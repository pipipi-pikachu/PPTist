import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const store = useStore()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const activeGroupElementId = computed(() => store.state.activeGroupElementId)
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()

  // 删除全部选中元素
  // 组合元素成员中，存在被选中可独立操作的元素时，优先删除该元素。否则默认删除所有被选中的元素
  const deleteElement = () => {
    if (!activeElementIdList.value.length) return

    let newElementList: PPTElement[] = []
    if (activeGroupElementId.value) {
      newElementList = currentSlide.value.elements.filter(el => el.id !== activeGroupElementId.value)
    }
    else {
      newElementList = currentSlide.value.elements.filter(el => !activeElementIdList.value.includes(el.id))
    }

    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    addHistorySnapshot()
  }

  // 删除内面内全部元素(无论是否选中)
  const deleteAllElements = () => {
    if (!currentSlide.value.elements.length) return
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: [] })
    addHistorySnapshot()
  }

  return {
    deleteElement,
    deleteAllElements,
  }
}