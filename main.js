// Load environment variables from .env file into process.env
require("dotenv").config();
// Import the express framework
const express = require("express");
// Import CORS middleware to allow cross-origin requests
const cors = require("cors");
// Import Helmet middleware to set security-related HTTP headers
const helmet = require("helmet");
// Import cookie parser to read cookies from requests
const cookieParser = require("cookie-parser");
// Import mongoose connection bootstrap
const connectDatabase = require("./config/mongoose.config");
// Import Swagger documentation setup
const SwaggerConfig = require("./config/swagger.config");
// Import the root API router
const mainRouter = require("./app.routes");
// Import 404 handler middleware
const NotFoundHandler = require("./common/exception/not-found.handler");
// Import global error handler middleware
const AllExceptionHandler = require("./common/exception/all-exception.handler");
// Import allowed CORS origins helper
const { getAllowedOrigins } = require("./common/utils/cors");

// Define the main async bootstrap function
async function main() {
  // Create express application instance
  const app = express();
  // Read port from env with a safe default
  const port = process.env.PORT || 3400;
  // Read node environment
  const env = process.env.NODE_ENV || "development";

  // Connect to MongoDB before serving requests
  await connectDatabase();

  // Set security headers via helmet
  app.use(helmet());
  // Enable trust proxy when behind reverse proxy in production
  if (env === "production") app.set("trust proxy", 1);
  // Configure CORS dynamically based on environment
  app.use(
    cors({
      // Use explicit allow list (no wildcard when credentials enabled)
      origin: getAllowedOrigins(),
      // Allow cookies to be sent cross-origin
      credentials: true,
      // Allowed HTTP methods
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      // Allowed request headers
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    }),
  );
  // Parse JSON request bodies with a size limit
  app.use(express.json({ limit: "1mb" }));
  // Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  // Parse cookies using the configured secret
  app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
  // Serve static files from public directory
  app.use(express.static("public"));

  // Mount Swagger documentation at /swagger
  SwaggerConfig(app);

  // Mount all application routes
  app.use(mainRouter);

  // Register 404 handler after all routes
  NotFoundHandler(app);
  // Register global error handler last
  AllExceptionHandler(app);

  // Start HTTP server
  const server = app.listen(port, () => {
    // Log the server URL
    console.log(`Vendo server listening on http://localhost:${port}`);
    // Log the Swagger URL
    console.log(`Swagger docs available at http://localhost:${port}/swagger`);
  });

  // Handle unhandled promise rejections gracefully
  process.on("unhandledRejection", (reason) => {
    // Log the reason
    console.error("Unhandled rejection:", reason);
  });
  // Handle uncaught exceptions gracefully
  process.on("uncaughtException", (error) => {
    // Log the error
    console.error("Uncaught exception:", error);
    // Exit the process
    process.exit(1);
  });
  // Handle SIGINT (Ctrl+C) for graceful shutdown
  process.on("SIGINT", () => {
    // Log shutdown start
    console.log("Shutting down gracefully...");
    // Close HTTP server then exit
    server.close(() => process.exit(0));
  });
}

// Run the bootstrap and catch fatal errors
main().catch((error) => {
  // Log the fatal error
  console.error("Fatal bootstrap error:", error);
  // Exit with failure code
  process.exit(1);
});
