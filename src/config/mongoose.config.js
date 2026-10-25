// Import mongoose default export
const mongoose = require("mongoose");

// Define the database connection function
async function connectDatabase() {
  // Read MongoDB URI from environment
  const uri = process.env.MONGODB_URL;
  // Fail fast if URI is missing
  if (!uri) throw new Error("MONGODB_URL is not defined in environment");
  // Enable strict query mode
  mongoose.set("strictQuery", true);
  // Connect to MongoDB
  await mongoose.connect(uri);
  // Log successful connection
  console.log("Connected to MongoDB");
  // Return the mongoose instance
  return mongoose;
}

// Export the connection function
module.exports = connectDatabase;
