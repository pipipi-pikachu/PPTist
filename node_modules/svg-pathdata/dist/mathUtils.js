import { SVGPathData } from './SVGPathData.js';
export function rotate([x, y], rad) {
    return [
        x * Math.cos(rad) - y * Math.sin(rad),
        x * Math.sin(rad) + y * Math.cos(rad),
    ];
}
const DEBUG_CHECK_NUMBERS = true;
export function assertNumbers(...numbers) {
    if (DEBUG_CHECK_NUMBERS) {
        for (let i = 0; i < numbers.length; i++) {
            if ('number' !== typeof numbers[i]) {
                throw new Error(`assertNumbers arguments[${i}] is not a number. ${typeof numbers[i]} == typeof ${numbers[i]}`);
            }
        }
    }
    return true;
}
const PI = Math.PI;
/**
 * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
 * Fixes rX and rY.
 * Ensures lArcFlag and sweepFlag are 0 or 1
 * Adds center coordinates: command.cX, command.cY (relative or absolute, depending on command.relative)
 * Adds start and end arc parameters (in degrees): command.phi1, command.phi2; phi1 < phi2 iff. c.sweepFlag == true
 */
export function annotateArcCommand(c, x1, y1) {
    c.lArcFlag = 0 === c.lArcFlag ? 0 : 1;
    c.sweepFlag = 0 === c.sweepFlag ? 0 : 1;
    // tslint:disable-next-line
    let { rX, rY } = c;
    const { x, y } = c;
    rX = Math.abs(c.rX);
    rY = Math.abs(c.rY);
    const [x1_, y1_] = rotate([(x1 - x) / 2, (y1 - y) / 2], (-c.xRot / 180) * PI);
    const testValue = Math.pow(x1_, 2) / Math.pow(rX, 2) + Math.pow(y1_, 2) / Math.pow(rY, 2);
    if (1 < testValue) {
        rX *= Math.sqrt(testValue);
        rY *= Math.sqrt(testValue);
    }
    c.rX = rX;
    c.rY = rY;
    const c_ScaleTemp = Math.pow(rX, 2) * Math.pow(y1_, 2) + Math.pow(rY, 2) * Math.pow(x1_, 2);
    const c_Scale = (c.lArcFlag !== c.sweepFlag ? 1 : -1) *
        Math.sqrt(Math.max(0, (Math.pow(rX, 2) * Math.pow(rY, 2) - c_ScaleTemp) / c_ScaleTemp));
    const cx_ = ((rX * y1_) / rY) * c_Scale;
    const cy_ = ((-rY * x1_) / rX) * c_Scale;
    const cRot = rotate([cx_, cy_], (c.xRot / 180) * PI);
    c.cX = cRot[0] + (x1 + x) / 2;
    c.cY = cRot[1] + (y1 + y) / 2;
    c.phi1 = Math.atan2((y1_ - cy_) / rY, (x1_ - cx_) / rX);
    c.phi2 = Math.atan2((-y1_ - cy_) / rY, (-x1_ - cx_) / rX);
    if (0 === c.sweepFlag && c.phi2 > c.phi1) {
        c.phi2 -= 2 * PI;
    }
    if (1 === c.sweepFlag && c.phi2 < c.phi1) {
        c.phi2 += 2 * PI;
    }
    c.phi1 *= 180 / PI;
    c.phi2 *= 180 / PI;
}
/**
 * Solves a quadratic system of equations of the form
 *      a * x + b * y = c
 *      x² + y² = 1
 * This can be understood as the intersection of the unit circle with a line.
 *      => y = (c - a x) / b
 *      => x² + (c - a x)² / b² = 1
 *      => x² b² + c² - 2 c a x + a² x² = b²
 *      => (a² + b²) x² - 2 a c x + (c² - b²) = 0
 */
export function intersectionUnitCircleLine(a, b, c) {
    assertNumbers(a, b, c);
    // cf. pqFormula
    const termSqr = a * a + b * b - c * c;
    if (0 > termSqr) {
        return [];
    }
    else if (0 === termSqr) {
        return [[(a * c) / (a * a + b * b), (b * c) / (a * a + b * b)]];
    }
    const term = Math.sqrt(termSqr);
    return [
        [
            (a * c + b * term) / (a * a + b * b),
            (b * c - a * term) / (a * a + b * b),
        ],
        [
            (a * c - b * term) / (a * a + b * b),
            (b * c + a * term) / (a * a + b * b),
        ],
    ];
}
export const DEG = Math.PI / 180;
export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}
export function arcAt(c, x1, x2, phiDeg) {
    return (c + Math.cos((phiDeg / 180) * PI) * x1 + Math.sin((phiDeg / 180) * PI) * x2);
}
export function bezierRoot(x0, x1, x2, x3) {
    const EPS = 1e-6;
    const x01 = x1 - x0;
    const x12 = x2 - x1;
    const x23 = x3 - x2;
    const a = 3 * x01 + 3 * x23 - 6 * x12;
    const b = (x12 - x01) * 6;
    const c = 3 * x01;
    // solve a * t² + b * t + c = 0
    if (Math.abs(a) < EPS) {
        // equivalent to b * t + c =>
        return [-c / b];
    }
    return pqFormula(b / a, c / a, EPS);
}
export function bezierAt(x0, x1, x2, x3, t) {
    // console.log(x0, y0, x1, y1, x2, y2, x3, y3, t)
    const s = 1 - t;
    const c0 = s * s * s;
    const c1 = 3 * s * s * t;
    const c2 = 3 * s * t * t;
    const c3 = t * t * t;
    return x0 * c0 + x1 * c1 + x2 * c2 + x3 * c3;
}
function pqFormula(p, q, PRECISION = 1e-6) {
    // 4 times the discriminant:in
    const discriminantX4 = (p * p) / 4 - q;
    if (discriminantX4 < -PRECISION) {
        return [];
    }
    else if (discriminantX4 <= PRECISION) {
        return [-p / 2];
    }
    const root = Math.sqrt(discriminantX4);
    return [-(p / 2) - root, -(p / 2) + root];
}
export function a2c(arc, x0, y0) {
    if (!arc.cX) {
        annotateArcCommand(arc, x0, y0);
    }
    const phiMin = Math.min(arc.phi1, arc.phi2), phiMax = Math.max(arc.phi1, arc.phi2), deltaPhi = phiMax - phiMin;
    const partCount = Math.ceil(deltaPhi / 90);
    const result = new Array(partCount);
    let prevX = x0, prevY = y0;
    for (let i = 0; i < partCount; i++) {
        const phiStart = lerp(arc.phi1, arc.phi2, i / partCount);
        const phiEnd = lerp(arc.phi1, arc.phi2, (i + 1) / partCount);
        const deltaPhi = phiEnd - phiStart;
        const f = (4 / 3) * Math.tan((deltaPhi * DEG) / 4);
        // x1/y1, x2/y2 and x/y coordinates on the unit circle for phiStart/phiEnd
        const [x1, y1] = [
            Math.cos(phiStart * DEG) - f * Math.sin(phiStart * DEG),
            Math.sin(phiStart * DEG) + f * Math.cos(phiStart * DEG),
        ];
        const [x, y] = [Math.cos(phiEnd * DEG), Math.sin(phiEnd * DEG)];
        const [x2, y2] = [
            x + f * Math.sin(phiEnd * DEG),
            y - f * Math.cos(phiEnd * DEG),
        ];
        const command = {
            relative: arc.relative,
            type: SVGPathData.CURVE_TO,
        };
        const transform = (x, y) => {
            const [xTemp, yTemp] = rotate([x * arc.rX, y * arc.rY], arc.xRot);
            return [arc.cX + xTemp, arc.cY + yTemp];
        };
        [command.x1, command.y1] = transform(x1, y1);
        [command.x2, command.y2] = transform(x2, y2);
        [command.x, command.y] = transform(x, y);
        if (arc.relative) {
            command.x1 -= prevX;
            command.y1 -= prevY;
            command.x2 -= prevX;
            command.y2 -= prevY;
            command.x -= prevX;
            command.y -= prevY;
        }
        [prevX, prevY] = [command.x, command.y];
        result[i] = command;
    }
    return result;
}
//# sourceMappingURL=mathUtils.js.map