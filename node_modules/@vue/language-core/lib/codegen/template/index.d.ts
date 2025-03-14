import * as CompilerDOM from '@vue/compiler-dom';
import type * as ts from 'typescript';
import type { Code, Sfc, VueCompilerOptions } from '../../types';
import { TemplateCodegenContext } from './context';
export interface TemplateCodegenOptions {
    ts: typeof ts;
    compilerOptions: ts.CompilerOptions;
    vueCompilerOptions: VueCompilerOptions;
    template: NonNullable<Sfc['template']>;
    scriptSetupBindingNames: Set<string>;
    scriptSetupImportComponentNames: Set<string>;
    hasDefineSlots?: boolean;
    slotsAssignName?: string;
    propsAssignName?: string;
}
export declare function generateTemplate(options: TemplateCodegenOptions): Generator<Code, TemplateCodegenContext>;
export declare function forEachElementNode(node: CompilerDOM.RootNode | CompilerDOM.TemplateChildNode): Generator<CompilerDOM.ElementNode>;
