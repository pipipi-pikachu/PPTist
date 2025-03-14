"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeFeatures = void 0;
exports.generateScript = generateScript;
const common_1 = require("../common");
const context_1 = require("./context");
const globalTypes_1 = require("./globalTypes");
const scriptSetup_1 = require("./scriptSetup");
const src_1 = require("./src");
const template_1 = require("./template");
exports.codeFeatures = {
    all: {
        verification: true,
        completion: true,
        semantic: true,
        navigation: true,
    },
    none: {},
    verification: {
        verification: true,
    },
    navigation: {
        navigation: true,
    },
    navigationWithoutRename: {
        navigation: {
            shouldRename() {
                return false;
            },
        },
    },
};
function* generateScript(options) {
    const ctx = (0, context_1.createScriptCodegenContext)(options);
    yield `/* __placeholder__ */${common_1.newLine}`;
    if (options.sfc.script?.src) {
        yield* (0, src_1.generateSrc)(options.sfc.script, options.sfc.script.src);
    }
    if (options.sfc.script && options.scriptRanges) {
        const { exportDefault, classBlockEnd } = options.scriptRanges;
        const isExportRawObject = exportDefault
            && options.sfc.script.content[exportDefault.expression.start] === '{';
        if (options.sfc.scriptSetup && options.scriptSetupRanges) {
            yield* (0, scriptSetup_1.generateScriptSetupImports)(options.sfc.scriptSetup, options.scriptSetupRanges);
            yield* generateDefineProp(options, options.sfc.scriptSetup);
            if (exportDefault) {
                yield (0, common_1.generateSfcBlockSection)(options.sfc.script, 0, exportDefault.expression.start, exports.codeFeatures.all);
                yield* (0, scriptSetup_1.generateScriptSetup)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
                yield (0, common_1.generateSfcBlockSection)(options.sfc.script, exportDefault.expression.end, options.sfc.script.content.length, exports.codeFeatures.all);
            }
            else {
                yield (0, common_1.generateSfcBlockSection)(options.sfc.script, 0, options.sfc.script.content.length, exports.codeFeatures.all);
                yield* (0, scriptSetup_1.generateScriptSetup)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
            }
        }
        else if (exportDefault && isExportRawObject && options.vueCompilerOptions.optionsWrapper.length) {
            yield (0, common_1.generateSfcBlockSection)(options.sfc.script, 0, exportDefault.expression.start, exports.codeFeatures.all);
            yield options.vueCompilerOptions.optionsWrapper[0];
            yield [
                '',
                'script',
                exportDefault.expression.start,
                {
                    __hint: {
                        setting: 'vue.inlayHints.optionsWrapper',
                        label: options.vueCompilerOptions.optionsWrapper.length
                            ? options.vueCompilerOptions.optionsWrapper[0]
                            : '[Missing optionsWrapper]',
                        tooltip: [
                            'This is virtual code that is automatically wrapped for type support, it does not affect your runtime behavior, you can customize it via `vueCompilerOptions.optionsWrapper` option in tsconfig / jsconfig.',
                            'To hide it, you can set `"vue.inlayHints.optionsWrapper": false` in IDE settings.',
                        ].join('\n\n'),
                    }
                },
            ];
            yield (0, common_1.generateSfcBlockSection)(options.sfc.script, exportDefault.expression.start, exportDefault.expression.end, exports.codeFeatures.all);
            yield [
                '',
                'script',
                exportDefault.expression.end,
                {
                    __hint: {
                        setting: 'vue.inlayHints.optionsWrapper',
                        label: options.vueCompilerOptions.optionsWrapper.length === 2
                            ? options.vueCompilerOptions.optionsWrapper[1]
                            : '[Missing optionsWrapper]',
                        tooltip: '',
                    }
                },
            ];
            yield options.vueCompilerOptions.optionsWrapper[1];
            yield (0, common_1.generateSfcBlockSection)(options.sfc.script, exportDefault.expression.end, options.sfc.script.content.length, exports.codeFeatures.all);
        }
        else if (classBlockEnd !== undefined) {
            yield (0, common_1.generateSfcBlockSection)(options.sfc.script, 0, classBlockEnd, exports.codeFeatures.all);
            yield* (0, template_1.generateTemplate)(options, ctx, true);
            yield (0, common_1.generateSfcBlockSection)(options.sfc.script, classBlockEnd, options.sfc.script.content.length, exports.codeFeatures.all);
        }
        else {
            yield (0, common_1.generateSfcBlockSection)(options.sfc.script, 0, options.sfc.script.content.length, exports.codeFeatures.all);
        }
    }
    else if (options.sfc.scriptSetup && options.scriptSetupRanges) {
        yield* (0, scriptSetup_1.generateScriptSetupImports)(options.sfc.scriptSetup, options.scriptSetupRanges);
        yield* generateDefineProp(options, options.sfc.scriptSetup);
        yield* (0, scriptSetup_1.generateScriptSetup)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
    }
    yield `;`;
    if (options.sfc.scriptSetup) {
        // #4569
        yield [
            '',
            'scriptSetup',
            options.sfc.scriptSetup.content.length,
            exports.codeFeatures.verification,
        ];
    }
    yield common_1.newLine;
    if (options.globalTypes) {
        yield (0, globalTypes_1.generateGlobalTypes)(options.vueCompilerOptions);
    }
    yield* ctx.generateHelperTypes();
    yield `\ntype __VLS_IntrinsicElementsCompletion = __VLS_IntrinsicElements${common_1.endOfLine}`;
    if (!ctx.generatedTemplate) {
        yield* (0, template_1.generateTemplate)(options, ctx, false);
    }
    if (options.sfc.scriptSetup) {
        yield [
            '',
            'scriptSetup',
            options.sfc.scriptSetup.content.length,
            exports.codeFeatures.verification,
        ];
    }
}
function* generateDefineProp(options, scriptSetup) {
    const definePropProposalA = scriptSetup.content.trimStart().startsWith('// @experimentalDefinePropProposal=kevinEdition') || options.vueCompilerOptions.experimentalDefinePropProposal === 'kevinEdition';
    const definePropProposalB = scriptSetup.content.trimStart().startsWith('// @experimentalDefinePropProposal=johnsonEdition') || options.vueCompilerOptions.experimentalDefinePropProposal === 'johnsonEdition';
    if (definePropProposalA || definePropProposalB) {
        yield `type __VLS_PropOptions<T> = Exclude<import('${options.vueCompilerOptions.lib}').Prop<T>, import('${options.vueCompilerOptions.lib}').PropType<T>>${common_1.endOfLine}`;
        if (definePropProposalA) {
            yield `declare function defineProp<T>(name: string, options: ({ required: true } | { default: T }) & __VLS_PropOptions<T>): import('${options.vueCompilerOptions.lib}').ComputedRef<T>${common_1.endOfLine}`;
            yield `declare function defineProp<T>(name?: string, options?: __VLS_PropOptions<T>): import('${options.vueCompilerOptions.lib}').ComputedRef<T | undefined>${common_1.endOfLine}`;
        }
        if (definePropProposalB) {
            yield `declare function defineProp<T>(value: T | (() => T), required?: boolean, options?: __VLS_PropOptions<T>): import('${options.vueCompilerOptions.lib}').ComputedRef<T>${common_1.endOfLine}`;
            yield `declare function defineProp<T>(value: T | (() => T) | undefined, required: true, options?: __VLS_PropOptions<T>): import('${options.vueCompilerOptions.lib}').ComputedRef<T>${common_1.endOfLine}`;
            yield `declare function defineProp<T>(value?: T | (() => T), required?: boolean, options?: __VLS_PropOptions<T>): import('${options.vueCompilerOptions.lib}').ComputedRef<T | undefined>${common_1.endOfLine}`;
        }
    }
}
//# sourceMappingURL=index.js.map