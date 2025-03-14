"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScriptCodegenContext = createScriptCodegenContext;
const shared_1 = require("../../utils/shared");
const common_1 = require("../common");
function createScriptCodegenContext(options) {
    const helperTypes = {
        OmitKeepDiscriminatedUnion: {
            get name() {
                this.used = true;
                return `__VLS_OmitKeepDiscriminatedUnion`;
            },
            get code() {
                return `type __VLS_OmitKeepDiscriminatedUnion<T, K extends keyof any> = T extends any
					? Pick<T, Exclude<keyof T, K>>
					: never;`;
            },
        },
        WithDefaults: {
            get name() {
                this.used = true;
                return `__VLS_WithDefaults`;
            },
            get code() {
                return `type __VLS_WithDefaults<P, D> = {
					[K in keyof Pick<P, keyof P>]: K extends keyof D
						? ${helperTypes.Prettify.name}<P[K] & { default: D[K]}>
						: P[K]
				};`;
            },
        },
        Prettify: {
            get name() {
                this.used = true;
                return `__VLS_Prettify`;
            },
            get code() {
                return `type __VLS_Prettify<T> = { [K in keyof T]: T[K]; } & {};`;
            },
        },
        WithTemplateSlots: {
            get name() {
                this.used = true;
                return `__VLS_WithTemplateSlots`;
            },
            get code() {
                return `type __VLS_WithTemplateSlots<T, S> = T & {
					new(): {
						${(0, shared_1.getSlotsPropertyName)(options.vueCompilerOptions.target)}: S;
						${options.vueCompilerOptions.jsxSlots ? `$props: ${helperTypes.PropsChildren.name}<S>;` : ''}
					}
				};`;
            },
        },
        PropsChildren: {
            get name() {
                this.used = true;
                return `__VLS_PropsChildren`;
            },
            get code() {
                return `type __VLS_PropsChildren<S> = {
					[K in keyof (
						boolean extends (
							// @ts-ignore
							JSX.ElementChildrenAttribute extends never
								? true
								: false
						)
							? never
							// @ts-ignore
							: JSX.ElementChildrenAttribute
					)]?: S;
				};`;
            },
        },
        TypePropsToOption: {
            get name() {
                this.used = true;
                return `__VLS_TypePropsToOption`;
            },
            get code() {
                return options.compilerOptions.exactOptionalPropertyTypes ?
                    `type __VLS_TypePropsToOption<T> = {
						[K in keyof T]-?: {} extends Pick<T, K>
							? { type: import('${options.vueCompilerOptions.lib}').PropType<T[K]> }
							: { type: import('${options.vueCompilerOptions.lib}').PropType<T[K]>, required: true }
					};` :
                    `type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
					type __VLS_TypePropsToOption<T> = {
						[K in keyof T]-?: {} extends Pick<T, K>
							? { type: import('${options.vueCompilerOptions.lib}').PropType<__VLS_NonUndefinedable<T[K]>> }
							: { type: import('${options.vueCompilerOptions.lib}').PropType<T[K]>, required: true }
					};`;
            },
        },
    };
    return {
        generatedTemplate: false,
        generatedPropsType: false,
        scriptSetupGeneratedOffset: undefined,
        bypassDefineComponent: options.lang === 'js' || options.lang === 'jsx',
        bindingNames: new Set([
            ...options.scriptRanges?.bindings.map(range => options.sfc.script.content.substring(range.start, range.end)) ?? [],
            ...options.scriptSetupRanges?.bindings.map(range => options.sfc.scriptSetup.content.substring(range.start, range.end)) ?? [],
        ]),
        helperTypes,
        generateHelperTypes,
    };
    function* generateHelperTypes() {
        let shouldCheck = true;
        while (shouldCheck) {
            shouldCheck = false;
            for (const helperType of Object.values(helperTypes)) {
                if (helperType.used && !helperType.generated) {
                    shouldCheck = true;
                    helperType.generated = true;
                    yield common_1.newLine + helperType.code + common_1.newLine;
                }
            }
        }
    }
}
//# sourceMappingURL=context.js.map