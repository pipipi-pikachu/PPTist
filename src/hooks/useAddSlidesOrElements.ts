import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useSlidesStore, useMainStore } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { createSlideIdMap, createElementIdMap } from '@/utils/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 添加指定的元素数据（一组）
   * @param elements 元素列表数据
   */
  const addElementsFromData = (elements: PPTElement[]) => {
    const { groupIdMap, elIdMap } = createElementIdMap(elements)
    const currentSlideElementIdList = currentSlide.value.elements.map(el => el.id)
    
    for (const element of elements) {
      const inCurrentSlide = currentSlideElementIdList.includes(element.id)
      
      element.id = elIdMap[element.id]

      if (inCurrentSlide) {
        element.left = element.left + 10
        element.top = element.top + 10
      }

      if (element.groupId) element.groupId = groupIdMap[element.groupId]
    }
    slidesStore.addElement(elements)
    mainStore.setActiveElementIdList(Object.values(elIdMap))
    addHistorySnapshot()
  }

  /**
   * 添加指定的页面数据
   * @param slide 页面数据
   */
  const addSlidesFromData = (slides: Slide[]) => {
    const slideIdMap = createSlideIdMap(slides)
    const newSlides = slides.map(slide => {
      const { groupIdMap, elIdMap } = createElementIdMap(slide.elements)

      for (const element of slide.elements) {
        element.id = elIdMap[element.id]
        if (element.groupId) element.groupId = groupIdMap[element.groupId]
		
        // 若元素绑定了页面跳转链接
        if (element.link && element.link.type === 'slide') {

          // 待添加页面中包含该页面，则替换相关绑定关系
          if (slideIdMap[element.link.target]) {
            element.link.target = slideIdMap[element.link.target]
          }
          // 待添加页面中不包含该页面，则删除该元素绑定的页面跳转
          else delete element.link
        }
      }
      // 动画id替换
      if (slide.animations) {
        for (const animation of slide.animations) {
          animation.id = nanoid(10)
          animation.elId = elIdMap[animation.elId]
        }
      }
      return {
        ...slide,
        id: slideIdMap[slide.id],
      }
    })
    slidesStore.addSlide(newSlides)
    addHistorySnapshot()
  }

  return {
    addElementsFromData,
    addSlidesFromData,
  }
}