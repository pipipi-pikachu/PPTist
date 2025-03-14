type YErrorParams = any;
/**
 * A YError class able to contain some params and
 *  print better stack traces
 * @extends Error
 */
declare class YError extends Error {
    code: string;
    params: YErrorParams[];
    wrappedErrors: (Error | YError)[];
    /**
     * Creates a new YError with an error code
     *  and some params as debug values.
     * @param {string} [errorCode = 'E_UNEXPECTED']
     * The error code corresponding to the actual error
     * @param {...YErrorParams} [params]
     * Some additional debugging values
     */
    constructor(errorCode: string, ...params: YErrorParams[]);
    constructor(wrappedErrors?: Error[], errorCode?: string, ...params: YErrorParams[]);
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
    static wrap<E extends Error | YError>(err: E, errorCode?: string, ...params: YErrorParams[]): YError;
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
    static cast<E extends Error | YError>(err: E, errorCode?: string, ...params: YErrorParams[]): YError;
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
    static bump<E extends Error | YError>(err: E, errorCode?: string, ...params: YErrorParams[]): YError;
    toString(): string;
}
/**
 * Allow to print a stack from anything (especially catched
 *  errors that may or may not contain errors 🤷).
 * @param {Error} err
 * The error to print
 * @return {string}
 * The stack trace if any
 */
export declare function printStackTrace(err: Error | YError): string;
export { YError };
