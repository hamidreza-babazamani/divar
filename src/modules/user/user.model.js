// Import mongoose schema helpers
const { Schema, model } = require("mongoose");

// Define the embedded OTP schema
const OTPSchema = new Schema(
  {
    // OTP digits
    code: { type: String },
    // Absolute expiry timestamp in milliseconds
    expiresIn: { type: Number, default: 0 },
  },
  // Disable the automatic _id on the subdocument
  { _id: false },
);

// Define the user schema
const UserSchema = new Schema(
  {
    // Optional display name
    fullName: { type: String, trim: true },
    // Unique mobile number
    mobile: { type: String, required: true, unique: true, index: true },
    // Role for authorization
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    // Embedded OTP
    otp: { type: OTPSchema },
    // Whether the mobile has been verified
    verifiedMobile: { type: Boolean, default: false, required: true },
    // Currently issued access token (used for revocation)
    accessToken: { type: String },
  },
  // Enable createdAt and updatedAt timestamps
  { timestamps: true },
);

// Export the user model
module.exports = model("user", UserSchema);
