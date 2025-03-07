package main

import (
	"log"
	"net/http"
	"os"

	controller "github.com/Itish41/LegalEagle/controller"
	"github.com/Itish41/LegalEagle/initializers"
	middleware "github.com/Itish41/LegalEagle/middleware"
	service "github.com/Itish41/LegalEagle/service"

	"github.com/gin-gonic/gin"
)

func init() {
	if err := initializers.LoadEnv(); err != nil {
		log.Fatalf("[CRITICAL] Failed to load env: %s", err)
	}
	if err := initializers.ConnectDB(); err != nil {
		log.Fatalf("[CRITICAL] Failed to initialize database connection: %s", err)
	}
	if err := initializers.Migrate(); err != nil {
		log.Fatalf("[CRITICAL] Failed to run database migrations: %s", err)
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	docService, err := service.NewDocumentService(initializers.DB)
	if err != nil {
		log.Fatalf("Failed to initialize document service: %s", err)
	}

	docController := controller.NewDocumentController(docService)

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// ✅ Serve frontend correctly
	router.StaticFS("/assets", http.Dir("/app/frontend/dist/assets"))
	router.NoRoute(func(c *gin.Context) {
		c.File("/app/frontend/dist/index.html")
	})

	// ✅ API routes
	api := router.Group("/api")
	api.Use(middleware.GlobalRateLimiter.Limit())

	api.POST("/upload", middleware.StrictRateLimiter.Limit(), docController.UploadDocument)
	api.POST("/rules", middleware.StrictRateLimiter.Limit(), docController.AddComplianceRule)
	api.GET("/rules", docController.GetAllComplianceRules)
	api.POST("/rules/by-names", docController.GetComplianceRulesByNames)

	api.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	api.POST("/action-update/:id", docController.AssignActionItem)
	api.GET("/search", docController.SearchDocuments)
	api.GET("/dashboard", docController.GetAllDocuments)
	api.GET("/action-items", docController.GetPendingActionItemsWithTitles)
	api.PUT("/action-items/:id/complete", middleware.StrictRateLimiter.Limit(), docController.CompleteActionItem)

	log.Printf("Server running on port %s...", port)
	router.Run(":" + port)
}
