import { describe, test, expect } from '@jest/globals';
import { SVGPathDataParser, SVGPathData } from '../index.js';

describe('SVGPathDataTransformer', () => {
  test('should be possible to transform the parser', () => {
    const parser = new SVGPathDataParser().toAbs();

    expect(SVGPathData.encode(parser.parse('m 0'))).toEqual('');
    expect(SVGPathData.encode(parser.parse(' 0 l'))).toEqual('M0 0');
    expect(SVGPathData.encode(parser.parse('2 3'))).toEqual('');
    expect(SVGPathData.encode(parser.finish())).toEqual('L2 3');
  });
});
