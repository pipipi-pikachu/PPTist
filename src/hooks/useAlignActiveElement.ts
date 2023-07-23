import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { ElementAlignCommands } from '@/types/edit'
import { getElementListRange, getRectRotatedOffset } from '@/utils/element'
import useHistorySnapshot from './useHistorySnapshot'

interface RangeMap {
  [id: string]: ReturnType<typeof getElementListRange> 
}

export default () => {
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeElementList } = storeToRefs(useMainStore())
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 对齐选中的元素
   * @param command 对齐方向
   */
  const alignActiveElement = (command: ElementAlignCommands) => {
    const { minX, maxX, minY, maxY } = getElementListRange(activeElementList.value)
    const elementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // 如果所选择的元素为组合元素的成员，需要计算该组合的整体范围
    const groupElementRangeMap: RangeMap = {}
    for (const activeElement of activeElementList.value) {
      if (activeElement.groupId && !groupElementRangeMap[activeElement.groupId]) {
        const groupElements = activeElementList.value.filter(item => item.groupId === activeElement.groupId)
        groupElementRangeMap[activeElement.groupId] = getElementListRange(groupElements)
      }
    }

    // 根据不同的命令，计算对齐的位置
    if (command === ElementAlignCommands.LEFT) {
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            if ('rotate' in element && element.rotate) {
              const { offsetX } = getRectRotatedOffset({
                left: element.left,
                top: element.top,
                width: element.width,
                height: element.height,
                rotate: element.rotate,
              })
              element.left = minX - offsetX
            }
            else element.left = minX
          }
          else {
            const range = groupElementRangeMap[element.groupId]
            const offset = range.minX - minX
            element.left = element.left - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.RIGHT) {
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            const elWidth = element.type === 'line' ? Math.max(element.start[0], element.end[0]) : element.width
            if ('rotate' in element && element.rotate) {
              const { offsetX } = getRectRotatedOffset({
                left: element.left,
                top: element.top,
                width: element.width,
                height: element.height,
                rotate: element.rotate,
              })
              element.left = maxX - elWidth + offsetX
            }
            else element.left = maxX - elWidth
          }
          else {
            const range = groupElementRangeMap[element.groupId]
            const offset = range.maxX - maxX
            element.left = element.left - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.TOP) {
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            if ('rotate' in element && element.rotate) {
              const { offsetY } = getRectRotatedOffset({
                left: element.left,
                top: element.top,
                width: element.width,
                height: element.height,
                rotate: element.rotate,
              })
              element.top = minY - offsetY
            }
            else element.top = minY
          }
          else {
            const range = groupElementRangeMap[element.groupId]
            const offset = range.minY - minY
            element.top = element.top - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.BOTTOM) {
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            const elHeight = element.type === 'line' ? Math.max(element.start[1], element.end[1]) : element.height
            if ('rotate' in element && element.rotate) {
              const { offsetY } = getRectRotatedOffset({
                left: element.left,
                top: element.top,
                width: element.width,
                height: element.height,
                rotate: element.rotate,
              })
              element.top = maxY - elHeight + offsetY
            }
            else element.top = maxY - elHeight
          }
          else {
            const range = groupElementRangeMap[element.groupId]
            const offset = range.maxY - maxY
            element.top = element.top - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.HORIZONTAL) {
      const horizontalCenter = (minX + maxX) / 2
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            const elWidth = element.type === 'line' ? Math.max(element.start[0], element.end[0]) : element.width
            element.left = horizontalCenter - elWidth / 2
          }
          else {
            const range = groupElementRangeMap[element.groupId]
            const center = (range.maxX + range.minX) / 2
            const offset = center - horizontalCenter
            element.left = element.left - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.VERTICAL) {
      const verticalCenter = (minY + maxY) / 2
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            const elHeight = element.type === 'line' ? Math.max(element.start[1], element.end[1]) : element.height
            element.top = verticalCenter - elHeight / 2
          }
          else {
            const range = groupElementRangeMap[element.groupId]
            const center = (range.maxY + range.minY) / 2
            const offset = center - verticalCenter
            element.top = element.top - offset
          }
        }
      })
    }

    slidesStore.updateSlide({ elements: elementList })
    addHistorySnapshot()
  }

  return {
    alignActiveElement,
  }
}