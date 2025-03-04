package controller

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetPendingActionItems fetches all pending action items
func (c *DocumentController) GetPendingActionItems(ctx *gin.Context) {
	items, err := c.service.GetPendingActionItems()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Action items retrieved successfully",
		"items":   items,
	})
}

// CompleteActionItem marks an action as completed
func (c *DocumentController) CompleteActionItem(ctx *gin.Context) {
	actionID := ctx.Param("id")
	if actionID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Action ID required"})
		return
	}
	if err := c.service.UpdateActionItem(actionID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Action item marked as completed"})
}

// GetPendingActionItemsWithTitles fetches pending action items with document titles
func (c *DocumentController) GetPendingActionItemsWithTitles(ctx *gin.Context) {
	items, err := c.service.GetPendingActionItemsWithTitles()
	if err != nil {
		log.Printf("Error fetching pending action items: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve action items",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Action items retrieved successfully",
		"items":   items,
	})
}
