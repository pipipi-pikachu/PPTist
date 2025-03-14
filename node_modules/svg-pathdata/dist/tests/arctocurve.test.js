import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
// Sample pathes from MDN
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
// Here we have to round output before testing since there is some lil
// differences across browsers.
describe('Converting elliptical arc commands to curves', () => {
    test('should work sweepFlag on 0 and largeArcFlag on 0', () => {
        expect(new SVGPathData('M80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 Z')
            .aToC()
            .round()
            .encode()).toEqual('M80 80C80 104.8528137423857 100.1471862576143 125 125 125L125 80z');
    });
    test('should work sweepFlag on 1 and largeArcFlag on 0', () => {
        expect(new SVGPathData('M230 80 A 45 45, 0, 1, 0, 275 125 L 275 80 Z')
            .aToC()
            .round()
            .encode()).toEqual('M230 80C205.1471862576143 80 185 100.1471862576143 185 125C185 149.8528137423857 205.1471862576143 170 230 170C254.8528137423857 170 275 149.8528137423857 275 125L275 80z');
    });
    test('should work sweepFlag on 0 and largeArcFlag on 1', () => {
        expect(new SVGPathData('M80 230 A 45 45, 0, 0, 1, 125 275 L 125 230 Z')
            .aToC()
            .round()
            .encode()).toEqual('M80 230C104.8528137423857 230 125 250.1471862576143 125 275L125 230z');
    });
    test('should work sweepFlag on 1 and largeArcFlag on 1', () => {
        expect(new SVGPathData('M230 230 A 45 45, 0, 1, 1, 275 275 L 275 230 Z')
            .aToC()
            .round()
            .encode()).toEqual('M230 230C230 205.1471862576143 250.1471862576143 185 275 185C299.8528137423857 185 320 205.1471862576143 320 230C320 254.8528137423857 299.8528137423857 275 275 275L275 230z');
    });
    test('should work sweepFlag on 0 and largeArcFlag on 0 with relative arc', () => {
        expect(new SVGPathData('M80 80 a 45 45, 0, 0, 0, 125 125 L 125 80 Z')
            .aToC()
            .round()
            .encode()).toEqual('M80 80c-34.5177968644246 34.5177968644246 -34.5177968644246 90.4822031355754 0 125c34.5177968644246 34.5177968644246 90.4822031355754 34.5177968644246 125 0L125 80z');
    });
});
//# sourceMappingURL=arctocurve.test.js.map