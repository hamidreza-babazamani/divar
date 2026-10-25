// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import slugify for slug generation
const { default: slugify } = require("slugify");
// Import mongoose helpers
const { isValidObjectId, Types } = require("mongoose");
// Import http-errors for typed errors
const createHttpError = require("http-errors");
// Import the category model
const CategoryModel = require("./category.model");
// Import the option model for cascade deletes
const OptionModel = require("../option/option.model");
// Import category messages
const { CategoryMessage } = require("./category.message");

// Define the category service class
class CategoryService {
  // Private fields for both models
  #model;
  #optionModel;
  // Constructor binds methods and stores the models
  constructor() {
    // Bind all methods
    autoBind(this);
    // Store the category model
    this.#model = CategoryModel;
    // Store the option model
    this.#optionModel = OptionModel;
  }

  // Return root categories with one level of children
  async find() {
    // Query roots and populate direct children
    return this.#model
      .find({ parent: { $exists: false } })
      .populate({ path: "children" })
      .lean();
  }

  // Load a category by slug
  async findBySlug(slug) {
    // Query by slug
    const category = await this.#model
      .findOne({ slug })
      .populate({ path: "children" })
      .lean();
    // Reject if missing
    if (!category) throw new createHttpError.NotFound(CategoryMessage.NotFound);
    // Return the category
    return category;
  }

  // Remove a category and all its descendants plus their options
  async remove(id) {
    // Ensure the category exists
    await this.checkExistById(id);
    // Collect the id and all descendant ids using parents array
    const descendantIds = await this.#model
      .find({ parents: new Types.ObjectId(id) }, { _id: 1 })
      .lean();
    // Build the full id list
    const ids = [new Types.ObjectId(id), ...descendantIds.map((d) => d._id)];
    // Delete all related options
    await this.#optionModel.deleteMany({ category: { $in: ids } });
    // Delete all related categories
    await this.#model.deleteMany({ _id: { $in: ids } });
    // Return success
    return true;
  }

  // Create a new category
  async create(dto) {
    // Clone the DTO to avoid mutation
    const data = { ...dto };
    // Handle parent category if provided
    if (data.parent && isValidObjectId(data.parent)) {
      // Ensure the parent exists
      const parent = await this.checkExistById(data.parent);
      // Store the normalized parent id
      data.parent = parent._id;
      // Compute ancestor list (parent + its ancestors)
      data.parents = [
        parent._id,
        ...parent.parents.map((pid) => new Types.ObjectId(pid)),
      ];
    } else {
      // Drop invalid parent fields
      delete data.parent;
      delete data.parents;
    }
    // Generate the slug from the given slug or name
    data.slug = slugify(data.slug || data.name, {
      lower: true,
      strict: true,
      trim: true,
    });
    // Reject duplicates
    await this.alreadyExistBySlug(data.slug);
    // Persist the category
    return this.#model.create(data);
  }

  // Ensure a category exists by id
  async checkExistById(id) {
    // Validate the ObjectId format
    if (!isValidObjectId(id))
      throw new createHttpError.BadRequest(CategoryMessage.NotFound);
    // Query the category
    const category = await this.#model.findById(id);
    // Reject if missing
    if (!category) throw new createHttpError.NotFound(CategoryMessage.NotFound);
    // Return the category
    return category;
  }

  // Reject if a slug is already used
  async alreadyExistBySlug(slug) {
    // Query by slug
    const exists = await this.#model.exists({ slug });
    // Throw conflict on duplicates
    if (exists)
      throw new createHttpError.Conflict(CategoryMessage.AlreadyExist);
    // Return null on success
    return null;
  }
}

// Export a singleton service
module.exports = new CategoryService();
