"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const to_case_1 = __importDefault(require("./to-case"));
exports.default = ensureCase;
function ensureCase(raw = '', target = 'lowercase') {
    // We delete any content together with quotes because he can contains proper names (example `refactor: `Eslint` configuration`).
    // We need trim string because content with quotes can be at the beginning or end of a line
    const input = String(raw)
        .replace(/`.*?`|".*?"|'.*?'/g, '')
        .trim();
    const transformed = (0, to_case_1.default)(input, target);
    if (transformed === '' || transformed.match(/^\d/)) {
        return true;
    }
    return transformed === input;
}
//# sourceMappingURL=case.js.map