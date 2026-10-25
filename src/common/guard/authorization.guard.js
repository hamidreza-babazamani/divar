// Import http-errors for building typed errors
const createHttpError = require("http-errors");
// Import JWT library
const jwt = require("jsonwebtoken");
// Import authorization messages
const AuthorizationMessage = require("../constant/messages/auth.message");
// Import cookie name constants
const CookieNames = require("../constant/cookie.enum");
// Import the user model
const UserModel = require("../../modules/user/user.model");

// Define the authorization middleware
async function Authorization(req, res, next) {
  try {
    // Read the access token from cookies
    const token = req?.cookies?.[CookieNames.AccessToken];
    // Reject if no token is present
    if (!token)
      throw new createHttpError.Unauthorized(AuthorizationMessage.Login);
    // Verify the token signature and expiry
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Ensure payload has the expected shape
    if (typeof payload !== "object" || !payload.id) {
      throw new createHttpError.Unauthorized(AuthorizationMessage.InvalidToken);
    }
    // Load the user without sensitive fields
    const user = await UserModel.findById(payload.id, {
      accessToken: 0,
      otp: 0,
      __v: 0,
      updatedAt: 0,
    }).lean();
    // Reject if the user no longer exists
    if (!user)
      throw new createHttpError.Unauthorized(
        AuthorizationMessage.NotFoundAccount,
      );
    // Enforce server-side logout by comparing stored token
    if (!user.accessToken || user.accessToken !== token) {
      throw new createHttpError.Unauthorized(AuthorizationMessage.TokenRevoked);
    }
    // Attach the authenticated user to the request
    req.user = user;
    // Continue to the next middleware
    return next();
  } catch (error) {
    // Forward errors to the global handler
    next(error);
  }
}

// Export the middleware
module.exports = Authorization;
