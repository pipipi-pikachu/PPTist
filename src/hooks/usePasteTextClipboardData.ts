import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { decrypt } from '@/utils/crypto'
import { PPTElement, Slide } from '@/types/slides'
import { createRandomCode } from '@/utils/common'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCreateElement from '@/hooks/useCreateElement'

interface PasteTextClipboardDataOptions {
  onlySlide?: boolean;
  onlyElements?: boolean;
}

export default () => {
  const store = useStore()
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()
  const { createTextElement } = useCreateElement()

  /**
   * 粘贴元素（一组）
   * @param elements 元素列表数据
   */
  const pasteElement = (elements: PPTElement[]) => {
    const groupIdMap = {}
    const elIdMap = {}
    for (const element of elements) {
      const groupId = element.groupId
      if (groupId && !groupIdMap[groupId]) {
        groupIdMap[groupId] = createRandomCode()
      }
      elIdMap[element.id] = createRandomCode()
    }
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
    store.commit(MutationTypes.ADD_ELEMENT, elements)
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, Object.values(elIdMap))
    addHistorySnapshot()
  }

  /**
   * 粘贴页面
   * @param slide 页面数据
   */
  const pasteSlides = (slides: Slide[]) => {
    const newSlides = slides.map(slide => ({
      ...slide,
      id: createRandomCode(8),
    }))
    store.commit(MutationTypes.ADD_SLIDE, newSlides)
    addHistorySnapshot()
  }

  /**
   * 粘贴普通文本：创建为新的文本元素
   * @param text 文本
   */
  const pasteText = (text: string) => {
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

    let clipboardData
    try {
      clipboardData = JSON.parse(decrypt(text))
    }
    catch {
      clipboardData = text
    }

    // 元素或页面
    if (typeof clipboardData === 'object') {
      const { type, data } = clipboardData

      if (type === 'elements' && !onlySlide) pasteElement(data)
      else if (type === 'slides' && !onlyElements) pasteSlides(data)
    }

    // 普通文本
    else if (!onlyElements && !onlySlide) pasteText(clipboardData)
  }

  return {
    pasteTextClipboardData,
  }
}