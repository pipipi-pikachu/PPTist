import { describe, test, expect } from '@jest/globals';
import { SVGPathData } from '../index.js';
import { assertThrows } from './testUtils.js';
import { type CommandM } from '../types.js';

describe('Parsing commands with different numbers', () => {
  test('should work with a 1 char integer', () => {
    expect((new SVGPathData('H0').commands[0] as CommandM).x).toEqual(0);
  });

  test('should work with a big integer', () => {
    expect((new SVGPathData('H1234567890').commands[0] as CommandM).x).toEqual(
      1234567890,
    );
  });

  test('should work with a explicitly positive integer', () => {
    expect((new SVGPathData('H+1254664').commands[0] as CommandM).x).toEqual(
      +1254664,
    );
  });

  test('should work with a negative integer', () => {
    expect((new SVGPathData('H-1254664').commands[0] as CommandM).x).toEqual(
      -1254664,
    );
  });

  test('should work with a float with left side digits', () => {
    expect((new SVGPathData('H123.456').commands[0] as CommandM).x).toEqual(
      123.456,
    );
  });

  test('should work with a float without left side digits', () => {
    expect((new SVGPathData('H.456').commands[0] as CommandM).x).toEqual(0.456);
  });

  test('should work with a float without right side digits', () => {
    expect((new SVGPathData('H123.').commands[0] as CommandM).x).toEqual(123.0);
  });

  test('should work with a number with a positive exponent', () => {
    expect((new SVGPathData('H123.456e125').commands[0] as CommandM).x).toEqual(
      123.456e125,
    );
  });

  test('should work with a number with an explicitly positive exponent', () => {
    expect(
      (new SVGPathData('H123.456e+125').commands[0] as CommandM).x,
    ).toEqual(123.456e125);
  });

  test('should work with a number with a negative exponent', () => {
    expect(
      (new SVGPathData('H123.456e-125').commands[0] as CommandM).x,
    ).toEqual(123.456e-125);
  });

  test('should work with a negative number with a positive exponent', () => {
    expect(
      (new SVGPathData('H-123.456e125').commands[0] as CommandM).x,
    ).toEqual(-123.456e125);
  });

  test('should work with a negative number with an explicitly positive exponent', () => {
    expect(
      (new SVGPathData('H-123.456e+125').commands[0] as CommandM).x,
    ).toEqual(-123.456e125);
  });

  test('should work with a negative number with a negative exponent', () => {
    expect(
      (new SVGPathData('H-123.456e-125').commands[0] as CommandM).x,
    ).toEqual(-123.456e-125);
  });

  test('should work with sign separated numbers', () => {
    const commands = new SVGPathData('M-123.456e-125-1234.456e-125')
      .commands as CommandM[];

    expect(commands[0].x).toEqual(-123.456e-125);
    expect(commands[0].y).toEqual(-1234.456e-125);
  });

  test('should work with sign separated numbers', () => {
    const commands = new SVGPathData(
      'M-1.456e-125-12.456e-125-123.456e-125-1234.456e-125',
    ).commands as CommandM[];

    expect(commands[0].x).toEqual(-1.456e-125);
    expect(commands[0].y).toEqual(-12.456e-125);
    expect(commands[1].x).toEqual(-123.456e-125);
    expect(commands[1].y).toEqual(-1234.456e-125);
  });

  test('should work with decpoint separated numbers', () => {
    const commands = new SVGPathData('M-123.123e-123.456e-456')
      .commands as CommandM[];

    expect(commands[0].x).toEqual(-123.123e-123);
    expect(commands[0].y).toEqual(0.456e-456);
  });

  test('should work with decpoint separated numbers', () => {
    const commands = new SVGPathData(
      'M-123.123e-123.456e-456.789e-789.123e-123',
    ).commands as CommandM[];

    expect(commands[0].x).toEqual(-123.123e-123);
    expect(commands[0].y).toEqual(0.456e-456);
    expect(commands[1].x).toEqual(0.789e-789);
    expect(commands[1].y).toEqual(0.123e-123);
  });

  test('should fail with eE', () => {
    assertThrows(
      () => new SVGPathData('H1ee2'),
      SyntaxError,
      'Invalid number ending at 0',
    );
  });
});
