import tinycolor from 'tinycolor2'
import { nanoid } from 'nanoid'
import type { LineBinding, LineConnectionAnchor, LinePoint, PPTElement, PPTLineElement, PPTShapeElement, Slide } from '@/types/slides'

interface RotatedElementData {
  left: number
  top: number
  width: number
  height: number
  rotate: number
}

interface Point {
  x: number
  y: number
}

export interface LineConnectionPoint extends Point {
  binding: LineBinding
}

interface AbsoluteLinePoints {
  start: Point
  end: Point
  broken?: Point
  broken2?: Point
  curve?: Point
  cubic?: [Point, Point]
}

interface IdMap {
  [id: string]: string
}

/**
 * 计算元素在画布中的矩形范围旋转后的新位置范围
 * @param element 元素的位置大小和旋转角度信息
 */
export const getRectRotatedRange = (element: RotatedElementData) => {
  const { left, top, width, height, rotate = 0 } = element

  const radius = Math.sqrt( Math.pow(width, 2) + Math.pow(height, 2) ) / 2
  const auxiliaryAngle = Math.atan(height / width) * 180 / Math.PI

  const tlbraRadian = (180 - rotate - auxiliaryAngle) * Math.PI / 180
  const trblaRadian = (auxiliaryAngle - rotate) * Math.PI / 180

  const middleLeft = left + width / 2
  const middleTop = top + height / 2

  const xAxis = [
    middleLeft + radius * Math.cos(tlbraRadian),
    middleLeft + radius * Math.cos(trblaRadian),
    middleLeft - radius * Math.cos(tlbraRadian),
    middleLeft - radius * Math.cos(trblaRadian),
  ]
  const yAxis = [
    middleTop - radius * Math.sin(tlbraRadian),
    middleTop - radius * Math.sin(trblaRadian),
    middleTop + radius * Math.sin(tlbraRadian),
    middleTop + radius * Math.sin(trblaRadian),
  ]

  return {
    xRange: [Math.min(...xAxis), Math.max(...xAxis)],
    yRange: [Math.min(...yAxis), Math.max(...yAxis)],
  }
}

/**
 * 计算元素在画布中的矩形范围旋转后的新位置与旋转之前位置的偏离距离
 * @param element 元素的位置大小和旋转角度信息
 */
export const getRectRotatedOffset = (element: RotatedElementData) => {
  const { xRange: originXRange, yRange: originYRange } = getRectRotatedRange({
    left: element.left,
    top: element.top,
    width: element.width,
    height: element.height,
    rotate: 0,
  })
  const { xRange: rotatedXRange, yRange: rotatedYRange } = getRectRotatedRange({
    left: element.left,
    top: element.top,
    width: element.width,
    height: element.height,
    rotate: element.rotate,
  })
  return {
    offsetX: rotatedXRange[0] - originXRange[0],
    offsetY: rotatedYRange[0] - originYRange[0],
  }
}

/**
 * 计算元素在画布中的位置范围
 * @param element 元素信息
 */
export const getElementRange = (element: PPTElement) => {
  let minX, maxX, minY, maxY

  if (element.type === 'line') {
    minX = element.left
    maxX = element.left + Math.max(element.start[0], element.end[0])
    minY = element.top
    maxY = element.top + Math.max(element.start[1], element.end[1])
  }
  else if ('rotate' in element && element.rotate) {
    const { left, top, width, height, rotate } = element
    const { xRange, yRange } = getRectRotatedRange({ left, top, width, height, rotate })
    minX = xRange[0]
    maxX = xRange[1]
    minY = yRange[0]
    maxY = yRange[1]
  }
  else {
    minX = element.left
    maxX = element.left + element.width
    minY = element.top
    maxY = element.top + element.height
  }
  return { minX, maxX, minY, maxY }
}

/**
 * 计算一组元素在画布中的位置范围
 * @param elementList 一组元素信息
 */
export const getElementListRange = (elementList: PPTElement[]) => {
  const leftValues: number[] = []
  const topValues: number[] = []
  const rightValues: number[] = []
  const bottomValues: number[] = []

  elementList.forEach(element => {
    const { minX, maxX, minY, maxY } = getElementRange(element)
    leftValues.push(minX)
    topValues.push(minY)
    rightValues.push(maxX)
    bottomValues.push(maxY)
  })

  const minX = Math.min(...leftValues)
  const maxX = Math.max(...rightValues)
  const minY = Math.min(...topValues)
  const maxY = Math.max(...bottomValues)

  return { minX, maxX, minY, maxY }
}

const ROTATABLE_GROUP_ELEMENT_TYPES = ['text', 'image', 'shape', 'line']

/**
 * 判断当前选中的元素是否为同一个组合的完整成员
 * @param elements 选中的元素列表
 */
export const isSingleGroupSelection = (elements: PPTElement[]) => {
  if (elements.length < 2) return false

  const groupId = elements[0].groupId
  if (!groupId) return false

  return elements.every(element => element.groupId === groupId)
}

/**
 * 判断当前组合是否允许执行统一旋转
 * @param elements 组合成员列表
 */
export const canRotateGroupElements = (elements: PPTElement[]) => {
  if (!isSingleGroupSelection(elements)) return false

  return elements.every(element => {
    if (!ROTATABLE_GROUP_ELEMENT_TYPES.includes(element.type)) return false
    if (element.type === 'line' && (element.broken || element.broken2 || element.curve || element.cubic)) return false
    return true
  })
}

/**
 * 计算一组元素整体范围的中心点
 * @param elements 元素列表
 * @param rotate 组合整体的旋转参照角度，会先按该角度对齐后再计算中心点
 */
export const getGroupElementCenter = (elements: PPTElement[], rotate = 0) => {
  const { minX, maxX, minY, maxY } = getElementListRangeByRotate(elements, rotate)
  const alignedCenter = {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
  }

  if (!rotate) return alignedCenter

  return rotatePoint(alignedCenter, { x: 0, y: 0 }, rotate)
}

/**
 * 计算矩形类元素四个顶点在画布中的绝对坐标
 * @param element 矩形类元素
 */
const getRectElementPoints = (element: Exclude<PPTElement, PPTLineElement>) => {
  const center = {
    x: element.left + element.width / 2,
    y: element.top + element.height / 2,
  }
  const points = [
    { x: center.x - element.width / 2, y: center.y - element.height / 2 },
    { x: center.x + element.width / 2, y: center.y - element.height / 2 },
    { x: center.x + element.width / 2, y: center.y + element.height / 2 },
    { x: center.x - element.width / 2, y: center.y + element.height / 2 },
  ]

  if (!element.rotate) return points

  return points.map(point => rotatePoint(point, center, element.rotate))
}

/**
 * 计算线条元素用于范围计算的绝对坐标列表
 * @param element 线条元素
 */
const getAbsoluteLinePointList = (element: PPTLineElement) => {
  const points = getAbsoluteLinePoints(element)
  return [points.start, points.end]
}

/**
 * 按指定整体旋转参照角度对齐后，计算元素列表的范围
 * @param elements 元素列表
 * @param rotate 组合整体的旋转参照角度
 */
const getElementListRangeByRotate = (elements: PPTElement[], rotate: number) => {
  const xValues: number[] = []
  const yValues: number[] = []

  elements.forEach(element => {
    const points = element.type === 'line' ? getAbsoluteLinePointList(element) : getRectElementPoints(element)
    const rotatedPoints = rotate ? points.map(point => rotatePoint(point, { x: 0, y: 0 }, -rotate)) : points
    xValues.push(...rotatedPoints.map(point => point.x))
    yValues.push(...rotatedPoints.map(point => point.y))
  })

  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues),
  }
}

/**
 * 将角度规范到 [-180, 180] 区间内
 * @param angle 原始角度
 */
export const normalizeAngle = (angle: number) => {
  let result = angle
  while (result > 180) result -= 360
  while (result < -180) result += 360
  return result
}

/**
 * 计算一个点绕指定中心点旋转后的坐标
 * @param point 目标点
 * @param center 旋转中心点
 * @param angle 旋转角度
 */
export const rotatePoint = (point: Point, center: Point, angle: number): Point => {
  const radian = angle * Math.PI / 180
  const deltaX = point.x - center.x
  const deltaY = point.y - center.y

  return {
    x: center.x + deltaX * Math.cos(radian) - deltaY * Math.sin(radian),
    y: center.y + deltaX * Math.sin(radian) + deltaY * Math.cos(radian),
  }
}

/**
 * 旋转矩形类元素：通过旋转元素中心点并叠加自身旋转角度实现
 * @param element 元素
 * @param center 组合旋转中心点
 * @param angle 旋转角度
 */
export const rotateRectLikeElement = (element: Exclude<PPTElement, PPTLineElement>, center: Point, angle: number) => {
  const elementCenter = {
    x: element.left + element.width / 2,
    y: element.top + element.height / 2,
  }
  const nextCenter = rotatePoint(elementCenter, center, angle)

  return {
    ...element,
    left: nextCenter.x - element.width / 2,
    top: nextCenter.y - element.height / 2,
    rotate: normalizeAngle(element.rotate + angle),
  }
}

/**
 * 将线条元素的点位转换为画布中的绝对坐标
 * @param element 线条元素
 */
const getAbsoluteLinePoints = (element: PPTLineElement): AbsoluteLinePoints => {
  const toAbsolutePoint = (point: [number, number]) => ({
    x: element.left + point[0],
    y: element.top + point[1],
  })

  const points: AbsoluteLinePoints = {
    start: toAbsolutePoint(element.start),
    end: toAbsolutePoint(element.end),
  }

  if (element.broken) points.broken = toAbsolutePoint(element.broken)
  if (element.broken2) points.broken2 = toAbsolutePoint(element.broken2)
  if (element.curve) points.curve = toAbsolutePoint(element.curve)
  if (element.cubic) {
    points.cubic = [
      toAbsolutePoint(element.cubic[0]),
      toAbsolutePoint(element.cubic[1]),
    ]
  }

  return points
}

/**
 * 将线条元素的全部绝对点位绕指定中心点旋转
 * @param points 线条绝对点位
 * @param center 组合旋转中心点
 * @param angle 旋转角度
 */
const rotateAbsoluteLinePoints = (points: AbsoluteLinePoints, center: Point, angle: number): AbsoluteLinePoints => {
  const rotated: AbsoluteLinePoints = {
    start: rotatePoint(points.start, center, angle),
    end: rotatePoint(points.end, center, angle),
  }

  if (points.broken) rotated.broken = rotatePoint(points.broken, center, angle)
  if (points.broken2) rotated.broken2 = rotatePoint(points.broken2, center, angle)
  if (points.curve) rotated.curve = rotatePoint(points.curve, center, angle)
  if (points.cubic) {
    rotated.cubic = [
      rotatePoint(points.cubic[0], center, angle),
      rotatePoint(points.cubic[1], center, angle),
    ]
  }

  return rotated
}

/**
 * 根据旋转后的绝对点位重建线条元素
 * @param element 原线条元素
 * @param points 旋转后的绝对点位
 */
const rebuildLineElement = (element: PPTLineElement, points: AbsoluteLinePoints): PPTLineElement => {
  // 与创建、端点编辑和范围计算一致，原点只取两个端点的最小坐标。
  const left = Math.min(points.start.x, points.end.x)
  const top = Math.min(points.start.y, points.end.y)
  const toRelativePoint = (point: Point): [number, number] => [point.x - left, point.y - top]

  const nextElement: PPTLineElement = {
    ...element,
    left,
    top,
    start: toRelativePoint(points.start),
    end: toRelativePoint(points.end),
  }

  if (points.broken) nextElement.broken = toRelativePoint(points.broken)
  else delete nextElement.broken

  if (points.broken2) nextElement.broken2 = toRelativePoint(points.broken2)
  else delete nextElement.broken2

  if (points.curve) nextElement.curve = toRelativePoint(points.curve)
  else delete nextElement.curve

  if (points.cubic) {
    nextElement.cubic = [
      toRelativePoint(points.cubic[0]),
      toRelativePoint(points.cubic[1]),
    ]
  }
  else delete nextElement.cubic

  return nextElement
}

/**
 * 旋转线条元素：将全部控制点旋转后重建线条数据
 * @param element 线条元素
 * @param center 组合旋转中心点
 * @param angle 旋转角度
 */
export const rotateLineElement = (element: PPTLineElement, center: Point, angle: number) => {
  const absolutePoints = getAbsoluteLinePoints(element)
  const rotatedPoints = rotateAbsoluteLinePoints(absolutePoints, center, angle)
  return rebuildLineElement(element, rotatedPoints)
}

export const getLineElementLength = (element: PPTLineElement) => {
  const deltaX = element.end[0] - element.start[0]
  const deltaY = element.end[1] - element.start[1]
  const len = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  return len
}

export const hasLineConnectionChanges = (element: PPTElement, propNames: string[]) => {
  if (propNames.includes('id') || propNames.includes('type')) return true
  if (element.type === 'shape') {
    return ['left', 'top', 'width', 'height', 'rotate'].some(prop => propNames.includes(prop))
  }
  if (element.type === 'line') {
    return ['left', 'top', 'start', 'end', 'startBinding', 'endBinding'].some(prop => propNames.includes(prop))
  }
  return false
}

export const isSameLineConnection = (element: PPTLineElement, target: PPTLineElement) => {
  for (const key of ['start', 'end'] as const) {
    if (Math.abs(element.left + element[key][0] - target.left - target[key][0]) > 1e-8 ||
      Math.abs(element.top + element[key][1] - target.top - target[key][1]) > 1e-8) return false
  }
  for (const key of ['startBinding', 'endBinding'] as const) {
    if (element[key]?.elementId !== target[key]?.elementId || element[key]?.anchor !== target[key]?.anchor) return false
  }
  return true
}

export const getBroken2LineDirection = (element: PPTLineElement) => {
  if (element.broken2Direction) return element.broken2Direction

  const { minX, maxX, minY, maxY } = getElementRange(element)
  return maxX - minX >= maxY - minY ? 'horizontal' : 'vertical'
}

const anchors: LineConnectionAnchor[] = ['top', 'right', 'bottom', 'left']

// 锚点位于形状自身外框的四边中点，跟随外框旋转，不受内部图形翻转影响。
export const getShapeConnectionPoint = (element: PPTShapeElement, anchor: LineConnectionAnchor): Point => {
  const center = { x: element.left + element.width / 2, y: element.top + element.height / 2 }
  let point = center
  if (anchor === 'top') point = { x: center.x, y: element.top }
  else if (anchor === 'right') point = { x: element.left + element.width, y: center.y }
  else if (anchor === 'bottom') point = { x: center.x, y: element.top + element.height }
  else if (anchor === 'left') point = { x: element.left, y: center.y }
  return element.rotate ? rotatePoint(point, center, element.rotate) : point
}

export const getLineConnectionPoints = (elements: PPTElement[], hiddenElementIds: string[] = []) => {
  const points: LineConnectionPoint[] = []
  const hiddenIds = new Set(hiddenElementIds)
  // 上层形状的锚点排在前面，查询距离相同时优先匹配。
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i]
    if (element.type !== 'shape' || hiddenIds.has(element.id)) continue
    for (const anchor of anchors) {
      const target = getShapeConnectionPoint(element, anchor)
      points.push({ ...target, binding: { elementId: element.id, anchor } })
    }
  }
  return points
}

export const findLineConnectionPoint = (
  points: LineConnectionPoint[], point: Point, range: number, direction?: 'horizontal' | 'vertical',
): LineConnectionPoint | undefined => {
  let nearest: LineConnectionPoint | undefined
  let distance = range * range
  for (const target of points) {
    if (direction === 'horizontal' && Math.abs(target.y - point.y) > 1e-8) continue
    if (direction === 'vertical' && Math.abs(target.x - point.x) > 1e-8) continue
    const value = (target.x - point.x) ** 2 + (target.y - point.y) ** 2
    if (value >= distance) continue
    distance = value
    nearest = target
  }
  return nearest
}

// 一次处理整个批次，先读取所有形状的最终几何，避免多选移动时重复偏移。
export const resolveLineConnections = (elements: PPTElement[]): PPTElement[] => {
  if (!elements.some(el => el.type === 'line' && (el.startBinding || el.endBinding))) return elements
  const shapeMap = new Map<string, PPTShapeElement>()
  for (const element of elements) {
    if (element.type === 'shape') shapeMap.set(element.id, element)
  }

  const getTarget = (binding?: LineBinding) => {
    if (!binding || !anchors.includes(binding.anchor)) return undefined
    const shape = shapeMap.get(binding.elementId)
    if (!shape) return undefined
    const point = getShapeConnectionPoint(shape, binding.anchor)
    return Number.isFinite(point.x) && Number.isFinite(point.y) ? point : undefined
  }

  let changed = false
  const result = elements.map(element => {
    if (element.type !== 'line' || (!element.startBinding && !element.endBinding)) return element
    const start = getTarget(element.startBinding)
    const end = getTarget(element.endBinding)
    const points = getAbsoluteLinePoints(element)
    const delta = (target: Point | undefined, origin: Point) => ({
      x: target && Math.abs(target.x - origin.x) > 1e-8 ? target.x - origin.x : 0,
      y: target && Math.abs(target.y - origin.y) > 1e-8 ? target.y - origin.y : 0,
    })
    const startMove = delta(start, points.start)
    const endMove = delta(end, points.end)
    const moved = startMove.x || startMove.y || endMove.x || endMove.y
    const invalid = (element.startBinding && !start) || (element.endBinding && !end)
    if (!moved && !invalid) return element

    changed = true
    const line = { ...element }
    if (!start) delete line.startBinding
    if (!end) delete line.endBinding
    if (!moved) return line

    if (start) points.start = start
    if (end) points.end = end
    const movePoint = (point: Point, movement: Point) => ({ x: point.x + movement.x, y: point.y + movement.y })
    const middleMove = { x: (startMove.x + endMove.x) / 2, y: (startMove.y + endMove.y) / 2 }
    if (points.broken) points.broken = movePoint(points.broken, middleMove)
    if (points.broken2) points.broken2 = movePoint(points.broken2, middleMove)
    if (points.curve) points.curve = movePoint(points.curve, middleMove)
    if (points.cubic) points.cubic = [movePoint(points.cubic[0], startMove), movePoint(points.cubic[1], endMove)]
    return rebuildLineElement(line, points)
  })
  return changed ? result : elements
}

// 主动移动线条时，仅保留连接到本批次一起变换的形状的绑定。
const detachLineConnections = (element: PPTElement, movingElementIds: ReadonlySet<string>): PPTElement => {
  if (element.type !== 'line') return element
  const detachStart = element.startBinding && !movingElementIds.has(element.startBinding.elementId)
  const detachEnd = element.endBinding && !movingElementIds.has(element.endBinding.elementId)
  if (!detachStart && !detachEnd) return element
  const line = { ...element }
  if (detachStart) delete line.startBinding
  if (detachEnd) delete line.endBinding
  return line
}

// 仅用于主动平移/旋转整条线的操作，控制点和端点编辑不调用此函数。
export const detachMovedLineConnections = (elements: PPTElement[], previousElements: PPTElement[]): PPTElement[] => {
  if (!elements.some(el => el.type === 'line' && (el.startBinding || el.endBinding))) return elements
  const previousMap = new Map(previousElements.map(el => [el.id, el]))
  const movingIds = new Set<string>()
  for (const element of elements) {
    const previous = previousMap.get(element.id)
    if (element.type !== 'shape' || previous?.type !== 'shape') continue
    if (element.left !== previous.left || element.top !== previous.top || element.width !== previous.width ||
      element.height !== previous.height || element.rotate !== previous.rotate) movingIds.add(element.id)
  }
  return elements.map(element => {
    const previous = previousMap.get(element.id)
    if (element.type !== 'line' || previous?.type !== 'line') return element
    const moved = element.left !== previous.left || element.top !== previous.top ||
      element.start.some((value, index) => value !== previous.start[index]) ||
      element.end.some((value, index) => value !== previous.end[index])
    return moved ? detachLineConnections(element, movingIds) : element
  })
}

// 与现有复制流程一致，只修改传入的副本；未一起复制的目标不再绑定。
export const remapLineConnections = (element: PPTElement, elementIdMap: Record<string, string>) => {
  if (element.type !== 'line') return
  for (const key of ['startBinding', 'endBinding'] as const) {
    const binding = element[key]
    if (!binding) continue
    const elementId = elementIdMap[binding.elementId]
    if (elementId) element[key] = { ...binding, elementId }
    else delete element[key]
  }
}

export interface AlignLine {
  value: number
  range: [number, number]
}

/**
 * 将一组对齐吸附线进行去重：同位置的的多条对齐吸附线仅留下一条，取该位置所有对齐吸附线的最大值和最小值为新的范围
 * @param lines 一组对齐吸附线信息
 */
export const uniqAlignLines = (lines: AlignLine[]) => {
  const uniqLines: AlignLine[] = []
  lines.forEach(line => {
    const index = uniqLines.findIndex(_line => _line.value === line.value)
    if (index === -1) uniqLines.push(line)
    else {
      const uniqLine = uniqLines[index]
      const rangeMin = Math.min(uniqLine.range[0], line.range[0])
      const rangeMax = Math.max(uniqLine.range[1], line.range[1])
      const range: [number, number] = [rangeMin, rangeMax]
      const _line = { value: line.value, range }
      uniqLines[index] = _line
    }
  })
  return uniqLines
}

/**
 * 以页面列表为基础，为每一个页面生成新的ID，并关联到旧ID形成一个字典
 * 主要用于页面元素时，维持数据中各处页面ID原有的关系
 * @param slides 页面列表
 */
export const createSlideIdMap = (slides: Slide[]) => {
  const slideIdMap: IdMap = {}
  for (const slide of slides) {
    slideIdMap[slide.id] = nanoid(10)
  }
  return slideIdMap
}

/**
   * 以元素列表为基础，为每一个元素生成新的ID，并关联到旧ID形成一个字典
   * 主要用于复制元素时，维持数据中各处元素ID原有的关系
   * 例如：原本两个组合的元素拥有相同的groupId，复制后依然会拥有另一个相同的groupId
   * @param elements 元素列表数据
   */
export const createElementIdMap = (elements: PPTElement[]) => {
  const groupIdMap: IdMap = {}
  const elIdMap: IdMap = {}
  for (const element of elements) {
    const groupId = element.groupId
    if (groupId && !groupIdMap[groupId]) {
      groupIdMap[groupId] = nanoid(10)
    }
    elIdMap[element.id] = nanoid(10)
  }
  return {
    groupIdMap,
    elIdMap,
  }
}

/**
 * 根据表格的主题色，获取对应用于配色的子颜色
 * @param themeColor 主题色
 */
export const getTableSubThemeColor = (themeColor: string) => {
  const rgba = tinycolor(themeColor)
  return [
    rgba.setAlpha(0.3).toRgbString(),
    rgba.setAlpha(0.1).toRgbString(),
  ]
}

/**
 * 获取线条元素路径字符串
 * @param element 线条元素
 */
export const getLineElementPath = (element: PPTLineElement) => {
  const start = element.start.join(',')
  const end = element.end.join(',')
  if (element.broken) {
    const mid = element.broken.join(',')
    return `M${start} L${mid} L${end}`
  }
  else if (element.broken2) {
    const direction = getBroken2LineDirection(element)
    if (direction === 'horizontal') return `M${start} L${element.broken2[0]},${element.start[1]} L${element.broken2[0]},${element.end[1]} ${end}`
    return `M${start} L${element.start[0]},${element.broken2[1]} L${element.end[0]},${element.broken2[1]} ${end}`
  }
  else if (element.curve) {
    const mid = element.curve.join(',')
    return `M${start} Q${mid} ${end}`
  }
  else if (element.cubic) {
    const [c1, c2] = element.cubic
    const p1 = c1.join(',')
    const p2 = c2.join(',')
    return `M${start} C${p1} ${p2} ${end}`
  }
  return `M${start} L${end}`
}

/**
 * 根据线条端点类型和线宽，计算渲染时线身需要向内收缩的距离
 * @param point 线条端点类型
 * @param width 线条宽度
 */
const getLinePointRetractionOffset = (point: LinePoint, width: number) => {
  const size = width < 2 ? 2 : width
  if (point === 'arrow') return size
  if (point === 'dot') return size / 2
  return 0
}

/**
 * 计算两个线条点位之间的距离
 * @param p1 第一个点
 * @param p2 第二个点
 */
const getLinePointDistance = (p1: [number, number], p2: [number, number]) => {
  const deltaX = p2[0] - p1[0]
  const deltaY = p2[1] - p1[1]
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

/**
 * 按指定偏移距离，将线条点位沿目标点方向平移
 * @param point 当前点
 * @param target 目标点
 * @param offset 偏移距离
 */
const getLinePointByOffset = (
  point: [number, number],
  target: [number, number],
  offset: number,
) => {
  const distance = getLinePointDistance(point, target)
  if (!distance) return point

  const ratio = offset / distance
  return [
    point[0] + (target[0] - point[0]) * ratio,
    point[1] + (target[1] - point[1]) * ratio,
  ] as [number, number]
}

/**
 * 获取线条在路径起点和终点处对应的相邻控制点，用于计算端点内缩方向
 * @param element 线条元素
 */
const getLinePathTurningPoints = (element: PPTLineElement) => {
  if (element.broken) return [element.broken]

  if (element.broken2) {
    const direction = getBroken2LineDirection(element)
    if (direction === 'horizontal') {
      return [
        [element.broken2[0], element.start[1]],
        [element.broken2[0], element.end[1]],
      ] as [number, number][]
    }
    return [
      [element.start[0], element.broken2[1]],
      [element.end[0], element.broken2[1]],
    ] as [number, number][]
  }

  if (element.curve) return [element.curve]
  if (element.cubic) return [element.cubic[0], element.cubic[1]]
  return []
}

/**
 * 获取线条元素用于实际渲染的路径字符串：
 * 保持端点 marker 仍对齐原始 start/end，仅将可见线身在两端按需向内收缩
 * @param element 线条元素
 */
export const getLineElementRenderPath = (element: PPTLineElement) => {
  const turningPoints = getLinePathTurningPoints(element)

  let start = element.start
  let end = element.end

  const startOffset = getLinePointRetractionOffset(element.points[0], element.width)
  const endOffset = getLinePointRetractionOffset(element.points[1], element.width)

  if (startOffset) {
    const nextPoint = turningPoints[0] || element.end
    const offset = Math.min(startOffset, getLinePointDistance(element.start, nextPoint) / 2)
    start = getLinePointByOffset(element.start, nextPoint, offset)
  }

  if (endOffset) {
    const prevPoint = turningPoints[turningPoints.length - 1] || element.start
    const offset = Math.min(endOffset, getLinePointDistance(prevPoint, element.end) / 2)
    end = getLinePointByOffset(element.end, prevPoint, offset)
  }

  const startPoint = start.join(',')
  const endPoint = end.join(',')
  if (element.broken) {
    const mid = element.broken.join(',')
    return `M${startPoint} L${mid} L${endPoint}`
  }
  else if (element.broken2) {
    const direction = getBroken2LineDirection(element)
    if (direction === 'horizontal') return `M${startPoint} L${element.broken2[0]},${element.start[1]} L${element.broken2[0]},${element.end[1]} ${endPoint}`
    return `M${startPoint} L${element.start[0]},${element.broken2[1]} L${element.end[0]},${element.broken2[1]} ${endPoint}`
  }
  else if (element.curve) {
    const mid = element.curve.join(',')
    return `M${startPoint} Q${mid} ${endPoint}`
  }
  else if (element.cubic) {
    const [c1, c2] = element.cubic
    const p1 = c1.join(',')
    const p2 = c2.join(',')
    return `M${startPoint} C${p1} ${p2} ${endPoint}`
  }
  return `M${startPoint} L${endPoint}`
}

/**
 * 判断一个元素是否在可视范围内
 * @param element 元素
 * @param parent 父元素
 */
export const isElementInViewport = (element: HTMLElement, parent: HTMLElement): boolean => {
  const elementRect = element.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  return (
    elementRect.top >= parentRect.top &&
    elementRect.bottom <= parentRect.bottom
  )
}
