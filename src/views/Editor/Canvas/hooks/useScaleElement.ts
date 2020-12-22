import { computed, Ref } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { ElementTypes, PPTElement, PPTImageElement, PPTLineElement, PPTShapeElement } from '@/types/slides'
import { OPERATE_KEYS, ElementScaleHandler, AlignmentLineProps, MultiSelectRange } from '@/types/edit'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { AlignLine, uniqAlignLines } from '@/utils/element'

// 计算元素被旋转一定角度后，八个操作点的新坐标
interface RotateElementData {
  left: number;
  top: number;
  width: number;
  height: number;
}
export const getRotateElementPoints = (element: RotateElementData, angle: number) => {
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
export const getOppositePoint = (direction: number, points: ReturnType<typeof getRotateElementPoints>): { left: number; top: number } => {
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

export default (
  elementList: Ref<PPTElement[]>,
  activeGroupElementId: Ref<string>,
  alignmentLines: Ref<AlignmentLineProps[]>,
) => {
  const store = useStore<State>()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const ctrlOrShiftKeyActive: Ref<boolean> = computed(() => store.getters.ctrlOrShiftKeyActive)
  const canvasScale = computed(() => store.state.canvasScale)

  const scaleElement = (e: MouseEvent, element: Exclude<PPTElement, PPTLineElement>, command: ElementScaleHandler) => {
    let isMouseDown = true

    const elOriginLeft = element.left
    const elOriginTop = element.top
    const elOriginWidth = element.width
    const elOriginHeight = element.height

    const isLockRatio = ctrlOrShiftKeyActive.value || ('lockRatio' in element && element.lockRatio)
    const lockRatio = elOriginWidth / elOriginHeight
    
    const elRotate = ('rotate' in element && element.rotate) ? element.rotate : 0
    const rotateRadian = Math.PI * elRotate / 180

    const startPageX = e.pageX
    const startPageY = e.pageY

    const minSize = 15
    const getSizeWithinRange = (size: number) => size < minSize ? minSize : size

    let points: ReturnType<typeof getRotateElementPoints>
    let baseLeft = 0
    let baseTop = 0
    let horizontalLines: AlignLine[] = []
    let verticalLines: AlignLine[] = []

    if('rotate' in element && element.rotate) {
      // 元素旋转后的各点坐标以及对角坐标
      const { left, top, width, height } = element
      points = getRotateElementPoints({ left, top, width, height }, elRotate)
      const oppositePoint = getOppositePoint(command, points)

      // 基点坐标（以操作点相对的点为基点，例如拖动右下角，实际上是保持左上角不变的前提下修改其他信息）
      baseLeft = oppositePoint.left
      baseTop = oppositePoint.top
    }
    else {
      const edgeWidth = VIEWPORT_SIZE
      const edgeHeight = VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO
      const isActiveGroupElement = element.elId === activeGroupElementId.value
      
      for(const el of elementList.value) {
        if('rotate' in el && el.rotate) continue
        if(el.type === ElementTypes.LINE) continue
        if(isActiveGroupElement && el.elId === element.elId) continue
        if(!isActiveGroupElement && activeElementIdList.value.includes(el.elId)) continue

        const left = el.left
        const top = el.top
        const width = el.width
        const height = el.height
        const right = left + width
        const bottom = top + height

        const topLine: AlignLine = { value: top, range: [left, right] }
        const bottomLine: AlignLine = { value: bottom, range: [left, right] }
        const leftLine: AlignLine = { value: left, range: [top, bottom] }
        const rightLine: AlignLine = { value: right, range: [top, bottom] }

        horizontalLines.push(topLine, bottomLine)
        verticalLines.push(leftLine, rightLine)
      }

      // 页面边界、水平和垂直的中心位置
      const edgeTopLine: AlignLine = { value: 0, range: [0, edgeWidth] }
      const edgeBottomLine: AlignLine = { value: edgeHeight, range: [0, edgeWidth] }
      const edgeHorizontalCenterLine: AlignLine = { value: edgeHeight / 2, range: [0, edgeWidth] }
      const edgeLeftLine: AlignLine = { value: 0, range: [0, edgeHeight] }
      const edgeRightLine: AlignLine = { value: edgeWidth, range: [0, edgeHeight] }
      const edgeVerticalCenterLine: AlignLine = { value: edgeWidth / 2, range: [0, edgeHeight] }

      horizontalLines.push(edgeTopLine, edgeBottomLine, edgeHorizontalCenterLine)
      verticalLines.push(edgeLeftLine, edgeRightLine, edgeVerticalCenterLine)
      
      horizontalLines = uniqAlignLines(horizontalLines)
      verticalLines = uniqAlignLines(verticalLines)
    }
    
    // 对齐吸附方法
    const alignedAdsorption = (currentX: number | null, currentY: number | null) => {
      const sorptionRange = 3

      const _alignmentLines: AlignmentLineProps[] = []
      let isVerticalAdsorbed = false
      let isHorizontalAdsorbed = false
      const correctionVal = { offsetX: 0, offsetY: 0 }
      
      if(currentY || currentY === 0) {
        for(let i = 0; i < horizontalLines.length; i++) {
          const { value, range } = horizontalLines[i]
          const min = Math.min(...range, currentX || 0)
          const max = Math.max(...range, currentX || 0)
          
          if(Math.abs(currentY - value) < sorptionRange) {
            if(!isHorizontalAdsorbed) {
              correctionVal.offsetY = currentY - value
              isHorizontalAdsorbed = true
            }
            _alignmentLines.push({type: 'horizontal', axis: {x: min - 20, y: value}, length: max - min + 40})
          }
        }
      }
      if(currentX || currentX === 0) {
        for(let i = 0; i < verticalLines.length; i++) {
          const { value, range } = verticalLines[i]
          const min = Math.min(...range, (currentY || 0))
          const max = Math.max(...range, (currentY || 0))

          if(Math.abs(currentX - value) < sorptionRange) {
            if(!isVerticalAdsorbed) {
              correctionVal.offsetX = currentX - value
              isVerticalAdsorbed = true
            }
            _alignmentLines.push({ type: 'vertical', axis: {x: value, y: min - 20}, length: max - min + 40 })
          }
        }
      }
      alignmentLines.value = _alignmentLines
      return correctionVal
    }

    document.onmousemove = e => {
      if(!isMouseDown) return

      const currentPageX = e.pageX
      const currentPageY = e.pageY

      const x = currentPageX - startPageX
      const y = currentPageY - startPageY

      let width = elOriginWidth
      let height = elOriginHeight
      let left = elOriginLeft
      let top = elOriginTop
      
      // 元素被旋转的情况下
      if(elRotate) {
        // 根据元素旋转的角度，修正鼠标按下后移动的距离（因为拖动的方向发生了改变）
        const revisedX = (Math.cos(rotateRadian) * x + Math.sin(rotateRadian) * y) / canvasScale.value
        let revisedY = (Math.cos(rotateRadian) * y - Math.sin(rotateRadian) * x) / canvasScale.value

        // 锁定宽高比例
        if(isLockRatio) {
          if(command === OPERATE_KEYS.RIGHT_BOTTOM || command === OPERATE_KEYS.LEFT_TOP) revisedY = revisedX / lockRatio
          if(command === OPERATE_KEYS.LEFT_BOTTOM || command === OPERATE_KEYS.RIGHT_TOP) revisedY = -revisedX / lockRatio
        }

        // 根据不同的操作点分别计算元素缩放后的大小和位置
        // 这里计算的位置是错误的，因为旋转后缩放实际上也改变了元素的位置，需要在后面进行矫正
        // 这里计算的大小是正确的，因为上面修正鼠标按下后移动的距离时其实已经进行过了矫正
        if(command === OPERATE_KEYS.RIGHT_BOTTOM) {
          width = getSizeWithinRange(elOriginWidth + revisedX)
          height = getSizeWithinRange(elOriginHeight + revisedY)
        }
        else if(command === OPERATE_KEYS.LEFT_BOTTOM) {
          width = getSizeWithinRange(elOriginWidth - revisedX)
          height = getSizeWithinRange(elOriginHeight + revisedY)
          left = elOriginLeft - (width - elOriginWidth)
        }
        else if(command === OPERATE_KEYS.LEFT_TOP) {
          width = getSizeWithinRange(elOriginWidth - revisedX)
          height = getSizeWithinRange(elOriginHeight - revisedY)
          left = elOriginLeft - (width - elOriginWidth)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if(command === OPERATE_KEYS.RIGHT_TOP) {
          width = getSizeWithinRange(elOriginWidth + revisedX)
          height = getSizeWithinRange(elOriginHeight - revisedY)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if(command === OPERATE_KEYS.TOP) {
          height = getSizeWithinRange(elOriginHeight - revisedY)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if(command === OPERATE_KEYS.BOTTOM) {
          height = getSizeWithinRange(elOriginHeight + revisedY)
        }
        else if(command === OPERATE_KEYS.LEFT) {
          width = getSizeWithinRange(elOriginWidth - revisedX)
          left = elOriginLeft - (width - elOriginWidth)
        }
        else if(command === OPERATE_KEYS.RIGHT) {
          width = getSizeWithinRange(elOriginWidth + revisedX)
        }

        // 获取当前元素基点坐标，与初始状态的基点坐标进行对比并矫正差值
        const currentPoints = getRotateElementPoints({ width, height, left, top }, elRotate)
        const currentOppositePoint = getOppositePoint(command, currentPoints)
        const currentBaseLeft = currentOppositePoint.left
        const currentBaseTop = currentOppositePoint.top

        const offsetX = currentBaseLeft - baseLeft
        const offsetY = currentBaseTop - baseTop

        left = left - offsetX
        top = top - offsetY
      }

      // 元素未被旋转的情况下，根据所操纵点的位置添加对齐吸附
      else {
        let moveX = x / canvasScale.value
        let moveY = y / canvasScale.value

        if(isLockRatio) {
          if(command === OPERATE_KEYS.RIGHT_BOTTOM || command === OPERATE_KEYS.LEFT_TOP) moveY = moveX / lockRatio
          if(command === OPERATE_KEYS.LEFT_BOTTOM || command === OPERATE_KEYS.RIGHT_TOP) moveY = -moveX / lockRatio
        }

        if(command === OPERATE_KEYS.RIGHT_BOTTOM) {
          const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + elOriginWidth + moveX, elOriginTop + elOriginHeight + moveY)
          moveX = moveX - offsetX
          moveY = moveY - offsetY
          if(isLockRatio) {
            if(offsetY) moveX = moveY * lockRatio
            else moveY = moveX / lockRatio
          }
          width = getSizeWithinRange(elOriginWidth + moveX)
          height = getSizeWithinRange(elOriginHeight + moveY)
        }
        else if(command === OPERATE_KEYS.LEFT_BOTTOM) {
          const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + moveX, elOriginTop + elOriginHeight + moveY)
          moveX = moveX - offsetX
          moveY = moveY - offsetY
          if(isLockRatio) {
            if(offsetY) moveX = -moveY * lockRatio
            else moveY = -moveX / lockRatio
          }
          width = getSizeWithinRange(elOriginWidth - moveX)
          height = getSizeWithinRange(elOriginHeight + moveY)
          left = elOriginLeft - (width - elOriginWidth)
        }
        else if(command === OPERATE_KEYS.LEFT_TOP) {
          const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + moveX, elOriginTop + moveY)
          moveX = moveX - offsetX
          moveY = moveY - offsetY
          if(isLockRatio) {
            if(offsetY) moveX = moveY * lockRatio
            else moveY = moveX / lockRatio
          }
          width = getSizeWithinRange(elOriginWidth - moveX)
          height = getSizeWithinRange(elOriginHeight - moveY)
          left = elOriginLeft - (width - elOriginWidth)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if(command === OPERATE_KEYS.RIGHT_TOP) {
          const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + elOriginWidth + moveX, elOriginTop + moveY)
          moveX = moveX - offsetX
          moveY = moveY - offsetY
          if(isLockRatio) {
            if(offsetY) moveX = -moveY * lockRatio
            else moveY = -moveX / lockRatio
          }
          width = getSizeWithinRange(elOriginWidth + moveX)
          height = getSizeWithinRange(elOriginHeight - moveY)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if(command === OPERATE_KEYS.LEFT) {
          const { offsetX } = alignedAdsorption(elOriginLeft + moveX, null)
          moveX = moveX - offsetX
          width = getSizeWithinRange(elOriginWidth - moveX)
          left = elOriginLeft - (width - elOriginWidth)
        }
        else if(command === OPERATE_KEYS.RIGHT) {
          const { offsetX } = alignedAdsorption(elOriginLeft + elOriginWidth + moveX, null)
          moveX = moveX - offsetX
          width = getSizeWithinRange(elOriginWidth + moveX)
        }
        else if(command === OPERATE_KEYS.TOP) {
          const { offsetY } = alignedAdsorption(null, elOriginTop + moveY)
          moveY = moveY - offsetY
          height = getSizeWithinRange(elOriginHeight - moveY)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if(command === OPERATE_KEYS.BOTTOM) {
          const { offsetY } = alignedAdsorption(null, elOriginTop + elOriginHeight + moveY)
          moveY = moveY - offsetY
          height = getSizeWithinRange(elOriginHeight + moveY)
        }
      }
      
      elementList.value = elementList.value.map(el => element.elId === el.elId ? { ...el, left, top, width, height } : el)
    }

    document.onmouseup = e => {
      isMouseDown = false
      document.onmousemove = null
      document.onmouseup = null
      alignmentLines.value = []

      if(startPageX === e.pageX && startPageY === e.pageY) return

      store.commit(MutationTypes.UPDATE_SLIDE, { elements: elementList.value })
    }
  }

  const scaleMultiElement = (e: MouseEvent, range: MultiSelectRange, command: ElementScaleHandler) => {
    let isMouseDown = true
    
    const { minX, maxX, minY, maxY } = range
    const operateWidth = maxX - minX
    const operateHeight = maxY - minY
    const lockRatio = operateWidth / operateHeight

    const startPageX = e.pageX
    const startPageY = e.pageY

    const originElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList.value))

    document.onmousemove = e => {
      if(!isMouseDown) return
      
      const currentPageX = e.pageX
      const currentPageY = e.pageY

      // 鼠标按下后移动的距离
      const x = (currentPageX - startPageX) / canvasScale.value
      let y = (currentPageY - startPageY) / canvasScale.value

      // 锁定宽高比例
      if(ctrlOrShiftKeyActive.value) {
        if(command === OPERATE_KEYS.RIGHT_BOTTOM || command === OPERATE_KEYS.LEFT_TOP) y = x / lockRatio
        if(command === OPERATE_KEYS.LEFT_BOTTOM || command === OPERATE_KEYS.RIGHT_TOP) y = -x / lockRatio
      }

      // 获取鼠标缩放时当前所有激活元素的范围
      let currentMinX = minX
      let currentMaxX = maxX
      let currentMinY = minY
      let currentMaxY = maxY

      if(command === OPERATE_KEYS.RIGHT_BOTTOM) {
        currentMaxX = maxX + x
        currentMaxY = maxY + y
      }
      else if(command === OPERATE_KEYS.LEFT_BOTTOM) {
        currentMinX = minX + x
        currentMaxY = maxY + y
      }
      else if(command === OPERATE_KEYS.LEFT_TOP) {
        currentMinX = minX + x
        currentMinY = minY + y
      }
      else if(command === OPERATE_KEYS.RIGHT_TOP) {
        currentMaxX = maxX + x
        currentMinY = minY + y
      }
      else if(command === OPERATE_KEYS.TOP) {
        currentMinY = minY + y
      }
      else if(command === OPERATE_KEYS.BOTTOM) {
        currentMaxY = maxY + y
      }
      else if(command === OPERATE_KEYS.LEFT) {
        currentMinX = minX + x
      }
      else if(command === OPERATE_KEYS.RIGHT) {
        currentMaxX = maxX + x
      }

      // 多选下所有元素整体宽高
      const currentOppositeWidth = currentMaxX - currentMinX
      const currentOppositeHeight = currentMaxY - currentMinY

      // 所有元素的整体宽高与被操作元素宽高的比例
      let widthScale = currentOppositeWidth / operateWidth
      let heightScale = currentOppositeHeight / operateHeight

      if(widthScale <= 0) widthScale = 0
      if(heightScale <= 0) heightScale = 0
      
      // 根据上面计算的比例，修改所有被激活元素的位置大小
      // 宽高通过乘以对应的比例得到，位置通过将被操作元素在所有元素整体中的相对位置乘以对应比例获得
      elementList.value = elementList.value.map(el => {
        if((el.type === ElementTypes.IMAGE || el.type === ElementTypes.SHAPE) && activeElementIdList.value.includes(el.elId)) {
          const originElement = originElementList.find(originEl => originEl.elId === el.elId) as PPTImageElement | PPTShapeElement
          return {
            ...el,
            width: originElement.width * widthScale,
            height: originElement.height * heightScale,
            left: currentMinX + (originElement.left - minX) * widthScale,
            top: currentMinY + (originElement.top - minY) * heightScale,
          }
        }
        return el
      })
    }

    document.onmouseup = e => {
      isMouseDown = false
      document.onmousemove = null
      document.onmouseup = null

      if(startPageX === e.pageX && startPageY === e.pageY) return

      store.commit(MutationTypes.UPDATE_SLIDE, { elements: elementList.value })
    }
  }

  return {
    scaleElement,
    scaleMultiElement,
  }
}