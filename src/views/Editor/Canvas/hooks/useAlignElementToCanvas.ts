import { Ref } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { PPTElement } from '@/types/slides'
import { ElementAlignCommand, ElementAlignCommands } from '@/types/edit'
import { getElementListRange } from '../utils/elementRange'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'

export default (elementList: Ref<PPTElement[]>, activeElementList: Ref<PPTElement[]>, activeElementIdList: Ref<string[]>) => {
  const store = useStore<State>()

  const alignElementToCanvas = (command: ElementAlignCommand) => {
    const viewportWidth = VIEWPORT_SIZE
    const viewportHeight = VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO
    const { minX, maxX, minY, maxY } = getElementListRange(activeElementList.value)
  
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList.value))
    for(const element of newElementList) {
      if(!activeElementIdList.value.includes(element.elId)) continue
      
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
    
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
  }

  return {
    alignElementToCanvas,
  }
}