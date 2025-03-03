package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	// "github.com/Itish41/LegalEagle/models
	model "github.com/Itish41/LegalEagle/models"
)

func (s *DocumentService) AddComplianceRule(rule *model.ComplianceRule) error {
	if err := s.db.Create(rule).Error; err != nil {
		log.Printf("Error saving compliance rule: %v", err)
		return err
	}
	log.Printf("Compliance rule %s added successfully", rule.Name)
	return nil
}

// DetermineApplicableRules uses Groq to suggest relevant rules
func (s *DocumentService) DetermineApplicableRules(ocrText string) ([]string, error) {
	log.Printf("Determining applicable rules for text: %s", ocrText)

	groqAPIKey := os.Getenv("VITE_GROQ_API_KEY")
	if groqAPIKey == "" {
		log.Println("ERROR: VITE_GROQ_API_KEY environment variable is not set")
		return nil, fmt.Errorf("VITE_GROQ_API_KEY environment variable is not set")
	}

	prompt := fmt.Sprintf("Given this document text: %s\nSuggest relevant compliance rules from: NDA Check, Liability Clause, Signature Requirement. Return a JSON list of rule names.", ocrText)
	log.Printf("Groq API Prompt: %s", prompt)

	reqBody, _ := json.Marshal(map[string]interface{}{
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"model":       "llama-3.3-70b-versatile",
		"temperature": 0.7,
		"max_tokens":  150,
	})

	req, err := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(reqBody))
	if err != nil {
		log.Printf("ERROR creating Groq request: %v", err)
		return nil, fmt.Errorf("failed to create Groq request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+groqAPIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("ERROR sending Groq request: %v", err)
		return nil, fmt.Errorf("groq API request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("ERROR reading Groq response: %v", err)
		return nil, fmt.Errorf("failed to read Groq response: %w", err)
	}

	log.Printf("Groq API Raw Response: %s", string(body))

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		log.Printf("ERROR parsing Groq response: %v", err)
		return nil, fmt.Errorf("failed to parse Groq response: %w", err)
	}

	var applicableRules []string
	if len(result.Choices) > 0 {
		log.Printf("Groq Response Content: %s", result.Choices[0].Message.Content)

		// Try parsing the content as JSON
		err = json.Unmarshal([]byte(result.Choices[0].Message.Content), &applicableRules)
		if err != nil {
			log.Printf("ERROR parsing rules from content: %v", err)
			// Fallback: try manual parsing or extract from text
			applicableRules = extractRulesFromText(result.Choices[0].Message.Content)
		}
	}

	// If no rules found, use default
	if len(applicableRules) == 0 {
		applicableRules = []string{"NDA Check", "Liability Clause", "Signature Requirement"}
	}

	log.Printf("Determined Applicable Rules: %v", applicableRules)
	return applicableRules, nil
}

// Helper function to extract rules from text if JSON parsing fails
func extractRulesFromText(content string) []string {
	possibleRules := []string{"NDA Check", "Liability Clause", "Signature Requirement"}
	foundRules := []string{}

	for _, rule := range possibleRules {
		if strings.Contains(strings.ToLower(content), strings.ToLower(rule)) {
			foundRules = append(foundRules, rule)
		}
	}

	return foundRules
}

// CheckRuleCompliance checks if OCR text complies with a rule using Groq
func (s *DocumentService) CheckRuleCompliance(ocrText, ruleName, rulePattern string) (map[string]interface{}, error) {
	log.Printf("Checking Rule Compliance - Rule: %s, Pattern: %s", ruleName, rulePattern)

	groqAPIKey := os.Getenv("VITE_GROQ_API_KEY")
	if groqAPIKey == "" {
		log.Println("ERROR: VITE_GROQ_API_KEY environment variable is not set")
		return nil, fmt.Errorf("VITE_GROQ_API_KEY environment variable is not set")
	}

	prompt := fmt.Sprintf("Check compliance for rule '%s' with pattern '%s'. Document text: %s\nRespond with a JSON object containing 'status' (pass/fail) and 'explanation'.",
		ruleName, rulePattern, ocrText)
	log.Printf("Compliance Check Prompt: %s", prompt)

	reqBody, _ := json.Marshal(map[string]interface{}{
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"model":       "llama-3.3-70b-versatile",
		"temperature": 0.7,
		"max_tokens":  150,
		"response_format": map[string]string{
			"type": "json_object",
		},
	})

	req, err := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(reqBody))
	if err != nil {
		log.Printf("ERROR creating Groq request: %v", err)
		return nil, fmt.Errorf("failed to create Groq request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+groqAPIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("ERROR sending Groq request: %v", err)
		return nil, fmt.Errorf("groq API request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("ERROR reading Groq response: %v", err)
		return nil, fmt.Errorf("failed to read Groq response: %w", err)
	}

	log.Printf("Groq API Raw Response: %s", string(body))

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		log.Printf("ERROR parsing Groq response structure: %v", err)
		return nil, fmt.Errorf("failed to parse Groq response structure: %w", err)
	}

	// Parse the content of the message
	var complianceResult map[string]interface{}
	if len(result.Choices) > 0 {
		log.Printf("Groq Response Content: %s", result.Choices[0].Message.Content)

		err = json.Unmarshal([]byte(result.Choices[0].Message.Content), &complianceResult)
		if err != nil {
			log.Printf("ERROR parsing compliance result JSON: %v", err)
			// Fallback to a default result if parsing fails
			complianceResult = map[string]interface{}{
				"status":      "fail",
				"explanation": "Unable to determine compliance due to parsing error",
			}
		}
	} else {
		// Fallback if no choices are returned
		complianceResult = map[string]interface{}{
			"status":      "fail",
			"explanation": "No compliance check result received",
		}
	}

	log.Printf("Rule Compliance Result: %+v", complianceResult)
	return complianceResult, nil
}

// CalculateRiskScore computes a score based on failed rules and their severity
func (s *DocumentService) CalculateRiskScore(results []map[string]interface{}, rules []model.ComplianceRule) float64 {
	log.Printf("Calculating Risk Score. Number of results: %d", len(results))

	severityWeights := map[string]float64{
		"high":   3.0,
		"medium": 2.0,
		"low":    1.0,
	}
	riskScore := 0.0

	for i, result := range results {
		log.Printf("Processing result %d: %+v", i, result)

		status, ok := result["status"].(string)
		if !ok {
			log.Printf("WARNING: Could not extract status from result %d", i)
			continue
		}

		if status == "fail" {
			if i < len(rules) {
				ruleSeverity := rules[i].Severity
				log.Printf("Failed rule severity: %s", ruleSeverity)

				weight, exists := severityWeights[ruleSeverity]
				if !exists {
					log.Printf("WARNING: Unknown severity level: %s", ruleSeverity)
					weight = 1.0 // Default to low risk
				}

				riskScore += weight
				log.Printf("Updated risk score: %f", riskScore)
			} else {
				log.Printf("WARNING: Rule index %d out of bounds", i)
			}
		}
	}

	log.Printf("Final Risk Score: %f", riskScore)
	return riskScore
}
