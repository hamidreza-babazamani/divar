// Import http-errors for typed errors
const createHttpError = require("http-errors");

// Define the admin-only guard
function AdminGuard(req, res, next) {
  // Reject if no authenticated user is attached
  if (!req.user) return next(new createHttpError.Unauthorized("Unauthorized"));
  // Reject if the role is not ADMIN
  if (req.user.role !== "ADMIN")
    return next(new createHttpError.Forbidden("Forbidden"));
  // Continue
  return next();
}

// Export the guard
module.exports = { AdminGuard };
