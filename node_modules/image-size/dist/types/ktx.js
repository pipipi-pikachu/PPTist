"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KTX = void 0;
const utils_1 = require("./utils");
exports.KTX = {
    validate: (input) => {
        const signature = (0, utils_1.toUTF8String)(input, 1, 7);
        return ['KTX 11', 'KTX 20'].includes(signature);
    },
    calculate: (input) => {
        const type = input[5] === 0x31 ? 'ktx' : 'ktx2';
        const offset = type === 'ktx' ? 36 : 20;
        return ({
            height: (0, utils_1.readUInt32LE)(input, offset + 4),
            width: (0, utils_1.readUInt32LE)(input, offset),
            type,
        });
    },
};
