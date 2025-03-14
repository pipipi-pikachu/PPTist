"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PNM = void 0;
const utils_1 = require("./utils");
const PNMTypes = {
    P1: 'pbm/ascii',
    P2: 'pgm/ascii',
    P3: 'ppm/ascii',
    P4: 'pbm',
    P5: 'pgm',
    P6: 'ppm',
    P7: 'pam',
    PF: 'pfm',
};
const handlers = {
    default: (lines) => {
        let dimensions = [];
        while (lines.length > 0) {
            const line = lines.shift();
            if (line[0] === '#') {
                continue;
            }
            dimensions = line.split(' ');
            break;
        }
        if (dimensions.length === 2) {
            return {
                height: parseInt(dimensions[1], 10),
                width: parseInt(dimensions[0], 10),
            };
        }
        else {
            throw new TypeError('Invalid PNM');
        }
    },
    pam: (lines) => {
        const size = {};
        while (lines.length > 0) {
            const line = lines.shift();
            if (line.length > 16 || line.charCodeAt(0) > 128) {
                continue;
            }
            const [key, value] = line.split(' ');
            if (key && value) {
                size[key.toLowerCase()] = parseInt(value, 10);
            }
            if (size.height && size.width) {
                break;
            }
        }
        if (size.height && size.width) {
            return {
                height: size.height,
                width: size.width,
            };
        }
        else {
            throw new TypeError('Invalid PAM');
        }
    },
};
exports.PNM = {
    validate: (input) => (0, utils_1.toUTF8String)(input, 0, 2) in PNMTypes,
    calculate(input) {
        const signature = (0, utils_1.toUTF8String)(input, 0, 2);
        const type = PNMTypes[signature];
        // TODO: this probably generates garbage. move to a stream based parser
        const lines = (0, utils_1.toUTF8String)(input, 3).split(/[\r\n]+/);
        const handler = handlers[type] || handlers.default;
        return handler(lines);
    },
};
