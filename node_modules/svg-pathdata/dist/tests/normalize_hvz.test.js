import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
describe('HVZA normalization', () => {
    // currently z/Z is always absolute
    test('should transform relative h v z', () => {
        expect(new SVGPathData('m 10 10 h 100 v 100 z').normalizeHVZ().encode()).toEqual(new SVGPathData('m 10 10 l 100 0 l 0 100 L 10 10').encode());
    });
    test('should transform absolute h v z', () => {
        expect(new SVGPathData('M 10 10 H 100 V 100 Z').normalizeHVZ().encode()).toEqual(new SVGPathData('M 10 10 L 100 10 L 100 100 L 10 10').encode());
    });
    test('should transform degenerate arcs', () => {
        expect(new SVGPathData('M 10 10 A 0 10 0 0 0 100 100 a 20 0 0 0 0 20 0')
            .normalizeHVZ()
            .encode()).toEqual(new SVGPathData('M 10 10 L 100 100 l 20 0').encode());
    });
});
//# sourceMappingURL=normalize_hvz.test.js.map