import { PPTTextElement, PPTImageElement, PPTShapeElement, PPTIconElement } from '@/types/slides'
import { OPERATE_KEYS } from '@/configs/element'

// 给定一个坐标，计算该坐标到(0, 0)点连线的弧度值
// 注意，Math.atan2的一般用法是Math.atan2(y, x)返回的是原点(0,0)到(x,y)点的线段与X轴正方向之间的弧度值
// 这里将使用时将x与y的传入顺序交换了，为的是获取原点(0,0)到(x,y)点的线段与Y轴正方向之间的弧度值
export const getAngleFromCoordinate = (x: number, y: number) => {
  const radian = Math.atan2(x, y)
  const angle = 180 / Math.PI * radian
  return angle
}

// 计算元素被旋转一定角度后，八个操作点的新坐标
export const getRotateElementPoints = (element: PPTTextElement | PPTImageElement | PPTShapeElement | PPTIconElement, angle: number) => {
  const { left, top, width, height } = element

  const radius = Math.sqrt( Math.pow(width, 2) + Math.pow(height, 2) ) / 2
  const auxiliaryAngle = Math.atan(height / width) * 180 / Math.PI

  const tlbraRadian = (180 - angle - auxiliaryAngle) * Math.PI / 180
  const trblaRadian = (auxiliaryAngle - angle) * Math.PI / 180
  const taRadian = (90 - angle) * Math.PI / 180
  const raRadian = angle * Math.PI / 180

  const halfWidth = width / 2
  const halfHeight = height / 2

  const middleLeft = left + halfWidth
  const middleTop = top + halfHeight

  const leftTopPoint = {
    left: middleLeft + radius * Math.cos(tlbraRadian),
    top: middleTop - radius * Math.sin(tlbraRadian),
  }
  const topPoint = {
    left: middleLeft + halfHeight * Math.cos(taRadian),
    top: middleTop - halfHeight * Math.sin(taRadian),
  }
  const rightTopPoint = {
    left: middleLeft + radius * Math.cos(trblaRadian),
    top: middleTop - radius * Math.sin(trblaRadian),
  }
  const rightPoint = {
    left: middleLeft + halfWidth * Math.cos(raRadian),
    top: middleTop + halfWidth * Math.sin(raRadian),
  }
  const rightBottomPoint = {
    left: middleLeft - radius * Math.cos(tlbraRadian),
    top: middleTop + radius * Math.sin(tlbraRadian),
  }
  const bottomPoint = {
    left: middleLeft - halfHeight * Math.sin(raRadian),
    top: middleTop + halfHeight * Math.cos(raRadian),
  }
  const leftBottomPoint = {
    left: middleLeft - radius * Math.cos(trblaRadian),
    top: middleTop + radius * Math.sin(trblaRadian),
  }
  const leftPoint = {
    left: middleLeft - halfWidth * Math.cos(raRadian),
    top: middleTop - halfWidth * Math.sin(raRadian),
  }

  return { leftTopPoint, topPoint, rightTopPoint, rightPoint, rightBottomPoint, bottomPoint, leftBottomPoint, leftPoint }
}

// 获取元素某个操作点对角线上另一端的操作点坐标（例如：左上 <-> 右下）
export const getOppositePoint = (direction: number, points: ReturnType<typeof getRotateElementPoints>) => {
  const oppositeMap = {
    [OPERATE_KEYS.RIGHT_BOTTOM]: points.leftTopPoint,
    [OPERATE_KEYS.LEFT_BOTTOM]: points.rightTopPoint,
    [OPERATE_KEYS.LEFT_TOP]: points.rightBottomPoint,
    [OPERATE_KEYS.RIGHT_TOP]: points.leftBottomPoint,
    [OPERATE_KEYS.TOP]: points.bottomPoint,
    [OPERATE_KEYS.BOTTOM]: points.topPoint,
    [OPERATE_KEYS.LEFT]: points.rightPoint,
    [OPERATE_KEYS.RIGHT]: points.leftPoint,
  }
  return oppositeMap[direction]
}