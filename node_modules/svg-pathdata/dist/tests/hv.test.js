import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
describe('Parsing horizontal commands', () => {
    test('should work with single coordinate', () => {
        const commands = new SVGPathData('H100').commands;
        expect(commands[0].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x).toEqual(100);
    });
    test('should work with single complexer coordinate', () => {
        const commands = new SVGPathData('H-10e-5').commands;
        expect(commands[0].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x).toEqual(-10e-5);
    });
    test('should work with single even more complexer coordinate', () => {
        const commands = new SVGPathData('H-10.0032e-5').commands;
        expect(commands[0].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].x).toEqual(-10.0032e-5);
    });
    test('should work with single relative coordinate', () => {
        const commands = new SVGPathData('h100').commands;
        expect(commands[0].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[0].relative).toEqual(true);
        expect(commands[0].x).toEqual(100);
    });
    test('should work with comma separated coordinates', () => {
        const commands = new SVGPathData('H123,456,7890,9876').commands;
        expect(commands[0].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[0].x).toEqual(123);
        expect(commands[1].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[1].x).toEqual(456);
        expect(commands[2].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[2].x).toEqual(7890);
        expect(commands[3].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[3].x).toEqual(9876);
    });
    test('should work with space separated coordinates', () => {
        const commands = new SVGPathData('H123 456 7890 9876').commands;
        expect(commands[0].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[0].x).toEqual(123);
        expect(commands[1].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[1].x).toEqual(456);
        expect(commands[2].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[2].x).toEqual(7890);
        expect(commands[3].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[3].x).toEqual(9876);
    });
    test('should work with nested separated coordinates', () => {
        const commands = new SVGPathData('H123 ,  456  \t,\n7890 \r\n 9876')
            .commands;
        expect(commands[0].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[0].x).toEqual(123);
        expect(commands[1].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[1].x).toEqual(456);
        expect(commands[2].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[2].x).toEqual(7890);
        expect(commands[3].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[3].x).toEqual(9876);
    });
    test('should work with multiple command declarations', () => {
        const commands = new SVGPathData(`
      H123 ,  456  \t,\n7890 \r\n 9876H123 ,
       456  \t,\n7890 \r\n 9876
     `).commands;
        expect(commands[0].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[0].x).toEqual(123);
        expect(commands[1].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[1].x).toEqual(456);
        expect(commands[2].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[2].x).toEqual(7890);
        expect(commands[3].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[3].x).toEqual(9876);
        expect(commands[4].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[4].x).toEqual(123);
        expect(commands[5].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[5].x).toEqual(456);
        expect(commands[6].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[6].x).toEqual(7890);
        expect(commands[7].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[7].x).toEqual(9876);
    });
});
describe('Parsing vertical commands', () => {
    test('should work with single coordinate', () => {
        const commands = new SVGPathData('V100').commands;
        expect(commands[0].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].y).toEqual(100);
    });
    test('should work with single complexer coordinate', () => {
        const commands = new SVGPathData('V-10e-5').commands;
        expect(commands[0].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].y).toEqual(-10e-5);
    });
    test('should work with single even more complexer coordinate', () => {
        const commands = new SVGPathData('V-10.0032e-5').commands;
        expect(commands[0].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].y).toEqual(-10.0032e-5);
    });
    test('should work with single relative coordinate', () => {
        const commands = new SVGPathData('v100').commands;
        expect(commands[0].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[0].relative).toEqual(true);
        expect(commands[0].y).toEqual(100);
    });
    test('should work with comma separated coordinates', () => {
        const commands = new SVGPathData('V123,456,7890,9876')
            .commands;
        expect(commands[0].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[0].y).toEqual(123);
        expect(commands[1].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[1].y).toEqual(456);
        expect(commands[2].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[2].y).toEqual(7890);
        expect(commands[3].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[3].y).toEqual(9876);
    });
    test('should work with space separated coordinates', () => {
        const commands = new SVGPathData('V123 456 7890 9876')
            .commands;
        expect(commands[0].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[0].y).toEqual(123);
        expect(commands[1].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[1].y).toEqual(456);
        expect(commands[2].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[2].y).toEqual(7890);
        expect(commands[3].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[3].y).toEqual(9876);
    });
    test('should work with nested separated coordinates', () => {
        const commands = new SVGPathData('V123 ,  456  \t,\n7890 \r\n 9876')
            .commands;
        expect(commands[0].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[0].y).toEqual(123);
        expect(commands[1].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[1].y).toEqual(456);
        expect(commands[2].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[2].y).toEqual(7890);
        expect(commands[3].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[3].y).toEqual(9876);
    });
    test('should work with multiple command declarations', () => {
        const commands = new SVGPathData(`
      V123 ,  456  \t,\n7890 \r\n
      9876V123 ,  456  \t,\n7890 \r\n 9876
    `).commands;
        expect(commands[0].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[0].y).toEqual(123);
        expect(commands[1].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[1].y).toEqual(456);
        expect(commands[2].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[2].y).toEqual(7890);
        expect(commands[3].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[3].y).toEqual(9876);
        expect(commands[4].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[4].y).toEqual(123);
        expect(commands[5].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[5].y).toEqual(456);
        expect(commands[6].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[6].y).toEqual(7890);
        expect(commands[7].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[7].y).toEqual(9876);
    });
});
describe('Parsing nested vertical/horizontal commands', () => {
    test('should work', () => {
        const commands = new SVGPathData('V100H100v0.12h0.12V100h100v-10e-5 H-10e-5').commands;
        expect(commands[0].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[0].relative).toEqual(false);
        expect(commands[0].y).toEqual(100);
        expect(commands[1].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[1].relative).toEqual(false);
        expect(commands[1].x).toEqual(100);
        expect(commands[2].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[2].relative).toEqual(true);
        expect(commands[2].y).toEqual(0.12);
        expect(commands[3].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[3].relative).toEqual(true);
        expect(commands[3].x).toEqual(0.12);
        expect(commands[4].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[4].relative).toEqual(false);
        expect(commands[4].y).toEqual(100);
        expect(commands[5].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[5].relative).toEqual(true);
        expect(commands[5].x).toEqual(100);
        expect(commands[6].type).toEqual(SVGPathData.VERT_LINE_TO);
        expect(commands[6].relative).toEqual(true);
        expect(commands[6].y).toEqual(-10e-5);
        expect(commands[7].type).toEqual(SVGPathData.HORIZ_LINE_TO);
        expect(commands[7].relative).toEqual(false);
        expect(commands[7].x).toEqual(-10e-5);
    });
});
describe('Encoding nested vertical/horizontal commands', () => {
    test('should work', () => {
        expect(new SVGPathData('V100H100v0.12h0.12V100h100v-10e-5H-10e-5').encode()).toEqual('V100H100v0.12h0.12V100h100v-0.0001H-0.0001');
    });
});
//# sourceMappingURL=hv.test.js.map