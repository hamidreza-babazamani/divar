// Define auth-related messages
const AuthMessage = Object.freeze({
  // OTP sent successfully
  SendOtpSuccessfully: "OTP sent successfully",
  // User not found
  NotFound: "User not found",
  // OTP already issued and not expired
  OtpCodeNotExpired: "OTP code has not expired yet, please try later",
  // OTP expired
  OtpCodeExpired: "OTP code has expired, please request a new one",
  // OTP is incorrect
  OtpCodeIsIncorrect: "OTP code is incorrect",
  // Login success
  LoginSuccessfully: "Logged in successfully",
  // Logout success
  LogoutSuccessfully: "Logged out successfully",
});

// Export messages
module.exports = { AuthMessage };
