"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const eslint_utils_1 = require("@typescript-eslint/utils/eslint-utils");
const util_1 = require("../util");
exports.default = (0, util_1.createRule)({
    name: 'no-require-imports',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow invocation of `require()`',
        },
        schema: [],
        messages: {
            noRequireImports: 'A `require()` style import is forbidden.',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            'CallExpression[callee.name="require"]'(node) {
                const variable = utils_1.ASTUtils.findVariable((0, eslint_utils_1.getScope)(context), 'require');
                // ignore non-global require usage as it's something user-land custom instead
                // of the commonjs standard
                if (!variable?.identifiers.length) {
                    context.report({
                        node,
                        messageId: 'noRequireImports',
                    });
                }
            },
            TSExternalModuleReference(node) {
                context.report({
                    node,
                    messageId: 'noRequireImports',
                });
            },
        };
    },
});
//# sourceMappingURL=no-require-imports.js.map