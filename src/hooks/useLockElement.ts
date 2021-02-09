import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const store = useStore()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()

  // 锁定选中的元素,并清空选中元素状态
  const lockElement = () => {
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
  
    for (const element of newElementList) {
      if (activeElementIdList.value.includes(element.id)) element.lock = true
    }
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    addHistorySnapshot()
  }

  /**
   * 解除元素的锁定状态,并将其设置为当前选择元素
   * @param handleElement 需要解锁的元素
   */
  const unlockElement = (handleElement: PPTElement) => {
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    if (handleElement.groupId) {
      for (const element of newElementList) {
        if (element.groupId === handleElement.groupId) element.lock = false
      }
      return newElementList
    }
    
    for (const element of newElementList) {
      if (element.id === handleElement.id) {
        element.lock = false
        break
      }
    }
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [handleElement.id])
    addHistorySnapshot()
  }

  return {
    lockElement,
    unlockElement,
  }
}