"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
const lodash_kebabcase_1 = __importDefault(require("lodash.kebabcase"));
const lodash_snakecase_1 = __importDefault(require("lodash.snakecase"));
const lodash_upperfirst_1 = __importDefault(require("lodash.upperfirst"));
const lodash_startcase_1 = __importDefault(require("lodash.startcase"));
function toCase(input, target) {
    switch (target) {
        case 'camel-case':
            return (0, lodash_camelcase_1.default)(input);
        case 'kebab-case':
            return (0, lodash_kebabcase_1.default)(input);
        case 'snake-case':
            return (0, lodash_snakecase_1.default)(input);
        case 'pascal-case':
            return (0, lodash_upperfirst_1.default)((0, lodash_camelcase_1.default)(input));
        case 'start-case':
            return (0, lodash_startcase_1.default)(input);
        case 'upper-case':
        case 'uppercase':
            return input.toUpperCase();
        case 'sentence-case':
        case 'sentencecase':
            return (0, lodash_upperfirst_1.default)(input);
        case 'lower-case':
        case 'lowercase':
        case 'lowerCase': // Backwards compat config-angular v4
            return input.toLowerCase();
        default:
            throw new TypeError(`to-case: Unknown target case "${target}"`);
    }
}
exports.default = toCase;
//# sourceMappingURL=to-case.js.map