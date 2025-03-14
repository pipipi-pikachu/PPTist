import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';

describe("Matrix transformation should be the same than it's equivalent transformation", () => {
  test('should fail with bad args', () => {
    assertThrows(
      () => {
        new SVGPathData('m20,30l10,10z')
          .matrix(...([] as unknown as Parameters<SVGPathData['matrix']>))
          .encode();
      },
      Error,
      'assertNumbers arguments[0] is not a number. undefined == typeof undefined',
    );
    assertThrows(
      () => {
        new SVGPathData('m20,30l10,10z')
          .matrix(...([1] as unknown as Parameters<SVGPathData['matrix']>))
          .encode();
      },
      Error,
      'assertNumbers arguments[1] is not a number. undefined == typeof undefined',
    );
    assertThrows(
      () => {
        new SVGPathData('m20,30l10,10z')
          .matrix(...([1, 1] as unknown as Parameters<SVGPathData['matrix']>))
          .encode();
      },
      Error,
      'assertNumbers arguments[2] is not a number. undefined == typeof undefined',
    );
    assertThrows(
      () => {
        new SVGPathData('m20,30l10,10z')
          .matrix(
            ...([1, 1, 1] as unknown as Parameters<SVGPathData['matrix']>),
          )
          .encode();
      },
      Error,
      'assertNumbers arguments[3] is not a number. undefined == typeof undefined',
    );
    assertThrows(
      () => {
        new SVGPathData('m20,30l10,10z')
          .matrix(
            ...([1, 1, 1, 1] as unknown as Parameters<SVGPathData['matrix']>),
          )
          .encode();
      },
      Error,
      'assertNumbers arguments[4] is not a number. undefined == typeof undefined',
    );
    assertThrows(
      () => {
        new SVGPathData('m20,30l10,10z')
          .matrix(
            ...([1, 1, 1, 1, 1] as unknown as Parameters<
              SVGPathData['matrix']
            >),
          )
          .encode();
      },
      Error,
      'assertNumbers arguments[5] is not a number. undefined == typeof undefined',
    );
  });

  test('for scale', () => {
    expect(
      new SVGPathData('m20 30c0 0 10 20 15 30z').scale(10, 10).encode(),
    ).toEqual(
      new SVGPathData('m20 30c0 0 10 20 15 30z')
        .matrix(10, 0, 0, 10, 0, 0)
        .encode(),
    );
  });
});
