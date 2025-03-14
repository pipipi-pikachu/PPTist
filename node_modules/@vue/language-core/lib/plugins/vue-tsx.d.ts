import type { Mapping } from '@volar/language-core';
import type { Code, Sfc, VueLanguagePlugin } from '../types';
export declare const tsCodegen: WeakMap<Sfc, {
    scriptRanges: () => {
        exportDefault: (import("../types").TextRange & {
            expression: import("../types").TextRange;
            args: import("../types").TextRange;
            argsNode: import("typescript").ObjectLiteralExpression | undefined;
            componentsOption: import("../types").TextRange | undefined;
            componentsOptionNode: import("typescript").ObjectLiteralExpression | undefined;
            nameOption: import("../types").TextRange | undefined;
        }) | undefined;
        classBlockEnd: number | undefined;
        bindings: import("../types").TextRange[];
    } | undefined;
    scriptSetupRanges: () => {
        leadingCommentEndOffset: number;
        importSectionEndOffset: number;
        bindings: import("../types").TextRange[];
        importComponentNames: Set<string>;
        props: {
            name?: string;
            define?: ReturnType<(node: import("typescript").CallExpression) => import("../types").TextRange & {
                arg?: import("../types").TextRange;
                typeArg?: import("../types").TextRange;
            }> & {
                statement: import("../types").TextRange;
            };
            withDefaults?: import("../types").TextRange & {
                arg?: import("../types").TextRange;
            };
        };
        slots: {
            name?: string;
            isObjectBindingPattern?: boolean;
            define?: ReturnType<(node: import("typescript").CallExpression) => import("../types").TextRange & {
                arg?: import("../types").TextRange;
                typeArg?: import("../types").TextRange;
            }>;
        };
        emits: {
            name?: string;
            define?: ReturnType<(node: import("typescript").CallExpression) => import("../types").TextRange & {
                arg?: import("../types").TextRange;
                typeArg?: import("../types").TextRange;
            }> & {
                hasUnionTypeArg?: boolean;
            };
        };
        expose: {
            name?: string;
            define?: ReturnType<(node: import("typescript").CallExpression) => import("../types").TextRange & {
                arg?: import("../types").TextRange;
                typeArg?: import("../types").TextRange;
            }>;
        };
        defineProp: {
            name: import("../types").TextRange | undefined;
            nameIsString: boolean;
            type: import("../types").TextRange | undefined;
            modifierType?: import("../types").TextRange | undefined;
            defaultValue: import("../types").TextRange | undefined;
            required: boolean;
            isModel?: boolean;
        }[];
        options: {
            name?: string;
        };
    } | undefined;
    lang: () => string;
    generatedScript: () => {
        codes: Code[];
        linkedCodeMappings: Mapping<unknown>[];
    };
    generatedTemplate: () => {
        codes: Code[];
        slots: {
            name: string;
            loc?: number;
            tagRange: [number, number];
            varName: string;
            nodeLoc: any;
        }[];
        dynamicSlots: {
            expVar: string;
            varName: string;
        }[];
        codeFeatures: {
            all: import("../types").VueCodeInformation;
            verification: import("../types").VueCodeInformation;
            completion: import("../types").VueCodeInformation;
            additionalCompletion: import("../types").VueCodeInformation;
            navigation: import("../types").VueCodeInformation;
            navigationWithoutRename: import("../types").VueCodeInformation;
            navigationAndCompletion: import("../types").VueCodeInformation;
            navigationAndAdditionalCompletion: import("../types").VueCodeInformation;
            withoutHighlight: import("../types").VueCodeInformation;
            withoutHighlightAndCompletion: import("../types").VueCodeInformation;
            withoutHighlightAndCompletionAndNavigation: import("../types").VueCodeInformation;
        };
        accessExternalVariables: Map<string, Set<number>>;
        hasSlotElements: Set<import("@vue/compiler-dom").ElementNode>;
        blockConditions: string[];
        usedComponentCtxVars: Set<string>;
        scopedClasses: {
            className: string;
            offset: number;
        }[];
        emptyClassOffsets: number[];
        hasSlot: boolean;
        accessExternalVariable(name: string, offset?: number): void;
        hasLocalVariable: (name: string) => boolean;
        addLocalVariable: (name: string) => void;
        removeLocalVariable: (name: string) => void;
        getInternalVariable: () => string;
        ignoreError: () => Generator<Code>;
        expectError: (prevNode: import("@vue/compiler-dom").CommentNode) => Generator<Code>;
        resetDirectiveComments: (endStr: string) => Generator<Code>;
        generateAutoImportCompletion: () => Generator<Code>;
    } | undefined;
}>;
declare const plugin: VueLanguagePlugin;
export default plugin;
