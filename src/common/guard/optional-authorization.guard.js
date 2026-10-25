// Import JWT library
const jwt = require("jsonwebtoken");
// Import cookie name constants
const CookieNames = require("../constant/cookie.enum");
// Import the user model
const UserModel = require("../../modules/user/user.model");

// Define optional authorization middleware (does not fail on missing token)
async function OptionalAuthorization(req, res, next) {
  try {
    // Read the access token from cookies
    const token = req?.cookies?.[CookieNames.AccessToken];
    // Skip if there is no token
    if (!token) return next();
    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Validate payload shape
    if (typeof payload !== "object" || !payload.id) return next();
    // Load a minimal user projection
    const user = await UserModel.findById(payload.id, {
      accessToken: 0,
      otp: 0,
      __v: 0,
      updatedAt: 0,
    }).lean();
    // Attach the user if found and the token matches
    if (user && user.accessToken === token) req.user = user;
    // Continue
    return next();
  } catch (error) {
    // Ignore errors and continue as anonymous
    return next();
  }
}

// Export the middleware
module.exports = OptionalAuthorization;
