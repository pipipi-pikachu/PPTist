import { useStore } from 'vuex'
import { Ref } from 'vue'
import { State, MutationTypes } from '@/store'
import { PPTElement } from '@/types/slides'

export default (elementList: Ref<PPTElement[]>, activeElementIdList: Ref<string[]>) => {
  const store = useStore<State>()

  const lockElement = (handleElement: PPTElement) => {
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList.value))
  
    for(const element of newElementList) {
      if(activeElementIdList.value.includes(handleElement.elId)) element.isLock = true
    }
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
  }

  const unlockElement = (handleElement: PPTElement) => {
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList.value))

    if(handleElement.groupId) {
      for(const element of newElementList) {
        if(element.groupId === handleElement.groupId) element.isLock = false
      }
      return newElementList
    }
    
    for(const element of newElementList) {
      if(element.elId === handleElement.elId) {
        element.isLock = false
        break
      }
    }
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
  }

  return {
    lockElement,
    unlockElement,
  }
}