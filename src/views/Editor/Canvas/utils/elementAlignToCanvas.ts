import { PPTElement } from '@/types/slides'
import { ElementAlignCommand, ElementAlignCommands } from '@/types/edit'
import { getElementListRange } from './elementRange'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'

// 将元素对齐到屏幕
export const alignElementToCanvas = (elementList: PPTElement[], activeElementList: PPTElement[], activeElementIdList: string[], command: ElementAlignCommand) => {
  const viewportWidth = VIEWPORT_SIZE
  const viewportHeight = VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO
  const { minX, maxX, minY, maxY } = getElementListRange(activeElementList)

  const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))
  for(const element of copyOfElementList) {
    if(!activeElementIdList.includes(element.elId)) continue
    
    if(command === ElementAlignCommands.TOP) {
      const offsetY = minY - 0
      element.top = element.top - offsetY            
    }
    else if(command === ElementAlignCommands.VERTICAL) {
      const offsetY = minY + (maxY - minY) / 2 - viewportHeight / 2
      element.top = element.top - offsetY            
    }
    else if(command === ElementAlignCommands.BOTTOM) {
      const offsetY = maxY - viewportHeight
      element.top = element.top - offsetY       
    }
    
    else if(command === ElementAlignCommands.LEFT) {
      const offsetX = minX - 0
      element.left = element.left - offsetX            
    }
    else if(command === ElementAlignCommands.HORIZONTAL) {
      const offsetX = minX + (maxX - minX) / 2 - viewportWidth / 2
      element.left = element.left - offsetX            
    }
    else if(command === ElementAlignCommands.RIGHT) {
      const offsetX = maxX - viewportWidth
      element.left = element.left - offsetX            
    }
  }
  
  return copyOfElementList
}