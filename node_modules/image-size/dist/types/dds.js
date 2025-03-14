"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDS = void 0;
const utils_1 = require("./utils");
exports.DDS = {
    validate: (input) => (0, utils_1.readUInt32LE)(input, 0) === 0x20534444,
    calculate: (input) => ({
        height: (0, utils_1.readUInt32LE)(input, 12),
        width: (0, utils_1.readUInt32LE)(input, 16),
    }),
};
