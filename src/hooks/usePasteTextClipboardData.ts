import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { decrypt } from '@/utils/crypto'
import { PPTElement, Slide } from '@/types/slides'
import { createRandomCode } from '@/utils/common'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

interface PasteTextClipboardDataOptions {
  onlySlide?: boolean;
  onlyElements?: boolean;
}

export default () => {
  const store = useStore()
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()

  const pasteElement = (elements: PPTElement[]) => {
    const groupIdMap = {}
    const elIdMap = {}
    for(const element of elements) {
      const groupId = element.groupId
      if(groupId && !groupIdMap[groupId]) {
        groupIdMap[groupId] = createRandomCode()
      }
      elIdMap[element.id] = createRandomCode()
    }
    const currentSlideElementIdList = currentSlide.value.elements.map(el => el.id)
    
    for(const element of elements) {
      const inCurrentSlide = currentSlideElementIdList.includes(element.id)
      
      element.id = elIdMap[element.id]

      if(inCurrentSlide) {
        element.left = element.left + 10
        element.top = element.top + 10
      }

      if(element.groupId) element.groupId = groupIdMap[element.groupId]
    }
    store.commit(MutationTypes.ADD_ELEMENT, elements)
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, Object.values(elIdMap))
    addHistorySnapshot()
  }

  const pasteSlide = (slide: Slide) => {
    store.commit(MutationTypes.ADD_SLIDE, slide)
    addHistorySnapshot()
  }

  const pasteText = (text: string) => {
    console.log(text)
  }

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

    // 粘贴自定义元素或页面
    if(typeof clipboardData === 'object') {
      const { type, data } = clipboardData

      if(type === 'elements' && !onlySlide) pasteElement(data)
      else if(type === 'slide' && !onlyElements) pasteSlide(data)
    }

    // 粘贴普通文本
    else if(!onlyElements && !onlySlide) pasteText(clipboardData)
  }

  return {
    pasteTextClipboardData,
  }
}