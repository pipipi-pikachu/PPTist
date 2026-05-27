import { SVGPathData, SVGPathDataTransformer } from 'svg-pathdata'

/**
 * 解析 SVG path 的 `d` 属性，并转换为项目可消费的点位数组。
 *
 * @param d - SVG path 元素的 `d` 属性字符串。
 * @returns 由移动点、直线点、三次贝塞尔点和闭合标记组成的路径点数组。
 * @throws 当 `d` 不是合法 SVG path 字符串或 `svg-pathdata` 解析失败时，异常会向上抛出。
 * @remarks
 * - 函数会把相对命令转换为绝对坐标，方便后续导出、缩放或几何计算。
 * - H/V/Z/S/T/Q/A 等命令会被标准化或转换，最终保留 M、L、C、Z 这几类项目更容易处理的结构。
 * - 圆弧 A 会转换为三次贝塞尔 C，因此返回点位不再保留原始圆弧参数。
 */
export const toPoints = (d: string) => {
  // 创建 SVGPathData 实例并按固定顺序标准化路径命令。
  const pathData = new SVGPathData(d)
    // 将相对坐标命令转换为绝对坐标，降低后续处理复杂度。
    .transform(SVGPathDataTransformer.TO_ABS())
    // 将水平线 H、垂直线 V 和闭合 Z 等命令标准化为更通用的命令形态。
    .transform(SVGPathDataTransformer.NORMALIZE_HVZ())
    // 将平滑曲线 S/T 转换为显式控制点命令，避免依赖前一个命令推导控制点。
    .transform(SVGPathDataTransformer.NORMALIZE_ST())
    // 将二次贝塞尔 Q/T 转换为三次贝塞尔 C，统一曲线表达。
    .transform(SVGPathDataTransformer.QT_TO_C())
    // 将圆弧 A 转换为三次贝塞尔 C，方便项目内以统一曲线结构处理。
    .transform(SVGPathDataTransformer.A_TO_C())

  // 累积项目内部使用的路径点位。
  const points = []

  // 遍历标准化后的命令，映射为项目的点位数据格式。
  for (const item of pathData.commands) {
    // MOVE_TO 表示子路径起点，对应 SVG 的 M 命令。
    if (item.type === SVGPathData.MOVE_TO) {
      // 写入起点坐标和命令类型；relative 固定 false 表示已是绝对坐标。
      points.push({
        x: item.x,
        y: item.y,
        type: 'M',
        relative: false,
      })
    }
    // LINE_TO 表示直线终点，对应 SVG 的 L 命令。
    else if (item.type === SVGPathData.LINE_TO) {
      // 写入直线终点坐标，供后续重建 path 或计算范围。
      points.push({
        x: item.x,
        y: item.y,
        type: 'L',
        relative: false,
      })
    }
    // CURVE_TO 表示三次贝塞尔曲线终点和两个控制点。
    else if (item.type === SVGPathData.CURVE_TO) {
      // 写入曲线终点和控制点；项目内使用 `curve.type = cubic` 标记三次贝塞尔。
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
    // CLOSE_PATH 表示闭合当前子路径，对应 SVG 的 Z 命令。
    else if (item.type === SVGPathData.CLOSE_PATH) {
      // 闭合命令没有坐标，只记录 close 标记和类型。
      points.push({
        close: true,
        type: 'Z',
      })
    }
  }

  // 返回标准化后的点位数组。
  return points
}

/**
 * 获取 SVG path 在坐标系中的简单边界范围。
 *
 * @param path - SVG path 元素的 `d` 属性字符串。
 * @returns 包含 `minX`、`minY`、`maxX`、`maxY` 的范围对象；解析失败时返回全 0 范围。
 * @throws 当前函数捕获 path 解析异常，不主动向上抛错。
 * @remarks
 * - 函数会先将路径命令转换为绝对坐标并标准化曲线命令。
 * - 当前范围计算只收集命令中的 `x/y` 字段，不精确计算贝塞尔曲线控制点导致的曲线极值。
 * - 解析失败返回零范围，调用方需要根据业务判断是否接受该兜底值。
 */
export const getSvgPathRange = (path: string) => {
  // 捕获非法 path 解析异常，保证调用方拿到稳定范围对象。
  try {
    // 创建并标准化 SVG path 数据，处理相对坐标、简写曲线和圆弧命令。
    const pathData = new SVGPathData(path)
      // 将路径命令统一转换为绝对坐标。
      .transform(SVGPathDataTransformer.TO_ABS())
      // 标准化水平线、垂直线和闭合命令。
      .transform(SVGPathDataTransformer.NORMALIZE_HVZ())
      // 标准化平滑曲线命令，使控制点显式化。
      .transform(SVGPathDataTransformer.NORMALIZE_ST())
      // 将二次贝塞尔转换为三次贝塞尔。
      .transform(SVGPathDataTransformer.QT_TO_C())
      // 将圆弧转换为三次贝塞尔。
      .transform(SVGPathDataTransformer.A_TO_C())

    // 收集所有命令中的 x 坐标，用于计算水平范围。
    const xList: number[] = []
    // 收集所有命令中的 y 坐标，用于计算垂直范围。
    const yList: number[] = []
    // 遍历标准化命令，提取存在的坐标字段。
    for (const item of pathData.commands) {
      // 某些命令如 CLOSE_PATH 没有 x 字段，需要先用 `in` 判断。
      if ('x' in item) xList.push(item.x)
      // 某些命令如 CLOSE_PATH 没有 y 字段，需要先用 `in` 判断。
      if ('y' in item) yList.push(item.y)
    }
    // 返回坐标列表的最小和最大值，形成路径的近似外接范围。
    return {
      minX: Math.min(...xList),
      minY: Math.min(...yList),
      maxX: Math.max(...xList),
      maxY: Math.max(...yList),
    }
  }
  // path 解析或转换失败时进入兜底分支。
  catch {
    // 返回零范围，避免上层因为非法 SVG path 直接崩溃。
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    }
  }
}

/**
 * `toPoints()` 返回值的类型别名。
 *
 * @remarks 供导入导出、形状路径转换等模块复用，确保路径点结构与解析函数保持同步。
 */
export type SvgPoints = ReturnType<typeof toPoints>
