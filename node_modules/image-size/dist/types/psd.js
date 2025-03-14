"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PSD = void 0;
const utils_1 = require("./utils");
exports.PSD = {
    validate: (input) => (0, utils_1.toUTF8String)(input, 0, 4) === '8BPS',
    calculate: (input) => ({
        height: (0, utils_1.readUInt32BE)(input, 14),
        width: (0, utils_1.readUInt32BE)(input, 18),
    }),
};
