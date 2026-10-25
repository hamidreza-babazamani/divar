// Import express Router
const { Router } = require("express");
// Import the user controller
const userController = require("./user.controller");
// Import the authorization guard
const Authorization = require("../../common/guard/authorization.guard");

// Create the user router
const router = Router();

// Return the currently authenticated user
router.get("/whoami", Authorization, userController.whoami);
// Update the current user's profile
router.patch("/edit", Authorization, userController.updateProfile);

// Export the router
module.exports = { UserRouter: router };
