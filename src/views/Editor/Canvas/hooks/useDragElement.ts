import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useKeyboardStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import type { AlignmentLineProps } from '@/types/edit'
import { getRectRotatedRange, uniqAlignLines, type AlignLine } from '@/utils/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default (
  elementList: Ref<PPTElement[]>,
  alignmentLines: Ref<AlignmentLineProps[]>,
  canvasScale: Ref<number>,
) => {
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeGroupElementId } = storeToRefs(useMainStore())
  const { shiftKeyState } = storeToRefs(useKeyboardStore())
  const { viewportRatio, viewportSize } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  const dragElement = (e: MouseEvent | TouchEvent, element: PPTElement) => {
    const isTouchEvent = !(e instanceof MouseEvent)
    if (isTouchEvent && (!e.changedTouches || !e.changedTouches[0])) return

    if (!activeElementIdList.value.includes(element.id)) return
    let isMouseDown = true

    const edgeWidth = viewportSize.value
    const edgeHeight = viewportSize.value * viewportRatio.value
    
    const sorptionRange = 5

    const originElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList.value))
    const originActiveElementList = originElementList.filter(el => activeElementIdList.value.includes(el.id))
  
    const elOriginLeft = element.left
    const elOriginTop = element.top
    const elOriginWidth = element.width
    const elOriginHeight = ('height' in element && element.height) ? element.height : 0
    const elOriginRotate = ('rotate' in element && element.rotate) ? element.rotate : 0
  
    const startPageX = isTouchEvent ? e.changedTouches[0].pageX : e.pageX
    const startPageY = isTouchEvent ? e.changedTouches[0].pageY : e.pageY

    let isMisoperation: boolean | null = null

    const isActiveGroupElement = element.id === activeGroupElementId.value

    // 收集对齐对齐吸附线
    // 包括页面内除目标元素外的其他元素在画布中的各个可吸附对齐位置：上下左右四边，水平中心、垂直中心
    // 其中线条和被旋转过的元素需要重新计算他们在画布中的中心点位置的范围
    let horizontalLines: AlignLine[] = []
    let verticalLines: AlignLine[] = []

    for (const el of elementList.value) {
      if (el.type === 'line') continue
      if (isActiveGroupElement && el.id === element.id) continue
      if (!isActiveGroupElement && activeElementIdList.value.includes(el.id)) continue

      let left, top, width, height
      if ('rotate' in el && el.rotate) {
        const { xRange, yRange } = getRectRotatedRange({
          left: el.left,
          top: el.top,
          width: el.width,
          height: el.height,
          rotate: el.rotate,
        })
        left = xRange[0]
        top = yRange[0]
        width = xRange[1] - xRange[0]
        height = yRange[1] - yRange[0]
      }
      else {
        left = el.left
        top = el.top
        width = el.width
        height = el.height
      }
      
      const right = left + width
      const bottom = top + height
      const centerX = top + height / 2
      const centerY = left + width / 2

      const topLine: AlignLine = { value: top, range: [left, right] }
      const bottomLine: AlignLine = { value: bottom, range: [left, right] }
      const horizontalCenterLine: AlignLine = { value: centerX, range: [left, right] }
      const leftLine: AlignLine = { value: left, range: [top, bottom] }
      const rightLine: AlignLine = { value: right, range: [top, bottom] }
      const verticalCenterLine: AlignLine = { value: centerY, range: [top, bottom] }

      horizontalLines.push(topLine, bottomLine, horizontalCenterLine)
      verticalLines.push(leftLine, rightLine, verticalCenterLine)
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
    
    // 对齐吸附线去重
    horizontalLines = uniqAlignLines(horizontalLines)
    verticalLines = uniqAlignLines(verticalLines)

    const handleMousemove = (e: MouseEvent | TouchEvent) => {
      const currentPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const currentPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY

      // 如果鼠标滑动距离过小，则将操作判定为误操作：
      // 如果误操作标记为null，表示是第一次触发移动，需要计算当前是否是误操作
      // 如果误操作标记为true，表示当前还处在误操作范围内，但仍然需要继续计算检查后续操作是否还处于误操作
      // 如果误操作标记为false，表示已经脱离了误操作范围，不需要再次计算
      if (isMisoperation !== false) {
        isMisoperation = Math.abs(startPageX - currentPageX) < sorptionRange && 
                         Math.abs(startPageY - currentPageY) < sorptionRange
      }
      if (!isMouseDown || isMisoperation) return
      
      let moveX = (currentPageX - startPageX) / canvasScale.value
      let moveY = (currentPageY - startPageY) / canvasScale.value

      if (shiftKeyState.value) {
        if (Math.abs(moveX) > Math.abs(moveY)) moveY = 0
        if (Math.abs(moveX) < Math.abs(moveY)) moveX = 0
      }

      // 基础目标位置
      let targetLeft = elOriginLeft + moveX
      let targetTop = elOriginTop + moveY

      // 计算目标元素在画布中的位置范围，用于吸附对齐
      // 需要区分单选和多选两种情况，其中多选状态下需要计算多选元素的整体范围；单选状态下需要继续区分线条、普通元素、旋转后的普通元素三种情况
      let targetMinX: number, targetMaxX: number, targetMinY: number, targetMaxY: number

      if (activeElementIdList.value.length === 1 || isActiveGroupElement) {
        if (elOriginRotate) {
          const { xRange, yRange } = getRectRotatedRange({
            left: targetLeft,
            top: targetTop,
            width: elOriginWidth,
            height: elOriginHeight,
            rotate: elOriginRotate,
          })
          targetMinX = xRange[0]
          targetMaxX = xRange[1]
          targetMinY = yRange[0]
          targetMaxY = yRange[1]
        }
        else if (element.type === 'line') {
          targetMinX = targetLeft
          targetMaxX = targetLeft + Math.max(element.start[0], element.end[0])
          targetMinY = targetTop
          targetMaxY = targetTop + Math.max(element.start[1], element.end[1])
        }
        else {
          targetMinX = targetLeft
          targetMaxX = targetLeft + elOriginWidth
          targetMinY = targetTop
          targetMaxY = targetTop + elOriginHeight
        }
      }
      else {
        const leftValues = []
        const topValues = []
        const rightValues = []
        const bottomValues = []
        
        for (let i = 0; i < originActiveElementList.length; i++) {
          const element = originActiveElementList[i]
          const left = element.left + moveX
          const top = element.top + moveY
          const width = element.width
          const height = ('height' in element && element.height) ? element.height : 0
          const rotate = ('rotate' in element && element.rotate) ? element.rotate : 0

          if ('rotate' in element && element.rotate) {
            const { xRange, yRange } = getRectRotatedRange({ left, top, width, height, rotate })
            leftValues.push(xRange[0])
            topValues.push(yRange[0])
            rightValues.push(xRange[1])
            bottomValues.push(yRange[1])
          }
          else if (element.type === 'line') {
            leftValues.push(left)
            topValues.push(top)
            rightValues.push(left + Math.max(element.start[0], element.end[0]))
            bottomValues.push(top + Math.max(element.start[1], element.end[1]))
          }
          else {
            leftValues.push(left)
            topValues.push(top)
            rightValues.push(left + width)
            bottomValues.push(top + height)
          }
        }

        targetMinX = Math.min(...leftValues)
        targetMaxX = Math.max(...rightValues)
        targetMinY = Math.min(...topValues)
        targetMaxY = Math.max(...bottomValues)
      }
      
      const targetCenterX = targetMinX + (targetMaxX - targetMinX) / 2
      const targetCenterY = targetMinY + (targetMaxY - targetMinY) / 2

      // 将收集到的对齐吸附线与计算的目标元素位置范围做对比，二者的差小于设定的值时执行自动对齐校正
      // 水平和垂直两个方向需要分开计算
      const _alignmentLines: AlignmentLineProps[] = []
      let isVerticalAdsorbed = false
      let isHorizontalAdsorbed = false
      for (let i = 0; i < horizontalLines.length; i++) {
        const { value, range } = horizontalLines[i]
        const min = Math.min(...range, targetMinX, targetMaxX)
        const max = Math.max(...range, targetMinX, targetMaxX)
        
        if (Math.abs(targetMinY - value) < sorptionRange && !isHorizontalAdsorbed) {
          targetTop = targetTop - (targetMinY - value)
          isHorizontalAdsorbed = true
          _alignmentLines.push({type: 'horizontal', axis: {x: min - 50, y: value}, length: max - min + 100})
        }
        if (Math.abs(targetMaxY - value) < sorptionRange && !isHorizontalAdsorbed) {
          targetTop = targetTop - (targetMaxY - value)
          isHorizontalAdsorbed = true
          _alignmentLines.push({type: 'horizontal', axis: {x: min - 50, y: value}, length: max - min + 100})
        }
        if (Math.abs(targetCenterY - value) < sorptionRange && !isHorizontalAdsorbed) {
          targetTop = targetTop - (targetCenterY - value)
          isHorizontalAdsorbed = true
          _alignmentLines.push({type: 'horizontal', axis: {x: min - 50, y: value}, length: max - min + 100})
        }
      }
      for (let i = 0; i < verticalLines.length; i++) {
        const { value, range } = verticalLines[i]
        const min = Math.min(...range, targetMinY, targetMaxY)
        const max = Math.max(...range, targetMinY, targetMaxY)

        if (Math.abs(targetMinX - value) < sorptionRange && !isVerticalAdsorbed) {
          targetLeft = targetLeft - (targetMinX - value)
          isVerticalAdsorbed = true
          _alignmentLines.push({type: 'vertical', axis: {x: value, y: min - 50}, length: max - min + 100})
        }
        if (Math.abs(targetMaxX - value) < sorptionRange && !isVerticalAdsorbed) {
          targetLeft = targetLeft - (targetMaxX - value)
          isVerticalAdsorbed = true
          _alignmentLines.push({type: 'vertical', axis: {x: value, y: min - 50}, length: max - min + 100})
        }
        if (Math.abs(targetCenterX - value) < sorptionRange && !isVerticalAdsorbed) {
          targetLeft = targetLeft - (targetCenterX - value)
          isVerticalAdsorbed = true
          _alignmentLines.push({type: 'vertical', axis: {x: value, y: min - 50}, length: max - min + 100})
        }
      }
      alignmentLines.value = _alignmentLines
      
      // 单选状态下，或者当前选中的多个元素中存在正在操作的元素时，仅修改正在操作的元素的位置
      if (activeElementIdList.value.length === 1 || isActiveGroupElement) {
        elementList.value = elementList.value.map(el => {
          return el.id === element.id ? { ...el, left: targetLeft, top: targetTop } : el
        })
      }

      // 多选状态下，除了修改正在操作的元素的位置，其他被选中的元素也需要修改位置信息
      // 其他被选中的元素的位置信息通过正在操作的元素的移动偏移量来进行计算
      else {
        const handleElement = elementList.value.find(el => el.id === element.id)
        if (!handleElement) return

        elementList.value = elementList.value.map(el => {
          if (activeElementIdList.value.includes(el.id)) {
            if (el.id === element.id) {
              return {
                ...el,
                left: targetLeft,
                top: targetTop,
              }
            }
            return {
              ...el,
              left: el.left + (targetLeft - handleElement.left),
              top: el.top + (targetTop - handleElement.top),
            }
          }
          return el
        })
      }
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

  return {
    dragElement,
  }
}