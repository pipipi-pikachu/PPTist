"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trailerExists = void 0;
const execa_1 = __importDefault(require("execa"));
const message_1 = __importDefault(require("@commitlint/message"));
const to_lines_1 = __importDefault(require("@commitlint/to-lines"));
const trailerExists = (parsed, when = 'always', value = '') => {
    const trailers = execa_1.default.sync('git', ['interpret-trailers', '--parse'], {
        input: parsed.raw,
    }).stdout;
    const matches = (0, to_lines_1.default)(trailers).filter((ln) => ln.startsWith(value)).length;
    const negated = when === 'never';
    const hasTrailer = matches > 0;
    return [
        negated ? !hasTrailer : hasTrailer,
        (0, message_1.default)([
            'message',
            negated ? 'must not' : 'must',
            'have `' + value + '` trailer',
        ]),
    ];
};
exports.trailerExists = trailerExists;
//# sourceMappingURL=trailer-exists.js.map