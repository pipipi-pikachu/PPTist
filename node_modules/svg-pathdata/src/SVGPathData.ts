import { encodeSVGPath } from './SVGPathDataEncoder.js';
import { SVGPathDataParser } from './SVGPathDataParser.js';
import { SVGPathDataTransformer } from './SVGPathDataTransformer.js';
import { TransformableSVG } from './TransformableSVG.js';
import type { SVGCommand } from './types.js';

export class SVGPathData extends TransformableSVG {
  commands: SVGCommand[];
  constructor(content: string | SVGCommand[]) {
    super();
    if ('string' === typeof content) {
      this.commands = SVGPathData.parse(content);
    } else {
      this.commands = content;
    }
  }

  encode() {
    return SVGPathData.encode(this.commands);
  }

  getBounds() {
    const boundsTransform = SVGPathDataTransformer.CALCULATE_BOUNDS();

    this.transform(boundsTransform);
    return boundsTransform;
  }

  transform(
    transformFunction: (input: SVGCommand) => SVGCommand | SVGCommand[],
  ) {
    const newCommands: SVGCommand[] = [];

    for (const command of this.commands) {
      const transformedCommand = transformFunction(command);

      if (Array.isArray(transformedCommand)) {
        newCommands.push(...transformedCommand);
      } else {
        newCommands.push(transformedCommand);
      }
    }
    this.commands = newCommands;
    return this;
  }

  static encode(commands: SVGCommand[]) {
    return encodeSVGPath(commands);
  }

  static parse(path: string) {
    const parser = new SVGPathDataParser();
    const commands: SVGCommand[] = [];
    parser.parse(path, commands);
    parser.finish(commands);
    return commands;
  }

  static readonly CLOSE_PATH = 1 as const;
  static readonly MOVE_TO = 2 as const;
  static readonly HORIZ_LINE_TO = 4 as const;
  static readonly VERT_LINE_TO = 8 as const;
  static readonly LINE_TO = 16 as const;
  static readonly CURVE_TO = 32 as const;
  static readonly SMOOTH_CURVE_TO = 64 as const;
  static readonly QUAD_TO = 128 as const;
  static readonly SMOOTH_QUAD_TO = 256 as const;
  static readonly ARC = 512 as const;
  static readonly LINE_COMMANDS =
    SVGPathData.LINE_TO | SVGPathData.HORIZ_LINE_TO | SVGPathData.VERT_LINE_TO;
  static readonly DRAWING_COMMANDS =
    SVGPathData.HORIZ_LINE_TO |
    SVGPathData.VERT_LINE_TO |
    SVGPathData.LINE_TO |
    SVGPathData.CURVE_TO |
    SVGPathData.SMOOTH_CURVE_TO |
    SVGPathData.QUAD_TO |
    SVGPathData.SMOOTH_QUAD_TO |
    SVGPathData.ARC;
}

export const COMMAND_ARG_COUNTS = {
  [SVGPathData.MOVE_TO]: 2,
  [SVGPathData.LINE_TO]: 2,
  [SVGPathData.HORIZ_LINE_TO]: 1,
  [SVGPathData.VERT_LINE_TO]: 1,
  [SVGPathData.CLOSE_PATH]: 0,
  [SVGPathData.QUAD_TO]: 4,
  [SVGPathData.SMOOTH_QUAD_TO]: 2,
  [SVGPathData.CURVE_TO]: 6,
  [SVGPathData.SMOOTH_CURVE_TO]: 4,
  [SVGPathData.ARC]: 7,
};
