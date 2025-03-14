"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponent = generateComponent;
exports.generateComponentSetupReturns = generateComponentSetupReturns;
exports.generateScriptOptions = generateScriptOptions;
exports.generateScriptSetupOptions = generateScriptSetupOptions;
exports.generatePropsOption = generatePropsOption;
exports.generateEmitsOption = generateEmitsOption;
const common_1 = require("../common");
const index_1 = require("./index");
function* generateComponent(options, ctx, scriptSetup, scriptSetupRanges) {
    if (options.sfc.script && options.scriptRanges?.exportDefault && options.scriptRanges.exportDefault.expression.start !== options.scriptRanges.exportDefault.args.start) {
        // use defineComponent() from user space code if it exist
        yield (0, common_1.generateSfcBlockSection)(options.sfc.script, options.scriptRanges.exportDefault.expression.start, options.scriptRanges.exportDefault.args.start, index_1.codeFeatures.all);
        yield `{${common_1.newLine}`;
    }
    else {
        yield `(await import('${options.vueCompilerOptions.lib}')).defineComponent({${common_1.newLine}`;
    }
    yield `setup() {${common_1.newLine}`;
    yield `return {${common_1.newLine}`;
    if (ctx.bypassDefineComponent) {
        yield* generateComponentSetupReturns(scriptSetupRanges);
    }
    if (scriptSetupRanges.expose.define) {
        yield `...__VLS_exposed,${common_1.newLine}`;
    }
    yield `}${common_1.endOfLine}`;
    yield `},${common_1.newLine}`;
    if (!ctx.bypassDefineComponent) {
        yield* generateScriptSetupOptions(options, ctx, scriptSetup, scriptSetupRanges);
    }
    if (options.sfc.script && options.scriptRanges) {
        yield* generateScriptOptions(options.sfc.script, options.scriptRanges);
    }
    yield `})`;
}
function* generateComponentSetupReturns(scriptSetupRanges) {
    // fill $props
    if (scriptSetupRanges.props.define) {
        // NOTE: defineProps is inaccurate for $props
        yield `$props: __VLS_makeOptional(${scriptSetupRanges.props.name ?? `__VLS_props`}),${common_1.newLine}`;
        yield `...${scriptSetupRanges.props.name ?? `__VLS_props`},${common_1.newLine}`;
    }
    // fill $emit
    if (scriptSetupRanges.emits.define) {
        yield `$emit: ${scriptSetupRanges.emits.name ?? '__VLS_emit'},${common_1.newLine}`;
    }
}
function* generateScriptOptions(script, scriptRanges) {
    if (scriptRanges.exportDefault?.args) {
        yield (0, common_1.generateSfcBlockSection)(script, scriptRanges.exportDefault.args.start + 1, scriptRanges.exportDefault.args.end - 1, index_1.codeFeatures.all);
    }
}
function* generateScriptSetupOptions(options, ctx, scriptSetup, scriptSetupRanges) {
    yield* generatePropsOption(options, ctx, scriptSetup, scriptSetupRanges);
    yield* generateEmitsOption(options, scriptSetup, scriptSetupRanges);
}
function* generatePropsOption(options, ctx, scriptSetup, scriptSetupRanges) {
    if (options.vueCompilerOptions.target >= 3.5 && ctx.generatedPropsType) {
        yield `__typeProps: {} as __VLS_PublicProps,${common_1.newLine}`;
    }
    if (options.vueCompilerOptions.target < 3.5 || !ctx.generatedPropsType || scriptSetupRanges.props.withDefaults) {
        const codegens = [];
        if (ctx.generatedPropsType) {
            codegens.push(function* () {
                yield `{} as `;
                if (scriptSetupRanges.props.withDefaults?.arg) {
                    yield `${ctx.helperTypes.WithDefaults.name}<`;
                }
                yield `${ctx.helperTypes.TypePropsToOption.name}<`;
                yield `__VLS_PublicProps>`;
                if (scriptSetupRanges.props.withDefaults?.arg) {
                    yield `, typeof __VLS_withDefaultsArg>`;
                }
            });
        }
        if (scriptSetupRanges.props.define?.arg) {
            const { arg } = scriptSetupRanges.props.define;
            codegens.push(function* () {
                yield (0, common_1.generateSfcBlockSection)(scriptSetup, arg.start, arg.end, index_1.codeFeatures.navigation);
            });
        }
        if (codegens.length === 1) {
            yield `props: `;
            for (const generate of codegens) {
                yield* generate();
            }
            yield `,${common_1.newLine}`;
        }
        else if (codegens.length >= 2) {
            yield `props: {${common_1.newLine}`;
            for (const generate of codegens) {
                yield `...`;
                yield* generate();
                yield `,${common_1.newLine}`;
            }
            yield `},${common_1.newLine}`;
        }
    }
}
function* generateEmitsOption(options, scriptSetup, scriptSetupRanges) {
    if (!scriptSetupRanges.emits.define && !scriptSetupRanges.defineProp.some(p => p.isModel)) {
        return;
    }
    if (options.vueCompilerOptions.target < 3.5 || scriptSetupRanges.emits.define?.arg || scriptSetupRanges.emits.define?.hasUnionTypeArg) {
        yield `emits: ({} as __VLS_NormalizeEmits<__VLS_ModelEmitsType`;
        if (scriptSetupRanges?.emits.define) {
            yield ` & typeof `;
            yield scriptSetupRanges.emits.name ?? '__VLS_emit';
        }
        yield `>),${common_1.newLine}`;
    }
    else {
        yield `__typeEmits: {} as __VLS_ModelEmitsType`;
        const typeArg = scriptSetupRanges.emits.define?.typeArg;
        if (typeArg) {
            yield ` & `;
            yield scriptSetup.content.slice(typeArg.start, typeArg.end);
        }
        yield `,${common_1.newLine}`;
    }
}
//# sourceMappingURL=component.js.map