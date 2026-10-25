// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import http-status codes helper
const HttpCodes = require("http-codes");
// Import the category service
const categoryService = require("./category.service");
// Import category messages
const { CategoryMessage } = require("./category.message");

// Define the category controller class
class CategoryController {
  // Private field for the service
  #service;
  // Constructor binds methods and stores the service
  constructor() {
    // Bind all methods
    autoBind(this);
    // Store the service reference
    this.#service = categoryService;
  }

  // Handle POST /category
  async create(req, res, next) {
    try {
      // Destructure validated body
      const { name, icon, slug, parent } = req.body;
      // Create the category
      await this.#service.create({ name, icon, slug, parent });
      // Respond with 201
      return res
        .status(HttpCodes.CREATED)
        .json({ message: CategoryMessage.Created });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /category
  async find(req, res, next) {
    try {
      // Return root categories with direct children
      const categories = await this.#service.find();
      // Respond with 200
      return res.json(categories);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /category/:slug
  async findBySlug(req, res, next) {
    try {
      // Read slug
      const { slug } = req.params;
      // Load the category
      const category = await this.#service.findBySlug(slug);
      // Respond with 200
      return res.json(category);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle DELETE /category/:id
  async remove(req, res, next) {
    try {
      // Read id
      const { id } = req.params;
      // Remove the category tree
      await this.#service.remove(id);
      // Respond with success
      return res.json({ message: CategoryMessage.Deleted });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }
}

// Export a singleton controller
module.exports = new CategoryController();
