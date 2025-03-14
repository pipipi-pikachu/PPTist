import type { Code } from '../../types';
import type { ScriptCodegenContext } from './context';
import { type ScriptCodegenOptions } from './index';
export declare function generateTemplate(options: ScriptCodegenOptions, ctx: ScriptCodegenContext, isClassComponent: boolean): Generator<Code>;
export declare function getTemplateUsageVars(options: ScriptCodegenOptions, ctx: ScriptCodegenContext): Set<string>;
