import { Ref, computed } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { Slide } from '@/types/slides'

export default () => {
  const store = useStore<State>()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

  const deleteElement = () => {
    if(!activeElementIdList.value.length) return
    const newElementList = currentSlide.value.elements.filter(el => !activeElementIdList.value.includes(el.elId))
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
  }

  const deleteAllElements = () => {
    if(!currentSlide.value.elements.length) return
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: [] })
  }

  return {
    deleteElement,
    deleteAllElements,
  }
}