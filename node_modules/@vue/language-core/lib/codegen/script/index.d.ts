import type { Mapping } from '@volar/language-core';
import type * as ts from 'typescript';
import type { ScriptRanges } from '../../parsers/scriptRanges';
import type { ScriptSetupRanges } from '../../parsers/scriptSetupRanges';
import type { Code, Sfc, VueCodeInformation, VueCompilerOptions } from '../../types';
import type { TemplateCodegenContext } from '../template/context';
export declare const codeFeatures: {
    all: VueCodeInformation;
    none: VueCodeInformation;
    verification: VueCodeInformation;
    navigation: VueCodeInformation;
    navigationWithoutRename: VueCodeInformation;
};
export interface ScriptCodegenOptions {
    fileBaseName: string;
    ts: typeof ts;
    compilerOptions: ts.CompilerOptions;
    vueCompilerOptions: VueCompilerOptions;
    sfc: Sfc;
    lang: string;
    scriptRanges: ScriptRanges | undefined;
    scriptSetupRanges: ScriptSetupRanges | undefined;
    templateCodegen: TemplateCodegenContext & {
        codes: Code[];
    } | undefined;
    globalTypes: boolean;
    getGeneratedLength: () => number;
    linkedCodeMappings: Mapping[];
}
export declare function generateScript(options: ScriptCodegenOptions): Generator<Code>;
