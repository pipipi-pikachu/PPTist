import { encodeSVGPath } from './SVGPathDataEncoder.js';
import { SVGPathDataParser } from './SVGPathDataParser.js';
import { SVGPathDataTransformer } from './SVGPathDataTransformer.js';
import { TransformableSVG } from './TransformableSVG.js';
export class SVGPathData extends TransformableSVG {
    commands;
    constructor(content) {
        super();
        if ('string' === typeof content) {
            this.commands = SVGPathData.parse(content);
        }
        else {
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
    transform(transformFunction) {
        const newCommands = [];
        for (const command of this.commands) {
            const transformedCommand = transformFunction(command);
            if (Array.isArray(transformedCommand)) {
                newCommands.push(...transformedCommand);
            }
            else {
                newCommands.push(transformedCommand);
            }
        }
        this.commands = newCommands;
        return this;
    }
    static encode(commands) {
        return encodeSVGPath(commands);
    }
    static parse(path) {
        const parser = new SVGPathDataParser();
        const commands = [];
        parser.parse(path, commands);
        parser.finish(commands);
        return commands;
    }
    static CLOSE_PATH = 1;
    static MOVE_TO = 2;
    static HORIZ_LINE_TO = 4;
    static VERT_LINE_TO = 8;
    static LINE_TO = 16;
    static CURVE_TO = 32;
    static SMOOTH_CURVE_TO = 64;
    static QUAD_TO = 128;
    static SMOOTH_QUAD_TO = 256;
    static ARC = 512;
    static LINE_COMMANDS = SVGPathData.LINE_TO | SVGPathData.HORIZ_LINE_TO | SVGPathData.VERT_LINE_TO;
    static DRAWING_COMMANDS = SVGPathData.HORIZ_LINE_TO |
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
//# sourceMappingURL=SVGPathData.js.map