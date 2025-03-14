"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateElementDirectives = generateElementDirectives;
const CompilerDOM = require("@vue/compiler-dom");
const shared_1 = require("@vue/shared");
const shared_2 = require("../../utils/shared");
const common_1 = require("../common");
const camelized_1 = require("./camelized");
const interpolation_1 = require("./interpolation");
function* generateElementDirectives(options, ctx, node) {
    for (const prop of node.props) {
        if (prop.type === CompilerDOM.NodeTypes.DIRECTIVE
            && prop.name !== 'slot'
            && prop.name !== 'on'
            && prop.name !== 'model'
            && prop.name !== 'bind'
            && prop.name !== 'scope'
            && prop.name !== 'data') {
            ctx.accessExternalVariable((0, shared_1.camelize)('v-' + prop.name), prop.loc.start.offset);
            if (prop.arg?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION && !prop.arg.isStatic) {
                yield* (0, interpolation_1.generateInterpolation)(options, ctx, prop.arg.content, prop.arg.loc, prop.arg.loc.start.offset + prop.arg.loc.source.indexOf(prop.arg.content), ctx.codeFeatures.all, '(', ')');
                yield common_1.endOfLine;
            }
            yield* (0, common_1.wrapWith)(prop.loc.start.offset, prop.loc.end.offset, ctx.codeFeatures.verification, `__VLS_directiveFunction(__VLS_ctx.`, ...(0, camelized_1.generateCamelized)('v-' + prop.name, prop.loc.start.offset, {
                ...ctx.codeFeatures.all,
                verification: false,
                completion: {
                    // fix https://github.com/vuejs/language-tools/issues/1905
                    isAdditional: true,
                },
                navigation: {
                    resolveRenameNewName: shared_1.camelize,
                    resolveRenameEditText: getPropRenameApply(prop.name),
                },
            }), `)(`, ...(prop.exp?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION
                ? (0, common_1.wrapWith)(prop.exp.loc.start.offset, prop.exp.loc.end.offset, ctx.codeFeatures.verification, ...(0, interpolation_1.generateInterpolation)(options, ctx, prop.exp.content, prop.exp.loc, prop.exp.loc.start.offset, ctx.codeFeatures.all, '(', ')'))
                : [`undefined`]), `)`);
            yield common_1.endOfLine;
        }
    }
}
function getPropRenameApply(oldName) {
    return oldName === (0, shared_2.hyphenateAttr)(oldName) ? shared_2.hyphenateAttr : undefined;
}
//# sourceMappingURL=elementDirectives.js.map