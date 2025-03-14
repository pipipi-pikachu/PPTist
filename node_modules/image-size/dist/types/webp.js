"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBP = void 0;
const utils_1 = require("./utils");
function calculateExtended(input) {
    return {
        height: 1 + (0, utils_1.readUInt24LE)(input, 7),
        width: 1 + (0, utils_1.readUInt24LE)(input, 4),
    };
}
function calculateLossless(input) {
    return {
        height: 1 +
            (((input[4] & 0xf) << 10) | (input[3] << 2) | ((input[2] & 0xc0) >> 6)),
        width: 1 + (((input[2] & 0x3f) << 8) | input[1]),
    };
}
function calculateLossy(input) {
    // `& 0x3fff` returns the last 14 bits
    // TO-DO: include webp scaling in the calculations
    return {
        height: (0, utils_1.readInt16LE)(input, 8) & 0x3fff,
        width: (0, utils_1.readInt16LE)(input, 6) & 0x3fff,
    };
}
exports.WEBP = {
    validate(input) {
        const riffHeader = 'RIFF' === (0, utils_1.toUTF8String)(input, 0, 4);
        const webpHeader = 'WEBP' === (0, utils_1.toUTF8String)(input, 8, 12);
        const vp8Header = 'VP8' === (0, utils_1.toUTF8String)(input, 12, 15);
        return riffHeader && webpHeader && vp8Header;
    },
    calculate(input) {
        const chunkHeader = (0, utils_1.toUTF8String)(input, 12, 16);
        input = input.slice(20, 30);
        // Extended webp stream signature
        if (chunkHeader === 'VP8X') {
            const extendedHeader = input[0];
            const validStart = (extendedHeader & 0xc0) === 0;
            const validEnd = (extendedHeader & 0x01) === 0;
            if (validStart && validEnd) {
                return calculateExtended(input);
            }
            else {
                // TODO: breaking change
                throw new TypeError('Invalid WebP');
            }
        }
        // Lossless webp stream signature
        if (chunkHeader === 'VP8 ' && input[0] !== 0x2f) {
            return calculateLossy(input);
        }
        // Lossy webp stream signature
        const signature = (0, utils_1.toHexString)(input, 3, 6);
        if (chunkHeader === 'VP8L' && signature !== '9d012a') {
            return calculateLossless(input);
        }
        throw new TypeError('Invalid WebP');
    },
};
