// Import swagger-jsdoc for generating the OpenAPI document
const swaggerJsDoc = require("swagger-jsdoc");
// Import swagger-ui-express for serving the UI
const swaggerUi = require("swagger-ui-express");

// Define the Swagger configuration installer
function SwaggerConfig(app) {
  // Build the OpenAPI document from JSDoc comments
  const swaggerDocument = swaggerJsDoc({
    // Swagger definition section
    definition: {
      // OpenAPI version
      openapi: "3.0.1",
      // API metadata
      info: {
        title: "Vendo API",
        description: "Vendo Backend - Online Classified Ads Platform",
        version: "1.0.0",
      },
      // Server list shown in Swagger UI
      servers: [
        { url: "http://localhost:3400", description: "Development" },
        { url: "https://bravo-vendo.onrender.com", description: "Production" },
      ],
      // Define global security scheme (cookie-based JWT)
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "access_token",
          },
        },
      },
      // Apply cookie auth globally
      security: [{ cookieAuth: [] }],
    },
    // Glob pattern to find swagger JSDoc files
    apis: [process.cwd() + "/src/modules/**/*.swagger.js"],
  });

  // Setup the Swagger UI handler
  const swagger = swaggerUi.setup(swaggerDocument);
  // Mount Swagger UI at /swagger
  app.use("/swagger", swaggerUi.serve, swagger);
}

// Export the installer
module.exports = SwaggerConfig;
