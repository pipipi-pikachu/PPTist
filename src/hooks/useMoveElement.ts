import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { Slide } from '@/types/slides'
import { KEYS } from '@/configs/hotkey'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const store = useStore()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 将元素向指定方向移动指定的距离
   * @param command 移动方向
   * @param step 移动距离
   */
  const moveElement = (command: string, step = 1) => {
    const newElementList = currentSlide.value.elements.map(el => {
      if (activeElementIdList.value.includes(el.id)) {
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
      return el
    })
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    addHistorySnapshot()
  }

  return {
    moveElement,
  }
}