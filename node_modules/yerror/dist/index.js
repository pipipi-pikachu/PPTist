import os from 'os';
/**
 * A YError class able to contain some params and
 *  print better stack traces
 * @extends Error
 */
class YError extends Error {
    code;
    params;
    wrappedErrors;
    constructor(wrappedErrors, errorCode, ...params) {
        // Detecting if wrappedErrors are passed
        if (!(wrappedErrors instanceof Array)) {
            params = ('undefined' === typeof errorCode ? [] : [errorCode]).concat(params);
            errorCode = wrappedErrors;
            wrappedErrors = [];
        }
        // Call the parent constructor
        super(errorCode);
        // Filling error
        this.code = errorCode || 'E_UNEXPECTED';
        this.params = params;
        this.wrappedErrors = wrappedErrors;
        this.name = this.toString();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    /**
     * Wraps any error and output a YError with an error
     *  code and some params as debug values.
     * @param {Error} err
     * The error to wrap
     * @param {string} [errorCode = 'E_UNEXPECTED']
     * The error code corresponding to the actual error
     * @param {...YErrorParams} [params]
     * Some additional debugging values
     * @return {YError}
     * The wrapped error
     */
    static wrap(err, errorCode, ...params) {
        const wrappedErrorIsACode = _looksLikeAYErrorCode(err.message);
        const wrappedErrors = ('wrappedErrors' in err ? err.wrappedErrors : []).concat(err);
        if (!errorCode) {
            if (wrappedErrorIsACode) {
                errorCode = err.message;
            }
            else {
                errorCode = 'E_UNEXPECTED';
            }
        }
        if (err.message && !wrappedErrorIsACode) {
            params.push(err.message);
        }
        return new YError(wrappedErrors, errorCode, ...params);
    }
    /**
     * Return a YError as is or wraps any other error and output
     *  a YError with a code and some params as debug values.
     * @param {Error} err
     * The error to cast
     * @param {string} [errorCode = 'E_UNEXPECTED']
     * The error code corresponding to the actual error
     * @param {...YErrorParams} [params]
     * Some additional debugging values
     * @return {YError}
     * The wrapped error
     */
    static cast(err, errorCode, ...params) {
        if (_looksLikeAYError(err)) {
            return err;
        }
        return YError.wrap(err, errorCode, ...params);
    }
    /**
     * Same than `YError.wrap()` but preserves the code
     *  and the debug values of the error if it is
     *  already an instance of the YError constructor.
     * @param {Error} err
     * The error to bump
     * @param {string} [errorCode = 'E_UNEXPECTED']
     * The error code corresponding to the actual error
     * @param {...YErrorParams} [params]
     * Some additional debugging values
     * @return {YError}
     * The wrapped error
     */
    static bump(err, errorCode, ...params) {
        if (_looksLikeAYError(err)) {
            return YError.wrap(err, err.code, ...err.params);
        }
        return YError.wrap(err, errorCode, ...params);
    }
    toString() {
        return ((this.wrappedErrors.length
            ? // eslint-disable-next-line
                this.wrappedErrors[this.wrappedErrors.length - 1].stack + os.EOL
            : '') +
            this.constructor.name +
            ': ' +
            this.code +
            ' (' +
            this.params.join(', ') +
            ')');
    }
}
/**
 * Allow to print a stack from anything (especially catched
 *  errors that may or may not contain errors 🤷).
 * @param {Error} err
 * The error to print
 * @return {string}
 * The stack trace if any
 */
export function printStackTrace(err) {
    return typeof err === 'object' && typeof err.stack === 'string'
        ? err.stack
        : `[no_stack_trace]: error is ${err != null && typeof err.toString === 'function'
            ? err.toString()
            : typeof err}`;
}
// In order to keep compatibility through major versions
// we have to make kind of an cross major version instanceof
function _looksLikeAYError(err) {
    return (!!(err instanceof YError) ||
        !!(err.constructor &&
            err.constructor.name &&
            err.constructor.name.endsWith('Error') &&
            'code' in err &&
            'string' === typeof err.code &&
            _looksLikeAYErrorCode(err.code) &&
            'params' in err &&
            err.params &&
            err.params instanceof Array));
}
function _looksLikeAYErrorCode(str) {
    return /^([A-Z0-9_]+)$/.test(str);
}
export { YError };
//# sourceMappingURL=index.js.map