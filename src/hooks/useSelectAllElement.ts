import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'

export default () => {
  const mainStore = useMainStore()
  const { currentSlide } = storeToRefs(useSlidesStore())

  // 将当前页面全部元素设置为被选择状态
  const selectAllElement = () => {
    const unlockedElements = currentSlide.value.elements.filter(el => !el.lock)
    const newActiveElementIdList = unlockedElements.map(el => el.id)
    mainStore.setActiveElementIdList(newActiveElementIdList)
  }

  return {
    selectAllElement,
  }
}