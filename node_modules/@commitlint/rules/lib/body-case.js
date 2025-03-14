"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyCase = void 0;
const ensure_1 = require("@commitlint/ensure");
const message_1 = __importDefault(require("@commitlint/message"));
const negated = (when) => when === 'never';
const bodyCase = (parsed, when = 'always', value = []) => {
    const { body } = parsed;
    if (!body) {
        return [true];
    }
    const checks = (Array.isArray(value) ? value : [value]).map((check) => {
        if (typeof check === 'string') {
            return {
                when: 'always',
                case: check,
            };
        }
        return check;
    });
    const result = checks.some((check) => {
        const r = (0, ensure_1.case)(body, check.case);
        return negated(check.when) ? !r : r;
    });
    const list = checks.map((c) => c.case).join(', ');
    return [
        negated(when) ? !result : result,
        (0, message_1.default)([`body must`, negated(when) ? `not` : null, `be ${list}`]),
    ];
};
exports.bodyCase = bodyCase;
//# sourceMappingURL=body-case.js.map