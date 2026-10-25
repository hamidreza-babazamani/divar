// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import the user service
const userService = require("./user.service");

// Define the user controller class
class UserController {
  // Private field for the service
  #service;
  // Constructor binds methods and stores the service
  constructor() {
    // Bind all methods
    autoBind(this);
    // Store the service reference
    this.#service = userService;
  }

  // Handle GET /user/whoami
  async whoami(req, res, next) {
    try {
      // The guard already populated req.user
      return res.json(req.user);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle PATCH /user/edit
  async updateProfile(req, res, next) {
    try {
      // Update the authenticated user's profile
      const updated = await this.#service.updateProfile(req.user._id, req.body);
      // Respond with the updated profile
      return res.json(updated);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }
}

// Export a singleton controller
module.exports = new UserController();
