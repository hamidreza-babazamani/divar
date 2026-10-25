// Import multer for multipart/form-data handling
const multer = require("multer");
// Import fs for directory creation
const fs = require("fs");
// Import path utilities
const path = require("path");
// Import crypto for collision-free file names
const crypto = require("crypto");
// Import http-errors for typed errors
const createHttpError = require("http-errors");

// Resolve the upload directory once
const UPLOAD_DIR = path.join(process.cwd(), "public", "upload");

// Configure disk storage
const storage = multer.diskStorage({
  // Destination callback
  destination: (req, file, cb) => {
    // Ensure the upload directory exists
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    // Pass the relative path multer expects
    cb(null, "public/upload");
  },
  // Filename callback
  filename: (req, file, cb) => {
    // Define allowed MIME types
    const allowedMime = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
    // Reject disallowed types
    if (!allowedMime.includes(file.mimetype)) {
      // Pass a typed error to multer
      return cb(new createHttpError.BadRequest("Image format is not allowed"));
    }
    // Extract the file extension
    const ext = path.extname(file.originalname).toLowerCase();
    // Generate a random hex name for collision safety
    const name = crypto.randomBytes(16).toString("hex") + ext;
    // Pass the final filename
    cb(null, name);
  },
});

// Build the multer upload middleware
const upload = multer({
  // Use the configured storage
  storage,
  // Enforce a 3 MB file size limit
  limits: { fileSize: 3 * 1024 * 1024 },
});

// Convert a stored file path into a public URL
function fileToPublicUrl(absoluteOrRelativePath) {
  // Normalize separators
  const normalized = absoluteOrRelativePath.replace(/\\/g, "/");
  // Find the public root index
  const idx = normalized.indexOf("public/");
  // Return path relative to the public root
  if (idx === -1) return normalized;
  // Slice after "public/"
  return normalized.slice(idx + "public/".length);
}

// Export upload middleware and helpers
module.exports = { upload, fileToPublicUrl };
