// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import slugify for key normalization
const { default: slugify } = require("slugify");
// Import mongoose helpers
const { isValidObjectId, Types } = require("mongoose");
// Import http-errors for typed errors
const createHttpError = require("http-errors");
// Import the option model
const OptionModel = require("./option.model");
// Import the category service
const categoryService = require("../category/category.service");
// Import option messages
const { OptionMessage } = require("./option.message");
// Import helpers
const { isTrue, isFalse, paginate } = require("../../common/utils/functions");

// Define the option service class
class OptionService {
  // Private fields for models and services
  #model;
  #categoryService;
  // Constructor binds methods and stores references
  constructor() {
    // Bind all methods
    autoBind(this);
    // Store the option model
    this.#model = OptionModel;
    // Store the category service
    this.#categoryService = categoryService;
  }

  // Return a paginated list of options
  async find(page, limit) {
    // Normalize pagination
    const p = paginate(page, limit);
    // Run count and find in parallel
    const [total, options] = await Promise.all([
      this.#model.countDocuments(),
      this.#model
        .find({}, { __v: 0 })
        .sort({ _id: -1 })
        .skip(p.skip)
        .limit(p.limit)
        .populate({ path: "category", select: { name: 1, slug: 1 } })
        .lean(),
    ]);
    // Return the paginated result
    return { total, page: p.page, limit: p.limit, data: options };
  }

  // Create a new option for a category
  async create(dto) {
    // Clone the DTO to avoid mutation
    const data = { ...dto };
    // Ensure the category exists
    const category = await this.#categoryService.checkExistById(data.category);
    // Store the normalized category id
    data.category = category._id;
    // Normalize the key to a safe slug
    data.key = slugify(data.key, { trim: true, replacement: "_", lower: true });
    // Reject duplicates within the same category
    await this.alreadyExistByCategoryAndKey(data.key, category._id);
    // Normalize enum input
    data.values = this.#normalizeEnum(data.enum);
    // Remove the raw enum field
    delete data.enum;
    // Normalize the required flag
    data.required = isTrue(data.required)
      ? true
      : isFalse(data.required)
        ? false
        : false;
    // Persist the option
    return this.#model.create(data);
  }

  // Update an existing option
  async update(id, dto) {
    // Clone the DTO
    const data = { ...dto };
    // Ensure the option exists
    const existing = await this.checkExistById(id);
    // Handle category change
    if (data.category && isValidObjectId(data.category)) {
      // Ensure the new category exists
      const category = await this.#categoryService.checkExistById(
        data.category,
      );
      // Store the normalized category id
      data.category = category._id;
    } else {
      // Drop invalid category input
      delete data.category;
    }
    // Handle key change
    if (typeof data.key === "string") {
      // Normalize the key
      data.key = slugify(data.key, {
        trim: true,
        replacement: "_",
        lower: true,
      });
      // Determine the effective category id for duplicate checks
      const effectiveCategory = data.category || existing.category;
      // Reject duplicates excluding the current option
      await this.alreadyExistByCategoryAndKey(data.key, effectiveCategory, id);
    } else {
      // Drop invalid key input
      delete data.key;
    }
    // Handle enum change
    if (typeof data.enum !== "undefined") {
      // Normalize enum into values
      data.values = this.#normalizeEnum(data.enum);
      // Remove the raw enum field
      delete data.enum;
    }
    // Handle required change
    if (isTrue(data.required)) data.required = true;
    else if (isFalse(data.required)) data.required = false;
    else delete data.required;
    // Apply the update
    return this.#model.updateOne({ _id: id }, { $set: data });
  }

  // Load a single option by id
  async findById(id) {
    // Delegate to existence check
    return this.checkExistById(id);
  }

  // Delete an option by id
  async removeById(id) {
    // Ensure the option exists
    await this.checkExistById(id);
    // Delete it
    return this.#model.deleteOne({ _id: id });
  }

  // List options belonging to a category id
  async findByCategoryId(category) {
    // Validate the category id format
    if (!isValidObjectId(category))
      throw new createHttpError.BadRequest(OptionMessage.NotFound);
    // Query options
    return this.#model
      .find({ category }, { __v: 0 })
      .populate({ path: "category", select: { name: 1, slug: 1 } })
      .lean();
  }

  // List options belonging to a category slug
  async findByCategorySlug(slug) {
    // Resolve the category by slug
    const category = await this.#categoryService.findBySlug(slug);
    // Query options of that category
    return this.#model.find({ category: category._id }, { __v: 0 }).lean();
  }

  // Ensure an option exists by id
  async checkExistById(id) {
    // Validate the ObjectId format
    if (!isValidObjectId(id))
      throw new createHttpError.BadRequest(OptionMessage.NotFound);
    // Query the option
    const option = await this.#model.findById(id);
    // Reject if missing
    if (!option) throw new createHttpError.NotFound(OptionMessage.NotFound);
    // Return the option
    return option;
  }

  // Reject duplicates of (category, key)
  async alreadyExistByCategoryAndKey(key, category, exceptionId = null) {
    // Build the query
    const query = { category, key };
    // Exclude the current document during updates
    if (exceptionId) query._id = { $ne: exceptionId };
    // Query for a match
    const exists = await this.#model.exists(query);
    // Throw conflict on duplicates
    if (exists) throw new createHttpError.Conflict(OptionMessage.AlreadyExist);
    // Return null on success
    return null;
  }

  // Normalize an enum input into an array of strings
  #normalizeEnum(input) {
    // Return empty array for undefined
    if (typeof input === "undefined") return [];
    // Split comma-separated strings
    if (typeof input === "string")
      return input
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    // Return arrays as-is
    if (Array.isArray(input)) return input;
    // Default to empty array
    return [];
  }
}

// Export a singleton service
module.exports = new OptionService();
