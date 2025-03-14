"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectCase = void 0;
const ensure_1 = require("@commitlint/ensure");
const message_1 = __importDefault(require("@commitlint/message"));
/**
 * Since the rule requires first symbol of a subject to be a letter, use
 * Unicode `Cased_Letter` category now to allow non-Latin alphabets as well.
 *
 * Do not use `Letter` category directly to avoid capturing `Modifier_Letter`
 * (which just modifiers letters, so we probably shouldn't anyway) and
 * `Other_Letter` (they actually are case-less, so they can't be validated)
 * categories, and to stay close to previous implementation.
 *
 * Also, typescript does not seem to support almost any longhand category name
 * (and even short for `Cased_Letter` too) so list all required letter
 * categories manually just to prevent it from complaining about unknown stuff.
 *
 * @see [Unicode Categories]{@link https://www.regular-expressions.info/unicode.html}
 */
const startsWithLetterRegex = /^[\p{Ll}\p{Lu}\p{Lt}]/iu;
const negated = (when) => when === 'never';
const subjectCase = (parsed, when = 'always', value = []) => {
    const { subject } = parsed;
    if (typeof subject !== 'string' || !subject.match(startsWithLetterRegex)) {
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
        const r = (0, ensure_1.case)(subject, check.case);
        return negated(check.when) ? !r : r;
    });
    const list = checks.map((c) => c.case).join(', ');
    return [
        negated(when) ? !result : result,
        (0, message_1.default)([`subject must`, negated(when) ? `not` : null, `be ${list}`]),
    ];
};
exports.subjectCase = subjectCase;
//# sourceMappingURL=subject-case.js.map