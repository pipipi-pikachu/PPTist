import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';

describe('Parsing close path commands', () => {
  test('should work', () => {
    const commands = new SVGPathData('Z').commands;

    expect(commands[0].type).toEqual(SVGPathData.CLOSE_PATH);
  });

  test('should work with spaces before', () => {
    const commands = new SVGPathData('   Z').commands;

    expect(commands[0].type).toEqual(SVGPathData.CLOSE_PATH);
  });

  test('should work with spaces after', () => {
    const commands = new SVGPathData('Z    ').commands;

    expect(commands[0].type).toEqual(SVGPathData.CLOSE_PATH);
  });

  test('should work before a command sequence', () => {
    const commands = new SVGPathData(' Z M10,10 L10,10 H10 V10').commands;

    expect(commands[0].type).toEqual(SVGPathData.CLOSE_PATH);
  });

  test('should work after a command sequence', () => {
    const commands = new SVGPathData('M10,10 L10,10 H10 V10 Z').commands;

    expect(commands[4].type).toEqual(SVGPathData.CLOSE_PATH);
  });

  test('should work in a command sequence', () => {
    const commands = new SVGPathData(
      'M10,10 L10,10 H10 V10 Z M10,10 L10,10 H10 V10',
    ).commands;

    expect(commands[4].type).toEqual(SVGPathData.CLOSE_PATH);
  });
});

describe('Encoding close path commands', () => {
  test('should work with one command', () => {
    expect(new SVGPathData('z').encode()).toEqual('z');
  });

  test('should work with several commands', () => {
    expect(new SVGPathData('zzzz').encode()).toEqual('zzzz');
  });
});
