import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';
describe('Parsing curve to commands', () => {
    test('should not work when badly declared', () => {
        assertThrows(() => {
            new SVGPathData('C');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('C10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('C10 10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('C10 10 10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('C10 10 10 10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('C10 10 10 10 10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('C10 10 10 10 10 10 10 10');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('C10 10 10C10 10 10 10 10 10');
        }, SyntaxError, 'Unterminated command at index 9.');
    });
    test('should work with comma separated coordinates', () => {
        const commands = new SVGPathData('C123,456 789,987 654,321').commands;
        expect(commands[0].type).toEqual(SVGPathData.CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x1).toEqual(123);
        expect(commands[0].y1).toEqual(456);
        expect(commands[0].x2).toEqual(789);
        expect(commands[0].y2).toEqual(987);
        expect(commands[0].x).toEqual(654);
        expect(commands[0].y).toEqual(321);
    });
    test('should work with space separated coordinates', () => {
        const commands = new SVGPathData('C123 456 789 987 654 321').commands;
        expect(commands[0].type).toEqual(SVGPathData.CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x1).toEqual(123);
        expect(commands[0].y1).toEqual(456);
        expect(commands[0].x2).toEqual(789);
        expect(commands[0].y2).toEqual(987);
        expect(commands[0].x).toEqual(654);
        expect(commands[0].y).toEqual(321);
    });
    test('should work with nested separated complexer coordinate pairs', () => {
        const commands = new SVGPathData('C-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 -50.0032e-5,-60.0032e-5').commands;
        expect(commands[0].type).toEqual(SVGPathData.CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x1).toEqual(-10.0032e-5);
        expect(commands[0].y1).toEqual(-20.0032e-5);
        expect(commands[0].x2).toEqual(-30.0032e-5);
        expect(commands[0].y2).toEqual(-40.0032e-5);
        expect(commands[0].x).toEqual(-50.0032e-5);
        expect(commands[0].y).toEqual(-60.0032e-5);
    });
    test('should work with multiple pairs of coordinates', () => {
        const commands = new SVGPathData(`
      C-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 -50.0032e-5,-60.0032e-5
      -10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 -50.0032e-5,-60.0032e-5
      -10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 -50.0032e-5,-60.0032e-5
    `).commands;
        expect(commands[0].type).toEqual(SVGPathData.CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x1).toEqual(-10.0032e-5);
        expect(commands[0].y1).toEqual(-20.0032e-5);
        expect(commands[0].x2).toEqual(-30.0032e-5);
        expect(commands[0].y2).toEqual(-40.0032e-5);
        expect(commands[0].x).toEqual(-50.0032e-5);
        expect(commands[0].y).toEqual(-60.0032e-5);
        expect(commands[1].type).toEqual(SVGPathData.CURVE_TO);
        expect(commands[1].relative).toEqual(false);
        expect(commands[1].x1).toEqual(-10.0032e-5);
        expect(commands[1].y1).toEqual(-20.0032e-5);
        expect(commands[1].x2).toEqual(-30.0032e-5);
        expect(commands[1].y2).toEqual(-40.0032e-5);
        expect(commands[1].x).toEqual(-50.0032e-5);
        expect(commands[1].y).toEqual(-60.0032e-5);
        expect(commands[2].type).toEqual(SVGPathData.CURVE_TO);
        expect(commands[2].relative).toEqual(false);
        expect(commands[2].x1).toEqual(-10.0032e-5);
        expect(commands[2].y1).toEqual(-20.0032e-5);
        expect(commands[2].x2).toEqual(-30.0032e-5);
        expect(commands[2].y2).toEqual(-40.0032e-5);
        expect(commands[2].x).toEqual(-50.0032e-5);
        expect(commands[2].y).toEqual(-60.0032e-5);
    });
    test('should work with multiple declared pairs of coordinates', () => {
        const commands = new SVGPathData(`
      C-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 -50.0032e-5,-60.0032e-5
      c-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 -50.0032e-5,-60.0032e-5
      C-10.0032e-5,-20.0032e-5 -30.0032e-5,-40.0032e-5 -50.0032e-5,-60.0032e-5
    `).commands;
        expect(commands[0].type).toEqual(SVGPathData.CURVE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x1).toEqual(-10.0032e-5);
        expect(commands[0].y1).toEqual(-20.0032e-5);
        expect(commands[0].x2).toEqual(-30.0032e-5);
        expect(commands[0].y2).toEqual(-40.0032e-5);
        expect(commands[0].x).toEqual(-50.0032e-5);
        expect(commands[0].y).toEqual(-60.0032e-5);
        expect(commands[1].type).toEqual(SVGPathData.CURVE_TO);
        expect(commands[1].relative).toEqual(true);
        expect(commands[1].x1).toEqual(-10.0032e-5);
        expect(commands[1].y1).toEqual(-20.0032e-5);
        expect(commands[1].x2).toEqual(-30.0032e-5);
        expect(commands[1].y2).toEqual(-40.0032e-5);
        expect(commands[1].x).toEqual(-50.0032e-5);
        expect(commands[1].y).toEqual(-60.0032e-5);
        expect(commands[2].type).toEqual(SVGPathData.CURVE_TO);
        expect(commands[2].relative).toEqual(false);
        expect(commands[2].x1).toEqual(-10.0032e-5);
        expect(commands[2].y1).toEqual(-20.0032e-5);
        expect(commands[2].x2).toEqual(-30.0032e-5);
        expect(commands[2].y2).toEqual(-40.0032e-5);
        expect(commands[2].x).toEqual(-50.0032e-5);
        expect(commands[2].y).toEqual(-60.0032e-5);
    });
});
describe('Encoding curve to commands', () => {
    test('should work with one command', () => {
        expect(new SVGPathData('C-10.0032e-5 -20.0032e-5 -30.0032e-5 -40.0032e-5 -50.0032e-5 -60.0032e-5').encode()).toEqual('C-0.000100032 -0.000200032 -0.000300032 -0.000400032 -0.000500032 -0.000600032');
    });
    test('should work with several commands', () => {
        expect(new SVGPathData('C-10.0032e-5 -20.0032e-5 -30.0032e-5 -40.0032e-5 -50.0032e-5 -60.0032e-5C-10.0032e-5 -20.0032e-5 -30.0032e-5 -40.0032e-5 -50.0032e-5 -60.0032e-5C-10.0032e-5 -20.0032e-5 -30.0032e-5 -40.0032e-5 -50.0032e-5 -60.0032e-5').encode()).toEqual('C-0.000100032 -0.000200032 -0.000300032 -0.000400032 -0.000500032 -0.000600032C-0.000100032 -0.000200032 -0.000300032 -0.000400032 -0.000500032 -0.000600032C-0.000100032 -0.000200032 -0.000300032 -0.000400032 -0.000500032 -0.000600032');
    });
});
//# sourceMappingURL=curveto.test.js.map