"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PNG = void 0;
const utils_1 = require("./utils");
const pngSignature = 'PNG\r\n\x1a\n';
const pngImageHeaderChunkName = 'IHDR';
// Used to detect "fried" png's: http://www.jongware.com/pngdefry.html
const pngFriedChunkName = 'CgBI';
exports.PNG = {
    validate(input) {
        if (pngSignature === (0, utils_1.toUTF8String)(input, 1, 8)) {
            let chunkName = (0, utils_1.toUTF8String)(input, 12, 16);
            if (chunkName === pngFriedChunkName) {
                chunkName = (0, utils_1.toUTF8String)(input, 28, 32);
            }
            if (chunkName !== pngImageHeaderChunkName) {
                throw new TypeError('Invalid PNG');
            }
            return true;
        }
        return false;
    },
    calculate(input) {
        if ((0, utils_1.toUTF8String)(input, 12, 16) === pngFriedChunkName) {
            return {
                height: (0, utils_1.readUInt32BE)(input, 36),
                width: (0, utils_1.readUInt32BE)(input, 32),
            };
        }
        return {
            height: (0, utils_1.readUInt32BE)(input, 20),
            width: (0, utils_1.readUInt32BE)(input, 16),
        };
    },
};
