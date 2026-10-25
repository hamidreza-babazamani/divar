// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import http-errors for typed errors
const createHttpError = require("http-errors");
// Import the user model
const UserModel = require("./user.model");
// Import user messages
const { UserMessage } = require("./user.messages");

// Define the user service class
class UserService {
  // Private field for the model
  #model;
  // Constructor binds methods and stores the model
  constructor() {
    // Bind all methods
    autoBind(this);
    // Store the model reference
    this.#model = UserModel;
  }

  // Load a user by id and strip sensitive fields
  async findById(id) {
    // Query the user with a projection
    const user = await this.#model
      .findById(id, { accessToken: 0, otp: 0, __v: 0 })
      .lean();
    // Reject if missing
    if (!user) throw new createHttpError.NotFound(UserMessage.NotFound);
    // Return the user
    return user;
  }

  // Update the profile fields allowed to be changed
  async updateProfile(userId, dto) {
    // Whitelist writable fields
    const update = {};
    // Only allow fullName
    if (typeof dto?.fullName === "string")
      update.fullName = dto.fullName.trim();
    // Apply the update and return the fresh document
    const user = await this.#model
      .findByIdAndUpdate(
        userId,
        { $set: update },
        { new: true, projection: { accessToken: 0, otp: 0, __v: 0 } },
      )
      .lean();
    // Reject if missing
    if (!user) throw new createHttpError.NotFound(UserMessage.NotFound);
    // Return the updated profile
    return user;
  }
}

// Export a singleton service
module.exports = new UserService();
