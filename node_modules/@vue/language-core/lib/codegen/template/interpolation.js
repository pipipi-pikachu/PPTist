"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInterpolation = generateInterpolation;
exports.forEachInterpolationSegment = forEachInterpolationSegment;
const shared_1 = require("@vue/shared");
const scriptSetupRanges_1 = require("../../parsers/scriptSetupRanges");
const common_1 = require("../common");
function* generateInterpolation(options, ctx, _code, astHolder, start, data, prefix, suffix) {
    const code = prefix + _code + suffix;
    const ast = (0, common_1.createTsAst)(options.ts, astHolder, code);
    const vars = [];
    for (let [section, offset, onlyError] of forEachInterpolationSegment(options.ts, ctx, code, start !== undefined ? start - prefix.length : undefined, ast)) {
        if (offset === undefined) {
            yield section;
        }
        else {
            offset -= prefix.length;
            let addSuffix = '';
            const overLength = offset + section.length - _code.length;
            if (overLength > 0) {
                addSuffix = section.substring(section.length - overLength);
                section = section.substring(0, section.length - overLength);
            }
            if (offset < 0) {
                yield section.substring(0, -offset);
                section = section.substring(-offset);
                offset = 0;
            }
            if (start !== undefined && data !== undefined) {
                yield [
                    section,
                    'template',
                    start + offset,
                    onlyError
                        ? ctx.codeFeatures.verification
                        : typeof data === 'function' ? data() : data,
                ];
            }
            else {
                yield section;
            }
            yield addSuffix;
        }
    }
    if (start !== undefined) {
        for (const v of vars) {
            v.offset = start + v.offset - prefix.length;
        }
    }
}
function* forEachInterpolationSegment(ts, ctx, code, offset, ast) {
    let ctxVars = [];
    const varCb = (id, isShorthand) => {
        const text = (0, scriptSetupRanges_1.getNodeText)(ts, id, ast);
        if (ctx.hasLocalVariable(text) ||
            // https://github.com/vuejs/core/blob/245230e135152900189f13a4281302de45fdcfaa/packages/compiler-core/src/transforms/transformExpression.ts#L342-L352
            (0, shared_1.isGloballyWhitelisted)(text) ||
            text === 'require' ||
            text.startsWith('__VLS_')) {
            // localVarOffsets.push(localVar.getStart(ast));
        }
        else {
            ctxVars.push({
                text,
                isShorthand: isShorthand,
                offset: (0, scriptSetupRanges_1.getStartEnd)(ts, id, ast).start,
            });
            if (offset !== undefined) {
                ctx.accessExternalVariable(text, offset + (0, scriptSetupRanges_1.getStartEnd)(ts, id, ast).start);
            }
            else {
                ctx.accessExternalVariable(text);
            }
        }
    };
    ts.forEachChild(ast, node => walkIdentifiers(ts, node, ast, varCb, ctx));
    ctxVars = ctxVars.sort((a, b) => a.offset - b.offset);
    if (ctxVars.length) {
        if (ctxVars[0].isShorthand) {
            yield [code.substring(0, ctxVars[0].offset + ctxVars[0].text.length), 0];
            yield [': ', undefined];
        }
        else {
            yield [code.substring(0, ctxVars[0].offset), 0];
        }
        for (let i = 0; i < ctxVars.length - 1; i++) {
            // fix https://github.com/vuejs/language-tools/issues/1205
            // fix https://github.com/vuejs/language-tools/issues/1264
            yield ['', ctxVars[i + 1].offset, true];
            yield ['__VLS_ctx.', undefined];
            if (ctxVars[i + 1].isShorthand) {
                yield [code.substring(ctxVars[i].offset, ctxVars[i + 1].offset + ctxVars[i + 1].text.length), ctxVars[i].offset];
                yield [': ', undefined];
            }
            else {
                yield [code.substring(ctxVars[i].offset, ctxVars[i + 1].offset), ctxVars[i].offset];
            }
        }
        yield ['', ctxVars[ctxVars.length - 1].offset, true];
        yield ['__VLS_ctx.', undefined];
        yield [code.substring(ctxVars[ctxVars.length - 1].offset), ctxVars[ctxVars.length - 1].offset];
    }
    else {
        yield [code, 0];
    }
}
function walkIdentifiers(ts, node, ast, cb, ctx, blockVars = [], isRoot = true) {
    if (ts.isIdentifier(node)) {
        cb(node, false);
    }
    else if (ts.isShorthandPropertyAssignment(node)) {
        cb(node.name, true);
    }
    else if (ts.isPropertyAccessExpression(node)) {
        walkIdentifiers(ts, node.expression, ast, cb, ctx, blockVars, false);
    }
    else if (ts.isVariableDeclaration(node)) {
        (0, common_1.collectVars)(ts, node.name, ast, blockVars);
        for (const varName of blockVars) {
            ctx.addLocalVariable(varName);
        }
        if (node.initializer) {
            walkIdentifiers(ts, node.initializer, ast, cb, ctx, blockVars, false);
        }
    }
    else if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
        const functionArgs = [];
        for (const param of node.parameters) {
            (0, common_1.collectVars)(ts, param.name, ast, functionArgs);
            if (param.type) {
                walkIdentifiers(ts, param.type, ast, cb, ctx, blockVars, false);
            }
        }
        for (const varName of functionArgs) {
            ctx.addLocalVariable(varName);
        }
        walkIdentifiers(ts, node.body, ast, cb, ctx, blockVars, false);
        for (const varName of functionArgs) {
            ctx.removeLocalVariable(varName);
        }
    }
    else if (ts.isObjectLiteralExpression(node)) {
        for (const prop of node.properties) {
            if (ts.isPropertyAssignment(prop)) {
                // fix https://github.com/vuejs/language-tools/issues/1176
                if (ts.isComputedPropertyName(prop.name)) {
                    walkIdentifiers(ts, prop.name.expression, ast, cb, ctx, blockVars, false);
                }
                walkIdentifiers(ts, prop.initializer, ast, cb, ctx, blockVars, false);
            }
            // fix https://github.com/vuejs/language-tools/issues/1156
            else if (ts.isShorthandPropertyAssignment(prop)) {
                walkIdentifiers(ts, prop, ast, cb, ctx, blockVars, false);
            }
            // fix https://github.com/vuejs/language-tools/issues/1148#issuecomment-1094378126
            else if (ts.isSpreadAssignment(prop)) {
                // TODO: cannot report "Spread types may only be created from object types.ts(2698)"
                walkIdentifiers(ts, prop.expression, ast, cb, ctx, blockVars, false);
            }
        }
    }
    else if (ts.isTypeReferenceNode(node)) {
        // fix https://github.com/vuejs/language-tools/issues/1422
        ts.forEachChild(node, node => walkIdentifiersInTypeReference(ts, node, cb));
    }
    else {
        const _blockVars = blockVars;
        if (ts.isBlock(node)) {
            blockVars = [];
        }
        ts.forEachChild(node, node => walkIdentifiers(ts, node, ast, cb, ctx, blockVars, false));
        if (ts.isBlock(node)) {
            for (const varName of blockVars) {
                ctx.removeLocalVariable(varName);
            }
        }
        blockVars = _blockVars;
    }
    if (isRoot) {
        for (const varName of blockVars) {
            ctx.removeLocalVariable(varName);
        }
    }
}
function walkIdentifiersInTypeReference(ts, node, cb) {
    if (ts.isTypeQueryNode(node) && ts.isIdentifier(node.exprName)) {
        cb(node.exprName, false);
    }
    else {
        ts.forEachChild(node, node => walkIdentifiersInTypeReference(ts, node, cb));
    }
}
//# sourceMappingURL=interpolation.js.map