import { type LanguagePlugin } from '@volar/language-core';
import type * as ts from 'typescript';
import type { VueCompilerOptions } from './types';
import { VueVirtualCode } from './virtualFile/vueFile';
export declare function createRootFileChecker(getProjectVersion: (() => string) | undefined, getRootFileNames: () => string[], caseSensitive: boolean): (fileName: string) => boolean;
export declare function createVueLanguagePlugin<T>(ts: typeof import('typescript'), asFileName: (scriptId: T) => string, _getProjectVersion: (() => string) | undefined, isRootFile: (fileName: string) => boolean, compilerOptions: ts.CompilerOptions, vueCompilerOptions: VueCompilerOptions): LanguagePlugin<T, VueVirtualCode>;
export declare function createVueLanguagePlugin2<T>(ts: typeof import('typescript'), asFileName: (scriptId: T) => string, isRootFile: (fileName: string) => boolean, compilerOptions: ts.CompilerOptions, vueCompilerOptions: VueCompilerOptions): LanguagePlugin<T, VueVirtualCode>;
export declare function getAllExtensions(options: VueCompilerOptions): string[];
