import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';

describe('normalization of curves', () => {
  test('should clear zero length line segments', () => {
    expect(
      new SVGPathData(
        'M 10 10 h 0 h 10 H 20 H 30 v 0 v 10 V 20 V 30 l 0 0 l 10 10 L 40 40 L 50 50',
      )
        .sanitize()
        .encode(),
    ).toEqual(
      new SVGPathData('M 10 10 h 10 H 30 v 10 V 30 l 10 10 L 50 50').encode(),
    );
  });

  test('should clear zero length quadratic curves', () => {
    expect(
      new SVGPathData('M 10 10 t 0 0 t 10 10 t 0 0 t 0 0').sanitize().encode(),
    ).toEqual(new SVGPathData('M 10 10 t 10 10 t 0 0 t 0 0').encode());
  });

  test('should clear zero length quadratic curves (absolute)', () => {
    expect(
      new SVGPathData('M 10 10 T 10 10 T 20 20 T 20 20 T 20 20')
        .sanitize()
        .encode(),
    ).toEqual(new SVGPathData('M 10 10 T 20 20 T 20 20 T 20 20').encode());
  });

  test('should clear zero length cubic curves', () => {
    expect(
      new SVGPathData(
        'M 10 10 C 10 10 10 10 10 10 c 0 0 0 0 0 0 S 10 10 10 10 s 0 0 0 0',
      )
        .sanitize()
        .encode(),
    ).toEqual(new SVGPathData('M 10 10').encode());
  });

  test('should clear zero length arc curves', () => {
    expect(
      new SVGPathData(`
        M 10 10
        A 20,30 0 1 0 10,10
        A 20,30 0 0 0 10,10
        a 20,30 0 0 0 0,0
        a 20,30 0 0 0 10,10
      `)
        .sanitize()
        .encode(),
    ).toEqual(
      new SVGPathData(`
        M 10 10
      A 20,30 0 1 0 10,10
      a 20,30 0 0 0 10,10
      `).encode(),
    );
  });

  test('should correctly handle first control point from smooth curve', () => {
    expect(
      new SVGPathData('M 10 10 s 10 10 20 10 s 0 0 0 0').sanitize().encode(),
    ).toEqual(new SVGPathData('M 10 10 s 10 10 20 10 s 0 0 0 0').encode());
  });

  test('should remove 0-length Zz', () => {
    expect(new SVGPathData('M 10 10 h 10 h -10 Z').sanitize().encode()).toEqual(
      new SVGPathData('M 10 10 h 10 h -10').encode(),
    );
  });
});
