import { TransformableSVG } from './TransformableSVG.js';
import type { SVGCommand } from './types.js';
export declare class SVGPathData extends TransformableSVG {
    commands: SVGCommand[];
    constructor(content: string | SVGCommand[]);
    encode(): string;
    getBounds(): import("./types.js").TransformFunction & {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    };
    transform(transformFunction: (input: SVGCommand) => SVGCommand | SVGCommand[]): this;
    static encode(commands: SVGCommand[]): string;
    static parse(path: string): SVGCommand[];
    static readonly CLOSE_PATH: 1;
    static readonly MOVE_TO: 2;
    static readonly HORIZ_LINE_TO: 4;
    static readonly VERT_LINE_TO: 8;
    static readonly LINE_TO: 16;
    static readonly CURVE_TO: 32;
    static readonly SMOOTH_CURVE_TO: 64;
    static readonly QUAD_TO: 128;
    static readonly SMOOTH_QUAD_TO: 256;
    static readonly ARC: 512;
    static readonly LINE_COMMANDS: number;
    static readonly DRAWING_COMMANDS: number;
}
export declare const COMMAND_ARG_COUNTS: {
    2: number;
    16: number;
    4: number;
    8: number;
    1: number;
    128: number;
    256: number;
    32: number;
    64: number;
    512: number;
};
