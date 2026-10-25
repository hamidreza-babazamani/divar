// Define development origins
const DEV_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

// Define production origins
const PROD_ORIGINS = [
  "https://vendo-frontend.vercel.app",
  "https://vendo-frontend-git-main-hamidreza-babazamani.vercel.app",
];

// Return the allowed origins based on the environment
function getAllowedOrigins() {
  // Read node environment
  const env = process.env.NODE_ENV || "development";
  // Return production origins when in production
  if (env === "production") return PROD_ORIGINS;
  // Return combined list in development (allows testing against prod frontend)
  return [...DEV_ORIGINS, ...PROD_ORIGINS];
}

// Export the helper
module.exports = { getAllowedOrigins };
