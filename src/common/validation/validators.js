// Import Joi for schema validation
const Joi = require("joi");

// Validate send-otp request body
const sendOtpSchema = Joi.object({
  // Iranian mobile number pattern
  mobile: Joi.string()
    .pattern(/^09\d{9}$/)
    .required()
    .messages({ "string.pattern.base": "Mobile number is invalid" }),
});

// Validate check-otp request body
const checkOtpSchema = Joi.object({
  // Iranian mobile number pattern
  mobile: Joi.string()
    .pattern(/^09\d{9}$/)
    .required(),
  // OTP code with 5 digits
  code: Joi.string().length(5).required(),
});

// Validate category creation
const createCategorySchema = Joi.object({
  // Category name
  name: Joi.string().min(2).max(120).required(),
  // Category slug (optional, generated from name)
  slug: Joi.string().min(2).max(120),
  // Icon identifier or URL
  icon: Joi.string().required(),
  // Parent category id (optional)
  parent: Joi.string().hex().length(24),
});

// Validate option creation
const createOptionSchema = Joi.object({
  // Option title
  title: Joi.string().min(2).max(120).required(),
  // Option key (slugified)
  key: Joi.string().min(2).max(120).required(),
  // Option data type
  type: Joi.string().valid("number", "string", "array", "boolean").required(),
  // Option guid (optional)
  guid: Joi.string(),
  // Option enum values (array or comma-separated string)
  enum: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  // Owning category id
  category: Joi.string().hex().length(24).required(),
  // Required flag
  required: Joi.boolean().default(false),
});

// Validate option update (all fields optional)
const updateOptionSchema = createOptionSchema.fork(
  ["title", "key", "type", "category"],
  (schema) => schema.optional(),
);

// Validate post creation body (files handled separately)
const createPostSchema = Joi.object({
  // Post title
  title_post: Joi.string().min(3).max(200).required(),
  // Post description
  description: Joi.string().min(3).max(5000).required(),
  // Price amount
  amount: Joi.number().min(0).default(0),
  // Category id
  category: Joi.string().hex().length(24).required(),
  // Latitude
  lat: Joi.number().min(-90).max(90).required(),
  // Longitude
  lng: Joi.number().min(-180).max(180).required(),
});

// Validate post update body
const updatePostSchema = Joi.object({
  // Post title
  title: Joi.string().min(3).max(200),
  // Post description
  content: Joi.string().min(3).max(5000),
  // Price amount
  amount: Joi.number().min(0),
  // Category id
  category: Joi.string().hex().length(24),
}).min(1);

// Build a generic express middleware for a Joi schema
function validate(schema, property = "body") {
  // Return the middleware
  return (req, res, next) => {
    // Validate the target property
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });
    // Reject on validation error
    if (error) {
      // Collect all messages
      const message = error.details.map((d) => d.message).join("; ");
      // Return 400 with messages
      return res.status(400).json({ message });
    }
    // Replace the property with the validated value
    req[property] = value;
    // Continue
    next();
  };
}

// Export schemas and middleware factory
module.exports = {
  sendOtpSchema,
  checkOtpSchema,
  createCategorySchema,
  createOptionSchema,
  updateOptionSchema,
  createPostSchema,
  updatePostSchema,
  validate,
};
