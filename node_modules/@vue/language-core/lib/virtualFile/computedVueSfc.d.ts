import type { SFCParseResult } from '@vue/compiler-sfc';
import type * as ts from 'typescript';
import type { VueLanguagePluginReturn } from '../types';
export declare function computedVueSfc(plugins: VueLanguagePluginReturn[], fileName: string, languageId: string, snapshot: () => ts.IScriptSnapshot): () => SFCParseResult | undefined;
