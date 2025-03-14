import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';
describe('X axis skew', () => {
    test('should fail with bad args', () => {
        assertThrows(() => {
            new SVGPathData('m20,30l10,10z')
                .skewX(undefined)
                .encode();
        }, Error, 'assertNumbers arguments[0] is not a number. undefined == typeof undefined');
    });
    test('should work with relative path', () => {
        expect(new SVGPathData('m100 75l-50 -45l0 90z').skewX(Math.PI / 2).encode()).toEqual('m175.29136163904155 75l-95.17481698342493 -45l90.34963396684985 90z');
    });
    test('should work with absolute path', () => {
        expect(new SVGPathData('M 100,75 50,30 50,120 z').skewX(Math.PI / 2).encode()).toEqual('M175.29136163904155 75L80.11654465561662 30L170.46617862246646 120z');
    });
});
describe('Y axis skew', () => {
    test('should fail with bad args', () => {
        assertThrows(() => {
            new SVGPathData('m20,30l10,10z')
                .skewY(undefined)
                .encode();
        }, Error, 'assertNumbers arguments[0] is not a number. undefined == typeof undefined');
    });
    test('should work with relative path', () => {
        expect(new SVGPathData('m100 75l-50 -45l0 90z').skewY(Math.PI / 2).encode()).toEqual('m100 175.3884821853887l-50 -95.19424109269436l0 90z');
    });
    test('should work with absolute path', () => {
        expect(new SVGPathData('M 100,75 50,30 50,120 z').skewY(Math.PI / 2).encode()).toEqual('M100 175.3884821853887L50 80.19424109269436L50 170.19424109269437z');
    });
});
//# sourceMappingURL=skew.test.js.map