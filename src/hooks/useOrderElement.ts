import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { PPTElement } from '@/types/slides'
import { ElementOrderCommands } from '@/types/edit'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const slidesStore = useSlidesStore()
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * Get the level scope of the combined element
   * @param elementList list of all elements on this page
   * @param combineElementList combined element list
   */
  const getCombineElementLevelRange = (elementList: PPTElement[], combineElementList: PPTElement[]) => {
    return {
      minLevel: elementList.findIndex(_element => _element.id === combineElementList[0].id),
      maxLevel: elementList.findIndex(_element => _element.id === combineElementList[combineElementList.length - 1].id),
    }
  }

  /**
   * Move up one layer
   * @param elementList list of all elements on this page
   * @param element The element of the current operation
   */
  const moveUpElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // If the element being operated is a member of a combination element, all members of the combination need to be moved together
    if (element.groupId) {

      // Obtain all members of the combination, as well as the level range of all members
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel, maxLevel } = getCombineElementLevelRange(elementList, combineElementList)

      // Already at the top level, cannot move further
      if (maxLevel === elementList.length - 1) return

      // Through the maximum value of the combined member range, get the element of the upper level of the combination, and then remove the combined element from the element list (and cache the removed element list)
      // If the upper-level element is in another combination, insert the above-mentioned removed combination element above the upper-level combination
      // If the upper-level element is not in any group, insert the above-mentioned removed combination element above the upper-level element
      const nextElement = copyOfElementList[maxLevel + 1]
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)

      if (nextElement.groupId) {
        const nextCombineElementList = copyOfElementList.filter(_element => _element.groupId === nextElement.groupId)
        copyOfElementList.splice(minLevel + nextCombineElementList.length, 0, ...movedElementList)
      }
      else copyOfElementList.splice(minLevel + 1, 0, ...movedElementList)
    }

    // If the element being operated on is not a composite element member
    else {

      // Get the level of the element in the list
      const level = elementList.findIndex(item => item.id === element.id)

      // Already at the top level, cannot move further
      if (level === elementList.length - 1) return

      // Get the elements of the upper layer of the combination, and then remove the combined element from the element list (and cache the removed element list)
      const nextElement = copyOfElementList[level + 1]
      const movedElement = copyOfElementList.splice(level, 1)[0]

      // Through the maximum value of the combined member range, get the element of the upper level of the combination, and then remove the combined element from the element list (and cache the removed element list)
      // If the upper-level element is in another combination, insert the above-mentioned removed combination element above the upper-level combination
      // If the upper-level element is not in any group, insert the above-mentioned removed combination element above the upper-level element
      if (nextElement.groupId) {
        const combineElementList = copyOfElementList.filter(_element => _element.groupId === nextElement.groupId)
        copyOfElementList.splice(level + combineElementList.length, 0, movedElement)
      }
      else copyOfElementList.splice(level + 1, 0, movedElement)
    }

    return copyOfElementList
  }

  /**
   * Move down one layer, the operation method is the same as move up
   * @param elementList list of all elements on this page
   * @param element The element of the current operation
   */
  const moveDownElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    if (element.groupId) {
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel } = getCombineElementLevelRange(elementList, combineElementList)
      if (minLevel === 0) return

      const prevElement = copyOfElementList[minLevel - 1]
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)

      if (prevElement.groupId) {
        const prevCombineElementList = copyOfElementList.filter(_element => _element.groupId === prevElement.groupId)
        copyOfElementList.splice(minLevel - prevCombineElementList.length, 0, ...movedElementList)
      }
      else copyOfElementList.splice(minLevel - 1, 0, ...movedElementList)
    }

    else {
      const level = elementList.findIndex(item => item.id === element.id)
      if (level === 0) return

      const prevElement = copyOfElementList[level - 1]
      const movedElement = copyOfElementList.splice(level, 1)[0]

      if (prevElement.groupId) {
        const combineElementList = copyOfElementList.filter(_element => _element.groupId === prevElement.groupId)
        copyOfElementList.splice(level - combineElementList.length, 0, movedElement)
      }
      else copyOfElementList.splice(level - 1, 0, movedElement)
    }

    return copyOfElementList
  }
  /**
    * top layer
    * @param elementList list of all elements on this page
    * @param element The element of the current operation
    */
  const moveTopElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // If the element being operated is a member of a combination element, all members of the combination need to be moved together
    if (element.groupId) {

      // Obtain all members of the combination, as well as the level range of all members
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel, maxLevel } = getCombineElementLevelRange(elementList, combineElementList)

      // Already at the top level, cannot move further
      if (maxLevel === elementList.length - 1) return null

      // Remove the combined element from the element list, and then add the removed element to the top of the element list
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)
      copyOfElementList.push(...movedElementList)
    }

    // If the element being operated on is not a composite element member
    else {

      // Get the level of the element in the list
      const level = elementList.findIndex(item => item.id === element.id)

      // Already at the top level, cannot move further
      if (level === elementList.length - 1) return null

      // Remove the combined element from the element list, and then add the removed element to the bottom of the element list
      copyOfElementList.splice(level, 1)
      copyOfElementList.push(element)
    }

    return copyOfElementList
  }

  /**
   * Put it at the bottom, the operation method is the same as putting it at the top
   * @param elementList list of all elements on this page
   * @param element The element of the current operation
   */
  const moveBottomElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    if (element.groupId) {
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel } = getCombineElementLevelRange(elementList, combineElementList)
      if (minLevel === 0) return

      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)
      copyOfElementList.unshift(...movedElementList)
    }

    else {
      const level = elementList.findIndex(item => item.id === element.id)
      if (level === 0) return

      copyOfElementList.splice(level, 1)
      copyOfElementList.unshift(element)
    }

    return copyOfElementList
  }

  /**
   * Adjust element level
   * @param element The element that needs to adjust the level
   * @param command adjustment command: move up, move down, top, bottom
   */
  const orderElement = (element: PPTElement, command: ElementOrderCommands) => {
    let newElementList

    if (command === ElementOrderCommands.UP) newElementList = moveUpElement(currentSlide.value.elements, element)
    else if (command === ElementOrderCommands.DOWN) newElementList = moveDownElement(currentSlide.value.elements, element)
    else if (command === ElementOrderCommands.TOP) newElementList = moveTopElement(currentSlide.value.elements, element)
    else if (command === ElementOrderCommands.BOTTOM) newElementList = moveBottomElement(currentSlide.value.elements, element)

    if (!newElementList) return

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  return {
    orderElement,
  }
}