import { type CommandA, type CommandC } from './types.js';
export declare function rotate([x, y]: [number, number], rad: number): number[];
export declare function assertNumbers(...numbers: number[]): boolean;
/**
 * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
 * Fixes rX and rY.
 * Ensures lArcFlag and sweepFlag are 0 or 1
 * Adds center coordinates: command.cX, command.cY (relative or absolute, depending on command.relative)
 * Adds start and end arc parameters (in degrees): command.phi1, command.phi2; phi1 < phi2 iff. c.sweepFlag == true
 */
export declare function annotateArcCommand(c: CommandA, x1: number, y1: number): void;
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
export declare function intersectionUnitCircleLine(a: number, b: number, c: number): [number, number][];
export declare const DEG: number;
export declare function lerp(a: number, b: number, t: number): number;
export declare function arcAt(c: number, x1: number, x2: number, phiDeg: number): number;
export declare function bezierRoot(x0: number, x1: number, x2: number, x3: number): number[];
export declare function bezierAt(x0: number, x1: number, x2: number, x3: number, t: number): number;
export declare function a2c(arc: CommandA, x0: number, y0: number): CommandC[];
