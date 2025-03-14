import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';
describe('Parsing elliptical arc commands', () => {
    test('should not work when badly declared', () => {
        // assertThrows(() => {
        //   new SVGPathData('A');
        // }, SyntaxError, 'Unterminated command at the path end.');
        // assertThrows(() => {
        //   new SVGPathData('A 30');
        // }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('A 30 50');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('A 30 50 0');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('A 30 50 0 0');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('A 30 50 0 0 1');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('A 30 50 0 0 1 162.55');
        }, SyntaxError, 'Unterminated command at the path end.');
        assertThrows(() => {
            new SVGPathData('A 30 50 0 0 1 A 30 50 0 0 1 162.55 162.45');
        }, SyntaxError, 'Unterminated command at index 14.');
    });
    test('should not work with bad rX value', () => {
        assertThrows(() => {
            new SVGPathData('A-30,50,0,0,1,162.55,162.45');
        }, SyntaxError, 'Expected positive number, got "-30" at index "4"');
    });
    test('should not work with bad rY value', () => {
        assertThrows(() => {
            new SVGPathData('A30,-50,0,0,1,162.55,162.45');
        }, SyntaxError, 'Expected positive number, got "-50" at index "7"');
    });
    test('should not work with bad lArcFlag value', () => {
        assertThrows(() => {
            new SVGPathData('A30,50,0,15,1,162.55,162.45');
        }, SyntaxError, 'Expected a flag, got "5" at index "11"');
    });
    test('should not work with bad sweepFlag value', () => {
        assertThrows(() => {
            new SVGPathData('A30,50,0,0,15,162.55,162.45');
        }, SyntaxError, 'Unterminated command at the path end.');
    });
    test('should work with comma separated coordinates', () => {
        const commands = new SVGPathData('A 30,50,0,0,1,162.55,162.45')
            .commands;
        expect(commands[0].type).toEqual(SVGPathData.ARC);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].rX).toEqual(30);
        expect(commands[0].rY).toEqual(50);
        expect(commands[0].xRot).toEqual(0);
        expect(commands[0].lArcFlag).toEqual(0);
        expect(commands[0].sweepFlag).toEqual(1);
        expect(commands[0].x).toEqual(162.55);
        expect(commands[0].y).toEqual(162.45);
    });
    test('should not work with a comma immediately after A', () => {
        assertThrows(() => new SVGPathData('A,30,50,0,0,1,162.55,162.45'), SyntaxError, 'Unexpected character "," at index 1. Command cannot follow comma');
    });
    test('should work with space separated coordinates', () => {
        const commands = new SVGPathData('A 30 50 0 0 1 162.55 162.45')
            .commands;
        expect(commands[0].type).toEqual(SVGPathData.ARC);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].rX).toEqual(30);
        expect(commands[0].rY).toEqual(50);
        expect(commands[0].xRot).toEqual(0);
        expect(commands[0].lArcFlag).toEqual(0);
        expect(commands[0].sweepFlag).toEqual(1);
        expect(commands[0].x).toEqual(162.55);
        expect(commands[0].y).toEqual(162.45);
    });
    test('should work with nested separated complexer coordinate pairs', () => {
        const commands = new SVGPathData('A 30,50 0 0 1 162.55,162.45')
            .commands;
        expect(commands[0].type).toEqual(SVGPathData.ARC);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].rX).toEqual(30);
        expect(commands[0].rY).toEqual(50);
        expect(commands[0].xRot).toEqual(0);
        expect(commands[0].lArcFlag).toEqual(0);
        expect(commands[0].sweepFlag).toEqual(1);
        expect(commands[0].x).toEqual(162.55);
        expect(commands[0].y).toEqual(162.45);
    });
    test('should work with multiple pairs of coordinates', () => {
        const commands = new SVGPathData(`
      A 10.0032e-5,20.0032e-5 0 0 1 -30.0032e-5,-40.0032e-5
      50.0032e-5,60.0032e-5 0 1 0 -70.0032e-5,-80.0032e-5
      90.0032e-5,90.0032e-5 0 0 1 -80.0032e-5,-70.0032e-5
    `).commands;
        expect(commands[0].type).toEqual(SVGPathData.ARC);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].rX).toEqual(10.0032e-5);
        expect(commands[0].rY).toEqual(20.0032e-5);
        expect(commands[0].xRot).toEqual(0);
        expect(commands[0].lArcFlag).toEqual(0);
        expect(commands[0].sweepFlag).toEqual(1);
        expect(commands[0].x).toEqual(-30.0032e-5);
        expect(commands[0].y).toEqual(-40.0032e-5);
        expect(commands[1].type).toEqual(SVGPathData.ARC);
        expect(commands[1].relative).toEqual(false);
        expect(commands[1].rX).toEqual(50.0032e-5);
        expect(commands[1].rY).toEqual(60.0032e-5);
        expect(commands[1].xRot).toEqual(0);
        expect(commands[1].lArcFlag).toEqual(1);
        expect(commands[1].sweepFlag).toEqual(0);
        expect(commands[1].x).toEqual(-70.0032e-5);
        expect(commands[1].y).toEqual(-80.0032e-5);
        expect(commands[2].type).toEqual(SVGPathData.ARC);
        expect(commands[2].relative).toEqual(false);
        expect(commands[2].rX).toEqual(90.0032e-5);
        expect(commands[2].rY).toEqual(90.0032e-5);
        expect(commands[2].xRot).toEqual(0);
        expect(commands[2].lArcFlag).toEqual(0);
        expect(commands[2].sweepFlag).toEqual(1);
        expect(commands[2].x).toEqual(-80.0032e-5);
        expect(commands[2].y).toEqual(-70.0032e-5);
    });
    test('should work with multiple declared pairs of coordinates', () => {
        const commands = new SVGPathData(`
      A 10.0032e-5,20.0032e-5 0 0 1 -30.0032e-5,-40.0032e-5
      a50.0032e-5,60.0032e-5 0 1 0 -70.0032e-5,-80.0032e-5
      A90.0032e-5,90.0032e-5 0 0 1 -80.0032e-5,-70.0032e-5
    `).commands;
        expect(commands[0].type).toEqual(SVGPathData.ARC);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].rX).toEqual(10.0032e-5);
        expect(commands[0].rY).toEqual(20.0032e-5);
        expect(commands[0].xRot).toEqual(0);
        expect(commands[0].lArcFlag).toEqual(0);
        expect(commands[0].sweepFlag).toEqual(1);
        expect(commands[0].x).toEqual(-30.0032e-5);
        expect(commands[0].y).toEqual(-40.0032e-5);
        expect(commands[1].type).toEqual(SVGPathData.ARC);
        expect(commands[1].relative).toEqual(true);
        expect(commands[1].rX).toEqual(50.0032e-5);
        expect(commands[1].rY).toEqual(60.0032e-5);
        expect(commands[1].xRot).toEqual(0);
        expect(commands[1].lArcFlag).toEqual(1);
        expect(commands[1].sweepFlag).toEqual(0);
        expect(commands[1].x).toEqual(-70.0032e-5);
        expect(commands[1].y).toEqual(-80.0032e-5);
        expect(commands[2].type).toEqual(SVGPathData.ARC);
        expect(commands[2].relative).toEqual(false);
        expect(commands[2].rX).toEqual(90.0032e-5);
        expect(commands[2].rY).toEqual(90.0032e-5);
        expect(commands[2].xRot).toEqual(0);
        expect(commands[2].lArcFlag).toEqual(0);
        expect(commands[2].sweepFlag).toEqual(1);
        expect(commands[2].x).toEqual(-80.0032e-5);
        expect(commands[2].y).toEqual(-70.0032e-5);
    });
});
describe('Encoding eliptical arc commands', () => {
    test('should work with one command', () => {
        expect(new SVGPathData('A30 50 0 0 1 162.55 162.45').encode()).toEqual('A30 50 0 0 1 162.55 162.45');
    });
    test('should work with several commands', () => {
        expect(new SVGPathData('A30 50 0 0 1 162.55 162.45A30 50 0 0 1 162.55 162.45A30 50 0 0 1 162.55 162.45').encode()).toEqual('A30 50 0 0 1 162.55 162.45A30 50 0 0 1 162.55 162.45A30 50 0 0 1 162.55 162.45');
    });
});
describe('Transforming elliptical arc commands', () => {
    function assertDeepCloseTo(x, y, delta) {
        if (typeof x === 'number' && typeof y === 'number') {
            expect(x).toBeCloseTo(y, delta);
        }
        else if (typeof x === 'object' && typeof y === 'object') {
            const keys = Object.getOwnPropertyNames(x);
            expect(keys).toEqual(Object.getOwnPropertyNames(y));
            for (let i = 0; i < keys.length; i++) {
                assertDeepCloseTo(x[keys[i]], y[keys[i]], delta);
            }
        }
        else if (x instanceof Array && y instanceof Array) {
            expect(x.length).toEqual(y.length);
            for (let i = 0; i < x.length; i++) {
                assertDeepCloseTo(x[i], y[i], delta);
            }
        }
        else {
            expect(x).toEqual(y);
        }
    }
    test('should rotate an axis-aligned arc', () => {
        assertDeepCloseTo(new SVGPathData('M 0,0 A 100,50 0 0 1 100,50z').rotate(Math.PI / 6)
            .commands, new SVGPathData('M 0,0 A 100,50 30 0 1 61.6,93.3z').commands, 0.1);
    });
    test('should rotate an arbitrary arc', () => {
        assertDeepCloseTo(new SVGPathData('M 0,0 A 100,50 -15 0 1 100,0z').rotate(Math.PI / 4)
            .commands, new SVGPathData('M 0,0 A 100,50 30 0 1 70.7,70.7z').commands, 0.1);
    });
    test('should skew', () => {
        assertDeepCloseTo(new SVGPathData('M 0,0 A 50,100 0 0 1 50,100z').skewX(Math.tan(-1))
            .commands, new SVGPathData('M 0,0 A 34.2,146.0 48.6 0 1 -50,100 Z').commands, 0.1);
    });
    test('should tolerate singular matrices', () => {
        assertDeepCloseTo(new SVGPathData('M 0,0 A 80,80 0 0 1 50,100z').matrix(0.8, 2, 0.5, 1.25, 0, 0).commands, new SVGPathData('M 0,0 L 90,225 Z').commands, 0.1);
    });
    test('should match what Inkscape does on this random case', () => {
        assertDeepCloseTo(new SVGPathData('M 170.19275,911.55263 A 61.42857,154.28572 21.033507 0 1 57.481868,1033.5109 61.42857,154.28572 21.033507 0 1 55.521508,867.4575 61.42857,154.28572 21.033507 0 1 168.2324,745.4993 A 61.42857,154.28572 21.033507 0 1 170.19275,911.55263 z').matrix(-0.10825745, -0.37157241, 0.77029181, 0.3345653, -560.10375, 633.84215).commands, new SVGPathData('M 123.63314,875.5771 A 135.65735,17.465974 30.334289 0 1 229.77839,958.26036 135.65735,17.465974 30.334289 0 1 102.08104,903.43307 135.65735,17.465974 30.334289 0 1 -4.0641555,820.74983 135.65735,17.465974 30.334289 0 1 123.63314,875.5771 z').commands, 0.0001);
    });
    test('should reflect the sweep flag any time the determinant is negative', () => {
        assertDeepCloseTo(new SVGPathData('M 0,0 A 50,100 -30 1 1 80,80 Z').matrix(-1, 0, 0, 1, 0, 0).commands, new SVGPathData('M 0,0 A 50,100 30 1 0 -80,80 Z').commands, 0.1);
    });
});
//# sourceMappingURL=arc.test.js.map