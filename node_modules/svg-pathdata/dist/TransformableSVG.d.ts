import type { TransformFunction } from './types.js';
export declare abstract class TransformableSVG {
    round(x?: number): this;
    toAbs(): this;
    toRel(): this;
    normalizeHVZ(a?: boolean, b?: boolean, c?: boolean): this;
    normalizeST(): this;
    qtToC(): this;
    aToC(): this;
    sanitize(eps?: number): this;
    translate(x: number, y?: number): this;
    scale(x: number, y?: number): this;
    rotate(a: number, x?: number, y?: number): this;
    matrix(a: number, b: number, c: number, d: number, e: number, f: number): this;
    skewX(a: number): this;
    skewY(a: number): this;
    xSymmetry(xOffset?: number): this;
    ySymmetry(yOffset?: number): this;
    annotateArcs(): this;
    abstract transform(transformFunction: TransformFunction): this;
}
