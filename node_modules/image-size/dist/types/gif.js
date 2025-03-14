"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIF = void 0;
const utils_1 = require("./utils");
const gifRegexp = /^GIF8[79]a/;
exports.GIF = {
    validate: (input) => gifRegexp.test((0, utils_1.toUTF8String)(input, 0, 6)),
    calculate: (input) => ({
        height: (0, utils_1.readUInt16LE)(input, 8),
        width: (0, utils_1.readUInt16LE)(input, 6),
    }),
};
