// Define post-related messages
const PostMessage = Object.freeze({
  // Post created
  Created: "Post created successfully",
  // Post not found
  NotFound: "Post not found",
  // Post already exists
  AlreadyExist: "Post already exists",
  // Post deleted
  Deleted: "Post deleted successfully",
  // Post updated
  Updated: "Post updated successfully",
  // Invalid request
  RequestNotValid: "Request is not valid",
  // Forbidden action
  Forbidden: "You are not allowed to perform this action",
});

// Export messages
module.exports = { PostMessage };
