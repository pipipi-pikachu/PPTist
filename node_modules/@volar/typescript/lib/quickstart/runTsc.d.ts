import type * as ts from 'typescript';
import type { Language, LanguagePlugin } from '@volar/language-core';
export declare let getLanguagePlugins: (ts: typeof import('typescript'), options: ts.CreateProgramOptions) => LanguagePlugin<string>[] | {
    languagePlugins: LanguagePlugin<string>[];
    setup?(language: Language<string>): void;
};
export declare function runTsc(tscPath: string, options: string[] | {
    extraSupportedExtensions: string[];
    extraExtensionsToRemove: string[];
}, _getLanguagePlugins: typeof getLanguagePlugins): void;
