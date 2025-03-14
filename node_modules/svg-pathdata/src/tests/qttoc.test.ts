import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';

describe('qt to c', () => {
  test('absolute Q and T commands should be converted', () => {
    expect(
      new SVGPathData(`M0 0
    Q0,9 9,9
    T9,18`)
        .qtToC()
        .encode(),
    ).toEqual(
      new SVGPathData(`M0 0
    C0,6 3,9 9,9
    C15,9 15,12 9,18`).encode(),
    );
  });

  test('relative Q and T commands should be converted', () => {
    expect(
      new SVGPathData(`M9 18
    q0,9 9,9
    t9,18`)
        .qtToC()
        .encode(),
    ).toEqual(
      new SVGPathData(`M9 18
    c0,6 3,9 9,9
    c6,0 9,6 9,18`).encode(),
    );
  });
});
