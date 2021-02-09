import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { Slide } from '@/types/slides'

export default () => {
  const store = useStore()
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  // 将当前页面全部元素设置为被选择状态
  const selectAllElement = () => {
    const unlockedElements = currentSlide.value.elements.filter(el => !el.lock)
    const newActiveElementIdList = unlockedElements.map(el => el.id)
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, newActiveElementIdList)
  }

  return {
    selectAllElement,
  }
}