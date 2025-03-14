"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TGA = void 0;
const utils_1 = require("./utils");
exports.TGA = {
    validate(input) {
        return (0, utils_1.readUInt16LE)(input, 0) === 0 && (0, utils_1.readUInt16LE)(input, 4) === 0;
    },
    calculate(input) {
        return {
            height: (0, utils_1.readUInt16LE)(input, 14),
            width: (0, utils_1.readUInt16LE)(input, 12),
        };
    },
};
