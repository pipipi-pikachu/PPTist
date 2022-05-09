import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useSlidesStore, useMainStore } from '@/store'
import { pasteCustomClipboardString } from '@/utils/clipboard'
import { PPTElement, Slide } from '@/types/slides'
import { createElementIdMap } from '@/utils/element'
import { parseText2Paragraphs } from '@/utils/textParser'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCreateElement from '@/hooks/useCreateElement'

interface PasteTextClipboardDataOptions {
  onlySlide?: boolean;
  onlyElements?: boolean;
}

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()
  const { createTextElement } = useCreateElement()

  /**
   * 粘贴元素（一组）
   * @param elements 元素列表数据
   */
  const addElementsFromClipboard = (elements: PPTElement[]) => {
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
   * 粘贴页面
   * @param slide 页面数据
   */
  const addSlidesFromClipboard = (slides: Slide[]) => {
    const newSlides = slides.map(slide => {
      const { groupIdMap, elIdMap } = createElementIdMap(slide.elements)

      for (const element of slide.elements) {
        element.id = elIdMap[element.id]
        if (element.groupId) element.groupId = groupIdMap[element.groupId]
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
        id: nanoid(10),
      }
    })
    slidesStore.addSlide(newSlides)
    addHistorySnapshot()
  }

  /**
   * 粘贴普通文本：创建为新的文本元素
   * @param text 文本
   */
  const createTextElementFromClipboard = (text: string) => {
    createTextElement({
      left: 0,
      top: 0,
      width: 600,
      height: 50,
    }, text)
  }

  /**
   * 解析剪贴板内容，根据解析结果选择合适的粘贴方式
   * @param text 剪贴板内容
   * @param options 配置项：onlySlide -- 仅处理页面粘贴；onlyElements -- 仅处理元素粘贴；
   */
  const pasteTextClipboardData = (text: string, options?: PasteTextClipboardDataOptions) => {
    const onlySlide = options?.onlySlide || false
    const onlyElements = options?.onlyElements || false

    const clipboardData = pasteCustomClipboardString(text)

    // 元素或页面
    if (typeof clipboardData === 'object') {
      const { type, data } = clipboardData

      if (type === 'elements' && !onlySlide) addElementsFromClipboard(data)
      else if (type === 'slides' && !onlyElements) addSlidesFromClipboard(data)
    }

    // 普通文本
    else if (!onlyElements && !onlySlide) {
      const string = parseText2Paragraphs(clipboardData)
      createTextElementFromClipboard(string)
    }
  }

  return {
    addSlidesFromClipboard,
    pasteTextClipboardData,
  }
}