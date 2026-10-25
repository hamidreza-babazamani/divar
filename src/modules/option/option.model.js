// Import mongoose schema helpers
const { Schema, Types, model } = require("mongoose");

// Define the option schema
const OptionSchema = new Schema(
  {
    // Display title
    title: { type: String, required: true, trim: true },
    // Machine key (slugified)
    key: { type: String, required: true, trim: true },
    // Value data type
    type: {
      type: String,
      enum: ["number", "string", "array", "boolean"],
      required: true,
    },
    // Allowed enum values
    values: { type: Array, default: [] },
    // Optional grouping guid
    guid: { type: String },
    // Whether a value is required
    required: { type: Boolean, default: false },
    // Owning category
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
  },
  // Enable timestamps and hide versionKey
  { timestamps: true, versionKey: false },
);

// Create a compound unique index for category+key
OptionSchema.index({ category: 1, key: 1 }, { unique: true });

// Export the option model
module.exports = model("option", OptionSchema);
