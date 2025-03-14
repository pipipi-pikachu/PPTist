"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectExclamationMark = void 0;
const message_1 = __importDefault(require("@commitlint/message"));
const subjectExclamationMark = (parsed, when = 'always') => {
    const input = parsed.header;
    if (!input) {
        return [true, ''];
    }
    const negated = when === 'never';
    const hasExclamationMark = /!:/.test(input);
    return [
        negated ? !hasExclamationMark : hasExclamationMark,
        (0, message_1.default)([
            'subject',
            negated ? 'must not' : 'must',
            'have an exclamation mark in the subject to identify a breaking change',
        ]),
    ];
};
exports.subjectExclamationMark = subjectExclamationMark;
//# sourceMappingURL=subject-exclamation-mark.js.map