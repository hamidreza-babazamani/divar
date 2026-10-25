// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import cookie name constants
const CookieNames = require("../../common/constant/cookie.enum");
// Import environment constants
const NodeEnv = require("../../common/constant/env.enum");
// Import auth messages
const { AuthMessage } = require("./auth.messages");
// Import auth service singleton
const authService = require("./auth.service");

// Define the auth controller class
class AuthController {
  // Private field for the service
  #service;
  // Constructor binds methods and stores the service
  constructor() {
    // Bind all methods to the instance
    autoBind(this);
    // Store the service reference
    this.#service = authService;
  }

  // Handle POST /auth/send-otp
  async sendOTP(req, res, next) {
    try {
      // Read mobile from validated body
      const { mobile } = req.body;
      // Request a new OTP
      await this.#service.sendOTP(mobile);
      // Respond with success
      return res.json({ message: AuthMessage.SendOtpSuccessfully });
    } catch (error) {
      // Forward to the global error handler
      next(error);
    }
  }

  // Handle POST /auth/check-otp
  async checkOTP(req, res, next) {
    try {
      // Read mobile and code from validated body
      const { mobile, code } = req.body;
      // Verify the OTP and receive a JWT
      const token = await this.#service.checkOTP(mobile, code);
      // Set the access token as an HttpOnly cookie
      return res
        .cookie(CookieNames.AccessToken, token, {
          // Prevent JS access
          httpOnly: true,
          // Enable secure flag only in production
          secure: process.env.NODE_ENV === NodeEnv.Production,
          // Mitigate CSRF for cross-site requests
          sameSite:
            process.env.NODE_ENV === NodeEnv.Production ? "none" : "lax",
          // Persist for one year
          maxAge: 365 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({ message: AuthMessage.LoginSuccessfully });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /auth/logout
  async logout(req, res, next) {
    try {
      // Invalidate the stored token on the server
      await this.#service.revokeToken(req.user._id);
      // Clear the cookie using matching options
      return res
        .clearCookie(CookieNames.AccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === NodeEnv.Production,
          sameSite:
            process.env.NODE_ENV === NodeEnv.Production ? "none" : "lax",
        })
        .status(200)
        .json({ message: AuthMessage.LogoutSuccessfully });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }
}

// Export a singleton controller
module.exports = new AuthController();
