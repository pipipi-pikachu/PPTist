import { storeToRefs } from 'pinia'
import { useSlidesStore, useMainStore } from '@/store'

export default () => {
  const slidesStore = useSlidesStore()
  const mainStore = useMainStore()
  const { currentSlide } = storeToRefs(slidesStore)
  const { activeElementIdList, hiddenElementIdList } = storeToRefs(mainStore)

  const toggleHideElement = (id: string) => {
    if (hiddenElementIdList.value.includes(id)) {
      mainStore.setHiddenElementIdList(hiddenElementIdList.value.filter(item => item !== id))
    }
    else mainStore.setHiddenElementIdList([...hiddenElementIdList.value, id])
  
    if (activeElementIdList.value.includes(id)) mainStore.setActiveElementIdList([])
  }
  
  const showAllElements = () => {
    const currentSlideElIdList = currentSlide.value.elements.map(item => item.id)
    const needHiddenElementIdList = hiddenElementIdList.value.filter(item => !currentSlideElIdList.includes(item))
    mainStore.setHiddenElementIdList(needHiddenElementIdList)
  }
  const hideAllElements = () => {
    const currentSlideElIdList = currentSlide.value.elements.map(item => item.id)
    mainStore.setHiddenElementIdList([...hiddenElementIdList.value, ...currentSlideElIdList])
    if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])
  }

  return {
    toggleHideElement,
    showAllElements,
    hideAllElements,
  }
}