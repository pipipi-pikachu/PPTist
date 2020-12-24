import { Ref, computed } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { Slide } from '@/types/slides'

export default () => {
  const store = useStore<State>()
  const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

  const selectAllElement = () => {
    const unlockedElements = currentSlide.value.elements.filter(el => !el.lock)
    const newActiveElementIdList = unlockedElements.map(el => el.id)
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, newActiveElementIdList)
  }

  return {
    selectAllElement,
  }
}