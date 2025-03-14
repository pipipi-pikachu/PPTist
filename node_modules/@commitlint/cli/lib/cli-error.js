"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliError = void 0;
class CliError extends Error {
    constructor(message, type, error_code = 1) {
        super(message);
        this.__proto__ = Error;
        this.type = type;
        this.error_code = error_code;
        Object.setPrototypeOf(this, CliError.prototype);
    }
}
exports.CliError = CliError;
//# sourceMappingURL=cli-error.js.map