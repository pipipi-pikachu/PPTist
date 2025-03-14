import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';
describe('Positive scale', () => {
    test('should fail with no args', () => {
        assertThrows(() => {
            new SVGPathData('m20,30l10,10z')
                .scale(undefined)
                .encode();
        }, Error, 'assertNumbers arguments[0] is not a number. undefined == typeof undefined');
    });
    test('should work with relative path', () => {
        expect(new SVGPathData('m20 30c0 0 10 20 15 30z').scale(10, 10).encode()).toEqual('m200 300c0 0 100 200 150 300z');
    });
    test('should work with absolute path', () => {
        expect(new SVGPathData('M20 30C0 0 10 20 15 30z').scale(10, 10).encode()).toEqual('M200 300C0 0 100 200 150 300z');
    });
});
//# sourceMappingURL=scale.test.js.map