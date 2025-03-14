"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplate = generateTemplate;
exports.getTemplateUsageVars = getTemplateUsageVars;
const shared_1 = require("../../utils/shared");
const common_1 = require("../common");
const context_1 = require("../template/context");
const interpolation_1 = require("../template/interpolation");
const index_1 = require("./index");
const internalComponent_1 = require("./internalComponent");
function* generateTemplate(options, ctx, isClassComponent) {
    ctx.generatedTemplate = true;
    if (!options.vueCompilerOptions.skipTemplateCodegen) {
        if (isClassComponent) {
            yield `__VLS_template() {${common_1.newLine}`;
        }
        else {
            yield `function __VLS_template() {${common_1.newLine}`;
        }
        const templateCodegenCtx = (0, context_1.createTemplateCodegenContext)(new Set());
        yield* generateCtx(options, ctx, isClassComponent);
        yield* generateTemplateContext(options, templateCodegenCtx);
        yield* generateExportOptions(options);
        yield* generateConstNameOption(options);
        yield* (0, internalComponent_1.generateInternalComponent)(options, ctx, templateCodegenCtx);
        yield `}${common_1.newLine}`;
    }
    else {
        yield `function __VLS_template() {${common_1.newLine}`;
        const templateUsageVars = [...getTemplateUsageVars(options, ctx)];
        yield `// @ts-ignore${common_1.newLine}`;
        yield `[${templateUsageVars.join(', ')}]${common_1.newLine}`;
        yield `return {}${common_1.endOfLine}`;
        yield `}${common_1.newLine}`;
    }
}
function* generateExportOptions(options) {
    yield common_1.newLine;
    yield `const __VLS_componentsOption = `;
    if (options.sfc.script && options.scriptRanges?.exportDefault?.componentsOption) {
        const componentsOption = options.scriptRanges.exportDefault.componentsOption;
        yield [
            options.sfc.script.content.substring(componentsOption.start, componentsOption.end),
            'script',
            componentsOption.start,
            index_1.codeFeatures.navigation,
        ];
    }
    else {
        yield `{}`;
    }
    yield common_1.endOfLine;
}
function* generateConstNameOption(options) {
    if (options.sfc.script && options.scriptRanges?.exportDefault?.nameOption) {
        const nameOption = options.scriptRanges.exportDefault.nameOption;
        yield `const __VLS_name = `;
        yield `${options.sfc.script.content.substring(nameOption.start, nameOption.end)} as const`;
        yield common_1.endOfLine;
    }
    else if (options.sfc.scriptSetup) {
        yield `let __VLS_name!: '${options.scriptSetupRanges?.options.name ?? options.fileBaseName.substring(0, options.fileBaseName.lastIndexOf('.'))}'${common_1.endOfLine}`;
    }
    else {
        yield `const __VLS_name = undefined${common_1.endOfLine}`;
    }
}
function* generateCtx(options, ctx, isClassComponent) {
    yield `let __VLS_ctx!: `;
    if (options.vueCompilerOptions.petiteVueExtensions.some(ext => options.fileBaseName.endsWith(ext))) {
        yield `typeof globalThis & `;
    }
    if (!isClassComponent) {
        yield `InstanceType<__VLS_PickNotAny<typeof __VLS_internalComponent, new () => {}>>`;
    }
    else {
        yield `typeof this`;
    }
    /* CSS Module */
    if (options.sfc.styles.some(style => style.module)) {
        yield `& {${common_1.newLine}`;
        for (let i = 0; i < options.sfc.styles.length; i++) {
            const style = options.sfc.styles[i];
            if (style.module) {
                yield `${style.module}: Record<string, string> & ${ctx.helperTypes.Prettify.name}<{}`;
                for (const className of style.classNames) {
                    yield* generateCssClassProperty(i, className.text, className.offset, 'string', false);
                }
                yield `>${common_1.endOfLine}`;
            }
        }
        yield `}`;
    }
    yield common_1.endOfLine;
}
function* generateTemplateContext(options, templateCodegenCtx) {
    /* Components */
    yield `/* Components */${common_1.newLine}`;
    yield `let __VLS_otherComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C } ? C : {}> & typeof __VLS_componentsOption${common_1.endOfLine}`;
    yield `let __VLS_own!: __VLS_SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & (new () => { ${(0, shared_1.getSlotsPropertyName)(options.vueCompilerOptions.target)}: typeof ${options.scriptSetupRanges?.slots?.name ?? '__VLS_slots'} })>${common_1.endOfLine}`;
    yield `let __VLS_localComponents!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>${common_1.endOfLine}`;
    yield `let __VLS_components!: typeof __VLS_localComponents & __VLS_GlobalComponents & typeof __VLS_ctx${common_1.endOfLine}`; // for html completion, TS references...
    /* Style Scoped */
    yield `/* Style Scoped */${common_1.newLine}`;
    yield `type __VLS_StyleScopedClasses = {}`;
    for (let i = 0; i < options.sfc.styles.length; i++) {
        const style = options.sfc.styles[i];
        const option = options.vueCompilerOptions.experimentalResolveStyleCssClasses;
        if (option === 'always' || (option === 'scoped' && style.scoped)) {
            for (const className of style.classNames) {
                yield* generateCssClassProperty(i, className.text, className.offset, 'boolean', true);
            }
        }
    }
    yield common_1.endOfLine;
    yield `let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[]${common_1.endOfLine}`;
    yield* generateCssVars(options, templateCodegenCtx);
    if (options.templateCodegen) {
        for (const code of options.templateCodegen.codes) {
            yield code;
        }
    }
    else {
        yield `// no template${common_1.newLine}`;
        if (!options.scriptSetupRanges?.slots.define) {
            yield `const __VLS_slots = {}${common_1.endOfLine}`;
        }
    }
    yield `return ${options.scriptSetupRanges?.slots.name ?? '__VLS_slots'}${common_1.endOfLine}`;
}
function* generateCssClassProperty(styleIndex, classNameWithDot, offset, propertyType, optional) {
    yield `${common_1.newLine} & { `;
    yield [
        '',
        'style_' + styleIndex,
        offset,
        index_1.codeFeatures.navigationWithoutRename,
    ];
    yield `'`;
    yield [
        classNameWithDot.substring(1),
        'style_' + styleIndex,
        offset + 1,
        index_1.codeFeatures.navigation,
    ];
    yield `'`;
    yield [
        '',
        'style_' + styleIndex,
        offset + classNameWithDot.length,
        index_1.codeFeatures.navigationWithoutRename,
    ];
    yield `${optional ? '?' : ''}: ${propertyType}`;
    yield ` }`;
}
function* generateCssVars(options, ctx) {
    if (!options.sfc.styles.length) {
        return;
    }
    yield `// CSS variable injection ${common_1.newLine}`;
    for (const style of options.sfc.styles) {
        for (const cssBind of style.cssVars) {
            for (const [segment, offset, onlyError] of (0, interpolation_1.forEachInterpolationSegment)(options.ts, ctx, cssBind.text, cssBind.offset, options.ts.createSourceFile('/a.txt', cssBind.text, 99))) {
                if (offset === undefined) {
                    yield segment;
                }
                else {
                    yield [
                        segment,
                        style.name,
                        cssBind.offset + offset,
                        onlyError
                            ? index_1.codeFeatures.navigation
                            : index_1.codeFeatures.all,
                    ];
                }
            }
            yield common_1.endOfLine;
        }
    }
    yield `// CSS variable injection end ${common_1.newLine}`;
}
function getTemplateUsageVars(options, ctx) {
    const usageVars = new Set();
    const components = new Set(options.sfc.template?.ast?.components);
    if (options.templateCodegen) {
        // fix import components unused report
        for (const varName of ctx.bindingNames) {
            if (components.has(varName) || components.has((0, shared_1.hyphenateTag)(varName))) {
                usageVars.add(varName);
            }
        }
        for (const component of components) {
            if (component.indexOf('.') >= 0) {
                usageVars.add(component.split('.')[0]);
            }
        }
        for (const [varName] of options.templateCodegen.accessExternalVariables) {
            usageVars.add(varName);
        }
    }
    return usageVars;
}
//# sourceMappingURL=template.js.map