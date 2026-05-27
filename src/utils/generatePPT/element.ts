import tinycolor from 'tinycolor2'
import { nanoid } from 'nanoid'
import type { LinePoint, PPTElement, PPTLineElement, Slide } from './slides'

/**
 * 可按矩形计算旋转外接范围的元素几何数据。
 *
 * @property left - 元素未旋转包围盒左上角的 x 坐标。
 * @property top - 元素未旋转包围盒左上角的 y 坐标。
 * @property width - 元素未旋转包围盒宽度。
 * @property height - 元素未旋转包围盒高度。
 * @property rotate - 元素绕自身中心旋转的角度，单位为度。
 * @remarks 该类型只描述几何计算所需字段，不包含 PPT 元素的业务属性。
 */
interface RotatedElementData {
  left: number
  top: number
  width: number
  height: number
  rotate: number
}

/**
 * 画布二维坐标点。
 *
 * @property x - 点在画布坐标系中的横坐标。
 * @property y - 点在画布坐标系中的纵坐标。
 * @remarks PPTist 画布坐标系以左上角为原点，x 向右增大，y 向下增大。
 */
interface Point {
  x: number
  y: number
}

/**
 * 线条元素全部关键点在画布中的绝对坐标集合。
 *
 * @property start - 线条起点的绝对坐标。
 * @property end - 线条终点的绝对坐标。
 * @property broken - 单折线的中间折点绝对坐标。
 * @property broken2 - 双折线的控制点绝对坐标。
 * @property curve - 二次贝塞尔曲线控制点绝对坐标。
 * @property cubic - 三次贝塞尔曲线两个控制点的绝对坐标。
 * @remarks 线条元素原始数据中的点位是相对元素 left/top 的坐标，旋转计算前需要转成绝对坐标。
 */
interface AbsoluteLinePoints {
  start: Point
  end: Point
  broken?: Point
  broken2?: Point
  curve?: Point
  cubic?: [Point, Point]
}

/**
 * 旧 ID 到新 ID 的映射表。
 *
 * @remarks 用于复制幻灯片或元素时重建引用关系，例如组合 ID、元素 ID、页面 ID 等。
 */
interface IdMap {
  [id: string]: string
}

/**
 * 计算矩形元素绕自身中心旋转后的外接范围。
 *
 * @param element - 元素的位置、尺寸和旋转角度信息。
 * @returns 旋转后外接矩形在 x/y 方向上的最小值和最大值。
 * @throws 当前函数不主动抛错；若传入宽高为 0 或非法数字，结果会按 JavaScript 数学规则产生 `NaN` 或无穷值。
 * @remarks
 * - 该函数只处理矩形包围盒，不处理线条、自由路径或非矩形真实轮廓。
 * - 通过对角线半径和辅助角推导四个顶点坐标，再取 x/y 极值作为外接范围。
 * - 角度单位为度，内部会转换为弧度供 `Math.sin()` 和 `Math.cos()` 使用。
 */
export const getRectRotatedRange = (element: RotatedElementData) => {
  // 解构矩形位置、尺寸和角度；rotate 默认值保留为 0，兼容没有旋转的调用。
  const { left, top, width, height, rotate = 0 } = element

  // 计算矩形中心到任意顶点的距离，即对角线长度的一半。
  const radius = Math.sqrt( Math.pow(width, 2) + Math.pow(height, 2) ) / 2
  // 计算矩形对角线与水平边之间的夹角，用于定位旋转后的顶点方向。
  const auxiliaryAngle = Math.atan(height / width) * 180 / Math.PI

  // 计算左上/右下对角线方向在旋转后的弧度值。
  const tlbraRadian = (180 - rotate - auxiliaryAngle) * Math.PI / 180
  // 计算右上/左下对角线方向在旋转后的弧度值。
  const trblaRadian = (auxiliaryAngle - rotate) * Math.PI / 180

  // 计算矩形中心点 x 坐标，旋转外接范围以该中心为基准展开。
  const middleLeft = left + width / 2
  // 计算矩形中心点 y 坐标，旋转外接范围以该中心为基准展开。
  const middleTop = top + height / 2

  // 计算四个旋转后顶点的 x 坐标。
  const xAxis = [
    // 左上或右下方向顶点的 x 坐标。
    middleLeft + radius * Math.cos(tlbraRadian),
    // 右上或左下方向顶点的 x 坐标。
    middleLeft + radius * Math.cos(trblaRadian),
    // 上面第一个顶点关于中心点对称的 x 坐标。
    middleLeft - radius * Math.cos(tlbraRadian),
    // 上面第二个顶点关于中心点对称的 x 坐标。
    middleLeft - radius * Math.cos(trblaRadian),
  ]
  // 计算四个旋转后顶点的 y 坐标；画布 y 轴向下，因此这里保留原公式符号。
  const yAxis = [
    // 左上或右下方向顶点的 y 坐标。
    middleTop - radius * Math.sin(tlbraRadian),
    // 右上或左下方向顶点的 y 坐标。
    middleTop - radius * Math.sin(trblaRadian),
    // 上面第一个顶点关于中心点对称的 y 坐标。
    middleTop + radius * Math.sin(tlbraRadian),
    // 上面第二个顶点关于中心点对称的 y 坐标。
    middleTop + radius * Math.sin(trblaRadian),
  ]

  // 返回外接范围，调用方通常用于对齐、选框、组合中心和碰撞判断。
  return {
    xRange: [Math.min(...xAxis), Math.max(...xAxis)],
    yRange: [Math.min(...yAxis), Math.max(...yAxis)],
  }
}

/**
 * 计算矩形元素旋转后外接范围相对未旋转范围的偏移量。
 *
 * @param element - 元素的位置、尺寸和旋转角度信息。
 * @returns 旋转后外接范围左上角相对原始外接范围左上角的 x/y 偏移。
 * @throws 当前函数不主动抛错；非法几何数据会导致底层范围计算产生非法数值。
 * @remarks 常用于把旋转后的视觉边界与元素原始 left/top 建模方式对齐。
 */
export const getRectRotatedOffset = (element: RotatedElementData) => {
  // 先计算未旋转状态下的标准外接范围，作为偏移基准。
  const { xRange: originXRange, yRange: originYRange } = getRectRotatedRange({
    left: element.left,
    top: element.top,
    width: element.width,
    height: element.height,
    rotate: 0,
  })
  // 再计算当前旋转角度下的实际外接范围。
  const { xRange: rotatedXRange, yRange: rotatedYRange } = getRectRotatedRange({
    left: element.left,
    top: element.top,
    width: element.width,
    height: element.height,
    rotate: element.rotate,
  })
  // 用旋转后最小坐标减去原始最小坐标，得到视觉边界左上角偏移。
  return {
    offsetX: rotatedXRange[0] - originXRange[0],
    offsetY: rotatedYRange[0] - originYRange[0],
  }
}

/**
 * 计算单个 PPT 元素在画布中的外接范围。
 *
 * @param element - 需要计算范围的 PPT 元素。
 * @returns 包含最小和最大 x/y 坐标的范围对象。
 * @throws 当前函数不主动抛错；元素缺少必要几何字段时会按 JavaScript 规则产生异常或非法数值。
 * @remarks
 * - 线条元素使用起止点和元素 left/top 计算范围。
 * - 带 rotate 的矩形类元素使用旋转后的外接范围。
 * - 未旋转矩形类元素直接使用 left/top/width/height。
 */
export const getElementRange = (element: PPTElement) => {
  // 先声明范围变量，后续按元素类型分别赋值。
  let minX, maxX, minY, maxY

  // 线条元素的 start/end 是相对 element.left/top 的坐标，需要加上元素位置。
  if (element.type === 'line') {
    // 线条元素的范围左边界以元素自身 left 为基准。
    minX = element.left
    // 取起点和终点相对 x 的较大值作为右边界延伸距离。
    maxX = element.left + Math.max(element.start[0], element.end[0])
    // 线条元素的范围上边界以元素自身 top 为基准。
    minY = element.top
    // 取起点和终点相对 y 的较大值作为下边界延伸距离。
    maxY = element.top + Math.max(element.start[1], element.end[1])
  }
  // 矩形类元素若存在旋转角度，则需要使用旋转外接范围。
  else if ('rotate' in element && element.rotate) {
    // 提取矩形类元素计算旋转范围所需字段。
    const { left, top, width, height, rotate } = element
    // 计算旋转后的 x/y 外接范围。
    const { xRange, yRange } = getRectRotatedRange({ left, top, width, height, rotate })
    // 写入旋转后的水平最小坐标。
    minX = xRange[0]
    // 写入旋转后的水平最大坐标。
    maxX = xRange[1]
    // 写入旋转后的垂直最小坐标。
    minY = yRange[0]
    // 写入旋转后的垂直最大坐标。
    maxY = yRange[1]
  }
  // 未旋转矩形类元素直接使用包围盒范围。
  else {
    // 左边界即元素 left。
    minX = element.left
    // 右边界为 left + width。
    maxX = element.left + element.width
    // 上边界即元素 top。
    minY = element.top
    // 下边界为 top + height。
    maxY = element.top + element.height
  }
  // 返回统一范围结构，供选择框、对齐、吸附等逻辑复用。
  return { minX, maxX, minY, maxY }
}

/**
 * 计算一组 PPT 元素在画布中的整体外接范围。
 *
 * @param elementList - 需要合并计算的元素列表。
 * @returns 包含列表整体最小和最大 x/y 坐标的范围对象。
 * @throws 当 `elementList` 为空时，`Math.min/Math.max` 会返回无穷值，这是当前既有行为。
 * @remarks 该函数按单元素范围汇总，适合多选框、组合元素和整体对齐计算。
 */
export const getElementListRange = (elementList: PPTElement[]) => {
  // 收集所有元素左边界。
  const leftValues: number[] = []
  // 收集所有元素上边界。
  const topValues: number[] = []
  // 收集所有元素右边界。
  const rightValues: number[] = []
  // 收集所有元素下边界。
  const bottomValues: number[] = []

  // 遍历元素列表，逐个计算外接范围。
  elementList.forEach(element => {
    // 获取当前元素的范围，内部会处理线条和旋转元素。
    const { minX, maxX, minY, maxY } = getElementRange(element)
    // 记录左边界候选值。
    leftValues.push(minX)
    // 记录上边界候选值。
    topValues.push(minY)
    // 记录右边界候选值。
    rightValues.push(maxX)
    // 记录下边界候选值。
    bottomValues.push(maxY)
  })

  // 取全部左边界的最小值作为整体左边界。
  const minX = Math.min(...leftValues)
  // 取全部右边界的最大值作为整体右边界。
  const maxX = Math.max(...rightValues)
  // 取全部上边界的最小值作为整体上边界。
  const minY = Math.min(...topValues)
  // 取全部下边界的最大值作为整体下边界。
  const maxY = Math.max(...bottomValues)

  // 返回合并后的整体范围。
  return { minX, maxX, minY, maxY }
}

// 允许参与组合统一旋转的元素类型；复杂线条暂不允许，因为控制点旋转和路径重建更容易出现视觉偏差。
const ROTATABLE_GROUP_ELEMENT_TYPES = ['text', 'image', 'shape', 'line']

/**
 * 判断当前选中的元素是否都属于同一个组合。
 *
 * @param elements - 当前选中的元素列表。
 * @returns 当元素数量不少于 2 且所有元素拥有相同 groupId 时返回 `true`。
 * @throws 当前函数不主动抛错；空数组或缺少 groupId 会返回 `false`。
 * @remarks 该函数只判断“选中项是不是同一个组合”，不验证是否选中了该组合的全部成员。
 */
export const isSingleGroupSelection = (elements: PPTElement[]) => {
  // 组合至少需要两个元素；单个元素不视为组合选择。
  if (elements.length < 2) return false

  // 以第一个元素的 groupId 作为比较基准。
  const groupId = elements[0].groupId
  // 第一个元素没有 groupId 时，无法构成同组选择。
  if (!groupId) return false

  // 所有元素 groupId 都一致时，认为当前选择属于同一个组合。
  return elements.every(element => element.groupId === groupId)
}

/**
 * 判断当前组合元素是否允许执行统一旋转。
 *
 * @param elements - 组合成员列表。
 * @returns 当元素属于同一组合且类型都可旋转时返回 `true`。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 普通文字、图片、形状和直线可以统一旋转。
 * - 带折点、二次折线、曲线或三次贝塞尔控制点的线条暂不允许参与统一旋转。
 */
export const canRotateGroupElements = (elements: PPTElement[]) => {
  // 先确认元素确实来自同一个组合，否则不允许组合旋转。
  if (!isSingleGroupSelection(elements)) return false

  // 逐个检查元素类型和线条复杂度。
  return elements.every(element => {
    // 不是白名单类型时直接拒绝，避免未知类型旋转后数据不一致。
    if (!ROTATABLE_GROUP_ELEMENT_TYPES.includes(element.type)) return false
    // 复杂线条包含额外控制点，当前组合旋转逻辑不支持其稳定重建。
    if (element.type === 'line' && (element.broken || element.broken2 || element.curve || element.cubic)) return false
    // 通过全部限制时，当前元素允许参与组合旋转。
    return true
  })
}

/**
 * 计算一组元素整体范围的中心点。
 *
 * @param elements - 元素列表。
 * @param rotate - 组合整体的旋转参照角度，会先按该角度反向对齐后再计算中心点。
 * @returns 组合整体中心点坐标。
 * @throws 当元素列表为空时，底层范围计算会产生无穷值，这是当前既有行为。
 * @remarks
 * - 传入 rotate 时，会把元素点位先旋回未旋转坐标系计算外接中心，再旋回原坐标系。
 * - 该处理可让组合在已有旋转角度下继续围绕视觉中心旋转。
 */
export const getGroupElementCenter = (elements: PPTElement[], rotate = 0) => {
  // 在指定旋转参照下计算元素列表范围。
  const { minX, maxX, minY, maxY } = getElementListRangeByRotate(elements, rotate)
  // 根据范围中点得到“对齐坐标系”中的中心点。
  const alignedCenter = {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
  }

  // 没有组合旋转参照时，中心点已经在画布坐标系中。
  if (!rotate) return alignedCenter

  // 有旋转参照时，把对齐坐标系中心点绕原点旋回画布坐标系。
  return rotatePoint(alignedCenter, { x: 0, y: 0 }, rotate)
}

/**
 * 计算矩形类元素四个顶点在画布中的绝对坐标。
 *
 * @param element - 非线条 PPT 元素。
 * @returns 按左上、右上、右下、左下顺序排列的四个点。
 * @throws 当前函数不主动抛错；缺少几何字段会导致非法数值。
 * @remarks 若元素自身带 rotate，会返回旋转后的真实顶点坐标。
 */
const getRectElementPoints = (element: Exclude<PPTElement, PPTLineElement>) => {
  // 计算元素中心点，这是元素自身旋转的中心。
  const center = {
    x: element.left + element.width / 2,
    y: element.top + element.height / 2,
  }
  // 根据未旋转矩形包围盒计算四个角点。
  const points = [
    { x: center.x - element.width / 2, y: center.y - element.height / 2 },
    { x: center.x + element.width / 2, y: center.y - element.height / 2 },
    { x: center.x + element.width / 2, y: center.y + element.height / 2 },
    { x: center.x - element.width / 2, y: center.y + element.height / 2 },
  ]

  // 没有自身旋转时，未旋转角点就是最终角点。
  if (!element.rotate) return points

  // 存在自身旋转时，把四个角点分别绕元素中心旋转。
  return points.map(point => rotatePoint(point, center, element.rotate))
}

/**
 * 计算线条元素用于范围计算的绝对坐标列表。
 *
 * @param element - 线条元素。
 * @returns 起点和终点的绝对坐标列表。
 * @throws 当前函数不主动抛错。
 * @remarks 当前范围计算只使用 start/end，不把曲线控制点纳入该列表，保持既有行为。
 */
const getAbsoluteLinePointList = (element: PPTLineElement) => {
  // 将线条所有关键点从相对坐标转为绝对坐标。
  const points = getAbsoluteLinePoints(element)
  // 仅返回起点和终点，供组合范围计算使用。
  return [points.start, points.end]
}

/**
 * 按指定整体旋转参照角度对齐后，计算元素列表的范围。
 *
 * @param elements - 元素列表。
 * @param rotate - 组合整体的旋转参照角度。
 * @returns 对齐坐标系中的整体范围。
 * @throws 当元素列表为空时，返回值会包含无穷值，这是当前既有行为。
 * @remarks 该函数是组合旋转中心计算的辅助逻辑。
 */
const getElementListRangeByRotate = (elements: PPTElement[], rotate: number) => {
  // 收集所有候选点的 x 坐标。
  const xValues: number[] = []
  // 收集所有候选点的 y 坐标。
  const yValues: number[] = []

  // 遍历元素并提取可代表外接范围的点位。
  elements.forEach(element => {
    // 线条使用线条点位，矩形类元素使用四个角点。
    const points = element.type === 'line' ? getAbsoluteLinePointList(element) : getRectElementPoints(element)
    // 有组合旋转参照时，先绕原点反向旋转，使点位落到对齐坐标系中。
    const rotatedPoints = rotate ? points.map(point => rotatePoint(point, { x: 0, y: 0 }, -rotate)) : points
    // 提取全部 x 坐标用于水平范围计算。
    xValues.push(...rotatedPoints.map(point => point.x))
    // 提取全部 y 坐标用于垂直范围计算。
    yValues.push(...rotatedPoints.map(point => point.y))
  })

  // 返回对齐坐标系下的整体外接范围。
  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues),
  }
}

/**
 * 将任意角度规范到 [-180, 180] 区间内。
 *
 * @param angle - 原始角度，单位为度。
 * @returns 规范化后的角度。
 * @throws 当前函数不主动抛错；传入 `Infinity` 会导致无限循环风险，调用方应避免非法角度。
 * @remarks 该函数用于保持元素 rotate 字段不会无限增长，方便 UI 显示和后续计算。
 */
export const normalizeAngle = (angle: number) => {
  // 使用临时变量保留原入参不被直接修改。
  let result = angle
  // 大于 180 时不断减去一圈，直到进入目标区间。
  while (result > 180) result -= 360
  // 小于 -180 时不断加上一圈，直到进入目标区间。
  while (result < -180) result += 360
  // 返回规范化角度。
  return result
}

/**
 * 计算一个点绕指定中心点旋转后的坐标。
 *
 * @param point - 需要旋转的目标点。
 * @param center - 旋转中心点。
 * @param angle - 旋转角度，单位为度。
 * @returns 旋转后的点坐标。
 * @throws 当前函数不主动抛错；非法数字会让结果变为 `NaN`。
 * @remarks 使用二维旋转矩阵计算，适配画布坐标系中 y 向下的现有角度约定。
 */
export const rotatePoint = (point: Point, center: Point, angle: number): Point => {
  // 将角度从度转换为弧度，供三角函数使用。
  const radian = angle * Math.PI / 180
  // 计算目标点相对旋转中心的 x 偏移。
  const deltaX = point.x - center.x
  // 计算目标点相对旋转中心的 y 偏移。
  const deltaY = point.y - center.y

  // 套用旋转矩阵并平移回画布坐标系。
  return {
    x: center.x + deltaX * Math.cos(radian) - deltaY * Math.sin(radian),
    y: center.y + deltaX * Math.sin(radian) + deltaY * Math.cos(radian),
  }
}

/**
 * 旋转矩形类元素。
 *
 * @param element - 需要旋转的非线条元素。
 * @param center - 组合旋转中心点。
 * @param angle - 本次叠加旋转角度，单位为度。
 * @returns 更新 left/top/rotate 后的新元素对象。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 该函数不会修改原元素对象，而是返回拷贝后的新对象。
 * - 通过旋转元素中心点并叠加自身 rotate 实现组合旋转。
 */
export const rotateRectLikeElement = (element: Exclude<PPTElement, PPTLineElement>, center: Point, angle: number) => {
  // 计算当前元素中心点，它会绕组合中心旋转。
  const elementCenter = {
    x: element.left + element.width / 2,
    y: element.top + element.height / 2,
  }
  // 将元素中心点绕组合中心旋转，得到旋转后的新中心。
  const nextCenter = rotatePoint(elementCenter, center, angle)

  // 返回新元素，保留其他业务字段，只更新位置和旋转角度。
  return {
    ...element,
    left: nextCenter.x - element.width / 2,
    top: nextCenter.y - element.height / 2,
    rotate: normalizeAngle(element.rotate + angle),
  }
}

/**
 * 将线条元素的全部关键点转换为画布绝对坐标。
 *
 * @param element - 线条元素。
 * @returns 线条起点、终点和可选控制点的绝对坐标集合。
 * @throws 当前函数不主动抛错。
 * @remarks 线条内部点位是相对元素 left/top 的局部坐标，旋转时必须先转换为画布绝对坐标。
 */
const getAbsoluteLinePoints = (element: PPTLineElement): AbsoluteLinePoints => {
  // 定义局部点位到画布绝对点位的转换函数。
  const toAbsolutePoint = (point: [number, number]) => ({
    x: element.left + point[0],
    y: element.top + point[1],
  })

  // 起点和终点是线条的必备点位。
  const points: AbsoluteLinePoints = {
    start: toAbsolutePoint(element.start),
    end: toAbsolutePoint(element.end),
  }

  // 单折线中间点存在时转为绝对坐标。
  if (element.broken) points.broken = toAbsolutePoint(element.broken)
  // 双折线控制点存在时转为绝对坐标。
  if (element.broken2) points.broken2 = toAbsolutePoint(element.broken2)
  // 二次贝塞尔控制点存在时转为绝对坐标。
  if (element.curve) points.curve = toAbsolutePoint(element.curve)
  // 三次贝塞尔两个控制点存在时分别转为绝对坐标。
  if (element.cubic) {
    points.cubic = [
      toAbsolutePoint(element.cubic[0]),
      toAbsolutePoint(element.cubic[1]),
    ]
  }

  // 返回完整绝对点集合。
  return points
}

/**
 * 将线条元素的全部绝对点位绕指定中心点旋转。
 *
 * @param points - 线条绝对点位集合。
 * @param center - 旋转中心点。
 * @param angle - 旋转角度，单位为度。
 * @returns 旋转后的绝对点位集合。
 * @throws 当前函数不主动抛错。
 * @remarks 该函数只做点位旋转，不负责重新计算线条元素的 left/top。
 */
const rotateAbsoluteLinePoints = (points: AbsoluteLinePoints, center: Point, angle: number): AbsoluteLinePoints => {
  // 先旋转必备的起点和终点。
  const rotated: AbsoluteLinePoints = {
    start: rotatePoint(points.start, center, angle),
    end: rotatePoint(points.end, center, angle),
  }

  // 单折线中间点存在时同步旋转。
  if (points.broken) rotated.broken = rotatePoint(points.broken, center, angle)
  // 双折线控制点存在时同步旋转。
  if (points.broken2) rotated.broken2 = rotatePoint(points.broken2, center, angle)
  // 二次贝塞尔控制点存在时同步旋转。
  if (points.curve) rotated.curve = rotatePoint(points.curve, center, angle)
  // 三次贝塞尔两个控制点存在时同步旋转。
  if (points.cubic) {
    rotated.cubic = [
      rotatePoint(points.cubic[0], center, angle),
      rotatePoint(points.cubic[1], center, angle),
    ]
  }

  // 返回旋转后的绝对坐标集合。
  return rotated
}

/**
 * 根据旋转后的绝对点位重建线条元素。
 *
 * @param element - 原线条元素。
 * @param points - 旋转后的绝对点位集合。
 * @returns 更新 left/top 和相对点位后的线条元素。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 线条元素仍以 left/top 加相对点位建模，所以重建时会取全部关键点最小 x/y 作为新 left/top。
 * - 原来不存在的控制点会从结果中删除，避免残留旧数据影响 path 渲染。
 */
const rebuildLineElement = (element: PPTLineElement, points: AbsoluteLinePoints): PPTLineElement => {
  // 起点和终点一定参与新包围盒计算。
  const allPoints = [points.start, points.end]
  // 单折线中间点存在时纳入包围盒。
  if (points.broken) allPoints.push(points.broken)
  // 双折线控制点存在时纳入包围盒。
  if (points.broken2) allPoints.push(points.broken2)
  // 二次曲线控制点存在时纳入包围盒。
  if (points.curve) allPoints.push(points.curve)
  // 三次曲线控制点存在时两个控制点都纳入包围盒。
  if (points.cubic) allPoints.push(...points.cubic)

  // 新 left 取全部绝对点位的最小 x。
  const left = Math.min(...allPoints.map(point => point.x))
  // 新 top 取全部绝对点位的最小 y。
  const top = Math.min(...allPoints.map(point => point.y))
  // 定义绝对坐标转相对新 left/top 的局部坐标函数。
  const toRelativePoint = (point: Point): [number, number] => [point.x - left, point.y - top]

  // 创建新的线条元素，先更新必备字段和基础点位。
  const nextElement: PPTLineElement = {
    ...element,
    left,
    top,
    start: toRelativePoint(points.start),
    end: toRelativePoint(points.end),
  }

  // 存在单折线点时写入相对坐标，否则删除旧字段。
  if (points.broken) nextElement.broken = toRelativePoint(points.broken)
  else delete nextElement.broken

  // 存在双折线控制点时写入相对坐标，否则删除旧字段。
  if (points.broken2) nextElement.broken2 = toRelativePoint(points.broken2)
  else delete nextElement.broken2

  // 存在二次贝塞尔控制点时写入相对坐标，否则删除旧字段。
  if (points.curve) nextElement.curve = toRelativePoint(points.curve)
  else delete nextElement.curve

  // 存在三次贝塞尔控制点时写入两个相对坐标。
  if (points.cubic) {
    nextElement.cubic = [
      toRelativePoint(points.cubic[0]),
      toRelativePoint(points.cubic[1]),
    ]
  }
  // 不存在三次贝塞尔控制点时删除旧字段，避免路径类型误判。
  else delete nextElement.cubic

  // 返回重建后的线条元素。
  return nextElement
}

/**
 * 旋转线条元素。
 *
 * @param element - 线条元素。
 * @param center - 组合旋转中心点。
 * @param angle - 旋转角度，单位为度。
 * @returns 旋转并重建后的线条元素。
 * @throws 当前函数不主动抛错。
 * @remarks 线条旋转流程是“相对点转绝对点 -> 绝对点旋转 -> 重新计算 left/top 和相对点”。
 */
export const rotateLineElement = (element: PPTLineElement, center: Point, angle: number) => {
  // 先把线条全部关键点转成画布绝对坐标。
  const absolutePoints = getAbsoluteLinePoints(element)
  // 将绝对点位绕组合中心旋转。
  const rotatedPoints = rotateAbsoluteLinePoints(absolutePoints, center, angle)
  // 根据旋转后点位重建线条局部坐标结构。
  return rebuildLineElement(element, rotatedPoints)
}

/**
 * 计算线条元素起点到终点的直线距离。
 *
 * @param element - 线条元素。
 * @returns 起点和终点之间的欧氏距离。
 * @throws 当前函数不主动抛错。
 * @remarks 该长度不包含折线路径或曲线路径的真实弧长，只是 start 到 end 的直线距离。
 */
export const getLineElementLength = (element: PPTLineElement) => {
  // 计算终点相对起点的水平距离。
  const deltaX = element.end[0] - element.start[0]
  // 计算终点相对起点的垂直距离。
  const deltaY = element.end[1] - element.start[1]
  // 使用勾股定理计算直线距离。
  const len = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  // 返回计算得到的长度。
  return len
}

/**
 * 获取双折线元素的主方向。
 *
 * @param element - 带 `broken2` 的线条元素。
 * @returns `horizontal` 表示先按水平转折构造路径，`vertical` 表示先按垂直转折构造路径。
 * @throws 当前函数不主动抛错。
 * @remarks 如果元素已有 `broken2Direction`，优先使用显式方向；否则根据元素外接范围宽高推断。
 */
export const getBroken2LineDirection = (element: PPTLineElement) => {
  // 如果线条数据中已记录方向，直接返回，避免拖拽过程中方向被反复推断改变。
  if (element.broken2Direction) return element.broken2Direction

  // 读取线条外接范围，用宽高关系推断折线主方向。
  const { minX, maxX, minY, maxY } = getElementRange(element)
  // 范围更宽时使用水平主方向，否则使用垂直主方向。
  return maxX - minX >= maxY - minY ? 'horizontal' : 'vertical'
}

/**
 * 对齐吸附线数据。
 *
 * @property value - 吸附线在某一轴上的坐标值。
 * @property range - 吸附线可显示或参与判断的范围区间。
 * @remarks value 相同的多条线可以合并 range，以减少画布上重复线段。
 */
export interface AlignLine {
  value: number
  range: [number, number]
}

/**
 * 将一组对齐吸附线按坐标去重并合并显示范围。
 *
 * @param lines - 一组对齐吸附线信息。
 * @returns 去重后的吸附线列表。
 * @throws 当前函数不主动抛错。
 * @remarks 同位置的多条对齐吸附线只保留一条，并把 range 扩展为这些线段的最小到最大范围。
 */
export const uniqAlignLines = (lines: AlignLine[]) => {
  // 存放已经去重合并后的吸附线。
  const uniqLines: AlignLine[] = []
  // 遍历原始吸附线列表。
  lines.forEach(line => {
    // 查找是否已存在同 value 的吸附线。
    const index = uniqLines.findIndex(_line => _line.value === line.value)
    // 没有同位置吸附线时，直接加入结果。
    if (index === -1) uniqLines.push(line)
    // 已存在同位置吸附线时，合并两条线的显示范围。
    else {
      // 读取已有吸附线。
      const uniqLine = uniqLines[index]
      // 合并范围左端点，取两条线的最小值。
      const rangeMin = Math.min(uniqLine.range[0], line.range[0])
      // 合并范围右端点，取两条线的最大值。
      const rangeMax = Math.max(uniqLine.range[1], line.range[1])
      // 构造新的范围元组。
      const range: [number, number] = [rangeMin, rangeMax]
      // 构造替换后的吸附线对象。
      const _line = { value: line.value, range }
      // 用合并后的线替换原位置。
      uniqLines[index] = _line
    }
  })
  // 返回去重合并后的吸附线列表。
  return uniqLines
}

/**
 * 以页面列表为基础，为每一个页面生成新 ID，并建立旧 ID 到新 ID 的映射。
 *
 * @param slides - 页面列表。
 * @returns 页面旧 ID 到新 ID 的映射字典。
 * @throws `nanoid()` 生成 ID 失败时异常会向上抛出。
 * @remarks 主要用于复制页面时维持动画、链接、跳转等数据里页面 ID 的原有关联关系。
 */
export const createSlideIdMap = (slides: Slide[]) => {
  // 初始化页面 ID 映射表。
  const slideIdMap: IdMap = {}
  // 遍历每一页幻灯片。
  for (const slide of slides) {
    // 为当前旧页面 ID 生成一个新的 10 位 ID。
    slideIdMap[slide.id] = nanoid(10)
  }
  // 返回完整映射，供深拷贝或引用替换逻辑使用。
  return slideIdMap
}

/**
 * 以元素列表为基础，为元素 ID 和组合 ID 分别生成新 ID 映射。
 *
 * @param elements - 元素列表数据。
 * @returns 包含 `groupIdMap` 和 `elIdMap` 的映射对象。
 * @throws `nanoid()` 生成 ID 失败时异常会向上抛出。
 * @remarks
 * - 主要用于复制元素时维持元素间引用关系。
 * - 例如原本两个元素拥有相同 groupId，复制后它们仍会共享另一个新的 groupId。
 */
export const createElementIdMap = (elements: PPTElement[]) => {
  // 组合 ID 映射表，同一个旧 groupId 只生成一个新 groupId。
  const groupIdMap: IdMap = {}
  // 元素 ID 映射表，每个元素独立生成新 ID。
  const elIdMap: IdMap = {}
  // 遍历待复制元素列表。
  for (const element of elements) {
    // 读取当前元素所属组合 ID。
    const groupId = element.groupId
    // 如果存在 groupId 且尚未生成映射，则生成新的组合 ID。
    if (groupId && !groupIdMap[groupId]) {
      groupIdMap[groupId] = nanoid(10)
    }
    // 为每个元素自身 ID 生成新的元素 ID。
    elIdMap[element.id] = nanoid(10)
  }
  // 返回组合 ID 和元素 ID 两类映射。
  return {
    groupIdMap,
    elIdMap,
  }
}

/**
 * 根据表格主题色生成两个透明度较低的子主题色。
 *
 * @param themeColor - 表格主题色，支持 tinycolor 可识别的颜色格式。
 * @returns 两个 rgba 字符串，分别使用 0.3 和 0.1 透明度。
 * @throws tinycolor 一般不会对非法颜色抛错，但非法输入可能得到不可预期颜色结果。
 * @remarks 表格样式可使用这些子颜色作为表头、斑马纹或辅助背景色。
 */
export const getTableSubThemeColor = (themeColor: string) => {
  // 使用 tinycolor 解析主题色，便于统一设置透明度并输出 rgba 字符串。
  const rgba = tinycolor(themeColor)
  // 返回两个层级的半透明主题色。
  return [
    rgba.setAlpha(0.3).toRgbString(),
    rgba.setAlpha(0.1).toRgbString(),
  ]
}

/**
 * 获取线条元素的 SVG path 字符串。
 *
 * @param element - 线条元素。
 * @returns 可写入 SVG `path.d` 属性的路径字符串。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 该函数使用线条原始 start/end，不做端点 marker 内缩。
 * - 实际渲染可使用 `getLineElementRenderPath()` 以避免箭头或圆点 marker 覆盖线身。
 */
export const getLineElementPath = (element: PPTLineElement) => {
  // 将起点坐标转成 SVG path 可用的 `x,y` 字符串。
  const start = element.start.join(',')
  // 将终点坐标转成 SVG path 可用的 `x,y` 字符串。
  const end = element.end.join(',')
  // 单折线路径：起点 -> 中间折点 -> 终点。
  if (element.broken) {
    // 将中间折点转成字符串。
    const mid = element.broken.join(',')
    // 返回单折线 path。
    return `M${start} L${mid} L${end}`
  }
  // 双折线路径：根据主方向构造两个正交转折点。
  else if (element.broken2) {
    // 读取或推断双折线主方向。
    const direction = getBroken2LineDirection(element)
    // 水平方向先使用 broken2.x，再连接到终点 y。
    if (direction === 'horizontal') return `M${start} L${element.broken2[0]},${element.start[1]} L${element.broken2[0]},${element.end[1]} ${end}`
    // 垂直方向先使用 broken2.y，再连接到终点 x。
    return `M${start} L${element.start[0]},${element.broken2[1]} L${element.end[0]},${element.broken2[1]} ${end}`
  }
  // 二次贝塞尔曲线路径。
  else if (element.curve) {
    // 将二次曲线控制点转成字符串。
    const mid = element.curve.join(',')
    // 返回 Q 命令路径。
    return `M${start} Q${mid} ${end}`
  }
  // 三次贝塞尔曲线路径。
  else if (element.cubic) {
    // 读取两个三次贝塞尔控制点。
    const [c1, c2] = element.cubic
    // 将第一个控制点转成字符串。
    const p1 = c1.join(',')
    // 将第二个控制点转成字符串。
    const p2 = c2.join(',')
    // 返回 C 命令路径。
    return `M${start} C${p1} ${p2} ${end}`
  }
  // 默认直线路径：起点 -> 终点。
  return `M${start} L${end}`
}

/**
 * 根据线条端点类型和线宽，计算渲染时线身需要向内收缩的距离。
 *
 * @param point - 线条端点类型，例如箭头、圆点或无端点。
 * @param width - 线条宽度。
 * @returns 线身端点向内收缩的距离。
 * @throws 当前函数不主动抛错。
 * @remarks 内缩用于避免可见线身穿过 marker 中心，使箭头和圆点端点视觉更自然。
 */
const getLinePointRetractionOffset = (point: LinePoint, width: number) => {
  // 使用最小视觉尺寸 2，避免极细线条端点 marker 过小导致内缩不足。
  const size = width < 2 ? 2 : width
  // 箭头 marker 需要完整线宽级别的内缩。
  if (point === 'arrow') return size
  // 圆点 marker 只需要半径级别内缩。
  if (point === 'dot') return size / 2
  // 其他端点类型不需要内缩。
  return 0
}

/**
 * 计算两个线条点位之间的欧氏距离。
 *
 * @param p1 - 第一个点。
 * @param p2 - 第二个点。
 * @returns 两点之间的直线距离。
 * @throws 当前函数不主动抛错。
 * @remarks 点位使用线条局部坐标 `[x, y]`。
 */
const getLinePointDistance = (p1: [number, number], p2: [number, number]) => {
  // 计算两点水平差值。
  const deltaX = p2[0] - p1[0]
  // 计算两点垂直差值。
  const deltaY = p2[1] - p1[1]
  // 使用勾股定理返回距离。
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

/**
 * 按指定偏移距离，将线条点位沿目标点方向平移。
 *
 * @param point - 当前点。
 * @param target - 目标点。
 * @param offset - 沿当前点到目标点方向移动的距离。
 * @returns 平移后的点位。
 * @throws 当前函数不主动抛错。
 * @remarks 当当前点与目标点重合时直接返回原点，避免除以 0。
 */
const getLinePointByOffset = (
  point: [number, number],
  target: [number, number],
  offset: number,
) => {
  // 计算当前点到目标点的距离。
  const distance = getLinePointDistance(point, target)
  // 距离为 0 时没有明确方向，按既有逻辑直接返回原点。
  if (!distance) return point

  // 计算偏移距离占整段距离的比例。
  const ratio = offset / distance
  // 按比例在线段方向上插值出新点。
  return [
    point[0] + (target[0] - point[0]) * ratio,
    point[1] + (target[1] - point[1]) * ratio,
  ] as [number, number]
}

/**
 * 获取线条起点和终点相邻的路径控制点。
 *
 * @param element - 线条元素。
 * @returns 与路径起点和终点相邻的控制点列表。
 * @throws 当前函数不主动抛错。
 * @remarks 这些点用于判断端点 marker 内缩方向，保证线身沿真实路径方向缩短。
 */
const getLinePathTurningPoints = (element: PPTLineElement) => {
  // 单折线只有一个中间折点，起点和终点都朝该折点内缩。
  if (element.broken) return [element.broken]

  // 双折线需要根据主方向构造两个真实转折点。
  if (element.broken2) {
    // 读取或推断双折线主方向。
    const direction = getBroken2LineDirection(element)
    // 水平主方向下，两个转折点共享 broken2.x。
    if (direction === 'horizontal') {
      return [
        [element.broken2[0], element.start[1]],
        [element.broken2[0], element.end[1]],
      ] as [number, number][]
    }
    // 垂直主方向下，两个转折点共享 broken2.y。
    return [
      [element.start[0], element.broken2[1]],
      [element.end[0], element.broken2[1]],
    ] as [number, number][]
  }

  // 二次贝塞尔曲线使用唯一控制点作为内缩方向参考。
  if (element.curve) return [element.curve]
  // 三次贝塞尔曲线使用第一个控制点参考起点、第二个控制点参考终点。
  if (element.cubic) return [element.cubic[0], element.cubic[1]]
  // 直线没有额外转折点，调用方会退回使用另一端点。
  return []
}

/**
 * 获取线条元素用于实际渲染的 SVG path 字符串。
 *
 * @param element - 线条元素。
 * @returns 可写入 SVG `path.d` 属性的渲染路径字符串。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 该函数保持 marker 仍对齐原始 start/end，只把可见线身在两端按需向内收缩。
 * - 内缩可以避免箭头、圆点端点被线身穿透或重叠过重。
 */
export const getLineElementRenderPath = (element: PPTLineElement) => {
  // 获取路径起点和终点相邻的控制点，用于计算内缩方向。
  const turningPoints = getLinePathTurningPoints(element)

  // 起点默认使用原始 start；后续根据端点 marker 类型可能向内收缩。
  let start = element.start
  // 终点默认使用原始 end；后续根据端点 marker 类型可能向内收缩。
  let end = element.end

  // 根据起点 marker 类型和线宽计算起点内缩距离。
  const startOffset = getLinePointRetractionOffset(element.points[0], element.width)
  // 根据终点 marker 类型和线宽计算终点内缩距离。
  const endOffset = getLinePointRetractionOffset(element.points[1], element.width)

  // 起点需要内缩时，沿路径第一段方向移动。
  if (startOffset) {
    // 获取起点下一控制点；直线没有控制点时使用终点作为方向。
    const nextPoint = turningPoints[0] || element.end
    // 内缩距离不能超过第一段的一半，避免短线两端收缩后交叉。
    const offset = Math.min(startOffset, getLinePointDistance(element.start, nextPoint) / 2)
    // 计算内缩后的起点。
    start = getLinePointByOffset(element.start, nextPoint, offset)
  }

  // 终点需要内缩时，沿路径最后一段反方向移动。
  if (endOffset) {
    // 获取终点前一控制点；直线没有控制点时使用起点作为方向。
    const prevPoint = turningPoints[turningPoints.length - 1] || element.start
    // 内缩距离不能超过最后一段的一半，避免短线两端收缩后交叉。
    const offset = Math.min(endOffset, getLinePointDistance(prevPoint, element.end) / 2)
    // 计算内缩后的终点。
    end = getLinePointByOffset(element.end, prevPoint, offset)
  }

  // 将渲染起点转成 SVG path 字符串。
  const startPoint = start.join(',')
  // 将渲染终点转成 SVG path 字符串。
  const endPoint = end.join(',')
  // 单折线渲染路径：内缩起点 -> 中间折点 -> 内缩终点。
  if (element.broken) {
    // 中间折点不内缩，保持原路径形态。
    const mid = element.broken.join(',')
    // 返回单折线路径。
    return `M${startPoint} L${mid} L${endPoint}`
  }
  // 双折线渲染路径：根据主方向构造两个正交转折点。
  else if (element.broken2) {
    // 读取或推断双折线主方向。
    const direction = getBroken2LineDirection(element)
    // 水平主方向下，路径先移动到 broken2.x，再转向终点 y。
    if (direction === 'horizontal') return `M${startPoint} L${element.broken2[0]},${element.start[1]} L${element.broken2[0]},${element.end[1]} ${endPoint}`
    // 垂直主方向下，路径先移动到 broken2.y，再转向终点 x。
    return `M${startPoint} L${element.start[0]},${element.broken2[1]} L${element.end[0]},${element.broken2[1]} ${endPoint}`
  }
  // 二次贝塞尔曲线渲染路径。
  else if (element.curve) {
    // 控制点保持不变，只替换内缩后的起终点。
    const mid = element.curve.join(',')
    // 返回 Q 命令路径。
    return `M${startPoint} Q${mid} ${endPoint}`
  }
  // 三次贝塞尔曲线渲染路径。
  else if (element.cubic) {
    // 读取两个三次贝塞尔控制点。
    const [c1, c2] = element.cubic
    // 第一个控制点保持原始坐标。
    const p1 = c1.join(',')
    // 第二个控制点保持原始坐标。
    const p2 = c2.join(',')
    // 返回 C 命令路径。
    return `M${startPoint} C${p1} ${p2} ${endPoint}`
  }
  // 默认直线路径：内缩起点 -> 内缩终点。
  return `M${startPoint} L${endPoint}`
}

/**
 * 判断一个 DOM 元素是否完全位于父容器的垂直可视范围内。
 *
 * @param element - 待判断的 DOM 元素。
 * @param parent - 作为可视范围参照的父容器元素。
 * @returns 当元素顶部不高于父容器顶部且底部不低于父容器底部时返回 `true`。
 * @throws 当传入元素不是有效 HTMLElement 或浏览器不支持布局 API 时，会产生运行时异常。
 * @remarks
 * - 当前只判断垂直方向，不判断水平方向。
 * - `getBoundingClientRect()` 返回的是视口坐标，因此适合判断滚动容器中的可见状态。
 */
export const isElementInViewport = (element: HTMLElement, parent: HTMLElement): boolean => {
  // 获取目标元素在浏览器视口中的矩形范围。
  const elementRect = element.getBoundingClientRect()
  // 获取父容器在浏览器视口中的矩形范围。
  const parentRect = parent.getBoundingClientRect()

  // 只有目标元素上下边界都落在父容器上下边界内时，才认为完全可见。
  return (
    elementRect.top >= parentRect.top &&
    elementRect.bottom <= parentRect.bottom
  )
}
