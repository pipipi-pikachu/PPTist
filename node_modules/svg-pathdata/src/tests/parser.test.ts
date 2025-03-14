import { describe, test } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';

describe('SVGPathDataParser', () => {
  test('should fail when a bad command is given', () => {
    assertThrows(
      () => {
        SVGPathData.parse('b80,20');
      },
      SyntaxError,
      'Unexpected character "b" at index 0.',
    );
  });
});
