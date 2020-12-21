import { Ref, computed } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { PPTElement } from '@/types/slides'
import { KEYS } from '@/configs/hotkey'

export default (elementList: Ref<PPTElement[]>) => {
  const store = useStore<State>()
  const activeElementIdList = computed(() => store.state.activeElementIdList)

  const moveElement = (command: string) => {
    const newElementList = elementList.value.map(el => {
      if(activeElementIdList.value.includes(el.elId)) {
        let { left, top } = el
        switch(command) {
          case KEYS.LEFT: 
            left = left - 1
            break
          case KEYS.RIGHT: 
            left = left + 1
            break
          case KEYS.UP: 
            top = top - 1
            break
          case KEYS.DOWN: 
            top = top + 1
            break
          default: break
        }
        return { ...el, left, top }
      }
      return el
    })
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
  }

  return {
    moveElement,
  }
}