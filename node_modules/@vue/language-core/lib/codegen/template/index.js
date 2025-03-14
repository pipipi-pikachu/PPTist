"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplate = generateTemplate;
exports.forEachElementNode = forEachElementNode;
const CompilerDOM = require("@vue/compiler-dom");
const common_1 = require("../common");
const context_1 = require("./context");
const element_1 = require("./element");
const objectProperty_1 = require("./objectProperty");
const templateChild_1 = require("./templateChild");
function* generateTemplate(options) {
    const ctx = (0, context_1.createTemplateCodegenContext)(options.scriptSetupBindingNames);
    if (options.slotsAssignName) {
        ctx.addLocalVariable(options.slotsAssignName);
    }
    if (options.propsAssignName) {
        ctx.addLocalVariable(options.propsAssignName);
    }
    yield* generatePreResolveComponents();
    if (options.template.ast) {
        yield* (0, templateChild_1.generateTemplateChild)(options, ctx, options.template.ast, undefined, undefined, undefined);
    }
    yield* generateStyleScopedClasses();
    if (!options.hasDefineSlots) {
        yield `var __VLS_slots!:`;
        yield* generateSlotsType();
        yield common_1.endOfLine;
    }
    yield* ctx.generateAutoImportCompletion();
    return ctx;
    function* generateSlotsType() {
        for (const { expVar, varName } of ctx.dynamicSlots) {
            ctx.hasSlot = true;
            yield `Partial<Record<NonNullable<typeof ${expVar}>, (_: typeof ${varName}) => any>> &${common_1.newLine}`;
        }
        yield `{${common_1.newLine}`;
        for (const slot of ctx.slots) {
            ctx.hasSlot = true;
            if (slot.name && slot.loc !== undefined) {
                yield* (0, objectProperty_1.generateObjectProperty)(options, ctx, slot.name, slot.loc, ctx.codeFeatures.withoutHighlightAndCompletion, slot.nodeLoc);
            }
            else {
                yield* (0, common_1.wrapWith)(slot.tagRange[0], slot.tagRange[1], ctx.codeFeatures.withoutHighlightAndCompletion, `default`);
            }
            yield `?(_: typeof ${slot.varName}): any,${common_1.newLine}`;
        }
        yield `}`;
    }
    function* generateStyleScopedClasses() {
        yield `if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {${common_1.newLine}`;
        for (const offset of ctx.emptyClassOffsets) {
            yield `__VLS_styleScopedClasses['`;
            yield [
                '',
                'template',
                offset,
                ctx.codeFeatures.additionalCompletion,
            ];
            yield `']${common_1.endOfLine}`;
        }
        for (const { className, offset } of ctx.scopedClasses) {
            yield `__VLS_styleScopedClasses[`;
            yield [
                '',
                'template',
                offset,
                ctx.codeFeatures.navigationWithoutRename,
            ];
            yield `'`;
            yield [
                className,
                'template',
                offset,
                ctx.codeFeatures.navigationAndAdditionalCompletion,
            ];
            yield `'`;
            yield [
                '',
                'template',
                offset + className.length,
                ctx.codeFeatures.navigationWithoutRename,
            ];
            yield `]${common_1.endOfLine}`;
        }
        yield `}${common_1.newLine}`;
    }
    function* generatePreResolveComponents() {
        yield `let __VLS_resolvedLocalAndGlobalComponents!: {}`;
        if (options.template.ast) {
            for (const node of forEachElementNode(options.template.ast)) {
                if (node.tagType === CompilerDOM.ElementTypes.COMPONENT
                    && node.tag.toLowerCase() !== 'component'
                    && !node.tag.includes('.') // namespace tag 
                ) {
                    yield ` & __VLS_WithComponent<'${(0, element_1.getCanonicalComponentName)(node.tag)}', typeof __VLS_localComponents, `;
                    yield (0, element_1.getPossibleOriginalComponentNames)(node.tag, false)
                        .map(name => `"${name}"`)
                        .join(', ');
                    yield `>`;
                }
            }
        }
        yield common_1.endOfLine;
    }
}
function* forEachElementNode(node) {
    if (node.type === CompilerDOM.NodeTypes.ROOT) {
        for (const child of node.children) {
            yield* forEachElementNode(child);
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.ELEMENT) {
        const patchForNode = (0, templateChild_1.getVForNode)(node);
        if (patchForNode) {
            yield* forEachElementNode(patchForNode);
        }
        else {
            yield node;
            for (const child of node.children) {
                yield* forEachElementNode(child);
            }
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.IF) {
        // v-if / v-else-if / v-else
        for (let i = 0; i < node.branches.length; i++) {
            const branch = node.branches[i];
            for (const childNode of branch.children) {
                yield* forEachElementNode(childNode);
            }
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.FOR) {
        // v-for
        for (const child of node.children) {
            yield* forEachElementNode(child);
        }
    }
}
//# sourceMappingURL=index.js.map