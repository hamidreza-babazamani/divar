// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import http-errors for typed errors
const createHttpError = require("http-errors");
// Import mongoose helpers
const { isValidObjectId, Types } = require("mongoose");
// Import the option model
const OptionModel = require("../option/option.model");
// Import the category model
const CategoryModel = require("../category/category.model");
// Import the post model
const PostModel = require("./post.model");
// Import post messages
const { PostMessage } = require("./post.message");
// Import the pagination helper
const { paginate } = require("../../common/utils/functions");

// Define the post service class
class PostService {
  // Private field for the post model
  #model;
  // Constructor binds methods and stores the model
  constructor() {
    // Bind all methods
    autoBind(this);
    // Store the post model
    this.#model = PostModel;
  }

  // Return the options of a category
  async getCategoryOptions(categoryId) {
    // Query options of the category
    return OptionModel.find({ category: categoryId }).lean();
  }

  // Create a new post
  async create(dto) {
    // Persist and return the document
    return this.#model.create(dto);
  }

  // Return a paginated list of posts for a user
  async findByUser(userId, p) {
    // Validate the user id
    if (!isValidObjectId(userId))
      throw new createHttpError.BadRequest(PostMessage.RequestNotValid);
    // Run count and find in parallel
    const [total, data] = await Promise.all([
      this.#model.countDocuments({ userId }),
      this.#model
        .find({ userId })
        .sort({ _id: -1 })
        .skip(p.skip)
        .limit(p.limit)
        .populate({ path: "category", select: { name: 1, slug: 1, icon: 1 } })
        .lean(),
    ]);
    // Return the paginated result
    return { total, page: p.page, limit: p.limit, data };
  }

  // Return a paginated feed of posts with filters
  async findAll(query) {
    // Normalize pagination
    const p = paginate(query.page, query.limit);
    // Build the filter
    const filter = {};
    // Apply category filter (slug)
    if (query.category) {
      // Resolve the root category
      const root = await CategoryModel.findOne({ slug: query.category }).lean();
      // Return an empty page when the category is unknown
      if (!root) return { total: 0, page: p.page, limit: p.limit, data: [] };
      // Collect the root and all descendants by ancestors array
      const descendants = await CategoryModel.find(
        { parents: root._id },
        { _id: 1 },
      ).lean();
      // Build the category id list
      filter.category = { $in: [root._id, ...descendants.map((d) => d._id)] };
    }
    // Apply text search on title and content
    if (query.search) {
      // Build a case-insensitive regex
      const rx = new RegExp(query.search, "ig");
      // Match either field
      filter.$or = [{ title: rx }, { content: rx }];
    }
    // Run count and find in parallel
    const [total, data] = await Promise.all([
      this.#model.countDocuments(filter),
      this.#model
        .find(filter)
        .sort({ _id: -1 })
        .skip(p.skip)
        .limit(p.limit)
        .populate({ path: "category", select: { name: 1, slug: 1, icon: 1 } })
        .lean(),
    ]);
    // Return the paginated result
    return { total, page: p.page, limit: p.limit, data };
  }

  // Load a single post with owner and category details
  async checkExist(postId) {
    // Validate the ObjectId format
    if (!postId || !isValidObjectId(postId))
      throw new createHttpError.BadRequest(PostMessage.RequestNotValid);
    // Run the aggregation pipeline
    const [post] = await this.#model.aggregate([
      // Match the requested post
      { $match: { _id: new Types.ObjectId(postId) } },
      // Join the owner user
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      // Unwind the owner (preserve when missing)
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      // Expose the owner's mobile
      { $addFields: { userMobile: "$user.mobile" } },
      // Drop the raw user document
      { $project: { user: 0 } },
      // Join the category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      // Unwind the category (preserve when missing)
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    ]);
    // Reject if missing
    if (!post) throw new createHttpError.NotFound(PostMessage.NotFound);
    // Return the post
    return post;
  }

  // Return similar posts for a given post id
  async findSimilar(postId) {
    // Ensure the source post exists
    const source = await this.checkExist(postId);
    // Query up to ten posts in the same category excluding the source
    return this.#model
      .find({ _id: { $ne: source._id }, category: source.category?._id })
      .sort({ _id: -1 })
      .limit(10)
      .populate({ path: "category", select: { name: 1, slug: 1, icon: 1 } })
      .lean();
  }

  // Delete a post with ownership or admin check
  async remove(postId, userId, role) {
    // Load the post
    const post = await this.checkExist(postId);
    // Allow admins or the post owner only
    const isOwner = post.userId?.toString() === userId.toString();
    if (!isOwner && role !== "ADMIN")
      throw new createHttpError.Forbidden(PostMessage.Forbidden);
    // Delete the post
    await this.#model.deleteOne({ _id: postId });
  }

  // Update a post with ownership or admin check
  async update(postId, userId, role, dto) {
    // Load the post
    const post = await this.checkExist(postId);
    // Allow admins or the post owner only
    const isOwner = post.userId?.toString() === userId.toString();
    if (!isOwner && role !== "ADMIN")
      throw new createHttpError.Forbidden(PostMessage.Forbidden);
    // Whitelist writable fields
    const update = {};
    if (typeof dto.title === "string") update.title = dto.title;
    if (typeof dto.content === "string") update.content = dto.content;
    if (typeof dto.amount === "number") update.amount = dto.amount;
    if (typeof dto.category === "string" && isValidObjectId(dto.category))
      update.category = dto.category;
    // Apply the update
    await this.#model.updateOne({ _id: postId }, { $set: update });
    // Return the refreshed post
    return this.checkExist(postId);
  }

  // Build statistics for a user
  async statistics(userId) {
    // Count posts by the user
    const totalPosts = await this.#model.countDocuments({ userId });
    // Sum the total amount of the user's posts
    const [amountAgg] = await this.#model.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          avgAmount: { $avg: "$amount" },
        },
      },
    ]);
    // Return the statistics
    return {
      totalPosts,
      totalAmount: amountAgg?.totalAmount ?? 0,
      averageAmount: Math.round(amountAgg?.avgAmount ?? 0),
    };
  }
}

// Export a singleton service
module.exports = new PostService();
