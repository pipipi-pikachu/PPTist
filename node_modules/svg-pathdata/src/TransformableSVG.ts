import { SVGPathDataTransformer } from './SVGPathDataTransformer.js';
import type { TransformFunction } from './types.js';

export abstract class TransformableSVG {
  round(x?: number) {
    return this.transform(SVGPathDataTransformer.ROUND(x));
  }

  toAbs() {
    return this.transform(SVGPathDataTransformer.TO_ABS());
  }

  toRel() {
    return this.transform(SVGPathDataTransformer.TO_REL());
  }

  normalizeHVZ(a?: boolean, b?: boolean, c?: boolean) {
    return this.transform(SVGPathDataTransformer.NORMALIZE_HVZ(a, b, c));
  }

  normalizeST() {
    return this.transform(SVGPathDataTransformer.NORMALIZE_ST());
  }

  qtToC() {
    return this.transform(SVGPathDataTransformer.QT_TO_C());
  }

  aToC() {
    return this.transform(SVGPathDataTransformer.A_TO_C());
  }

  sanitize(eps?: number) {
    return this.transform(SVGPathDataTransformer.SANITIZE(eps));
  }

  translate(x: number, y?: number) {
    return this.transform(SVGPathDataTransformer.TRANSLATE(x, y));
  }

  scale(x: number, y?: number) {
    return this.transform(SVGPathDataTransformer.SCALE(x, y));
  }

  rotate(a: number, x?: number, y?: number) {
    return this.transform(SVGPathDataTransformer.ROTATE(a, x, y));
  }

  matrix(a: number, b: number, c: number, d: number, e: number, f: number) {
    return this.transform(SVGPathDataTransformer.MATRIX(a, b, c, d, e, f));
  }

  skewX(a: number) {
    return this.transform(SVGPathDataTransformer.SKEW_X(a));
  }

  skewY(a: number) {
    return this.transform(SVGPathDataTransformer.SKEW_Y(a));
  }

  xSymmetry(xOffset?: number) {
    return this.transform(SVGPathDataTransformer.X_AXIS_SYMMETRY(xOffset));
  }

  ySymmetry(yOffset?: number) {
    return this.transform(SVGPathDataTransformer.Y_AXIS_SYMMETRY(yOffset));
  }

  annotateArcs() {
    return this.transform(SVGPathDataTransformer.ANNOTATE_ARCS());
  }

  abstract transform(transformFunction: TransformFunction): this;
}
