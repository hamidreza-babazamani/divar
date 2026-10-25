// Import mongoose schema helpers
const { Schema, Types, model } = require("mongoose");

// Define the post schema
const PostSchema = new Schema(
  {
    // Post title
    title: { type: String, required: true, trim: true },
    // Owning user
    userId: { type: Types.ObjectId, ref: "user", required: true, index: true },
    // Price
    amount: { type: Number, required: true, default: 0 },
    // Description
    content: { type: String, required: true },
    // Category
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    // Province name
    province: { type: String },
    // City name
    city: { type: String },
    // District name
    district: { type: String },
    // Human readable address
    address: { type: String },
    // [latitude, longitude]
    coordinate: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2,
        message: "Coordinate must be [lat, lng]",
      },
    },
    // Uploaded image paths relative to public/
    images: { type: [String], default: [] },
    // Dynamic option key/value map
    options: { type: Object, default: {} },
  },
  // Enable timestamps and hide versionKey
  { timestamps: true, versionKey: false },
);

// Create a text index for search
PostSchema.index({ title: "text", content: "text" });

// Export the post model
module.exports = model("post", PostSchema);
