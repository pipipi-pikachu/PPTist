import type { Ref } from 'vue'
import { uniq } from 'lodash'
import { storeToRefs } from 'pinia'
import { useMainStore, useKeyboardStore } from '@/store'
import type { PPTElement } from '@/types/slides'

export default (
  elementList: Ref<PPTElement[]>,
  moveElement: (e: MouseEvent | TouchEvent, element: PPTElement) => void,
) => {
  const mainStore = useMainStore()
  const { activeElementIdList, activeGroupElementId, handleElementId, editorAreaFocus } = storeToRefs(mainStore)
  const { ctrlOrShiftKeyActive } = storeToRefs(useKeyboardStore())

  // 选中元素
  // startMove 表示是否需要再选中操作后进入到开始移动的状态
  const selectElement = (e: MouseEvent | TouchEvent, element: PPTElement, startMove = true) => {
    if (!editorAreaFocus.value) mainStore.setEditorareaFocus(true)

    // 如果目标元素当前未被选中，则将他设为选中状态
    // 此时如果按下Ctrl键或Shift键，则进入多选状态，将当前已选中的元素和目标元素一起设置为选中状态，否则仅将目标元素设置为选中状态
    // 如果目标元素是分组成员，需要将该组合的其他元素一起设置为选中状态
    if (!activeElementIdList.value.includes(element.id)) {
      let newActiveIdList: string[] = []

      if (ctrlOrShiftKeyActive.value) {
        newActiveIdList = [...activeElementIdList.value, element.id]
      }
      else newActiveIdList = [element.id]
      
      if (element.groupId) {
        const groupMembersId: string[] = []
        elementList.value.forEach((el: PPTElement) => {
          if (el.groupId === element.groupId) groupMembersId.push(el.id)
        })
        newActiveIdList = [...newActiveIdList, ...groupMembersId]
      }

      mainStore.setActiveElementIdList(uniq(newActiveIdList))
      mainStore.setHandleElementId(element.id)
    }

    // 如果目标元素已被选中，且按下了Ctrl键或Shift键，则取消其被选中状态
    // 除非目标元素是最后的一个被选中元素，或者目标元素所在的组合是最后一组选中组合
    // 如果目标元素是分组成员，需要将该组合的其他元素一起取消选中状态
    else if (ctrlOrShiftKeyActive.value) {
      let newActiveIdList: string[] = []

      if (element.groupId) {
        const groupMembersId: string[] = []
        elementList.value.forEach((el: PPTElement) => {
          if (el.groupId === element.groupId) groupMembersId.push(el.id)
        })
        newActiveIdList = activeElementIdList.value.filter(id => !groupMembersId.includes(id))
      }
      else {
        newActiveIdList = activeElementIdList.value.filter(id => id !== element.id)
      }

      if (newActiveIdList.length > 0) {
        mainStore.setActiveElementIdList(newActiveIdList)
      }
    }

    // 如果目标元素已被选中，同时目标元素不是当前操作元素，则将其设置为当前操作元素
    else if (handleElementId.value !== element.id) {
      mainStore.setHandleElementId(element.id)
    }

    // 如果目标元素已被选中，同时也是当前操作元素，那么当目标元素在该状态下再次被点击时，将被设置为多选元素中的激活成员
    else if (activeGroupElementId.value !== element.id) {
      const startPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const startPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY

      ;(e.target as HTMLElement).onmouseup = (e: MouseEvent) => {
        const currentPageX = e.pageX
        const currentPageY = e.pageY

        if (startPageX === currentPageX && startPageY === currentPageY) {
          mainStore.setActiveGroupElementId(element.id)
          ;(e.target as HTMLElement).onmouseup = null
        }
      }
    }

    if (startMove) moveElement(e, element)
  }

  return {
    selectElement,
  }
}
