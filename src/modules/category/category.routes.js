// Import express Router
const { Router } = require("express");
// Import the category controller
const categoryController = require("./category.controller");
// Import the authorization guard
const Authorization = require("../../common/guard/authorization.guard");
// Import the admin guard
const { AdminGuard } = require("../../common/guard/admin.guard");
// Import validation helpers
const {
  validate,
  createCategorySchema,
} = require("../../common/validation/validators");

// Create the category router
const router = Router();

// Create a category (admin only)
router.post(
  "/",
  Authorization,
  AdminGuard,
  validate(createCategorySchema),
  categoryController.create,
);
// List root categories
router.get("/", categoryController.find);
// Fetch a single category by slug
router.get("/:slug", categoryController.findBySlug);
// Delete a category tree (admin only)
router.delete("/:id", Authorization, AdminGuard, categoryController.remove);

// Export the router
module.exports = { CategoryRouter: router };
