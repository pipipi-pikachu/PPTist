import { Ref } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { PPTElement } from '@/types/slides'

export default (elementList: Ref<PPTElement[]>, activeElementIdList: Ref<string[]>) => {
  const store = useStore<State>()

  const deleteElement = () => {
    if(!activeElementIdList.value.length) return
    const newElementList = elementList.value.filter(el => !activeElementIdList.value.includes(el.elId))
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
  }

  const deleteAllElements = () => {
    if(!elementList.value.length) return
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: [] })
  }

  return {
    deleteElement,
    deleteAllElements,
  }
}