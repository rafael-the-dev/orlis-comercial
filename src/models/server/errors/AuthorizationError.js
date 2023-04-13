const DefaultError = require("./DefaultError");

class AuthorizationError extends DefaultError {
    constructor(message) {
        super(401, message ?? "Not authorized or credentials not provided");
    }
}

module.exports = AuthorizationError;