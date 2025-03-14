import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';

describe('Positive translation', () => {
  test('should fail with no args', () => {
    assertThrows(
      () => {
        new SVGPathData('m20,30l10,10z')
          .translate(undefined as unknown as number)
          .encode();
      },
      Error,
      'assertNumbers arguments[0] is not a number. undefined == typeof undefined',
    );
  });

  test('should work with relative path', () => {
    expect(
      new SVGPathData(
        'm20,30c0 0 10 20 15 30s10 20 15 30q10 20 15 30t10 10l10 10h10v10a10 10 5 1 0 10 10z',
      )
        .translate(10, 10)
        .encode(),
    ).toEqual(
      'm30 40c0 0 10 20 15 30s10 20 15 30q10 20 15 30t10 10l10 10h10v10a10 10 5 1 0 10 10z',
    );
  });

  test('should work with absolute path', () => {
    expect(
      new SVGPathData(
        'M20,30C0 0 10 20 15 30S10 20 15 30Q10 20 15 30T10 10L10 10H10V10A10 10 5 1 0 10 10z',
      )
        .translate(10, 10)
        .encode(),
    ).toEqual(
      'M30 40C10 10 20 30 25 40S20 30 25 40Q20 30 25 40T20 20L20 20H20V20A10 10 5 1 0 20 20z',
    );
  });
});
