// Import express Router
const { Router } = require("express");
// Import the option controller
const optionController = require("./option.controller");
// Import the authorization guard
const Authorization = require("../../common/guard/authorization.guard");
// Import the admin guard
const { AdminGuard } = require("../../common/guard/admin.guard");
// Import validation helpers
const {
  validate,
  createOptionSchema,
  updateOptionSchema,
} = require("../../common/validation/validators");

// Create the option router
const router = Router();

// Create an option (admin only)
router.post(
  "/",
  Authorization,
  AdminGuard,
  validate(createOptionSchema),
  optionController.create,
);
// List options with pagination
router.get("/", optionController.find);
