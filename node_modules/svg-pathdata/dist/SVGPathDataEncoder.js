import { SVGPathData } from './SVGPathData.js';
// Encode SVG PathData
// http://www.w3.org/TR/SVG/paths.html#PathDataBNF
// Private consts : Char groups
const WSP = ' ';
export function encodeSVGPath(commands) {
    let str = '';
    if (!Array.isArray(commands)) {
        commands = [commands];
    }
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        if (command.type === SVGPathData.CLOSE_PATH) {
            str += 'z';
        }
        else if (command.type === SVGPathData.HORIZ_LINE_TO) {
            str += (command.relative ? 'h' : 'H') + command.x;
        }
        else if (command.type === SVGPathData.VERT_LINE_TO) {
            str += (command.relative ? 'v' : 'V') + command.y;
        }
        else if (command.type === SVGPathData.MOVE_TO) {
            str += (command.relative ? 'm' : 'M') + command.x + WSP + command.y;
        }
        else if (command.type === SVGPathData.LINE_TO) {
            str += (command.relative ? 'l' : 'L') + command.x + WSP + command.y;
        }
        else if (command.type === SVGPathData.CURVE_TO) {
            str +=
                (command.relative ? 'c' : 'C') +
                    command.x1 +
                    WSP +
                    command.y1 +
                    WSP +
                    command.x2 +
                    WSP +
                    command.y2 +
                    WSP +
                    command.x +
                    WSP +
                    command.y;
        }
        else if (command.type === SVGPathData.SMOOTH_CURVE_TO) {
            str +=
                (command.relative ? 's' : 'S') +
                    command.x2 +
                    WSP +
                    command.y2 +
                    WSP +
                    command.x +
                    WSP +
                    command.y;
        }
        else if (command.type === SVGPathData.QUAD_TO) {
            str +=
                (command.relative ? 'q' : 'Q') +
                    command.x1 +
                    WSP +
                    command.y1 +
                    WSP +
                    command.x +
                    WSP +
                    command.y;
        }
        else if (command.type === SVGPathData.SMOOTH_QUAD_TO) {
            str += (command.relative ? 't' : 'T') + command.x + WSP + command.y;
        }
        else if (command.type === SVGPathData.ARC) {
            str +=
                (command.relative ? 'a' : 'A') +
                    command.rX +
                    WSP +
                    command.rY +
                    WSP +
                    command.xRot +
                    WSP +
                    +command.lArcFlag +
                    WSP +
                    +command.sweepFlag +
                    WSP +
                    command.x +
                    WSP +
                    command.y;
        }
        else {
            // Unknown command
            throw new Error(`Unexpected command type "${command?.type}" at index ${i}.`);
        }
    }
    return str;
}
//# sourceMappingURL=SVGPathDataEncoder.js.map