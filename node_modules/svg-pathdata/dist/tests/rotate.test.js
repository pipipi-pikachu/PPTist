import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';
describe('Positive rotate from the origin', () => {
    test('should fail with no args', () => {
        assertThrows(() => {
            new SVGPathData('m20,30l10,10z')
                .rotate(undefined)
                .encode();
        }, Error, 'assertNumbers arguments[0] is not a number. undefined == typeof undefined');
    });
    test('should work with relative horizontal path', () => {
        expect(new SVGPathData('m10 0l60 0z').rotate(Math.PI).round(6).encode()).toEqual('m-10 0l-60 0z');
    });
    test('should work with relative vertical path', () => {
        expect(new SVGPathData('m0 10l0 60z').rotate(Math.PI).round(6).encode()).toEqual('m0 -10l0 -60z');
    });
    test('should work with relative path', () => {
        expect(new SVGPathData('m75 100l0 -50z').rotate(Math.PI).round(6).encode()).toEqual('m-75 -100l0 50z');
    });
    test('should work with absolute path', () => {
        expect(new SVGPathData('M75,100L75,50z').rotate(Math.PI).round(6).encode()).toEqual('M-75 -100L-75 -50z');
    });
});
describe('Positive rotate', () => {
    test('should work with relative path (Math.PI)', () => {
        expect(new SVGPathData('m100 100l100 100z')
            .rotate(Math.PI, 150, 150)
            .round(6)
            .encode()).toEqual('m200 200l-100 -100z');
    });
    test('should work with relative path (Math.PI/2)', () => {
        expect(new SVGPathData('m100 100l100 100z')
            .rotate(Math.PI / 2, 150, 150)
            .round(6)
            .encode()).toEqual('m200 100l-100 100z');
    });
    test('should work with relative path', () => {
        expect(new SVGPathData('m75 100l0 -50z')
            .rotate(Math.PI, 75, 75)
            .round(6)
            .encode()).toEqual('m75 50l0 50z');
    });
    test('should work with absolute path', () => {
        expect(new SVGPathData('M75,100L75,50z')
            .rotate(Math.PI, 75, 75)
            .round(6)
            .encode()).toEqual('M75 50L75 100z');
    });
});
describe('360° Positive rotate', () => {
    test('should work with relative path', () => {
        expect(new SVGPathData('m100 75l-50 -45l0 90z')
            .rotate(2 * Math.PI, 75, 75)
            .round(6)
            .encode()).toEqual('m100 75l-50 -45l0 90z');
    });
    test('should work with absolute path', () => {
        expect(new SVGPathData('M 100,75L50,30L50,120 z')
            .rotate(2 * Math.PI, 75, 75)
            .round(6)
            .encode()).toEqual('M100 75L50 30L50 120z');
    });
});
//# sourceMappingURL=rotate.test.js.map