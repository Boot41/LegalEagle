package services

import (
	"encoding/json"
	"fmt"
	"log"
	"regexp"
	"strings"
	"time"

	model "github.com/Itish41/LegalEagle/models"
	"gorm.io/datatypes"
)

// CreateActionItems generates action items for failed compliance rules
func (s *DocumentService) CreateActionItems(doc model.Document) error {
	var results []map[string]interface{}
	if err := json.Unmarshal([]byte(doc.ParsedData), &results); err != nil {
		log.Printf("Error unmarshaling parsed_data: %v", err)
		return err
	}

	for _, result := range results {
		if status, ok := result["status"].(string); ok && status == "fail" {
			explanation, _ := result["explanation"].(string)
			ruleName := extractRuleName(explanation)
			log.Printf("Extracted rule name from explanation: %s", ruleName)

			var rule model.ComplianceRule
			if err := s.db.Where("name = ?", ruleName).First(&rule).Error; err != nil {
				log.Printf("Rule %s not found in compliance_rules: %v", ruleName, err)
				continue // Skip this result entirely if rule not found
			}

			// Ensure RuleID is valid (not empty)
			if rule.ID == "" {
				log.Printf("Invalid RuleID for %s; skipping action item creation", ruleName)
				continue
			}

			action := model.ActionItem{
				DocumentID:  doc.ID,
				RuleID:      rule.ID,
				Description: fmt.Sprintf("Address %s non-compliance: %s", ruleName, explanation),
				Priority:    strings.Title(strings.ToLower(rule.Severity)),
				Status:      "pending",
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
				// Don't set AssignedTo field to avoid UUID validation error
			}

			// Use Omit to skip the AssignedTo field
			if err := s.db.Omit("AssignedTo").Create(&action).Error; err != nil {
				log.Printf("Error creating action item: %v", err)
				return err
			}
			log.Printf("Action item created: %s for document %s", action.Description, doc.ID)

			docResult := model.DocumentRuleResult{
				DocumentID: doc.ID,
				RuleID:     rule.ID,
				Status:     "fail",
				Details:    datatypes.JSON(marshalResult(result)),
				CreatedAt:  time.Now(),
			}
			if err := s.db.Create(&docResult).Error; err != nil {
				log.Printf("Error creating document rule result: %v", err)
				return err
			}
			log.Printf("Document rule result created for rule %s, document %s", ruleName, doc.ID)
		}
	}
	return nil
}

// GetPendingActionItemsWithTitles retrieves pending action items with document titles
func (s *DocumentService) GetPendingActionItemsWithTitles() ([]map[string]interface{}, error) {
	var items []model.ActionItem
	if err := s.db.Where("status = ?", "pending").Find(&items).Error; err != nil {
		log.Printf("[GetPendingActionItemsWithTitles] Error fetching pending action items: %v", err)
		return nil, err
	}

	result := make([]map[string]interface{}, 0, len(items))
	for _, item := range items {
		var doc model.Document
		if err := s.db.Select("title").Where("id = ?", item.DocumentID).First(&doc).Error; err != nil {
			log.Printf("[GetPendingActionItemsWithTitles] Error fetching document title for %s: %v", item.DocumentID, err)
			continue
		}
		result = append(result, map[string]interface{}{
			"id":          item.ID,
			"document_id": item.DocumentID,
			"title":       doc.Title,
			"rule_id":     item.RuleID,
			"description": item.Description,
			"priority":    item.Priority,
			"assigned_to": item.AssignedTo,
			"due_date":    item.DueDate,
			"status":      item.Status,
		})
	}
	return result, nil
}

// UpdateActionItem marks an action as completed and updates DocumentRuleResult
func (s *DocumentService) UpdateActionItem(actionID string) error {
	var action model.ActionItem
	if err := s.db.First(&action, "id = ?", actionID).Error; err != nil {
		log.Printf("[UpdateActionItem] Error fetching action item %s: %v", actionID, err)
		return err
	}

	action.Status = "completed"
	action.UpdatedAt = time.Now()
	
	// Use Omit to skip the AssignedTo field to avoid UUID validation error
	if err := s.db.Model(&action).Omit("AssignedTo").Updates(map[string]interface{}{
		"Status":    "completed",
		"UpdatedAt": time.Now(),
	}).Error; err != nil {
		log.Printf("[UpdateActionItem] Error updating action item %s: %v", actionID, err)
		return err
	}

	var docResult model.DocumentRuleResult
	if err := s.db.Where("document_id = ? AND rule_id = ?", action.DocumentID, action.RuleID).First(&docResult).Error; err != nil {
		log.Printf("[UpdateActionItem] Error fetching document rule result for action %s: %v", actionID, err)
		return err
	}
	docResult.Status = "resolved"
	docResult.CreatedAt = time.Now() // Consider adding UpdatedAt to the model
	if err := s.db.Save(&docResult).Error; err != nil {
		log.Printf("[UpdateActionItem] Error updating document rule result for action %s: %v", actionID, err)
		return err
	}
	return nil
}

// GetPendingActionItems retrieves all pending action items
func (s *DocumentService) GetPendingActionItems() ([]model.ActionItem, error) {
	var items []model.ActionItem
	if err := s.db.Where("status = ?", "pending").Find(&items).Error; err != nil {
		log.Printf("[GetPendingActionItems] Error fetching pending action items: %v", err)
		return nil, err
	}
	return items, nil
}

// Helper functions
func extractRuleName(explanation string) string {
	// Convert to lowercase for consistent matching
	explanation = strings.ToLower(explanation)

	// Specific handling for NDA Check rule
	if strings.Contains(explanation, "non-disclosure agreement") {
		return "NDA Check"
	}

	// Predefined rule mappings
	ruleMap := map[string]string{
		"nda check":          "NDA Check",
		"confidentiality":    "Confidentiality Check",
		"document integrity": "Document Integrity Check",
	}

	// Check for predefined rules first
	for keyword, ruleName := range ruleMap {
		if strings.Contains(explanation, keyword) {
			return ruleName
		}
	}

	// Extract rule name from quotes or specific patterns
	patterns := []string{
		"'([^']*)'",       // Extract text between single quotes
		"\"([^\"]*)\"",    // Extract text between double quotes
		"rule\\s*([^:]+)", // Extract text after "rule"
	}

	for _, pattern := range patterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(explanation)
		if len(matches) > 1 {
			ruleName := strings.TrimSpace(matches[1])
			if ruleName != "" {
				return ruleName
			}
		}
	}

	// Fallback extraction methods
	if strings.Contains(explanation, "required by") {
		parts := strings.Split(explanation, "required by")
		if len(parts) > 1 {
			ruleName := strings.TrimSpace(parts[1])
			if ruleName != "" {
				return ruleName
			}
		}
	}

	// Final fallback
	log.Printf("Could not extract rule name from explanation: %s", explanation)
	return "Unknown Rule"
}

func marshalResult(result map[string]interface{}) []byte {
	bytes, err := json.Marshal(result)
	if err != nil {
		log.Printf("[marshalResult] Error marshaling result: %v", err)
		return []byte("{}")
	}
	return bytes
}
