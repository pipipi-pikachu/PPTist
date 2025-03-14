"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BMP = void 0;
const utils_1 = require("./utils");
exports.BMP = {
    validate: (input) => (0, utils_1.toUTF8String)(input, 0, 2) === 'BM',
    calculate: (input) => ({
        height: Math.abs((0, utils_1.readInt32LE)(input, 22)),
        width: (0, utils_1.readUInt32LE)(input, 18),
    }),
};
