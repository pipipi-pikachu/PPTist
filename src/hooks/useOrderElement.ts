import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { ElementOrderCommands } from '@/types/edit'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

/**
 * 提供元素图层顺序调整能力。
 *
 * @returns 包含 `orderElement` 的方法集合。
 * @throws 当前 composable 不主动抛错；JSON 深拷贝、store 更新或历史快照写入异常会按运行时错误表现。
 * @remarks
 * - 元素数组顺序即画布渲染层级，数组越靠后通常越靠上显示。
 * - 组合元素成员调整层级时会整组移动，避免组合成员被其他元素插入打散。
 * - 每次实际改变层级后都会记录历史快照，支持撤销/重做。
 */
export default () => {
  // 获取幻灯片 store，用于读取和更新当前页元素列表。
  const slidesStore = useSlidesStore()
  // 当前幻灯片响应式引用，包含当前页元素层级数组。
  const { currentSlide } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于层级变化后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 获取组合元素成员在当前页元素数组中的层级范围。
   *
   * @param elementList - 本页所有元素列表。
   * @param combineElementList - 同一组合下的元素列表。
   * @returns 组合成员最小层级索引和最大层级索引。
   * @throws 当组合列表为空时访问首尾元素会产生运行时异常，调用方应确保传入有效组合。
   * @remarks 该函数假设组合成员在元素数组中保持连续，这是后续整组移动的基础。
   */
  const getCombineElementLevelRange = (elementList: PPTElement[], combineElementList: PPTElement[]) => {
    // 通过组合第一个成员 ID 定位组合起始层级。
    return {
      minLevel: elementList.findIndex(_element => _element.id === combineElementList[0].id),
      // 通过组合最后一个成员 ID 定位组合结束层级。
      maxLevel: elementList.findIndex(_element => _element.id === combineElementList[combineElementList.length - 1].id),
    }
  }

  /**
   * 将元素或其所在组合上移一层。
   *
   * @param elementList - 本页所有元素列表。
   * @param element - 当前操作的元素。
   * @returns 调整后的元素列表；如果已经处于顶层则返回 `undefined`。
   * @throws JSON 深拷贝失败或数组访问异常时会产生运行时错误。
   * @remarks
   * - 非组合元素上移时，如果上方元素属于组合，会跨过整个上方组合。
   * - 组合元素上移时，整组作为一个连续块移动。
   */
  const moveUpElement = (elementList: PPTElement[], element: PPTElement) => {
    // 深拷贝元素列表，避免直接修改当前 slide 中的响应式数组。
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // 如果被操作的元素是组合元素成员，需要将该组合全部成员一起进行移动
    if (element.groupId) {

      // 获取到该组合全部成员，以及所有成员的层级范围
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel, maxLevel } = getCombineElementLevelRange(elementList, combineElementList)

      // 已经处在顶层，无法继续移动
      if (maxLevel === elementList.length - 1) return

      // 通过组合成员范围的最大值，获取到该组合上一层的元素，然后将该组合元素从元素列表中移除（并缓存被移除的元素列表）
      // 若上层元素处在另一个组合中，则将上述被移除的组合元素插入到该上层组合上方
      // 若上层元素不处于任何分组中，则将上述被移除的组合元素插入到该上层元素上方
      const nextElement = copyOfElementList[maxLevel + 1]
      // 从列表中移除当前组合连续块，并缓存待移动成员。
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)

      // 如果上一层元素属于另一个组合，则需要跨过那个组合的全部成员。
      if (nextElement.groupId) {
        // 获取被跨过组合的全部成员数量，用于计算插入位置。
        const nextCombineElementList = copyOfElementList.filter(_element => _element.groupId === nextElement.groupId)
        // 插入到上方组合之后，使当前组合整体位于其上层。
        copyOfElementList.splice(minLevel + nextCombineElementList.length, 0, ...movedElementList)
      }
      // 上方元素不是组合时，只需插入到该元素后一位。
      else copyOfElementList.splice(minLevel + 1, 0, ...movedElementList)
    }

    // 如果被操作的元素不是组合元素成员
    else {

      // 获取该元素在列表中的层级
      const level = elementList.findIndex(item => item.id === element.id)

      // 已经处在顶层，无法继续移动
      if (level === elementList.length - 1) return

      // 获取到该组合上一层的元素，然后将该组合元素从元素列表中移除（并缓存被移除的元素列表）
      const nextElement = copyOfElementList[level + 1]
      // 移除当前单个元素，并缓存该元素。
      const movedElement = copyOfElementList.splice(level, 1)[0]

      // 通过组合成员范围的最大值，获取到该组合上一层的元素，然后将该组合元素从元素列表中移除（并缓存被移除的元素列表）
      // 若上层元素处在另一个组合中，则将上述被移除的组合元素插入到该上层组合上方
      // 若上层元素不处于任何分组中，则将上述被移除的组合元素插入到该上层元素上方
      if (nextElement.groupId) {
        // 获取上方组合成员数量，确保单元素跨过整个组合。
        const combineElementList = copyOfElementList.filter(_element => _element.groupId === nextElement.groupId)
        // 插入到上方组合之后，使单元素位于该组合上层。
        copyOfElementList.splice(level + combineElementList.length, 0, movedElement)
      }
      // 上方元素不是组合时，插入到原位置后一位即可。
      else copyOfElementList.splice(level + 1, 0, movedElement)
    }

    // 返回调整后的新列表。
    return copyOfElementList
  }

  /**
   * 将元素或其所在组合下移一层。
   *
   * @param elementList - 本页所有元素列表。
   * @param element - 当前操作的元素。
   * @returns 调整后的元素列表；如果已经处于底层则返回 `undefined`。
   * @throws JSON 深拷贝失败或数组访问异常时会产生运行时错误。
   * @remarks 操作方式与上移对称，遇到下方组合时会跨过整个组合。
   */
  const moveDownElement = (elementList: PPTElement[], element: PPTElement) => {
    // 深拷贝元素列表，避免直接修改当前 slide 中的响应式数组。
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // 组合成员下移时，需要把同组成员作为一个整体移动。
    if (element.groupId) {
      // 获取当前组合全部成员。
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      // 获取组合最底层索引，用于判断是否已到底层和计算移动位置。
      const { minLevel } = getCombineElementLevelRange(elementList, combineElementList)
      // 组合已经在底层时无法继续下移。
      if (minLevel === 0) return

      // 获取组合下方紧邻元素。
      const prevElement = copyOfElementList[minLevel - 1]
      // 移除当前组合连续块，并缓存待移动成员。
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)

      // 下方元素属于另一个组合时，跨过整个下方组合。
      if (prevElement.groupId) {
        // 获取下方组合全部成员数量，用于向前计算插入位置。
        const prevCombineElementList = copyOfElementList.filter(_element => _element.groupId === prevElement.groupId)
        // 插入到下方组合之前，使当前组合整体位于其下层。
        copyOfElementList.splice(minLevel - prevCombineElementList.length, 0, ...movedElementList)
      }
      // 下方元素不是组合时，插入到原位置前一位。
      else copyOfElementList.splice(minLevel - 1, 0, ...movedElementList)
    }

    // 非组合元素下移时，只移动单个元素。
    else {
      // 获取当前元素层级索引。
      const level = elementList.findIndex(item => item.id === element.id)
      // 已经在底层时无法继续下移。
      if (level === 0) return

      // 获取下方紧邻元素。
      const prevElement = copyOfElementList[level - 1]
      // 移除当前元素，并缓存该元素。
      const movedElement = copyOfElementList.splice(level, 1)[0]

      // 下方元素属于组合时，单元素跨过整个组合。
      if (prevElement.groupId) {
        // 获取下方组合全部成员。
        const combineElementList = copyOfElementList.filter(_element => _element.groupId === prevElement.groupId)
        // 插入到下方组合之前。
        copyOfElementList.splice(level - combineElementList.length, 0, movedElement)
      }
      // 下方元素不是组合时，插入到原位置前一位。
      else copyOfElementList.splice(level - 1, 0, movedElement)
    }

    // 返回调整后的新列表。
    return copyOfElementList
  }

  /**
   * 将元素或其所在组合置于顶层。
   *
   * @param elementList - 本页所有元素列表。
   * @param element - 当前操作的元素。
   * @returns 调整后的元素列表；如果已经在顶层则返回 `null` 或 `undefined`，保持既有行为。
   * @throws JSON 深拷贝失败或数组访问异常时会产生运行时错误。
   */
  const moveTopElement = (elementList: PPTElement[], element: PPTElement) => {
    // 深拷贝元素列表，避免直接修改当前 slide 中的响应式数组。
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // 如果被操作的元素是组合元素成员，需要将该组合全部成员一起进行移动
    if (element.groupId) {

      // 获取到该组合全部成员，以及所有成员的层级范围
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel, maxLevel } = getCombineElementLevelRange(elementList, combineElementList)

      // 已经处在顶层，无法继续移动
      if (maxLevel === elementList.length - 1) return null

      // 将该组合元素从元素列表中移除，然后将被移除的元素添加到元素列表顶部
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)
      // push 到数组末尾，表示显示层级置顶。
      copyOfElementList.push(...movedElementList)
    }

    // 如果被操作的元素不是组合元素成员
    else {

      // 获取该元素在列表中的层级
      const level = elementList.findIndex(item => item.id === element.id)

      // 已经处在顶层，无法继续移动
      if (level === elementList.length - 1) return null

      // 将该组合元素从元素列表中移除，然后将被移除的元素添加到元素列表底部
      copyOfElementList.splice(level, 1)
      // push 到数组末尾，表示单元素置顶。
      copyOfElementList.push(element)
    }

    // 返回调整后的新列表。
    return copyOfElementList
  }

  /**
   * 将元素或其所在组合置于底层。
   *
   * @param elementList - 本页所有元素列表。
   * @param element - 当前操作的元素。
   * @returns 调整后的元素列表；如果已经在底层则返回 `undefined`。
   * @throws JSON 深拷贝失败或数组访问异常时会产生运行时错误。
   * @remarks 操作方式与置顶对称，数组头部表示更低层级。
   */
  const moveBottomElement = (elementList: PPTElement[], element: PPTElement) => {
    // 深拷贝元素列表，避免直接修改当前 slide 中的响应式数组。
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // 组合元素置底时，整组作为连续块移动到数组头部。
    if (element.groupId) {
      // 获取当前组合全部成员。
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      // 获取组合最低层级。
      const { minLevel } = getCombineElementLevelRange(elementList, combineElementList)
      // 已在底层时无需移动。
      if (minLevel === 0) return

      // 移除组合连续块。
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)
      // unshift 到数组头部，表示显示层级置底。
      copyOfElementList.unshift(...movedElementList)
    }

    // 非组合元素置底时，只移动单个元素。
    else {
      // 获取当前元素层级。
      const level = elementList.findIndex(item => item.id === element.id)
      // 已在底层时无需移动。
      if (level === 0) return

      // 移除当前元素。
      copyOfElementList.splice(level, 1)
      // unshift 到数组头部，表示单元素置底。
      copyOfElementList.unshift(element)
    }

    // 返回调整后的新列表。
    return copyOfElementList
  }

  /**
   * 根据命令调整元素层级。
   *
   * @param element - 需要调整层级的元素。
   * @param command - 调整命令：上移、下移、置顶、置底。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 无法移动时不会更新 slide，也不会记录历史快照。
   */
  const orderElement = (element: PPTElement, command: ElementOrderCommands) => {
    // 存放命令执行后得到的新元素列表；无法移动时保持为空。
    let newElementList
    
    // 执行上移一层。
    if (command === ElementOrderCommands.UP) newElementList = moveUpElement(currentSlide.value.elements, element)
    // 执行下移一层。
    else if (command === ElementOrderCommands.DOWN) newElementList = moveDownElement(currentSlide.value.elements, element)
    // 执行置顶。
    else if (command === ElementOrderCommands.TOP) newElementList = moveTopElement(currentSlide.value.elements, element)
    // 执行置底。
    else if (command === ElementOrderCommands.BOTTOM) newElementList = moveBottomElement(currentSlide.value.elements, element)

    // 如果命令未产生新列表，说明已到边界或命令无效，直接返回。
    if (!newElementList) return

    // 写回调整后的元素列表。
    slidesStore.updateSlide({ elements: newElementList })
    // 记录历史快照，支持撤销本次层级调整。
    addHistorySnapshot()
  }

  // 返回层级调整方法，供工具栏、右键菜单或快捷键调用。
  return {
    orderElement,
  }
}
