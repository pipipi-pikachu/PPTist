import { describe, test } from '@jest/globals';
import { encodeSVGPath } from '../index.js';
import { assertThrows } from './testUtils.js';
describe('SVGPathDataEncoder', () => {
    test('should not work when the command is forgotten', () => {
        assertThrows(() => {
            encodeSVGPath(undefined);
        }, TypeError, "Cannot read properties of undefined (reading 'type')");
    });
    test('should fail when a bad command is given', () => {
        assertThrows(() => {
            encodeSVGPath({
                type: 'plop',
                x: 0,
                y: 0,
            });
        }, Error, 'Unexpected command type "plop" at index 0.');
    });
});
//# sourceMappingURL=encoder.test.js.map