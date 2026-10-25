// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import JWT library
const jwt = require("jsonwebtoken");
// Import http-errors for typed errors
const createHttpError = require("http-errors");
// Import crypto helpers
const { randomInt } = require("crypto");
// Import the user model
const UserModel = require("../user/user.model");
// Import auth messages
const { AuthMessage } = require("./auth.messages");

// Define the auth service class
class AuthService {
  // Private field for the user model
  #model;
  // Constructor binds methods and stores the model
  constructor() {
    // Bind all methods
    autoBind(this);
    // Store the model reference
    this.#model = UserModel;
  }

  // Generate a numeric OTP and expiry
  #generateOtp() {
    // Read TTL from env with a 2 minute default
    const ttl = parseInt(process.env.OTP_EXPIRES_MS, 10) || 120_000;
    // Return a 5-digit code and expiry timestamp
    return {
      code: randomInt(10000, 100000).toString(),
      expiresIn: Date.now() + ttl,
    };
  }

  // Create or refresh the OTP for a mobile number
  async sendOTP(mobile) {
    // Load the user if it exists
    const user = await this.#model.findOne({ mobile });
    // Build a fresh OTP
    const otp = this.#generateOtp();
    // Handle first-time users
    if (!user) {
      // Create a new user document with the OTP
      const newUser = await this.#model.create({ mobile, otp });
      // Return the new user
      return newUser;
    }
    // Prevent OTP spam while the current code is still valid
    if (user.otp?.expiresIn > Date.now()) {
      throw new createHttpError.BadRequest(AuthMessage.OtpCodeNotExpired);
    }
    // Store the new OTP
    user.otp = otp;
    // Persist changes
    await user.save();
    // Return the updated user
    return user;
  }

  // Verify the OTP and issue a JWT
  async checkOTP(mobile, code) {
    // Load the user or throw not found
    const user = await this.checkExistByMobile(mobile);
    // Reject expired OTPs
    if (!user.otp || user.otp.expiresIn < Date.now()) {
      throw new createHttpError.Unauthorized(AuthMessage.OtpCodeExpired);
    }
    // Reject incorrect OTPs
    if (user.otp.code !== code) {
      throw new createHttpError.Unauthorized(AuthMessage.OtpCodeIsIncorrect);
    }
    // Mark the mobile as verified on first login
    if (!user.verifiedMobile) user.verifiedMobile = true;
    // Sign a new access token
    const accessToken = this.signToken({ mobile, id: user._id });
    // Clear the used OTP to prevent replay
    user.otp = { code: undefined, expiresIn: 0 };
    // Persist the issued token for revocation on logout
    user.accessToken = accessToken;
    // Save the user document
    await user.save();
    // Return the token
    return accessToken;
  }

  // Load a user by mobile or throw a 404
  async checkExistByMobile(mobile) {
    // Query the user
    const user = await this.#model.findOne({ mobile });
    // Reject if missing
    if (!user) throw new createHttpError.NotFound(AuthMessage.NotFound);
    // Return the user
    return user;
  }

  // Sign a JWT with a one-year expiry
  signToken(payload) {
    // Return the signed token
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1y" });
  }

  // Invalidate the stored token for the given user
  async revokeToken(userId) {
    // Unset the access token on the user document
    await this.#model.updateOne(
      { _id: userId },
      { $unset: { accessToken: 1 } },
    );
  }
}

// Export a singleton service
module.exports = new AuthService();
