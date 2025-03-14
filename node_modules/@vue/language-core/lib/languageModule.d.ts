import { type LanguagePlugin } from '@volar/language-core';
import type * as ts from 'typescript';
import type { VueCompilerOptions } from './types';
import { VueVirtualCode } from './virtualFile/vueFile';
export declare function createVueLanguagePlugin<T>(ts: typeof import('typescript'), asFileName: (scriptId: T) => string, getProjectVersion: () => string, isRootFile: (fileName: string) => boolean, compilerOptions: ts.CompilerOptions, vueCompilerOptions: VueCompilerOptions): LanguagePlugin<T, VueVirtualCode>;
