"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUR = void 0;
const ico_1 = require("./ico");
const utils_1 = require("./utils");
const TYPE_CURSOR = 2;
exports.CUR = {
    validate(input) {
        const reserved = (0, utils_1.readUInt16LE)(input, 0);
        const imageCount = (0, utils_1.readUInt16LE)(input, 4);
        if (reserved !== 0 || imageCount === 0)
            return false;
        const imageType = (0, utils_1.readUInt16LE)(input, 2);
        return imageType === TYPE_CURSOR;
    },
    calculate: (input) => ico_1.ICO.calculate(input),
};
