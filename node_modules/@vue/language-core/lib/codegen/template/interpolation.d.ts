import type * as ts from 'typescript';
import type { Code, VueCodeInformation } from '../../types';
import type { TemplateCodegenContext } from './context';
import type { TemplateCodegenOptions } from './index';
export declare function generateInterpolation(options: TemplateCodegenOptions, ctx: TemplateCodegenContext, _code: string, astHolder: any, start: number | undefined, data: VueCodeInformation | (() => VueCodeInformation) | undefined, prefix: string, suffix: string): Generator<Code>;
export declare function forEachInterpolationSegment(ts: typeof import('typescript'), ctx: TemplateCodegenContext, code: string, offset: number | undefined, ast: ts.SourceFile): Generator<[fragment: string, offset: number | undefined, isJustForErrorMapping?: boolean]>;
