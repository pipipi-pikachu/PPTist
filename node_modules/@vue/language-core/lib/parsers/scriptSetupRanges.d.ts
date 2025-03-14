import type * as ts from 'typescript';
import type { VueCompilerOptions, TextRange } from '../types';
export interface ScriptSetupRanges extends ReturnType<typeof parseScriptSetupRanges> {
}
export declare function parseScriptSetupRanges(ts: typeof import('typescript'), ast: ts.SourceFile, vueCompilerOptions: VueCompilerOptions): {
    leadingCommentEndOffset: number;
    importSectionEndOffset: number;
    bindings: TextRange[];
    importComponentNames: Set<string>;
    props: {
        name?: string;
        define?: ReturnType<(node: ts.CallExpression) => TextRange & {
            arg?: TextRange;
            typeArg?: TextRange;
        }> & {
            statement: TextRange;
        };
        withDefaults?: TextRange & {
            arg?: TextRange;
        };
    };
    slots: {
        name?: string;
        isObjectBindingPattern?: boolean;
        define?: ReturnType<(node: ts.CallExpression) => TextRange & {
            arg?: TextRange;
            typeArg?: TextRange;
        }>;
    };
    emits: {
        name?: string;
        define?: ReturnType<(node: ts.CallExpression) => TextRange & {
            arg?: TextRange;
            typeArg?: TextRange;
        }> & {
            hasUnionTypeArg?: boolean;
        };
    };
    expose: {
        name?: string;
        define?: ReturnType<(node: ts.CallExpression) => TextRange & {
            arg?: TextRange;
            typeArg?: TextRange;
        }>;
    };
    defineProp: {
        name: TextRange | undefined;
        nameIsString: boolean;
        type: TextRange | undefined;
        modifierType?: TextRange | undefined;
        defaultValue: TextRange | undefined;
        required: boolean;
        isModel?: boolean;
    }[];
    options: {
        name?: string;
    };
};
export declare function parseBindingRanges(ts: typeof import('typescript'), sourceFile: ts.SourceFile): TextRange[];
export declare function findBindingVars(ts: typeof import('typescript'), left: ts.BindingName, sourceFile: ts.SourceFile): TextRange[];
export declare function getStartEnd(ts: typeof import('typescript'), node: ts.Node, sourceFile: ts.SourceFile): {
    start: number;
    end: number;
};
export declare function getNodeText(ts: typeof import('typescript'), node: ts.Node, sourceFile: ts.SourceFile): string;
