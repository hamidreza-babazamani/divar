// Define the 404 handler installer
function NotFoundHandler(app) {
  // Register catch-all middleware after all routes
  app.use((req, res, next) => {
    // Respond with 404 JSON
    res.status(404).json({ message: "Not Found Route" });
  });
}

// Export the installer
module.exports = NotFoundHandler;
