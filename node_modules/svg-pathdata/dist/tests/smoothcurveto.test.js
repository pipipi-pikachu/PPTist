import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';
describe('Parsing smooth curve to commands', () => {
    test('should not work when badly declared', () => {
        assertThrows(() => {
            new SVGPathData('S');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('S10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('S10 10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('S10 10 10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('S10 10 10 10 10 10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('S10 10 10S10 10 10 10');
        }, SyntaxError, 'Unterminated command at index 9.');
    });
    test('should work with comma separated coordinates', () => {
        const commands = new SVGPathData('S123,456 789,987').commands;
        expect(commands[0].type).toEqual(SVGPathData.SMOOTH_CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x2).toEqual(123);
        expect(commands[0].y2).toEqual(456);
        expect(commands[0].x).toEqual(789);
        expect(commands[0].y).toEqual(987);
    });
    test('should work with space separated coordinates', () => {
        const commands = new SVGPathData('S123 456 789 987').commands;
        expect(commands[0].type).toEqual(SVGPathData.SMOOTH_CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x2).toEqual(123);
        expect(commands[0].y2).toEqual(456);
        expect(commands[0].x).toEqual(789);
        expect(commands[0].y).toEqual(987);
    });
    test('should work with nested separated complexer coordinate pairs', () => {
        const commands = new SVGPathData('S-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5').commands;
        expect(commands[0].type).toEqual(SVGPathData.SMOOTH_CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x2).toEqual(-10.0032e-5);
        expect(commands[0].y2).toEqual(-20.0032e-5);
        expect(commands[0].x).toEqual(-30.0032e-5);
        expect(commands[0].y).toEqual(-40.0032e-5);
    });
    test('should work with multiple pairs of coordinates', () => {
        const commands = new SVGPathData('S-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 -10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 -10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5').commands;
        expect(commands[0].type).toEqual(SVGPathData.SMOOTH_CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x2).toEqual(-10.0032e-5);
        expect(commands[0].y2).toEqual(-20.0032e-5);
        expect(commands[0].x).toEqual(-30.0032e-5);
        expect(commands[0].y).toEqual(-40.0032e-5);
        expect(commands[1].type).toEqual(SVGPathData.SMOOTH_CURVE_TO);
        expect(commands[1].relative).toEqual(false);
        expect(commands[1].x2).toEqual(-10.0032e-5);
        expect(commands[1].y2).toEqual(-20.0032e-5);
        expect(commands[1].x).toEqual(-30.0032e-5);
        expect(commands[1].y).toEqual(-40.0032e-5);
        expect(commands[2].type).toEqual(SVGPathData.SMOOTH_CURVE_TO);
        expect(commands[2].relative).toEqual(false);
        expect(commands[2].x2).toEqual(-10.0032e-5);
        expect(commands[2].y2).toEqual(-20.0032e-5);
        expect(commands[2].x).toEqual(-30.0032e-5);
        expect(commands[2].y).toEqual(-40.0032e-5);
    });
    test('should work with multiple declared pairs of coordinates', () => {
        const commands = new SVGPathData('S-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 s-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 S-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5').commands;
        expect(commands[0].type).toEqual(SVGPathData.SMOOTH_CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x2).toEqual(-10.0032e-5);
        expect(commands[0].y2).toEqual(-20.0032e-5);
        expect(commands[0].x).toEqual(-30.0032e-5);
        expect(commands[0].y).toEqual(-40.0032e-5);
        expect(commands[1].type).toEqual(SVGPathData.SMOOTH_CURVE_TO);
        expect(commands[1].relative).toEqual(true);
        expect(commands[1].x2).toEqual(-10.0032e-5);
        expect(commands[1].y2).toEqual(-20.0032e-5);
        expect(commands[1].x).toEqual(-30.0032e-5);
        expect(commands[1].y).toEqual(-40.0032e-5);
        expect(commands[2].type).toEqual(SVGPathData.SMOOTH_CURVE_TO);
        expect(commands[2].relative).toEqual(false);
        expect(commands[2].x2).toEqual(-10.0032e-5);
        expect(commands[2].y2).toEqual(-20.0032e-5);
        expect(commands[2].x).toEqual(-30.0032e-5);
        expect(commands[2].y).toEqual(-40.0032e-5);
    });
});
//# sourceMappingURL=smoothcurveto.test.js.map