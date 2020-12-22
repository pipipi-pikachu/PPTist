import { Ref, computed } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { createRandomCode } from '@/utils/common'

export default () => {
  const store = useStore<State>()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const activeElementList: Ref<PPTElement[]> = computed(() => store.getters.activeElementList)
  const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

  // 组合元素（为当前所有激活元素添加一个相同的groupId）
  const combineElements = () => {
    if(!activeElementList.value.length) return

    let newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
    const groupId = createRandomCode()

    const combineElementList: PPTElement[] = []
    for(const element of newElementList) {
      if(activeElementIdList.value.includes(element.elId)) {
        element.groupId = groupId
        combineElementList.push(element)
      }
    }

    // 注意，组合元素的层级应该是连续的，所以需要获取该组元素中最顶层的元素，将组内其他成员从原位置移动到最顶层的元素的下面
    const combineElementMaxIndex = newElementList.findIndex(_element => _element.elId === combineElementList[combineElementList.length - 1].elId)
    const combineElementIdList = combineElementList.map(_element => _element.elId)
    newElementList = newElementList.filter(_element => !combineElementIdList.includes(_element.elId))

    const insertIndex = combineElementMaxIndex - combineElementList.length + 1
    newElementList.splice(insertIndex, 0, ...combineElementList)

    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
  }

  // 取消组合元素（移除所有被激活元素的groupId）
  const uncombineElements = () => {
    if(!activeElementList.value.length) return
    const hasElementInGroup = activeElementList.value.some(item => item.groupId)
    if(!hasElementInGroup) return
    
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
    for(const element of newElementList) {
      if(activeElementIdList.value.includes(element.elId) && element.groupId) delete element.groupId
    }
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
  }

  return {
    combineElements,
    uncombineElements,
  }
}