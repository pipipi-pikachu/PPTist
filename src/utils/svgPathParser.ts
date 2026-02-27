import { SVGPathData, SVGPathDataTransformer } from 'svg-pathdata'

/**
 * 解析SVG路径，并将圆弧（A）类型的路径转为三次贝塞尔（C）类型的路径
 * @param d SVG path d属性
 */
export const toPoints = (d: string) => {
  const pathData = new SVGPathData(d)
    .transform(SVGPathDataTransformer.TO_ABS())
    .transform(SVGPathDataTransformer.NORMALIZE_HVZ())
    .transform(SVGPathDataTransformer.NORMALIZE_ST())
    .transform(SVGPathDataTransformer.QT_TO_C())
    .transform(SVGPathDataTransformer.A_TO_C())

  const points = []

  for (const item of pathData.commands) {
    if (item.type === SVGPathData.MOVE_TO) {
      points.push({
        x: item.x,
        y: item.y,
        type: 'M',
        relative: false,
      })
    }
    else if (item.type === SVGPathData.LINE_TO) {
      points.push({
        x: item.x,
        y: item.y,
        type: 'L',
        relative: false,
      })
    }
    else if (item.type === SVGPathData.CURVE_TO) {
      points.push({
        x: item.x,
        y: item.y,
        type: 'C',
        relative: false,
        curve: {
          type: 'cubic',
          x1: item.x1,
          y1: item.y1,
          x2: item.x2,
          y2: item.y2,
        },
      })
    }
    else if (item.type === SVGPathData.CLOSE_PATH) {
      points.push({
        close: true,
        type: 'Z',
      })
    }
  }

  return points
}

export const getSvgPathRange = (path: string) => {
  try {
    const pathData = new SVGPathData(path)
      .transform(SVGPathDataTransformer.TO_ABS())
      .transform(SVGPathDataTransformer.NORMALIZE_HVZ())
      .transform(SVGPathDataTransformer.NORMALIZE_ST())
      .transform(SVGPathDataTransformer.QT_TO_C())
      .transform(SVGPathDataTransformer.A_TO_C())

    const xList: number[] = []
    const yList: number[] = []
    for (const item of pathData.commands) {
      if ('x' in item) xList.push(item.x)
      if ('y' in item) yList.push(item.y)
    }
    return {
      minX: Math.min(...xList),
      minY: Math.min(...yList),
      maxX: Math.max(...xList),
      maxY: Math.max(...yList),
    }
  }
  catch {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    }
  }
}

export type SvgPoints = ReturnType<typeof toPoints>