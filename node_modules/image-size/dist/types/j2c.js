"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.J2C = void 0;
const utils_1 = require("./utils");
exports.J2C = {
    // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
    validate: (input) => (0, utils_1.toHexString)(input, 0, 4) === 'ff4fff51',
    calculate: (input) => ({
        height: (0, utils_1.readUInt32BE)(input, 12),
        width: (0, utils_1.readUInt32BE)(input, 8),
    }),
};
