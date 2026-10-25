// Import express Router
const { Router } = require("express");
// Import the auth controller
const authController = require("./auth.controller");
// Import the authorization guard
const Authorization = require("../../common/guard/authorization.guard");
// Import rate limiters
const {
  sendOtpLimiter,
  checkOtpLimiter,
} = require("../../common/middleware/rate-limit");
// Import validation helpers
const {
  validate,
  sendOtpSchema,
  checkOtpSchema,
} = require("../../common/validation/validators");

// Create the auth router
const router = Router();

// Send OTP with rate limit and body validation
router.post(
  "/send-otp",
  sendOtpLimiter,
  validate(sendOtpSchema),
  authController.sendOTP,
);
// Verify OTP with rate limit and body validation
router.post(
  "/check-otp",
  checkOtpLimiter,
  validate(checkOtpSchema),
  authController.checkOTP,
);
// Logout requires a valid session
router.get("/logout", Authorization, authController.logout);

// Export the router
module.exports = { AuthRouter: router };
