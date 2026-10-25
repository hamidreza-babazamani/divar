// Import express Router
const { Router } = require("express");
// Import the post controller
const postController = require("./post.controller");
// Import the authorization guard
const Authorization = require("../../common/guard/authorization.guard");
// Import the optional authorization guard
const OptionalAuthorization = require("../../common/guard/optional-authorization.guard");
// Import the multer upload middleware
const { upload } = require("../../common/utils/multer");
// Import validation helpers
const {
  validate,
  createPostSchema,
  updatePostSchema,
} = require("../../common/validation/validators");

// Create the post router
const router = Router();

// Return the create-post form bootstrap
router.get("/create", Authorization, postController.createPostPage);
// Create a post with up to ten images
router.post(
  "/create",
  Authorization,
  upload.array("images", 10),
  validate(createPostSchema),
  postController.create,
);
// Return the current user's posts
router.get("/my", Authorization, postController.findMyPosts);
// Return statistics for the current user
router.get("/statistics", Authorization, postController.statistics);
// Update a post by id
router.patch(
  "/:id",
  Authorization,
  validate(updatePostSchema),
  postController.update,
);
// Delete a post by id
router.delete("/delete/:id", Authorization, postController.remove);
// Return similar posts for a post id
router.get("/:id/similar", postController.similar);
// Return a single post (optionally authenticated)
router.get("/:id", OptionalAuthorization, postController.showPost);
// Return the public paginated feed
router.get("/", postController.postList);

// Export the router
module.exports = { PostRouter: router };
