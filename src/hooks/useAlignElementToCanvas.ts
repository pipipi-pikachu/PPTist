import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { ElementAlignCommands } from '@/types/edit'
import { getElementListRange } from '@/utils/element'
import useHistorySnapshot from './useHistorySnapshot'

export default () => {
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeElementList } = storeToRefs(useMainStore())
  const { currentSlide, viewportRatio, viewportSize } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 将所有选中的元素对齐到画布
   * @param command 对齐方向
   */
  const alignElementToCanvas = (command: ElementAlignCommands) => {
    const viewportWidth = viewportSize.value
    const viewportHeight = viewportSize.value * viewportRatio.value
    const { minX, maxX, minY, maxY } = getElementListRange(activeElementList.value)
  
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
    for (const element of newElementList) {
      if (!activeElementIdList.value.includes(element.id)) continue
      
      // 水平垂直居中
      if (command === ElementAlignCommands.CENTER) {
        const offsetY = minY + (maxY - minY) / 2 - viewportHeight / 2
        const offsetX = minX + (maxX - minX) / 2 - viewportWidth / 2
        element.top = element.top - offsetY 
        element.left = element.left - offsetX           
      }

      // 顶部对齐
      if (command === ElementAlignCommands.TOP) {
        const offsetY = minY - 0
        element.top = element.top - offsetY            
      }

      // 垂直居中
      else if (command === ElementAlignCommands.VERTICAL) {
        const offsetY = minY + (maxY - minY) / 2 - viewportHeight / 2
        element.top = element.top - offsetY            
      }

      // 底部对齐
      else if (command === ElementAlignCommands.BOTTOM) {
        const offsetY = maxY - viewportHeight
        element.top = element.top - offsetY       
      }
      
      // 左侧对齐
      else if (command === ElementAlignCommands.LEFT) {
        const offsetX = minX - 0
        element.left = element.left - offsetX            
      }

      // 水平居中
      else if (command === ElementAlignCommands.HORIZONTAL) {
        const offsetX = minX + (maxX - minX) / 2 - viewportWidth / 2
        element.left = element.left - offsetX            
      }

      // 右侧对齐
      else if (command === ElementAlignCommands.RIGHT) {
        const offsetX = maxX - viewportWidth
        element.left = element.left - offsetX            
      }
    }

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  return {
    alignElementToCanvas,
  }
}