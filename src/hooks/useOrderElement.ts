import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { ElementOrderCommand, ElementOrderCommands } from '@/types/edit'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const store = useStore()
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()

  // 获取组合元素层级范围（组合成员中的最大层级和最小层级）
  const getCombineElementIndexRange = (elementList: PPTElement[], combineElementList: PPTElement[]) => {
    const minIndex = elementList.findIndex(_element => _element.id === combineElementList[0].id)
    const maxIndex = elementList.findIndex(_element => _element.id === combineElementList[combineElementList.length - 1].id)
    return { minIndex, maxIndex }
  }

  // 上移一层，返回移动后新的元素列表（下移一层逻辑类似）
  const moveUpElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // 被操作的元素是组合元素成员
    if (element.groupId) {

      // 获取该组合元素全部成员，以及组合元素层级范围
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minIndex, maxIndex } = getCombineElementIndexRange(elementList, combineElementList)

      // 无法移动（已经处在顶层）
      if (maxIndex === elementList.length - 1) return null

      // 该组合元素上一层的元素，以下简称为【元素next】
      const nextElement = copyOfElementList[maxIndex + 1]

      // 从元素列表中移除该组合元素全部成员
      const movedElementList = copyOfElementList.splice(minIndex, combineElementList.length)

      // 如果【元素next】也是组合元素成员（另一个组合，不是上面被移除的那一组，以下简称为【组合next】）
      // 需要获取【组合next】全部成员的长度，将上面移除的组合元素全部成员添加到【组合next】全部成员的上方
      if (nextElement.groupId) {
        const nextCombineElementList = copyOfElementList.filter(_element => _element.groupId === nextElement.groupId)
        copyOfElementList.splice(minIndex + nextCombineElementList.length, 0, ...movedElementList)
      }

      // 如果【元素next】是单独的元素（非组合成员），将上面移除的组合元素全部成员添加到【元素next】上方
      else copyOfElementList.splice(minIndex + 1, 0, ...movedElementList)
    }

    // 被操作的元素是单独的元素（非组合成员）
    else {

      // 元素在元素列表中的层级
      const elementIndex = elementList.findIndex(item => item.id === element.id)

      // 无法移动（已经处在顶层）
      if (elementIndex === elementList.length - 1) return null

      // 上一层的元素，以下简称为【元素next】
      const nextElement = copyOfElementList[elementIndex + 1]

      // 从元素列表中移除被操作的元素
      const movedElement = copyOfElementList.splice(elementIndex, 1)[0]

      // 如果【元素next】是组合元素成员
      // 需要获取该组合全部成员的长度，将上面移除的元素添加到该组合全部成员的上方
      if (nextElement.groupId) {
        const combineElementList = copyOfElementList.filter(_element => _element.groupId === nextElement.groupId)
        copyOfElementList.splice(elementIndex + combineElementList.length, 0, movedElement)
      }

      // 如果【元素next】是单独的元素（非组合成员），将上面移除的元素添加到【元素next】上方
      else copyOfElementList.splice(elementIndex + 1, 0, movedElement)
    }

    return copyOfElementList
  }

  // 下移一层
  const moveDownElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    if (element.groupId) {
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minIndex } = getCombineElementIndexRange(elementList, combineElementList)
      if (minIndex === 0) return null
      const prevElement = copyOfElementList[minIndex - 1]
      const movedElementList = copyOfElementList.splice(minIndex, combineElementList.length)
      if (prevElement.groupId) {
        const prevCombineElementList = copyOfElementList.filter(_element => _element.groupId === prevElement.groupId)
        copyOfElementList.splice(minIndex - prevCombineElementList.length, 0, ...movedElementList)
      }
      else copyOfElementList.splice(minIndex - 1, 0, ...movedElementList)
    }

    else {
      const elementIndex = elementList.findIndex(item => item.id === element.id)
      if (elementIndex === 0) return null
      const prevElement = copyOfElementList[elementIndex - 1]
      const movedElement = copyOfElementList.splice(elementIndex, 1)[0]
      if (prevElement.groupId) {
        const combineElementList = copyOfElementList.filter(_element => _element.groupId === prevElement.groupId)
        copyOfElementList.splice(elementIndex - combineElementList.length, 0, movedElement)
      }
      else copyOfElementList.splice(elementIndex - 1, 0, movedElement)
    }

    return copyOfElementList
  }

  // 置顶层，返回移动后新的元素列表（置底层逻辑类似）
  const moveTopElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // 被操作的元素是组合元素成员
    if (element.groupId) {

      // 获取该组合元素全部成员，以及组合元素层级范围
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minIndex, maxIndex } = getCombineElementIndexRange(elementList, combineElementList)

      // 无法移动（已经处在顶层）
      if (maxIndex === elementList.length - 1) return null

      // 从元素列表中移除该组合元素全部成员，然后添加到元素列表最上方
      const movedElementList = copyOfElementList.splice(minIndex, combineElementList.length)
      copyOfElementList.push(...movedElementList)
    }

    // 被操作的元素是单独的元素（非组合成员）
    else {

      // 元素在元素列表中的层级
      const elementIndex = elementList.findIndex(item => item.id === element.id)

      // 无法移动（已经处在顶层）
      if (elementIndex === elementList.length - 1) return null

      // 从元素列表中移除该元素，然后添加到元素列表最上方
      copyOfElementList.splice(elementIndex, 1)
      copyOfElementList.push(element)
    }

    return copyOfElementList
  }

  // 置底层
  const moveBottomElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    if (element.groupId) {
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minIndex } = getCombineElementIndexRange(elementList, combineElementList)
      if (minIndex === 0) return null
      const movedElementList = copyOfElementList.splice(minIndex, combineElementList.length)
      copyOfElementList.unshift(...movedElementList)
    }

    else {
      const elementIndex = elementList.findIndex(item => item.id === element.id)
      if (elementIndex === 0) return null
      copyOfElementList.splice(elementIndex, 1)
      copyOfElementList.unshift(element)
    }

    return copyOfElementList
  }

  const orderElement = (element: PPTElement, command: ElementOrderCommand) => {
    let newElementList = null
    
    if (command === ElementOrderCommands.UP) newElementList = moveUpElement(currentSlide.value.elements, element)
    else if (command === ElementOrderCommands.DOWN) newElementList = moveDownElement(currentSlide.value.elements, element)
    else if (command === ElementOrderCommands.TOP) newElementList = moveTopElement(currentSlide.value.elements, element)
    else if (command === ElementOrderCommands.BOTTOM) newElementList = moveBottomElement(currentSlide.value.elements, element)

    if (!newElementList) return

    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    addHistorySnapshot()
  }

  return {
    orderElement,
  }
}