package main

import (
	// "yourproject/controllers"
	// "yourproject/services"
	"log"

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
	// Uncomment to run migrations
	if err := initializers.Migrate(); err != nil {
		log.Fatalf("[CRITICAL] Failed to run database migrations: %s", err)
	}
}

func main() {
	docService, err := service.NewDocumentService(initializers.DB)
	if err != nil {
		log.Fatalf("Failed to initialize document service: %s", err)
	}

	docController := controller.NewDocumentController(docService)

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())
	router.POST("/upload", docController.UploadDocument)
	router.GET("/search", docController.SearchDocuments)

	router.Run(":8080")
}
