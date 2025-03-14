"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JP2 = void 0;
const utils_1 = require("./utils");
exports.JP2 = {
    validate(input) {
        if ((0, utils_1.readUInt32BE)(input, 4) !== 0x6a502020 || (0, utils_1.readUInt32BE)(input, 0) < 1)
            return false;
        const ftypBox = (0, utils_1.findBox)(input, 'ftyp', 0);
        if (!ftypBox)
            return false;
        return (0, utils_1.readUInt32BE)(input, ftypBox.offset + 4) === 0x66747970;
    },
    calculate(input) {
        const jp2hBox = (0, utils_1.findBox)(input, 'jp2h', 0);
        const ihdrBox = jp2hBox && (0, utils_1.findBox)(input, 'ihdr', jp2hBox.offset + 8);
        if (ihdrBox) {
            return {
                height: (0, utils_1.readUInt32BE)(input, ihdrBox.offset + 8),
                width: (0, utils_1.readUInt32BE)(input, ihdrBox.offset + 12),
            };
        }
        throw new TypeError('Unsupported JPEG 2000 format');
    },
};
