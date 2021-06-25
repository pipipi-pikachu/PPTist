import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { KEYS } from '@/configs/hotkey'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const store = useStore()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const activeGroupElementId = computed(() => store.state.activeGroupElementId)
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 将元素向指定方向移动指定的距离
   * 组合元素成员中，存在被选中可独立操作的元素时，优先移动该元素。否则默认移动所有被选中的元素
   * @param command 移动方向
   * @param step 移动距离
   */
  const moveElement = (command: string, step = 1) => {
    let newElementList: PPTElement[] = []

    const move = (el: PPTElement) => {
      let { left, top } = el
      switch (command) {
        case KEYS.LEFT: 
          left = left - step
          break
        case KEYS.RIGHT: 
          left = left + step
          break
        case KEYS.UP: 
          top = top - step
          break
        case KEYS.DOWN: 
          top = top + step
          break
        default: break
      }
      return { ...el, left, top }
    }

    if (activeGroupElementId.value) {
      newElementList = currentSlide.value.elements.map(el => {
        return activeGroupElementId.value === el.id ? move(el) : el
      })
    }
    else {
      newElementList = currentSlide.value.elements.map(el => {
        return activeElementIdList.value.includes(el.id) ? move(el) : el
      })
    }

    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    addHistorySnapshot()
  }

  return {
    moveElement,
  }
}