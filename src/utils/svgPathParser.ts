// @ts-ignore
import { SVGPathData } from 'svg-pathdata'
import arcToBezier from 'svg-arc-to-cubic-bezier'

type CommandM = {
  relative: boolean
  type: typeof SVGPathData.MOVE_TO
  x: number
  y: number
}
type CommandL = {
  relative: boolean
  type: typeof SVGPathData.LINE_TO
  x: number
  y: number
}
type CommandH = {
  relative: boolean
  type: typeof SVGPathData.HORIZ_LINE_TO
  x: number
}
type CommandV = {
  relative: boolean
  type: typeof SVGPathData.VERT_LINE_TO
  y: number
}
type CommandZ = {
  type: typeof SVGPathData.CLOSE_PATH
}
type CommandQ = {
  relative: boolean
  type: typeof SVGPathData.QUAD_TO
  x1: number
  y1: number
  x: number
  y: number
}
type CommandT = {
  relative: boolean
  type: typeof SVGPathData.SMOOTH_QUAD_TO
  x: number
  y: number
}
type CommandC = {
  relative: boolean
  type: typeof SVGPathData.CURVE_TO
  x1: number
  y1: number
  x2: number
  y2: number
  x: number
  y: number
}
type CommandS = {
  relative: boolean
  type: typeof SVGPathData.SMOOTH_CURVE_TO
  x2: number
  y2: number
  x: number
  y: number
}
type CommandA = {
  relative: boolean
  type: typeof SVGPathData.ARC
  rX: number
  rY: number
  xRot: number
  sweepFlag: 0 | 1
  lArcFlag: 0 | 1
  x: number
  y: number
  cX?: number
  cY?: number
  phi1?: number
  phi2?: number
}
type SVGCommand = CommandM | CommandL | CommandH | CommandV | CommandZ | CommandQ | CommandT | CommandC | CommandS | CommandA

declare class SVGPathData {
  commands: SVGCommand[]
  constructor(content: string | SVGCommand[])
  static readonly CLOSE_PATH: 1
  static readonly MOVE_TO: 2
  static readonly HORIZ_LINE_TO: 4
  static readonly VERT_LINE_TO: 8
  static readonly LINE_TO: 16
  static readonly CURVE_TO: 32
  static readonly SMOOTH_CURVE_TO: 64
  static readonly QUAD_TO: 128
  static readonly SMOOTH_QUAD_TO: 256
  static readonly ARC: 512
  static readonly LINE_COMMANDS: number
  static readonly DRAWING_COMMANDS: number
}

const typeMap = {
  1: 'Z',
  2: 'M',
  4: 'H',
  8: 'V',
  16: 'L',
  32: 'C',
  64: 'S',
  128: 'Q',
  256: 'T',
  512: 'A',
}

/**
 * 简单解析SVG路径
 * @param d SVG path d属性
 */
export const parseSvgPath = (d: string) => {
  const pathData = new SVGPathData(d)

  const ret = pathData.commands.map(item => {
    return { ...item, type: typeMap[item.type] }
  })
  return ret
}

export type SvgPath = ReturnType<typeof parseSvgPath>

/**
 * 解析SVG路径，并将圆弧（A）类型的路径转为三次贝塞尔（C）类型的路径
 * @param d SVG path d属性
 */
export const toPoints = (d: string) => {
  const pathData = new SVGPathData(d)
  
  const points = []
  for (const item of pathData.commands) {
    const type = typeMap[item.type]

    if (item.type === 2 || item.type === 16) {
      points.push({
        x: item.x,
        y: item.y,
        relative: item.relative,
        type,
      })
    }
    if (item.type === 32) {
      points.push({
        x: item.x, 
        y: item.y,
        curve: {
          type: 'cubic',
          x1: item.x1,
          y1: item.y1,
          x2: item.x2,
          y2: item.y2,
        },
        relative: item.relative,
        type,
      })
    }
    else if (item.type === 128) {
      points.push({
        x: item.x, 
        y: item.y,
        curve: {
          type: 'quadratic',
          x1: item.x1,
          y1: item.y1,
        },
        relative: item.relative,
        type,
      })
    }
    else if (item.type === 512) {
      const lastPoint = points[points.length - 1]
      if (!['M', 'L', 'Q', 'C'].includes(lastPoint.type)) continue

      const cubicBezierPoints = arcToBezier({
        px: lastPoint.x as number,
        py: lastPoint.y as number,
        cx: item.x,
        cy: item.y,
        rx: item.rX,
        ry: item.rY,
        xAxisRotation: item.xRot,
        largeArcFlag: item.lArcFlag,
        sweepFlag: item.sweepFlag,
      })
      for (const cbPoint of cubicBezierPoints) {
        points.push({
          x: cbPoint.x, 
          y: cbPoint.y,
          curve: {
            type: 'cubic',
            x1: cbPoint.x1,
            y1: cbPoint.y1,
            x2: cbPoint.x2,
            y2: cbPoint.y2,
          },
          relative: false,
          type: 'C',
        })
      }
    }
    else if (item.type === 1) {
      points.push({ close: true, type })
    }
    else continue
  }
  return points
}

export type SvgPoints = ReturnType<typeof toPoints>