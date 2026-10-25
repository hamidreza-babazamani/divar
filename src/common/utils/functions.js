// Convert truthy string/number values to boolean true
const isTrue = (value) => ["true", 1, true, "1"].includes(value);
// Convert falsy string/number values to boolean false
const isFalse = (value) => ["false", 0, false, "0"].includes(value);

// Return a shallow copy of target without the given properties
const removeProperties = (target = {}, properties = []) => {
  // Clone to avoid mutating the caller's object
  const copy = { ...target };
  // Delete each listed property
  for (const item of properties) delete copy[item];
  // Return the filtered copy
  return copy;
};

// Normalize a paginated query result
const paginate = (page = 1, limit = 20) => {
  // Coerce page to a positive integer
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  // Clamp limit between 1 and 100
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  // Compute skip offset
  const skip = (safePage - 1) * safeLimit;
  // Return normalized values
  return { page: safePage, limit: safeLimit, skip };
};

// Export all helpers
module.exports = { isTrue, isFalse, removeProperties, paginate };
