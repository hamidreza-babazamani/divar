// Define authorization-related messages
const AuthorizationMessage = Object.freeze({
  // Message shown when the user is not logged in
  Login: "Please login to your account",
  // Message shown when the token is expired or invalid
  LoginAgain: "Please login again",
  // Generic unauthorized message
  Unauthorized: "Unauthorized, please login to your account",
  // Message when the account does not exist
  NotFoundAccount: "Account not found",
  // Message for invalid token format
  InvalidToken: "Token is invalid",
  // Message for revoked token
  TokenRevoked: "Token has been revoked",
});

// Export the messages
module.exports = AuthorizationMessage;
