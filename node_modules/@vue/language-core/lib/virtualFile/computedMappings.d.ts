import type { CodeMapping } from '@volar/language-core';
import type * as ts from 'typescript';
import type { Sfc } from '../types';
export declare function computedMappings(snapshot: () => ts.IScriptSnapshot, sfc: Sfc): () => CodeMapping[];
