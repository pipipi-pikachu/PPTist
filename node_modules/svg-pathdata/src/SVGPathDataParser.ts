// Parse SVG PathData
// http://www.w3.org/TR/SVG/paths.html#PathDataBNF
import { COMMAND_ARG_COUNTS, SVGPathData } from './SVGPathData.js';
import { TransformableSVG } from './TransformableSVG.js';
import type { SVGCommand, TransformFunction } from './types.js';
// Private consts : Char groups
const isWhiteSpace = (c: string) =>
  ' ' === c || '\t' === c || '\r' === c || '\n' === c;
const isDigit = (c: string) =>
  '0'.charCodeAt(0) <= c.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0);

export class SVGPathDataParser extends TransformableSVG {
  private curNumber: string = '';
  private curCommandType: SVGCommand['type'] | -1 = -1;
  private curCommandRelative = false;
  private canParseCommandOrComma = true;
  private curNumberHasExp = false;
  private curNumberHasExpDigits = false;
  private curNumberHasDecimal = false;
  private curArgs: number[] = [];

  constructor() {
    super();
  }

  finish(commands: SVGCommand[] = []) {
    this.parse(' ', commands);
    // Adding residual command
    if (0 !== this.curArgs.length || !this.canParseCommandOrComma) {
      throw new SyntaxError('Unterminated command at the path end.');
    }
    return commands;
  }

  parse(str: string, commands: SVGCommand[] = []) {
    const finishCommand = (command: SVGCommand) => {
      commands.push(command);
      this.curArgs.length = 0;
      this.canParseCommandOrComma = true;
    };

    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      // White spaces parsing
      const isAArcFlag =
        this.curCommandType === SVGPathData.ARC &&
        (this.curArgs.length === 3 || this.curArgs.length === 4) &&
        this.curNumber.length === 1 &&
        (this.curNumber === '0' || this.curNumber === '1');
      const isEndingDigit =
        isDigit(c) && ((this.curNumber === '0' && c === '0') || isAArcFlag);

      if (isDigit(c) && !isEndingDigit) {
        this.curNumber += c;
        this.curNumberHasExpDigits = this.curNumberHasExp;
        continue;
      }
      if ('e' === c || 'E' === c) {
        this.curNumber += c;
        this.curNumberHasExp = true;
        continue;
      }
      if (
        ('-' === c || '+' === c) &&
        this.curNumberHasExp &&
        !this.curNumberHasExpDigits
      ) {
        this.curNumber += c;
        continue;
      }
      // if we already have a ".", it means we are starting a new number
      if (
        '.' === c &&
        !this.curNumberHasExp &&
        !this.curNumberHasDecimal &&
        !isAArcFlag
      ) {
        this.curNumber += c;
        this.curNumberHasDecimal = true;
        continue;
      }

      // New number
      if (this.curNumber && -1 !== this.curCommandType) {
        const val = Number(this.curNumber);
        if (isNaN(val)) {
          throw new SyntaxError(`Invalid number ending at ${i}`);
        }
        if (this.curCommandType === SVGPathData.ARC) {
          if (0 === this.curArgs.length || 1 === this.curArgs.length) {
            if (0 > val) {
              throw new SyntaxError(
                `Expected positive number, got "${val}" at index "${i}"`,
              );
            }
          } else if (3 === this.curArgs.length || 4 === this.curArgs.length) {
            if ('0' !== this.curNumber && '1' !== this.curNumber) {
              throw new SyntaxError(
                `Expected a flag, got "${this.curNumber}" at index "${i}"`,
              );
            }
          }
        }
        this.curArgs.push(val);
        if (this.curArgs.length === COMMAND_ARG_COUNTS[this.curCommandType]) {
          if (SVGPathData.HORIZ_LINE_TO === this.curCommandType) {
            finishCommand({
              type: SVGPathData.HORIZ_LINE_TO,
              relative: this.curCommandRelative,
              x: val,
            });
          } else if (SVGPathData.VERT_LINE_TO === this.curCommandType) {
            finishCommand({
              type: SVGPathData.VERT_LINE_TO,
              relative: this.curCommandRelative,
              y: val,
            });
            // Move to / line to / smooth quadratic curve to commands (x, y)
          } else if (
            this.curCommandType === SVGPathData.MOVE_TO ||
            this.curCommandType === SVGPathData.LINE_TO ||
            this.curCommandType === SVGPathData.SMOOTH_QUAD_TO
          ) {
            finishCommand({
              type: this.curCommandType,
              relative: this.curCommandRelative,
              x: this.curArgs[0],
              y: this.curArgs[1],
            } as SVGCommand);
            // Switch to line to state
            if (SVGPathData.MOVE_TO === this.curCommandType) {
              this.curCommandType = SVGPathData.LINE_TO;
            }
          } else if (this.curCommandType === SVGPathData.CURVE_TO) {
            finishCommand({
              type: SVGPathData.CURVE_TO,
              relative: this.curCommandRelative,
              x1: this.curArgs[0],
              y1: this.curArgs[1],
              x2: this.curArgs[2],
              y2: this.curArgs[3],
              x: this.curArgs[4],
              y: this.curArgs[5],
            });
          } else if (this.curCommandType === SVGPathData.SMOOTH_CURVE_TO) {
            finishCommand({
              type: SVGPathData.SMOOTH_CURVE_TO,
              relative: this.curCommandRelative,
              x2: this.curArgs[0],
              y2: this.curArgs[1],
              x: this.curArgs[2],
              y: this.curArgs[3],
            });
          } else if (this.curCommandType === SVGPathData.QUAD_TO) {
            finishCommand({
              type: SVGPathData.QUAD_TO,
              relative: this.curCommandRelative,
              x1: this.curArgs[0],
              y1: this.curArgs[1],
              x: this.curArgs[2],
              y: this.curArgs[3],
            });
          } else if (this.curCommandType === SVGPathData.ARC) {
            finishCommand({
              type: SVGPathData.ARC,
              relative: this.curCommandRelative,
              rX: this.curArgs[0],
              rY: this.curArgs[1],
              xRot: this.curArgs[2],
              lArcFlag: this.curArgs[3] as 0 | 1,
              sweepFlag: this.curArgs[4] as 0 | 1,
              x: this.curArgs[5],
              y: this.curArgs[6],
            });
          }
        }
        this.curNumber = '';
        this.curNumberHasExpDigits = false;
        this.curNumberHasExp = false;
        this.curNumberHasDecimal = false;
        this.canParseCommandOrComma = true;
      }
      // Continue if a white space or a comma was detected
      if (isWhiteSpace(c)) {
        continue;
      }
      if (',' === c && this.canParseCommandOrComma) {
        // L 0,0, H is not valid:
        this.canParseCommandOrComma = false;
        continue;
      }
      // if a sign is detected, then parse the new number
      if ('+' === c || '-' === c || '.' === c) {
        this.curNumber = c;
        this.curNumberHasDecimal = '.' === c;
        continue;
      }
      // if a 0 is detected, then parse the new number
      if (isEndingDigit) {
        this.curNumber = c;
        this.curNumberHasDecimal = false;
        continue;
      }

      // Adding residual command
      if (0 !== this.curArgs.length) {
        throw new SyntaxError(`Unterminated command at index ${i}.`);
      }
      if (!this.canParseCommandOrComma) {
        throw new SyntaxError(
          `Unexpected character "${c}" at index ${i}. Command cannot follow comma`,
        );
      }
      this.canParseCommandOrComma = false;
      // Detecting the next command
      if ('z' === c || 'Z' === c) {
        commands.push({
          type: SVGPathData.CLOSE_PATH,
        });
        this.canParseCommandOrComma = true;
        this.curCommandType = -1;
        continue;
        // Horizontal move to command
      } else if ('h' === c || 'H' === c) {
        this.curCommandType = SVGPathData.HORIZ_LINE_TO;
        this.curCommandRelative = 'h' === c;
        // Vertical move to command
      } else if ('v' === c || 'V' === c) {
        this.curCommandType = SVGPathData.VERT_LINE_TO;
        this.curCommandRelative = 'v' === c;
        // Move to command
      } else if ('m' === c || 'M' === c) {
        this.curCommandType = SVGPathData.MOVE_TO;
        this.curCommandRelative = 'm' === c;
        // Line to command
      } else if ('l' === c || 'L' === c) {
        this.curCommandType = SVGPathData.LINE_TO;
        this.curCommandRelative = 'l' === c;
        // Curve to command
      } else if ('c' === c || 'C' === c) {
        this.curCommandType = SVGPathData.CURVE_TO;
        this.curCommandRelative = 'c' === c;
        // Smooth curve to command
      } else if ('s' === c || 'S' === c) {
        this.curCommandType = SVGPathData.SMOOTH_CURVE_TO;
        this.curCommandRelative = 's' === c;
        // Quadratic bezier curve to command
      } else if ('q' === c || 'Q' === c) {
        this.curCommandType = SVGPathData.QUAD_TO;
        this.curCommandRelative = 'q' === c;
        // Smooth quadratic bezier curve to command
      } else if ('t' === c || 'T' === c) {
        this.curCommandType = SVGPathData.SMOOTH_QUAD_TO;
        this.curCommandRelative = 't' === c;
        // Elliptic arc command
      } else if ('a' === c || 'A' === c) {
        this.curCommandType = SVGPathData.ARC;
        this.curCommandRelative = 'a' === c;
      } else {
        throw new SyntaxError(`Unexpected character "${c}" at index ${i}.`);
      }
    }
    return commands;
  }
  /**
   * Return a wrapper around this parser which applies the transformation on parsed commands.
   */
  transform(transform: TransformFunction) {
    const result = Object.create(this, {
      parse: {
        value(chunk: string, commands: SVGCommand[] = []) {
          const parsedCommands = Object.getPrototypeOf(this).parse.call(
            this,
            chunk,
          );
          for (const c of parsedCommands) {
            const cT = transform(c);
            if (Array.isArray(cT)) {
              commands.push(...cT);
            } else {
              commands.push(cT);
            }
          }
          return commands;
        },
      },
    });
    return result as this;
  }
}
