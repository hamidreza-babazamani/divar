// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import http-status codes helper
const HttpCodes = require("http-codes");
// Import the option service
const optionService = require("./option.service");
// Import option messages
const { OptionMessage } = require("./option.message");

// Define the option controller class
class OptionController {
  // Private field for the service
  #service;
  // Constructor binds methods and stores the service
  constructor() {
    // Bind all methods
    autoBind(this);
    // Store the service reference
    this.#service = optionService;
  }

  // Handle POST /option
  async create(req, res, next) {
    try {
      // Destructure validated body
      const {
        title,
        key,
        guid,
        enum: list,
        type,
        category,
        required,
      } = req.body;
      // Create the option
      await this.#service.create({
        title,
        key,
        guid,
        enum: list,
        type,
        category,
        required,
      });
      // Respond with 201
      return res
        .status(HttpCodes.CREATED)
        .json({ message: OptionMessage.Created });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle PUT /option/:id
  async update(req, res, next) {
    try {
      // Destructure validated body
      const {
        title,
        key,
        guid,
        enum: list,
        type,
        category,
        required,
      } = req.body;
      // Read id
      const { id } = req.params;
      // Update the option
      await this.#service.update(id, {
        title,
        key,
        guid,
        enum: list,
        type,
        category,
        required,
      });
      // Respond with success
      return res.json({ message: OptionMessage.Updated });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /option/by-category/:categoryId
  async findByCategoryId(req, res, next) {
    try {
      // Read category id
      const { categoryId } = req.params;
      // Query options
      const options = await this.#service.findByCategoryId(categoryId);
      // Respond with list
      return res.json(options);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /option/by-category-slug/:slug
  async findByCategorySlug(req, res, next) {
    try {
      // Read slug
      const { slug } = req.params;
      // Query options
      const options = await this.#service.findByCategorySlug(slug);
      // Respond with list
      return res.json(options);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /option/:id
  async findById(req, res, next) {
    try {
      // Read id
      const { id } = req.params;
      // Load the option
      const option = await this.#service.findById(id);
      // Respond with the option
      return res.json(option);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle DELETE /option/:id
  async removeById(req, res, next) {
    try {
      // Read id
      const { id } = req.params;
      // Delete the option
      await this.#service.removeById(id);
      // Respond with success
      return res.json({ message: OptionMessage.Deleted });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /option
  async find(req, res, next) {
    try {
      // Read pagination query params
      const { page, limit } = req.query;
      // Query with pagination
      const result = await this.#service.find(page, limit);
      // Respond with the paginated list
      return res.json(result);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }
}

// Export a singleton controller
module.exports = new OptionController();
