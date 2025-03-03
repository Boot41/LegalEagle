package controllers

import (
	"net/http"

	service "github.com/Itish41/LegalEagle/service"

	"github.com/gin-gonic/gin"
)

// DocumentController manages HTTP requests for document uploads
type DocumentController struct {
	service *service.DocumentService
}

// NewDocumentController initializes the controller with the service
func NewDocumentController(service *service.DocumentService) *DocumentController {
	return &DocumentController{service}
}

// UploadDocument handles the file upload request
func (c *DocumentController) UploadDocument(ctx *gin.Context) {
	file, header, err := ctx.Request.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file from request"})
		return
	}
	defer file.Close()

	ocrText, fileID, fileURL, err := c.service.UploadAndProcessDocument(file, header) // Update service to return these
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Document uploaded and processed successfully",
		"ocrText": ocrText,
		"fileID":  fileID,
		"fileURL": fileURL,
	})
}

// In controllers
func (c *DocumentController) SearchDocuments(ctx *gin.Context) {
	query := ctx.Query("q")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter 'q' is required"})
		return
	}

	results, err := c.service.SearchDocuments(query)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Search completed successfully",
		"results": results,
	})
}
