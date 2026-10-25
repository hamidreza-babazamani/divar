// Import axios for HTTP requests
const { default: axios } = require("axios");

// Reverse-geocode a coordinate pair via Map.ir
async function getAddressDetail(lat, lng) {
  // Read base URL from env
  const url = process.env.MAP_IR_URL;
  // Read API key from env
  const apiKey = process.env.MAP_API_KEY;
  // Skip external call if inputs or config are missing
  if (!lat || !lng || !url || !apiKey) {
    // Return an empty address object
    return {
      province: undefined,
      city: undefined,
      district: undefined,
      address: undefined,
    };
  }
  // Try the external call and swallow failures
  try {
    // Call Map.ir reverse geocoding endpoint
    const response = await axios.get(`${url}?lat=${lat}&lon=${lng}`, {
      // Attach API key header
      headers: { "x-api-key": apiKey },
      // Fail fast on slow external services
      timeout: 5000,
    });
    // Extract response body
    const result = response?.data;
    // Return a normalized address object
    return {
      province: result?.province,
      city: result?.city,
      district: result?.region ?? result?.district,
      address: result?.address,
    };
  } catch (error) {
    // Log a warning without crashing the request
    console.warn("Reverse geocoding failed:", error?.message);
    // Return an empty address object
    return {
      province: undefined,
      city: undefined,
      district: undefined,
      address: undefined,
    };
  }
}

// Export the helper
module.exports = { getAddressDetail };
