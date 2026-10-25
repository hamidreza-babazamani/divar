// Import auto-bind for `this` binding
const autoBind = require("auto-bind");
// Import http-status codes helper
const HttpCodes = require("http-codes");
// Import http-errors for typed errors
const createHttpError = require("http-errors");
// Import mongoose helpers
const { Types } = require("mongoose");
// Import the post service
const postService = require("./post.service");
// Import post messages
const { PostMessage } = require("./post.message");
// Import helpers
const { removeProperties, paginate } = require("../../common/utils/functions");
// Import the multer helper for public URLs
const { fileToPublicUrl } = require("../../common/utils/multer");
// Import the reverse geocoding helper
const { getAddressDetail } = require("../../common/utils/http");
// Import the category model
const CategoryModel = require("../category/category.model");

// Define the post controller class
class PostController {
  // Private field for the service
  #service;
  // Constructor binds methods and stores the service
  constructor() {
    // Bind all methods
    autoBind(this);
    // Store the service reference
    this.#service = postService;
  }

  // Handle GET /post/create (form bootstrap)
  async createPostPage(req, res, next) {
    try {
      // Read optional slug query
      let { slug } = req.query;
      // Default the category match to roots
      let match = { parent: { $exists: false } };
      // Default options
      let options = null;
      // Default category id
      let categoryId = null;
      // If a slug was provided, resolve it
      if (slug) {
        // Trim whitespace
        slug = slug.trim();
        // Load the category
        const category = await CategoryModel.findOne({ slug }).lean();
        // Reject if missing
        if (!category) throw new createHttpError.NotFound(PostMessage.NotFound);
        // Load its options
        options = await this.#service.getCategoryOptions(category._id);
        // Null out an empty option list
        if (options.length === 0) options = null;
        // Match children of the resolved category
        match = { parent: category._id };
        // Store the resolved id
        categoryId = category._id.toString();
      }
      // Load matching categories
      const categories = await CategoryModel.find(match).lean();
      // Respond with the form data
      return res.json({ categories, category: categoryId, options });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle POST /post/create
  async create(req, res, next) {
    try {
      // Read the authenticated user id
      const userId = req.user._id;
      // Map uploaded files to public URLs
      const images = (req.files || []).map((f) => fileToPublicUrl(f.path));
      // Destructure validated body fields
      const {
        title_post: title,
        description: content,
        lat,
        lng,
        category,
        amount,
      } = req.body;
      // Collect dynamic option keys (excluding reserved names)
      const options = removeProperties(req.body, [
        "title_post",
        "description",
        "lat",
        "lng",
        "category",
        "amount",
        "images",
      ]);
      // Resolve address metadata from coordinates
      const { address, province, city, district } = await getAddressDetail(
        lat,
        lng,
      );
      // Create the post
      const post = await this.#service.create({
        userId,
        title,
        amount,
        content,
        coordinate: [parseFloat(lat), parseFloat(lng)],
        category: new Types.ObjectId(category),
        images,
        options,
        address,
        province,
        city,
        district,
      });
      // Respond with 201
      return res
        .status(HttpCodes.CREATED)
        .json({ message: PostMessage.Created, post });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /post/my
  async findMyPosts(req, res, next) {
    try {
      // Read pagination query params
      const p = paginate(req.query.page, req.query.limit);
      // Query the current user's posts
      const result = await this.#service.findByUser(req.user._id, p);
      // Respond with the paginated list
      return res.json(result);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle DELETE /post/delete/:id
  async remove(req, res, next) {
    try {
      // Read the post id
      const { id } = req.params;
      // Remove the post with ownership check
      await this.#service.remove(id, req.user._id, req.user.role);
      // Respond with success
      return res.json({ message: PostMessage.Deleted });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /post/:id
  async showPost(req, res, next) {
    try {
      // Read the post id
      const { id } = req.params;
      // Load the post
      const post = await this.#service.checkExist(id);
      // Hide the owner's mobile from anonymous users
      if (!req.user) delete post.userMobile;
      // Respond with the post
      return res.json(post);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /post
  async postList(req, res, next) {
    try {
      // Build the filter and pagination from query
      const result = await this.#service.findAll(req.query);
      // Respond with the paginated list
      return res.json(result);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /post/:id/similar
  async similar(req, res, next) {
    try {
      // Read the post id
      const { id } = req.params;
      // Load similar posts
      const posts = await this.#service.findSimilar(id);
      // Respond with the list
      return res.json(posts);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle GET /post/statistics
  async statistics(req, res, next) {
    try {
      // Build statistics for the current user
      const stats = await this.#service.statistics(req.user._id);
      // Respond with the statistics
      return res.json(stats);
    } catch (error) {
      // Forward errors
      next(error);
    }
  }

  // Handle PATCH /post/:id
  async update(req, res, next) {
    try {
      // Read the post id
      const { id } = req.params;
      // Update the post with ownership check
      const post = await this.#service.update(
        id,
        req.user._id,
        req.user.role,
        req.body,
      );
      // Respond with success
      return res.json({ message: PostMessage.Updated, post });
    } catch (error) {
      // Forward errors
      next(error);
    }
  }
}

// Export a singleton controller
module.exports = new PostController();
