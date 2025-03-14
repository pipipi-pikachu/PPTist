import { describe, test } from '@jest/globals';
import { encodeSVGPath } from '../index.js';
import { assertThrows } from './testUtils.js';
import { type SVGCommand } from '../types.js';

describe('SVGPathDataEncoder', () => {
  test('should not work when the command is forgotten', () => {
    assertThrows(
      () => {
        encodeSVGPath(undefined as unknown as SVGCommand);
      },
      TypeError,
      "Cannot read properties of undefined (reading 'type')",
    );
  });

  test('should fail when a bad command is given', () => {
    assertThrows(
      () => {
        encodeSVGPath({
          type: 'plop',
          x: 0,
          y: 0,
        } as unknown as SVGCommand);
      },
      Error,
      'Unexpected command type "plop" at index 0.',
    );
  });
});
