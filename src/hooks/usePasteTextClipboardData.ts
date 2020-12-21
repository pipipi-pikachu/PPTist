import { computed, Ref } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { decrypt } from '@/utils/crypto'
import { PPTElement, Slide } from '@/types/slides'
import { createRandomCode } from '@/utils/common'

export default () => {
  const store = useStore<State>()
  const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

  const pasteElement = (elements: PPTElement[]) => {
    const groupIdMap = {}
    const elIdMap = {}
    for(const element of elements) {
      const groupId = element.groupId
      if(groupId && !groupIdMap[groupId]) {
        groupIdMap[groupId] = createRandomCode()
      }
      elIdMap[element.elId] = createRandomCode()
    }
    const currentSlideElementIdList = currentSlide.value.elements.map(el => el.elId)
    
    for(const element of elements) {
      const inCurrentSlide = currentSlideElementIdList.includes(element.elId)
      
      element.elId = elIdMap[element.elId]

      if(inCurrentSlide) {
        element.left = element.left + 10
        element.top = element.top + 10
      }

      if(element.groupId) element.groupId = groupIdMap[element.groupId]
    }
    store.commit(MutationTypes.ADD_ELEMENT, elements)
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, Object.values(elIdMap))
  }

  const pasteSlide = (slides: Slide[]) => {
    console.log(slides)
  }

  const pasteText = (text: string) => {
    console.log(text)
  }

  const pasteTextClipboardData = (text: string) => {
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

      if(type === 'elements') pasteElement(data)
      else if(type === 'slide') pasteSlide(data)
    }

    // 粘贴普通文本
    else pasteText(clipboardData)
  }

  return {
    pasteTextClipboardData,
  }
}