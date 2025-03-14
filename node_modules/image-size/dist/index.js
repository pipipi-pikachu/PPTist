"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = exports.setConcurrency = exports.disableTypes = exports.disableFS = exports.imageSize = void 0;
const fs = require("fs");
const path = require("path");
const queue_1 = require("queue");
const index_1 = require("./types/index");
const detector_1 = require("./detector");
// Maximum input size, with a default of 512 kilobytes.
// TO-DO: make this adaptive based on the initial signature of the image
const MaxInputSize = 512 * 1024;
// This queue is for async `fs` operations, to avoid reaching file-descriptor limits
const queue = new queue_1.default({ concurrency: 100, autostart: true });
const globalOptions = {
    disabledFS: false,
    disabledTypes: [],
};
/**
 * Return size information based on an Uint8Array
 *
 * @param {Uint8Array} input
 * @param {String} filepath
 * @returns {Object}
 */
function lookup(input, filepath) {
    // detect the file type.. don't rely on the extension
    const type = (0, detector_1.detector)(input);
    if (typeof type !== 'undefined') {
        if (globalOptions.disabledTypes.indexOf(type) > -1) {
            throw new TypeError('disabled file type: ' + type);
        }
        // find an appropriate handler for this file type
        if (type in index_1.typeHandlers) {
            const size = index_1.typeHandlers[type].calculate(input, filepath);
            if (size !== undefined) {
                size.type = size.type ?? type;
                return size;
            }
        }
    }
    // throw up, if we don't understand the file
    throw new TypeError('unsupported file type: ' + type + ' (file: ' + filepath + ')');
}
/**
 * Reads a file into an Uint8Array.
 * @param {String} filepath
 * @returns {Promise<Uint8Array>}
 */
async function readFileAsync(filepath) {
    const handle = await fs.promises.open(filepath, 'r');
    try {
        const { size } = await handle.stat();
        if (size <= 0) {
            throw new Error('Empty file');
        }
        const inputSize = Math.min(size, MaxInputSize);
        const input = new Uint8Array(inputSize);
        await handle.read(input, 0, inputSize, 0);
        return input;
    }
    finally {
        await handle.close();
    }
}
/**
 * Synchronously reads a file into an Uint8Array, blocking the nodejs process.
 *
 * @param {String} filepath
 * @returns {Uint8Array}
 */
function readFileSync(filepath) {
    // read from the file, synchronously
    const descriptor = fs.openSync(filepath, 'r');
    try {
        const { size } = fs.fstatSync(descriptor);
        if (size <= 0) {
            throw new Error('Empty file');
        }
        const inputSize = Math.min(size, MaxInputSize);
        const input = new Uint8Array(inputSize);
        fs.readSync(descriptor, input, 0, inputSize, 0);
        return input;
    }
    finally {
        fs.closeSync(descriptor);
    }
}
// eslint-disable-next-line @typescript-eslint/no-use-before-define
module.exports = exports = imageSize; // backwards compatibility
exports.default = imageSize;
/**
 * @param {Uint8Array|string} input - Uint8Array or relative/absolute path of the image file
 * @param {Function=} [callback] - optional function for async detection
 */
function imageSize(input, callback) {
    // Handle Uint8Array input
    if (input instanceof Uint8Array) {
        return lookup(input);
    }
    // input should be a string at this point
    if (typeof input !== 'string' || globalOptions.disabledFS) {
        throw new TypeError('invalid invocation. input should be a Uint8Array');
    }
    // resolve the file path
    const filepath = path.resolve(input);
    if (typeof callback === 'function') {
        queue.push(() => readFileAsync(filepath)
            .then((input) => process.nextTick(callback, null, lookup(input, filepath)))
            .catch(callback));
    }
    else {
        const input = readFileSync(filepath);
        return lookup(input, filepath);
    }
}
exports.imageSize = imageSize;
const disableFS = (v) => {
    globalOptions.disabledFS = v;
};
exports.disableFS = disableFS;
const disableTypes = (types) => {
    globalOptions.disabledTypes = types;
};
exports.disableTypes = disableTypes;
const setConcurrency = (c) => {
    queue.concurrency = c;
};
exports.setConcurrency = setConcurrency;
exports.types = Object.keys(index_1.typeHandlers);
