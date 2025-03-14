import { SVGPathDataTransformer } from './SVGPathDataTransformer.js';
export class TransformableSVG {
    round(x) {
        return this.transform(SVGPathDataTransformer.ROUND(x));
    }
    toAbs() {
        return this.transform(SVGPathDataTransformer.TO_ABS());
    }
    toRel() {
        return this.transform(SVGPathDataTransformer.TO_REL());
    }
    normalizeHVZ(a, b, c) {
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
    sanitize(eps) {
        return this.transform(SVGPathDataTransformer.SANITIZE(eps));
    }
    translate(x, y) {
        return this.transform(SVGPathDataTransformer.TRANSLATE(x, y));
    }
    scale(x, y) {
        return this.transform(SVGPathDataTransformer.SCALE(x, y));
    }
    rotate(a, x, y) {
        return this.transform(SVGPathDataTransformer.ROTATE(a, x, y));
    }
    matrix(a, b, c, d, e, f) {
        return this.transform(SVGPathDataTransformer.MATRIX(a, b, c, d, e, f));
    }
    skewX(a) {
        return this.transform(SVGPathDataTransformer.SKEW_X(a));
    }
    skewY(a) {
        return this.transform(SVGPathDataTransformer.SKEW_Y(a));
    }
    xSymmetry(xOffset) {
        return this.transform(SVGPathDataTransformer.X_AXIS_SYMMETRY(xOffset));
    }
    ySymmetry(yOffset) {
        return this.transform(SVGPathDataTransformer.Y_AXIS_SYMMETRY(yOffset));
    }
    annotateArcs() {
        return this.transform(SVGPathDataTransformer.ANNOTATE_ARCS());
    }
}
//# sourceMappingURL=TransformableSVG.js.map