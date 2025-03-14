"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInternalComponent = generateInternalComponent;
const common_1 = require("../common");
const component_1 = require("./component");
const template_1 = require("./template");
function* generateInternalComponent(options, ctx, templateCodegenCtx) {
    if (options.sfc.scriptSetup && options.scriptSetupRanges) {
        yield `let __VLS_defineComponent!: typeof import('${options.vueCompilerOptions.lib}').defineComponent${common_1.endOfLine}`;
        yield `const __VLS_internalComponent = __VLS_defineComponent({${common_1.newLine}`;
        yield `setup() {${common_1.newLine}`;
        yield `return {${common_1.newLine}`;
        if (ctx.bypassDefineComponent) {
            yield* (0, component_1.generateComponentSetupReturns)(options.scriptSetupRanges);
        }
        // bindings
        const templateUsageVars = (0, template_1.getTemplateUsageVars)(options, ctx);
        for (const [content, bindings] of [
            [options.sfc.scriptSetup.content, options.scriptSetupRanges.bindings],
            options.sfc.script && options.scriptRanges
                ? [options.sfc.script.content, options.scriptRanges.bindings]
                : ['', []],
        ]) {
            for (const expose of bindings) {
                const varName = content.substring(expose.start, expose.end);
                if (!templateUsageVars.has(varName) && !templateCodegenCtx.accessExternalVariables.has(varName)) {
                    continue;
                }
                const templateOffset = options.getGeneratedLength();
                yield `${varName}: ${varName} as typeof `;
                const scriptOffset = options.getGeneratedLength();
                yield `${varName},${common_1.newLine}`;
                options.linkedCodeMappings.push({
                    sourceOffsets: [scriptOffset],
                    generatedOffsets: [templateOffset],
                    lengths: [varName.length],
                    data: undefined,
                });
            }
        }
        yield `}${common_1.endOfLine}`; // return {
        yield `},${common_1.newLine}`; // setup() {
        if (options.sfc.scriptSetup && options.scriptSetupRanges && !ctx.bypassDefineComponent) {
            yield* (0, component_1.generateScriptSetupOptions)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
        }
        if (options.sfc.script && options.scriptRanges) {
            yield* (0, component_1.generateScriptOptions)(options.sfc.script, options.scriptRanges);
        }
        yield `})${common_1.endOfLine}`; // defineComponent {
    }
    else if (options.sfc.script) {
        yield `let __VLS_internalComponent!: typeof import('./${options.fileBaseName}').default${common_1.endOfLine}`;
    }
    else {
        yield `const __VLS_internalComponent = (await import('${options.vueCompilerOptions.lib}')).defineComponent({})${common_1.endOfLine}`;
    }
}
//# sourceMappingURL=internalComponent.js.map