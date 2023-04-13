const DefaultError = require("./DefaultError");

class InvalidArgumentError extends DefaultError {
    constructor(message) {
        super(400, message ?? "Invalid arguments.");
    }
}

module.exports = InvalidArgumentError;