// Import mongoose schema helpers
const { Schema, Types, model } = require("mongoose");

// Define the category schema
const CategorySchema = new Schema(
  {
    // Display name
    name: { type: String, required: true, trim: true },
    // URL slug
    slug: { type: String, required: true, unique: true, index: true },
    // Icon identifier
    icon: { type: String, required: true },
    // Direct parent id
    parent: { type: Types.ObjectId, ref: "Category" },
    // Ancestor ids (for efficient descendant queries)
    parents: { type: [Types.ObjectId], default: [] },
  },
  // Disable versionKey and _id in JSON output, enable virtuals
  {
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Define a one-to-many virtual for direct children
CategorySchema.virtual("children", {
  // Referenced model
  ref: "Category",
  // Local field holding the reference
  localField: "_id",
  // Foreign field on the referenced model
  foreignField: "parent",
});

// Export the category model
module.exports = model("Category", CategorySchema);
