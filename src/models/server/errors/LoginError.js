const DefaultError = require("./DefaultError");

class LoginError extends DefaultError {
    constructor() {
        super(401, "Username or password invalid");
    }
}

module.exports = LoginError;