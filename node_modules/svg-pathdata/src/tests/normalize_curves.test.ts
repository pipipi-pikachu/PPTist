import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';

describe('normalization of curves', () => {
  test("should ignore everything which isn't S s T t", () => {
    expect(
      new SVGPathData(
        'm20,30c0 0 10 20 15 30q10 20 15 30h10v10a10 10 5 1 0 10 10z',
      )
        .normalizeST()
        .encode(),
    ).toEqual(
      new SVGPathData(
        'm20,30c0 0 10 20 15 30q10 20 15 30h10v10a10 10 5 1 0 10 10z',
      ).encode(),
    );
  });

  test("should take the previous point as the curve parameter if the previous curve isn't of the same type", () => {
    expect(
      new SVGPathData('M 10 10 h 100 s 10 20 15 30 t 20 15')
        .normalizeST()
        .encode(),
    ).toEqual(
      new SVGPathData('M 10 10 h 100 c 0 0 10 20 15 30 q 0 0 20 15').encode(),
    );
  });

  test('should mirror the previous control point', () => {
    expect(
      new SVGPathData('M 10 10 s 10 20 15 30 S 90 80 100 100')
        .normalizeST()
        .encode(),
    ).toEqual(
      new SVGPathData(
        'M 10 10 c 0 0 10 20 15 30 C 30 50 90 80 100 100',
      ).encode(),
    );
  });
});
