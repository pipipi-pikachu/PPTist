import { Ref, computed } from 'vue'
import { useStore } from 'vuex'
import uniq from 'lodash/uniq'
import { State, MutationTypes } from '@/store'
import { PPTElement } from '@/types/slides'

export default (
  elementList: Ref<PPTElement[]>,
  activeGroupElementId: Ref<string>,
  moveElement: (e: MouseEvent, element: PPTElement) => void,
) => {
  const store = useStore<State>()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const handleElementId = computed(() => store.state.handleElementId)
  const editorAreaFocus = computed(() => store.state.editorAreaFocus)
  const ctrlOrShiftKeyActive: Ref<boolean> = computed(() => store.getters.ctrlOrShiftKeyActive)

  const selectElement = (e: MouseEvent, element: PPTElement, canMove = true) => {
    if(!editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)

    // 如果被点击的元素处于未激活状态，则将他设置为激活元素（单选），或者加入到激活元素中（多选）
    if(!activeElementIdList.value.includes(element.elId)) {
      let newActiveIdList: string[] = []

      if(ctrlOrShiftKeyActive.value) {
        newActiveIdList = [...activeElementIdList.value, element.elId]
      }
      else newActiveIdList = [element.elId]
      
      // 同时如果该元素是分组成员，需要将和他同组的元素一起激活
      if(element.groupId) {
        const groupMembersId: string[] = []
        elementList.value.forEach((el: PPTElement) => {
          if(el.groupId === element.groupId) groupMembersId.push(el.elId)
        })
        newActiveIdList = [...newActiveIdList, ...groupMembersId]
      }

      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, uniq(newActiveIdList))
      store.commit(MutationTypes.SET_HANDLE_ELEMENT_ID, element.elId)
    }

    // 如果被点击的元素已激活，且按下了多选按钮，则取消其激活状态（除非该元素或分组是最后的一个激活元素）
    else if(ctrlOrShiftKeyActive.value) {
      let newActiveIdList: string[] = []

      // 同时如果该元素是分组成员，需要将和他同组的元素一起取消
      if(element.groupId) {
        const groupMembersId: string[] = []
        elementList.value.forEach((el: PPTElement) => {
          if(el.groupId === element.groupId) groupMembersId.push(el.elId)
        })
        newActiveIdList = activeElementIdList.value.filter(elId => !groupMembersId.includes(elId))
      }
      else {
        newActiveIdList = activeElementIdList.value.filter(elId => elId !== element.elId)
      }

      if(newActiveIdList.length > 0) {
        store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, newActiveIdList)
      }
    }

    // 如果被点击的元素已激活，且没有按下多选按钮，且该元素不是当前操作元素，则将其设置为当前操作元素
    else if(handleElementId.value !== element.elId) {
      store.commit(MutationTypes.SET_HANDLE_ELEMENT_ID, element.elId)
    }

    else if(activeGroupElementId.value !== element.elId && element.groupId) {
      const startPageX = e.pageX
      const startPageY = e.pageY

      ;(e.target as HTMLElement).onmouseup = (e: MouseEvent) => {
        const currentPageX = e.pageX
        const currentPageY = e.pageY

        if(startPageX === currentPageX && startPageY === currentPageY) {
          activeGroupElementId.value = element.elId
          ;(e.target as HTMLElement).onmouseup = null
        }
      }
    }

    if(canMove) moveElement(e, element)
  }

  const selectAllElement = () => {
    const unlockedElements = elementList.value.filter(el => !el.isLock)
    const newActiveElementIdList = unlockedElements.map(el => el.elId)
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, newActiveElementIdList)
  }

  return {
    selectElement,
    selectAllElement,
  }
}