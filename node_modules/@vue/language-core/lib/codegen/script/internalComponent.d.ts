import type { Code } from '../../types';
import type { TemplateCodegenContext } from '../template/context';
import type { ScriptCodegenContext } from './context';
import type { ScriptCodegenOptions } from './index';
export declare function generateInternalComponent(options: ScriptCodegenOptions, ctx: ScriptCodegenContext, templateCodegenCtx: TemplateCodegenContext): Generator<Code>;
