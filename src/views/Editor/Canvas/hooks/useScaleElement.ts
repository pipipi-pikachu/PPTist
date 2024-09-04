import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useKeyboardStore } from '@/store'
import type { PPTElement, PPTImageElement, PPTLineElement, PPTShapeElement } from '@/types/slides'
import { OperateResizeHandlers, type AlignmentLineProps, type MultiSelectRange } from '@/types/edit'
import { MIN_SIZE } from '@/configs/element'
import { SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import { type AlignLine, uniqAlignLines } from '@/utils/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

interface RotateElementData {
  left: number
  top: number
  width: number
  height: number
}

/**
 * 计算旋转后的元素八个缩放点的位置
 * @param element 元素原始位置大小信息
 * @param angle 旋转角度
 */
const getRotateElementPoints = (element: RotateElementData, angle: number) => {
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

/**
 * 获取元素某缩放点相对的另一个点的位置，如：【上】对应【下】、【左上】对应【右下】
 * @param direction 当前操作的缩放点
 * @param points 旋转后的元素八个缩放点的位置
 */
const getOppositePoint = (direction: OperateResizeHandlers, points: ReturnType<typeof getRotateElementPoints>): { left: number; top: number } => {
  const oppositeMap = {
    [OperateResizeHandlers.RIGHT_BOTTOM]: points.leftTopPoint,
    [OperateResizeHandlers.LEFT_BOTTOM]: points.rightTopPoint,
    [OperateResizeHandlers.LEFT_TOP]: points.rightBottomPoint,
    [OperateResizeHandlers.RIGHT_TOP]: points.leftBottomPoint,
    [OperateResizeHandlers.TOP]: points.bottomPoint,
    [OperateResizeHandlers.BOTTOM]: points.topPoint,
    [OperateResizeHandlers.LEFT]: points.rightPoint,
    [OperateResizeHandlers.RIGHT]: points.leftPoint,
  }
  return oppositeMap[direction]
}

export default (
  elementList: Ref<PPTElement[]>,
  alignmentLines: Ref<AlignmentLineProps[]>,
  canvasScale: Ref<number>,
) => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeGroupElementId } = storeToRefs(mainStore)
  const { viewportRatio, viewportSize } = storeToRefs(slidesStore)
  const { ctrlOrShiftKeyActive } = storeToRefs(useKeyboardStore())

  const { addHistorySnapshot } = useHistorySnapshot()

  // 缩放元素
  const scaleElement = (e: MouseEvent | TouchEvent, element: Exclude<PPTElement, PPTLineElement>, command: OperateResizeHandlers) => {
    const isTouchEvent = !(e instanceof MouseEvent)
    if (isTouchEvent && (!e.changedTouches || !e.changedTouches[0])) return

    let isMouseDown = true
    mainStore.setScalingState(true)

    const elOriginLeft = element.left
    const elOriginTop = element.top
    const elOriginWidth = element.width
    const elOriginHeight = element.height

    const originTableCellMinHeight = element.type === 'table' ? element.cellMinHeight : 0
    
    const elRotate = ('rotate' in element && element.rotate) ? element.rotate : 0
    const rotateRadian = Math.PI * elRotate / 180

    const fixedRatio = ctrlOrShiftKeyActive.value || ('fixedRatio' in element && element.fixedRatio)
    const aspectRatio = elOriginWidth / elOriginHeight

    const startPageX = isTouchEvent ? e.changedTouches[0].pageX : e.pageX
    const startPageY = isTouchEvent ? e.changedTouches[0].pageY : e.pageY

    // 元素最小缩放限制
    const minSize = MIN_SIZE[element.type] || 20
    const getSizeWithinRange = (size: number) => size < minSize ? minSize : size

    let points: ReturnType<typeof getRotateElementPoints>
    let baseLeft = 0
    let baseTop = 0
    let horizontalLines: AlignLine[] = []
    let verticalLines: AlignLine[] = []

    // 旋转后的元素进行缩放时，引入基点的概念，以当前操作的缩放点相对的点为基点
    // 例如拖动右下角缩放时，左上角为基点，需要保持左上角不变然后修改其他的点的位置来达到所放的效果
    if ('rotate' in element && element.rotate) {
      const { left, top, width, height } = element
      points = getRotateElementPoints({ left, top, width, height }, elRotate)
      const oppositePoint = getOppositePoint(command, points)

      baseLeft = oppositePoint.left
      baseTop = oppositePoint.top
    }

    // 未旋转的元素具有缩放时的对齐吸附功能，在此处收集对齐对齐吸附线
    // 包括页面内除目标元素外的其他元素在画布中的各个可吸附对齐位置：上下左右四边
    // 其中线条和被旋转过的元素不参与吸附对齐
    else {
      const edgeWidth = viewportSize.value
      const edgeHeight = viewportSize.value * viewportRatio.value
      const isActiveGroupElement = element.id === activeGroupElementId.value
      
      for (const el of elementList.value) {
        if ('rotate' in el && el.rotate) continue
        if (el.type === 'line') continue
        if (isActiveGroupElement && el.id === element.id) continue
        if (!isActiveGroupElement && activeElementIdList.value.includes(el.id)) continue

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

      // 画布可视区域的四个边界、水平中心、垂直中心
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
    // 将收集到的对齐吸附线与计算的目标元素当前的位置大小相关数据做对比，差值小于设定的值时执行自动缩放校正
    // 水平和垂直两个方向需要分开计算
    const alignedAdsorption = (currentX: number | null, currentY: number | null) => {
      const sorptionRange = 5

      const _alignmentLines: AlignmentLineProps[] = []
      let isVerticalAdsorbed = false
      let isHorizontalAdsorbed = false
      const correctionVal = { offsetX: 0, offsetY: 0 }
      
      if (currentY || currentY === 0) {
        for (let i = 0; i < horizontalLines.length; i++) {
          const { value, range } = horizontalLines[i]
          const min = Math.min(...range, currentX || 0)
          const max = Math.max(...range, currentX || 0)
          
          if (Math.abs(currentY - value) < sorptionRange && !isHorizontalAdsorbed) {
            correctionVal.offsetY = currentY - value
            isHorizontalAdsorbed = true
            _alignmentLines.push({ type: 'horizontal', axis: {x: min - 50, y: value}, length: max - min + 100 })
          }
        }
      }
      if (currentX || currentX === 0) {
        for (let i = 0; i < verticalLines.length; i++) {
          const { value, range } = verticalLines[i]
          const min = Math.min(...range, (currentY || 0))
          const max = Math.max(...range, (currentY || 0))

          if (Math.abs(currentX - value) < sorptionRange && !isVerticalAdsorbed) {
            correctionVal.offsetX = currentX - value
            isVerticalAdsorbed = true
            _alignmentLines.push({ type: 'vertical', axis: {x: value, y: min - 50}, length: max - min + 100 })
          }
        }
      }
      alignmentLines.value = _alignmentLines
      return correctionVal
    }

    const handleMousemove = (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return

      const currentPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const currentPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY

      const x = currentPageX - startPageX
      const y = currentPageY - startPageY

      let width = elOriginWidth
      let height = elOriginHeight
      let left = elOriginLeft
      let top = elOriginTop
      
      // 元素被旋转的情况下，需要根据元素旋转的角度，重新计算需要缩放的距离（鼠标按下后移动的距离）
      if (elRotate) {
        const revisedX = (Math.cos(rotateRadian) * x + Math.sin(rotateRadian) * y) / canvasScale.value
        let revisedY = (Math.cos(rotateRadian) * y - Math.sin(rotateRadian) * x) / canvasScale.value

        // 锁定宽高比例（仅四个角可能触发，四条边不会触发）
        // 以水平方向上缩放的距离为基础，计算垂直方向上的缩放距离，保持二者具有相同的缩放比例
        if (fixedRatio) {
          if (command === OperateResizeHandlers.RIGHT_BOTTOM || command === OperateResizeHandlers.LEFT_TOP) revisedY = revisedX / aspectRatio
          if (command === OperateResizeHandlers.LEFT_BOTTOM || command === OperateResizeHandlers.RIGHT_TOP) revisedY = -revisedX / aspectRatio
        }

        // 根据不同的操作点分别计算元素缩放后的大小和位置
        // 需要注意：
        // 此处计算的位置需要在后面重新进行校正，因为旋转后再缩放事实上会改变元素基点的位置（虽然视觉上基点保持不动，但这是【旋转】+【移动】共同作用的结果）
        // 但此处计算的大小不需要重新校正，因为前面已经重新计算需要缩放的距离，相当于大小已经经过了校正
        if (command === OperateResizeHandlers.RIGHT_BOTTOM) {
          width = getSizeWithinRange(elOriginWidth + revisedX)
          height = getSizeWithinRange(elOriginHeight + revisedY)
        }
        else if (command === OperateResizeHandlers.LEFT_BOTTOM) {
          width = getSizeWithinRange(elOriginWidth - revisedX)
          height = getSizeWithinRange(elOriginHeight + revisedY)
          left = elOriginLeft - (width - elOriginWidth)
        }
        else if (command === OperateResizeHandlers.LEFT_TOP) {
          width = getSizeWithinRange(elOriginWidth - revisedX)
          height = getSizeWithinRange(elOriginHeight - revisedY)
          left = elOriginLeft - (width - elOriginWidth)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if (command === OperateResizeHandlers.RIGHT_TOP) {
          width = getSizeWithinRange(elOriginWidth + revisedX)
          height = getSizeWithinRange(elOriginHeight - revisedY)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if (command === OperateResizeHandlers.TOP) {
          height = getSizeWithinRange(elOriginHeight - revisedY)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if (command === OperateResizeHandlers.BOTTOM) {
          height = getSizeWithinRange(elOriginHeight + revisedY)
        }
        else if (command === OperateResizeHandlers.LEFT) {
          width = getSizeWithinRange(elOriginWidth - revisedX)
          left = elOriginLeft - (width - elOriginWidth)
        }
        else if (command === OperateResizeHandlers.RIGHT) {
          width = getSizeWithinRange(elOriginWidth + revisedX)
        }

        // 获取当前元素的基点坐标，与初始状态时的基点坐标进行对比，并计算差值进行元素位置的校正
        const currentPoints = getRotateElementPoints({ width, height, left, top }, elRotate)
        const currentOppositePoint = getOppositePoint(command, currentPoints)
        const currentBaseLeft = currentOppositePoint.left
        const currentBaseTop = currentOppositePoint.top

        const offsetX = currentBaseLeft - baseLeft
        const offsetY = currentBaseTop - baseTop

        left = left - offsetX
        top = top - offsetY
      }

      // 元素未被旋转的情况下，正常计算新的位置大小即可，无需复杂的校正等工作
      // 额外需要处理对齐吸附相关的操作
      // 锁定宽高比例相关的操作同上，不再赘述
      else {
        let moveX = x / canvasScale.value
        let moveY = y / canvasScale.value

        if (fixedRatio) {
          if (command === OperateResizeHandlers.RIGHT_BOTTOM || command === OperateResizeHandlers.LEFT_TOP) moveY = moveX / aspectRatio
          if (command === OperateResizeHandlers.LEFT_BOTTOM || command === OperateResizeHandlers.RIGHT_TOP) moveY = -moveX / aspectRatio
        }

        if (command === OperateResizeHandlers.RIGHT_BOTTOM) {
          const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + elOriginWidth + moveX, elOriginTop + elOriginHeight + moveY)
          moveX = moveX - offsetX
          moveY = moveY - offsetY
          if (fixedRatio) {
            if (offsetY) moveX = moveY * aspectRatio
            else moveY = moveX / aspectRatio
          }
          width = getSizeWithinRange(elOriginWidth + moveX)
          height = getSizeWithinRange(elOriginHeight + moveY)
        }
        else if (command === OperateResizeHandlers.LEFT_BOTTOM) {
          const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + moveX, elOriginTop + elOriginHeight + moveY)
          moveX = moveX - offsetX
          moveY = moveY - offsetY
          if (fixedRatio) {
            if (offsetY) moveX = -moveY * aspectRatio
            else moveY = -moveX / aspectRatio
          }
          width = getSizeWithinRange(elOriginWidth - moveX)
          height = getSizeWithinRange(elOriginHeight + moveY)
          left = elOriginLeft - (width - elOriginWidth)
        }
        else if (command === OperateResizeHandlers.LEFT_TOP) {
          const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + moveX, elOriginTop + moveY)
          moveX = moveX - offsetX
          moveY = moveY - offsetY
          if (fixedRatio) {
            if (offsetY) moveX = moveY * aspectRatio
            else moveY = moveX / aspectRatio
          }
          width = getSizeWithinRange(elOriginWidth - moveX)
          height = getSizeWithinRange(elOriginHeight - moveY)
          left = elOriginLeft - (width - elOriginWidth)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if (command === OperateResizeHandlers.RIGHT_TOP) {
          const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + elOriginWidth + moveX, elOriginTop + moveY)
          moveX = moveX - offsetX
          moveY = moveY - offsetY
          if (fixedRatio) {
            if (offsetY) moveX = -moveY * aspectRatio
            else moveY = -moveX / aspectRatio
          }
          width = getSizeWithinRange(elOriginWidth + moveX)
          height = getSizeWithinRange(elOriginHeight - moveY)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if (command === OperateResizeHandlers.LEFT) {
          const { offsetX } = alignedAdsorption(elOriginLeft + moveX, null)
          moveX = moveX - offsetX
          width = getSizeWithinRange(elOriginWidth - moveX)
          left = elOriginLeft - (width - elOriginWidth)
        }
        else if (command === OperateResizeHandlers.RIGHT) {
          const { offsetX } = alignedAdsorption(elOriginLeft + elOriginWidth + moveX, null)
          moveX = moveX - offsetX
          width = getSizeWithinRange(elOriginWidth + moveX)
        }
        else if (command === OperateResizeHandlers.TOP) {
          const { offsetY } = alignedAdsorption(null, elOriginTop + moveY)
          moveY = moveY - offsetY
          height = getSizeWithinRange(elOriginHeight - moveY)
          top = elOriginTop - (height - elOriginHeight)
        }
        else if (command === OperateResizeHandlers.BOTTOM) {
          const { offsetY } = alignedAdsorption(null, elOriginTop + elOriginHeight + moveY)
          moveY = moveY - offsetY
          height = getSizeWithinRange(elOriginHeight + moveY)
        }
      }
      
      elementList.value = elementList.value.map(el => {
        if (element.id !== el.id) return el
        if (el.type === 'shape' && 'pathFormula' in el && el.pathFormula) {
          const pathFormula = SHAPE_PATH_FORMULAS[el.pathFormula]

          let path = ''
          if ('editable' in pathFormula) path = pathFormula.formula(width, height, el.keypoints!)
          else path = pathFormula.formula(width, height)

          return {
            ...el, left, top, width, height,
            viewBox: [width, height],
            path,
          }
        }
        if (el.type === 'table') {
          let cellMinHeight = originTableCellMinHeight + (height - elOriginHeight) / el.data.length
          cellMinHeight = cellMinHeight < 36 ? 36 : cellMinHeight

          if (cellMinHeight === originTableCellMinHeight) return { ...el, left, width }
          return {
            ...el, left, top, width, height,
            cellMinHeight: cellMinHeight < 36 ? 36 : cellMinHeight,
          }
        }
        return { ...el, left, top, width, height }
      })
    }

    const handleMouseup = (e: MouseEvent | TouchEvent) => {
      isMouseDown = false
      
      document.ontouchmove = null
      document.ontouchend = null
      document.onmousemove = null
      document.onmouseup = null

      alignmentLines.value = []

      const currentPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const currentPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY
      
      if (startPageX === currentPageX && startPageY === currentPageY) return
      
      slidesStore.updateSlide({ elements: elementList.value })
      mainStore.setScalingState(false)
      
      addHistorySnapshot()
    }

    if (isTouchEvent) {
      document.ontouchmove = handleMousemove
      document.ontouchend = handleMouseup
    }
    else {
      document.onmousemove = handleMousemove
      document.onmouseup = handleMouseup
    }
  }

  // 多选元素缩放
  const scaleMultiElement = (e: MouseEvent, range: MultiSelectRange, command: OperateResizeHandlers) => {
    let isMouseDown = true
    
    const { minX, maxX, minY, maxY } = range
    const operateWidth = maxX - minX
    const operateHeight = maxY - minY
    const aspectRatio = operateWidth / operateHeight

    const startPageX = e.pageX
    const startPageY = e.pageY

    const originElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList.value))

    document.onmousemove = e => {
      if (!isMouseDown) return
      
      const currentPageX = e.pageX
      const currentPageY = e.pageY

      const x = (currentPageX - startPageX) / canvasScale.value
      let y = (currentPageY - startPageY) / canvasScale.value

      // 锁定宽高比例，逻辑同上
      if (ctrlOrShiftKeyActive.value) {
        if (command === OperateResizeHandlers.RIGHT_BOTTOM || command === OperateResizeHandlers.LEFT_TOP) y = x / aspectRatio
        if (command === OperateResizeHandlers.LEFT_BOTTOM || command === OperateResizeHandlers.RIGHT_TOP) y = -x / aspectRatio
      }

      // 所有选中元素的整体范围
      let currentMinX = minX
      let currentMaxX = maxX
      let currentMinY = minY
      let currentMaxY = maxY

      if (command === OperateResizeHandlers.RIGHT_BOTTOM) {
        currentMaxX = maxX + x
        currentMaxY = maxY + y
      }
      else if (command === OperateResizeHandlers.LEFT_BOTTOM) {
        currentMinX = minX + x
        currentMaxY = maxY + y
      }
      else if (command === OperateResizeHandlers.LEFT_TOP) {
        currentMinX = minX + x
        currentMinY = minY + y
      }
      else if (command === OperateResizeHandlers.RIGHT_TOP) {
        currentMaxX = maxX + x
        currentMinY = minY + y
      }
      else if (command === OperateResizeHandlers.TOP) {
        currentMinY = minY + y
      }
      else if (command === OperateResizeHandlers.BOTTOM) {
        currentMaxY = maxY + y
      }
      else if (command === OperateResizeHandlers.LEFT) {
        currentMinX = minX + x
      }
      else if (command === OperateResizeHandlers.RIGHT) {
        currentMaxX = maxX + x
      }

      // 所有选中元素的整体宽高
      const currentOppositeWidth = currentMaxX - currentMinX
      const currentOppositeHeight = currentMaxY - currentMinY

      // 当前正在操作元素宽高占所有选中元素的整体宽高的比例
      let widthScale = currentOppositeWidth / operateWidth
      let heightScale = currentOppositeHeight / operateHeight

      if (widthScale <= 0) widthScale = 0
      if (heightScale <= 0) heightScale = 0
      
      // 根据前面计算的比例，计算并修改所有选中元素的位置大小
      elementList.value = elementList.value.map(el => {
        if ((el.type === 'image' || el.type === 'shape') && activeElementIdList.value.includes(el.id)) {
          const originElement = originElementList.find(originEl => originEl.id === el.id) as PPTImageElement | PPTShapeElement
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

      if (startPageX === e.pageX && startPageY === e.pageY) return

      slidesStore.updateSlide({ elements: elementList.value })
      addHistorySnapshot()
    }
  }

  return {
    scaleElement,
    scaleMultiElement,
  }
}