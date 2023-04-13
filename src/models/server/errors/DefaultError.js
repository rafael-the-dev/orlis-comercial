
class DefaultError extends Error {
    constructor(status, message) {
        super(message);
        this._status = status;
    }

    get status() { return this._status; }

    getResponse() {
        return {
            message: this.message
        }
    }
}

module.exports = DefaultError;