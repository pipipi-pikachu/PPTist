import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
describe('toRel', () => {
    test('should work with M commands', () => {
        expect(new SVGPathData('M100,100 M110,90 M120,80 M130,70').toRel().encode()).toEqual(new SVGPathData('m100,100 m10,-10 m10,-10 m10,-10').encode());
    });
    test('should work with m commands', () => {
        expect(new SVGPathData('M-100,100m90,-90M20,20M19,19').toRel().encode()).toEqual(new SVGPathData('m-100,100 m90,-90 m30,10 m-1,-1').encode());
    });
    test('should work with H commands', () => {
        expect(new SVGPathData('M0,0 H100 H10  H20 H15').toRel().encode()).toEqual(new SVGPathData('m0,0 h100 h-90 h10 h-5').encode());
    });
    test('should work with V commands', () => {
        expect(new SVGPathData('M0,0 V100 V10  V15V20').toRel().encode()).toEqual(new SVGPathData('m0,0 v100 v-90 v5 v5').encode());
    });
    test('should work with L commands', () => {
        expect(new SVGPathData('M0,0 L100,-100 L1,0     L3,2 L2,1').toRel().encode()).toEqual(new SVGPathData('m0,0 l100,-100 l-99,100 l2,2 l-1,-1').encode());
    });
    test('should work with C commands', () => {
        expect(new SVGPathData(`
      M0,0
      C100,100 100,100 100,100
      C200,200 200,200 200,200
      C300,300 300,300 300,300
      C400,400 400,400 400,400`)
            .toRel()
            .encode()).toEqual(new SVGPathData(`
      m0,0
      c100,100 100,100 100,100
      c100,100 100,100 100,100
      c100,100 100,100 100,100
      c100,100 100,100 100,100`).encode());
    });
    test('should work with S commands', () => {
        expect(new SVGPathData(`
      M0,0
      S100,100 100,100
      S200,200 200,200
      S300,300 300,300
      S400,400 400,400`)
            .toRel()
            .encode()).toEqual(new SVGPathData(`
      m0,0
      s100,100 100,100
      s100,100 100,100
      s100,100 100,100
      s100,100 100,100`).encode());
    });
    test('should work with Q commands', () => {
        expect(new SVGPathData(`M0,0
    Q-100,100 -100,100
    Q-200,200 -200,200
    Q-300,300 -300,300
    Q-400,400 -400,400`)
            .toRel()
            .encode()).toEqual(new SVGPathData(`m0,0
    q-100,100 -100,100
    q-100,100 -100,100
    q-100,100 -100,100
    q-100,100 -100,100`).encode());
    });
    test('should work with T commands', () => {
        expect(new SVGPathData(`M0,0 T-100,100 T-200,200 T-190,210 T-180,220`)
            .toRel()
            .encode()).toEqual(new SVGPathData(`m0,0 t-100,100 t-100,100 t10,10    t10,10`).encode());
    });
    test('should work with A commands', () => {
        expect(new SVGPathData(`
      M0,0
      A20,20 180 1 0 -100,100
      A20,20 180 1 0 -200,200
      A20,20 180 1 0 -300,300
      A20,20 180 1 0 -400,400`)
            .toRel()
            .encode()).toEqual(new SVGPathData(`
      m0,0
      a20,20 180 1 0 -100,100
      a20,20 180 1 0 -100,100
      a20,20 180 1 0 -100,100
      a20,20 180 1 0 -100,100`).encode());
    });
    test('toRel should work with nested commands', () => {
        expect(new SVGPathData(`M0 0
      A20,20 180 1 0 -100,100
      H-90
      V110
      L-80,120
      C-70,130 -60,140 20,220`)
            .toRel()
            .encode()).toEqual(new SVGPathData(`m0 0
      a20,20 180 1 0 -100,100
      h10
      v10
      l10,10
      c10,10 20,20 100,100`).encode());
    });
    test('should work with Z commands', () => {
        expect(new SVGPathData(`M10,10 H20 V20 Z V20 H0 Z`).toRel().encode()).toEqual(new SVGPathData(`m10,10 h10 v10 z v10 h-10 z`).encode());
    });
});
describe('toAbs', () => {
    test('should work with m commands', () => {
        expect(new SVGPathData('m-100,100 M10,10 m10,10 m-1,-1').toAbs().encode()).toEqual(new SVGPathData('M-100,100 M10,10 M20,20 M19,19').encode());
    });
    test('should work with h commands', () => {
        expect(new SVGPathData('M0 0 h100 H10 h10 h-5').toAbs().encode()).toEqual(new SVGPathData('M0 0 H100 H10 H20 H15').encode());
    });
    test('should work with nested commands', () => {
        expect(new SVGPathData(`M0 0
      a20,20 180 1 0 -100,100
      h10
      v10
      l10,10
      c10,10 20,20 100,100`)
            .toAbs()
            .encode()).toEqual(new SVGPathData(`M0 0
      A20,20 180 1 0 -100,100
      H-90
      V110
      L-80,120
      C-70,130 -60,140 20,220`).encode());
    });
    test('should work with a commands', () => {
        expect(new SVGPathData(`M0 0
      a20,20 180 1 0 -100,100
      a20,20 180 1 0 -100,100
      a20,20 180 1 0 -100,100
      a20,20 180 1 0 -100,100`)
            .toAbs()
            .encode()).toEqual(new SVGPathData(`M0 0
      A20,20 180 1 0 -100,100
      A20,20 180 1 0 -200,200
      A20,20 180 1 0 -300,300
      A20,20 180 1 0 -400,400`).encode());
    });
    test('should work with t commands', () => {
        expect(new SVGPathData('M0 0 t-100,100 t-100,100 t10,10 t10,10')
            .toAbs()
            .encode()).toEqual(new SVGPathData('M0 0 T-100,100 T-200,200 T-190,210 -180,220').encode());
    });
    test('should work with v commands', () => {
        expect(new SVGPathData('M0 0 v100 V10 v5 v5').toAbs().encode()).toEqual(new SVGPathData('M0 0 V100 V10 V15 V20').encode());
    });
    test('should work with l commands', () => {
        expect(new SVGPathData('M0 0 l100,-100 L1,0 l2,2 l-1,-1').toAbs().encode()).toEqual(new SVGPathData('M0 0 L100,-100 L1,0 L3,2 L2,1').encode());
    });
    test('should work with c commands', () => {
        expect(new SVGPathData(`M0 0
      c100,100 100,100 100,100
      c100,100 100,100 100,100
      c100,100 100,100 100,100
      c100,100 100,100 100,100`)
            .toAbs()
            .encode()).toEqual(new SVGPathData(`M 0 0 
      C100,100 100,100 100,100
      C200,200 200,200 200,200
      C300,300 300,300 300,300
      C400,400 400,400 400,400`).encode());
    });
    test('should work with s commands', () => {
        expect(new SVGPathData(`M0 0
      s100,100 100,100
      s100,100 100,100
      s100,100 100,100
      s100,100 100,100`)
            .toAbs()
            .encode()).toEqual(new SVGPathData(`M 0 0 
      S100,100 100,100
      S200,200 200,200
      S300,300 300,300
      S400,400 400,400`).encode());
    });
    test('should work with q commands', () => {
        expect(new SVGPathData(`M0 0
      q-100,100 -100,100
      q-100,100 -100,100
      q-100,100 -100,100
      q-100,100 -100,100`)
            .toAbs()
            .encode()).toEqual(new SVGPathData(`M0 0
      Q-100,100 -100,100
      Q-200,200 -200,200
      Q-300,300 -300,300
      Q-400,400 -400,400`).encode());
    });
});
//# sourceMappingURL=relabs.test.js.map