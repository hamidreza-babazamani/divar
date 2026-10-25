// Define the global error handler installer
function AllExceptionHandler(app) {
  // Register express error middleware
  app.use((err, req, res, next) => {
    // Extract a numeric status code from the error object
    let status = err?.status ?? err?.statusCode ?? err?.code;
    // Validate the status code range
    if (!status || isNaN(+status) || status > 511 || status < 200) status = 500;
    // Extract the message
    const message = err?.message ?? err?.stack ?? "InternalServerError";
    // Send JSON response
    res.status(status).json({ message });
  });
}

// Export the installer
module.exports = AllExceptionHandler;
