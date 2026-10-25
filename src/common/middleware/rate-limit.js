// Import express-rate-limit
const rateLimit = require("express-rate-limit");

// Build a rate limiter for OTP sending
const sendOtpLimiter = rateLimit({
  // Time window in milliseconds
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
  // Max requests per window per IP
  max: parseInt(process.env.RATE_LIMIT_SEND_OTP, 10) || 5,
  // Return JSON on limit
  standardHeaders: true,
  legacyHeaders: false,
  // Custom response
  message: { message: "Too many requests, please try again later" },
});

// Build a rate limiter for OTP verification
const checkOtpLimiter = rateLimit({
  // Time window in milliseconds
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
  // Max requests per window per IP
  max: parseInt(process.env.RATE_LIMIT_CHECK_OTP, 10) || 10,
  // Return JSON on limit
  standardHeaders: true,
  legacyHeaders: false,
  // Custom response
  message: { message: "Too many attempts, please try again later" },
});

// Export limiters
module.exports = { sendOtpLimiter, checkOtpLimiter };
