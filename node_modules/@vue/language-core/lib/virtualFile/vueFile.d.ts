import type { VirtualCode } from '@volar/language-core';
import { Signal } from 'computeds';
import type * as ts from 'typescript';
import type { VueCompilerOptions, VueLanguagePluginReturn } from '../types';
export declare class VueVirtualCode implements VirtualCode {
    fileName: string;
    languageId: string;
    initSnapshot: ts.IScriptSnapshot;
    vueCompilerOptions: VueCompilerOptions;
    plugins: VueLanguagePluginReturn[];
    ts: typeof import('typescript');
    id: string;
    _snapshot: Signal<ts.IScriptSnapshot>;
    getVueSfc: () => import("@vue/compiler-sfc").SFCParseResult | undefined;
    sfc: import("../types").Sfc;
    getMappings: () => import("@volar/language-core").CodeMapping[];
    getEmbeddedCodes: () => VirtualCode[];
    get embeddedCodes(): VirtualCode[];
    get snapshot(): ts.IScriptSnapshot;
    get mappings(): import("@volar/language-core").CodeMapping[];
    constructor(fileName: string, languageId: string, initSnapshot: ts.IScriptSnapshot, vueCompilerOptions: VueCompilerOptions, plugins: VueLanguagePluginReturn[], ts: typeof import('typescript'));
    update(newSnapshot: ts.IScriptSnapshot): void;
}
