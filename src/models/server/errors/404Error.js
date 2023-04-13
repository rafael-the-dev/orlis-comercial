const DefaultError = require("./DefaultError");

class Error404 extends DefaultError {
    constructor(message) {
        super(404, message ?? "404 Error");
    }
}

module.exports = Error404;