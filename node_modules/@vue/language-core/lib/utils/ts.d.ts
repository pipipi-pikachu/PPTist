import type * as ts from 'typescript';
import type { VueCompilerOptions } from '../types';
export type ParsedCommandLine = ts.ParsedCommandLine & {
    vueOptions: VueCompilerOptions;
};
export declare function createParsedCommandLineByJson(ts: typeof import('typescript'), parseConfigHost: ts.ParseConfigHost, rootDir: string, json: any, configFileName?: string): ParsedCommandLine;
export declare function createParsedCommandLine(ts: typeof import('typescript'), parseConfigHost: ts.ParseConfigHost, tsConfigPath: string): ParsedCommandLine;
export declare function resolveVueCompilerOptions(vueOptions: Partial<VueCompilerOptions>): VueCompilerOptions;
