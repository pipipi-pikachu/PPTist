import type * as CompilerDOM from '@vue/compiler-dom';
import type { Code, VueCodeInformation } from '../../types';
import type { TemplateCodegenOptions } from './index';
export type TemplateCodegenContext = ReturnType<typeof createTemplateCodegenContext>;
export declare function createTemplateCodegenContext(scriptSetupBindingNames: TemplateCodegenOptions['scriptSetupBindingNames']): {
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
        all: VueCodeInformation;
        verification: VueCodeInformation;
        completion: VueCodeInformation;
        additionalCompletion: VueCodeInformation;
        navigation: VueCodeInformation;
        navigationWithoutRename: VueCodeInformation;
        navigationAndCompletion: VueCodeInformation;
        navigationAndAdditionalCompletion: VueCodeInformation;
        withoutHighlight: VueCodeInformation;
        withoutHighlightAndCompletion: VueCodeInformation;
        withoutHighlightAndCompletionAndNavigation: VueCodeInformation;
    };
    accessExternalVariables: Map<string, Set<number>>;
    hasSlotElements: Set<CompilerDOM.ElementNode>;
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
    expectError: (prevNode: CompilerDOM.CommentNode) => Generator<Code>;
    resetDirectiveComments: (endStr: string) => Generator<Code>;
    generateAutoImportCompletion: () => Generator<Code>;
};
