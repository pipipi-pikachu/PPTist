import { Ref } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { ElementTypes, PPTElement } from '@/types/slides'
import { AlignmentLineProps } from '../types/index'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { getRectRotatedRange } from '../utils/elementRange'
import { AlignLine, uniqAlignLines } from '../utils/alignLines'

export default (
  elementList: Ref<PPTElement[]>,
  activeElementIdList: Ref<string[]>,
  activeGroupElementId: Ref<string>,
  canvasScale: Ref<number>,
  alignmentLines: Ref<AlignmentLineProps[]>,
) => {
  const store = useStore<State>()

  const moveElement = (e: MouseEvent, element: PPTElement) => {
    if(!activeElementIdList.value.includes(element.elId)) return
    let isMouseDown = true

    // 可视范围宽高，用于边缘对齐吸附
    const edgeWidth = VIEWPORT_SIZE
    const edgeHeight = VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO

    const originElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList.value))
    const originActiveElementList = originElementList.filter(el => activeElementIdList.value.includes(el.elId))

    const sorptionRange = 3
    const elOriginLeft = element.left
    const elOriginTop = element.top
    const elOriginWidth = element.width
    const elOriginHeight = ('height' in element && element.height) ? element.height : 0
    const elOriginRotate = ('rotate' in element && element.rotate) ? element.rotate : 0
    const startPageX = e.pageX
    const startPageY = e.pageY

    let isMisoperation: boolean | null = null

    const isActiveGroupElement = element.elId === activeGroupElementId.value

    // 收集对齐参考线
    // 包括页面内出被操作元素以外的所有元素在页面内水平和垂直方向的范围和中心位置、页面边界和水平和垂直的中心位置
    let horizontalLines: AlignLine[] = []
    let verticalLines: AlignLine[] = []

    // 元素在页面内水平和垂直方向的范围和中心位置（需要特殊计算线条和被旋转的元素）
    for(const el of elementList.value) {
      if(el.type === ElementTypes.LINE) continue
      if(isActiveGroupElement && el.elId === element.elId) continue
      if(!isActiveGroupElement && activeElementIdList.value.includes(el.elId)) continue

      let left, top, width, height
      if('rotate' in el && el.rotate) {
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

    // 页面边界、水平和垂直的中心位置
    const edgeTopLine: AlignLine = { value: 0, range: [0, edgeWidth] }
    const edgeBottomLine: AlignLine = { value: edgeHeight, range: [0, edgeWidth] }
    const edgeHorizontalCenterLine: AlignLine = { value: edgeHeight / 2, range: [0, edgeWidth] }
    const edgeLeftLine: AlignLine = { value: 0, range: [0, edgeHeight] }
    const edgeRightLine: AlignLine = { value: edgeWidth, range: [0, edgeHeight] }
    const edgeVerticalCenterLine: AlignLine = { value: edgeWidth / 2, range: [0, edgeHeight] }

    horizontalLines.push(edgeTopLine, edgeBottomLine, edgeHorizontalCenterLine)
    verticalLines.push(edgeLeftLine, edgeRightLine, edgeVerticalCenterLine)
    
    // 参考线去重
    horizontalLines = uniqAlignLines(horizontalLines)
    verticalLines = uniqAlignLines(verticalLines)

    document.onmousemove = e => {
      const currentPageX = e.pageX
      const currentPageY = e.pageY

      // 对于鼠标第一次滑动距离过小的操作判定为误操作
      // 这里仅在误操作标记未被赋值（null，第一次触发移动），以及被标记为误操作时（true，当前处于误操作范围，但可能会脱离该范围转变成正常操作），才会去计算
      // 已经被标记为非误操作时（false），不需要再次计算（因为不可能从非误操作转变成误操作）
      if(isMisoperation !== false) {
        isMisoperation = Math.abs(startPageX - currentPageX) < sorptionRange && 
                         Math.abs(startPageY - currentPageY) < sorptionRange
      }
      if( !isMouseDown || isMisoperation ) return

      // 鼠标按下后移动的距离
      const moveX = (currentPageX - startPageX) / canvasScale.value
      const moveY = (currentPageY - startPageY) / canvasScale.value

      // 被操作元素需要移动到的位置
      let targetLeft = elOriginLeft + moveX
      let targetTop = elOriginTop + moveY

      // 计算被操作元素在页面中的范围（用于吸附对齐）
      // 需要区分计算：多选状态、线条、被旋转的元素
      // 注意这里需要用元素的原始信息结合移动信息来计算
      let targetMinX: number, targetMaxX: number, targetMinY: number, targetMaxY: number

      if(activeElementIdList.value.length === 1 || isActiveGroupElement) {
        if(elOriginRotate) {
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
        else if(element.type === 'line') {
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
        
        for(let i = 0; i < originActiveElementList.length; i++) {
          const element = originActiveElementList[i]
          const left = element.left + moveX
          const top = element.top + moveY
          const width = element.width
          const height = ('height' in element && element.height) ? element.height : 0
          const rotate = ('rotate' in element && element.rotate) ? element.rotate : 0

          if('rotate' in element && element.rotate) {
            const { xRange, yRange } = getRectRotatedRange({ left, top, width, height, rotate })
            leftValues.push(xRange[0])
            topValues.push(yRange[0])
            rightValues.push(xRange[1])
            bottomValues.push(yRange[1])
          }
          else if(element.type === 'line') {
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

      // 根据收集到的参考线，分别执行垂直和水平两个方向的对齐吸附
      const _alignmentLines: AlignmentLineProps[] = []
      let isVerticalAdsorbed = false
      let isHorizontalAdsorbed = false
      for(let i = 0; i < horizontalLines.length; i++) {
        const { value, range } = horizontalLines[i]
        const min = Math.min(...range, targetMinX, targetMaxX)
        const max = Math.max(...range, targetMinX, targetMaxX)
        
        if(Math.abs(targetMinY - value) < sorptionRange) {
          if(!isHorizontalAdsorbed) {
            targetTop = targetTop - (targetMinY - value)
            isHorizontalAdsorbed = true
          }
          _alignmentLines.push({type: 'horizontal', axis: {x: min - 20, y: value}, length: max - min + 40})
        }
        if(Math.abs(targetMaxY - value) < sorptionRange) {
          if(!isHorizontalAdsorbed) {
            targetTop = targetTop - (targetMaxY - value)
            isHorizontalAdsorbed = true
          }
          _alignmentLines.push({type: 'horizontal', axis: {x: min - 20, y: value}, length: max - min + 40})
        }
        if(Math.abs(targetCenterY - value) < sorptionRange) {
          if(!isHorizontalAdsorbed) {
            targetTop = targetTop - (targetCenterY - value)
            isHorizontalAdsorbed = true
          }
          _alignmentLines.push({type: 'horizontal', axis: {x: min - 20, y: value}, length: max - min + 40})
        }
      }
      for(let i = 0; i < verticalLines.length; i++) {
        const { value, range } = verticalLines[i]
        const min = Math.min(...range, targetMinY, targetMaxY)
        const max = Math.max(...range, targetMinY, targetMaxY)

        if(Math.abs(targetMinX - value) < sorptionRange) {
          if(!isVerticalAdsorbed) {
            targetLeft = targetLeft - (targetMinX - value)
            isVerticalAdsorbed = true
          }
          _alignmentLines.push({type: 'vertical', axis: {x: value, y: min - 20}, length: max - min + 40})
        }
        if(Math.abs(targetMaxX - value) < sorptionRange) {
          if(!isVerticalAdsorbed) {
            targetLeft = targetLeft - (targetMaxX - value)
            isVerticalAdsorbed = true
          }
          _alignmentLines.push({type: 'vertical', axis: {x: value, y: min - 20}, length: max - min + 40})
        }
        if(Math.abs(targetCenterX - value) < sorptionRange) {
          if(!isVerticalAdsorbed) {
            targetLeft = targetLeft - (targetCenterX - value)
            isVerticalAdsorbed = true
          }
          _alignmentLines.push({type: 'vertical', axis: {x: value, y: min - 20}, length: max - min + 40})
        }
      }
      alignmentLines.value = _alignmentLines
      
      // 非多选，或者当前操作的元素时激活的组合元素
      if(activeElementIdList.value.length === 1 || isActiveGroupElement) {
        elementList.value = elementList.value.map(el => {
          return el.elId === element.elId ? { ...el, left: targetLeft, top: targetTop } : el
        })
      }

      // 修改元素位置，如果需要修改位置的元素不是被操作的元素（例如多选下的操作）
      // 那么其他非操作元素要移动的位置通过操作元素的移动偏移量计算
      else {
        const handleElement = elementList.value.find(el => el.elId === element.elId)
        if(!handleElement) return

        elementList.value = elementList.value.map(el => {
          const newEl = el
          activeElementIdList.value.includes(el.elId) ? { ...el, left: targetLeft, top: targetTop } : el
          if(activeElementIdList.value.includes(el.elId)) {
            if(el.elId === element.elId) {
              newEl.left = targetLeft
              newEl.top = targetTop
            }
            else {
              newEl.left = newEl.left + (targetLeft - handleElement.left)
              newEl.top = newEl.top + (targetTop - handleElement.top)
            }
          }
          return newEl
        })
      }
    }

    document.onmouseup = e => {
      isMouseDown = false
      document.onmousemove = null
      document.onmouseup = null
      alignmentLines.value = []

      const currentPageX = e.pageX
      const currentPageY = e.pageY

      // 对比初始位置，没有实际的位移不更新数据
      if(startPageX === currentPageX && startPageY === currentPageY) return

      store.commit(MutationTypes.UPDATE_SLIDE, { elements: elementList.value })
    }
  }

  return {
    moveElement,
  }
}