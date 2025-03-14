import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { type CommandA } from '../types.js';

// Sample paths from MDN
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
// Here we have to round output before testing since there is some lil
// differences across browsers.

describe('Converting elliptical arc commands to curves', () => {
  test('should work sweepFlag on 0 and largeArcFlag on 0', () => {
    const arc = new SVGPathData(
      'M80 80 A 45 45, 0, 0, 0, 125 125',
    ).annotateArcs().commands[1] as CommandA;

    expect(arc.rX).toEqual(45);
    expect(arc.rY).toEqual(45);
    expect(arc.cX).toEqual(125);
    expect(arc.cY).toEqual(80);
    expect(arc.phi1).toEqual(180);
    expect(arc.phi2).toEqual(90);
  });

  test('should work sweepFlag on 1 and largeArcFlag on 0', () => {
    const arc = new SVGPathData(
      'M230 80 a 45 45, 0, 1, 0, 45 45',
    ).annotateArcs().commands[1] as Required<CommandA>;

    expect(arc.relative).toEqual(true);
    expect(arc.rX).toEqual(45);
    expect(arc.rY).toEqual(45);
    expect(arc.cX).toEqual(0);
    expect(arc.cY).toEqual(45);
    expect(arc.phi2 - arc.phi1).toEqual(-270);
    expect((arc.phi1 + 360) % 360).toEqual(270);
  });

  test('should work sweepFlag on 0 and largeArcFlag on 1', () => {
    const arc = new SVGPathData(
      'M230 80 a 45 45, 0, 0, 1, 45 45',
    ).annotateArcs().commands[1] as Required<CommandA>;

    expect(arc.relative).toEqual(true);
    expect(arc.rX).toEqual(45);
    expect(arc.rY).toEqual(45);
    expect(arc.cX).toEqual(0);
    expect(arc.cY).toEqual(45);
    expect(arc.phi2 - arc.phi1).toEqual(90);
    expect((arc.phi1 + 360) % 360).toEqual(270);
  });

  test('should work sweepFlag on 1 and largeArcFlag on 1', () => {
    const arc = new SVGPathData(
      'M110 215 A 30 50 0 1 1 162.55 162.45',
    ).annotateArcs().commands[1] as CommandA;

    expect(arc.relative).toEqual(false);
    expect(arc.rX).toEqual(30.64165220741206);
    expect(arc.rY).toEqual(51.069420345686765);
    expect(arc.cX).toEqual(136.275);
    expect(arc.cY).toEqual(188.725);
    expect(arc.phi1).toEqual(149.03624346792648);
    expect(arc.phi2).toEqual(329.03624346792645);
  });

  test('should work sweepFlag on 0 and largeArcFlag on 1xx', () => {
    const arc = new SVGPathData(
      'M80 80 A 45 60, 0, 1, 1, 125 125',
    ).annotateArcs().commands[1] as CommandA;

    expect(arc.relative).toEqual(false);
    expect(arc.cX).toBeLessThan(125);
  });
});
