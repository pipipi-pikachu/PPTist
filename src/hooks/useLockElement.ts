import { useStore } from 'vuex'
import { Ref, computed } from 'vue'
import { State, MutationTypes } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const store = useStore<State>()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()

  const lockElement = () => {
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
  
    for(const element of newElementList) {
      if(activeElementIdList.value.includes(element.elId)) element.isLock = true
    }
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    addHistorySnapshot()
  }

  const unlockElement = (handleElement: PPTElement) => {
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

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
    addHistorySnapshot()
  }

  return {
    lockElement,
    unlockElement,
  }
}