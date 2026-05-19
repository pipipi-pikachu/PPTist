import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { ElementAlignCommands } from '@/types/edit'
import { getElementListRange, getRectRotatedOffset } from '@/utils/element'
import useHistorySnapshot from './useHistorySnapshot'

/**
 * 组合范围映射表。
 *
 * @remarks key 为 groupId，value 为该组合在当前选区中的整体外接范围。
 */
interface RangeMap {
  [id: string]: ReturnType<typeof getElementListRange>
}

/**
 * 提供选中元素之间的相互对齐操作。
 *
 * @returns 包含 `alignActiveElement` 的方法集合。
 * @throws 当前 composable 不主动抛错；JSON 深拷贝、store 更新或历史快照写入异常会按运行时错误表现。
 * @remarks
 * - 对齐基准是当前选区整体外接范围，而不是画布。
 * - 组合元素会按组合整体范围对齐，再把同组每个成员平移同样偏移量。
 * - 旋转矩形元素在边缘对齐时会通过 `getRectRotatedOffset()` 修正视觉边界与 left/top 的差异。
 */
export default () => {
  // 获取幻灯片 store，用于更新当前页元素列表。
  const slidesStore = useSlidesStore()
  // 读取当前选中元素 ID 和元素实体列表。
  const { activeElementIdList, activeElementList } = storeToRefs(useMainStore())
  // 当前幻灯片响应式引用。
  const { currentSlide } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于对齐后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 对齐当前选中的元素。
   *
   * @param command - 对齐方向或方式。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 空选区或单选情况下调用会保持既有计算行为，调用方应控制按钮可用状态。
   */
  const alignActiveElement = (command: ElementAlignCommands) => {
    // 获取整个选区的外接范围，作为对齐目标边界或中心。
    const { minX, maxX, minY, maxY } = getElementListRange(activeElementList.value)
    // 深拷贝当前页元素列表，避免直接修改响应式原对象。
    const elementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // 如果所选择的元素为组合元素的成员，需要计算该组合的整体范围
    const groupElementRangeMap: RangeMap = {}
    // 遍历当前选中元素，收集每个组合在选区中的整体范围。
    for (const activeElement of activeElementList.value) {
      // 只为每个 groupId 计算一次范围，避免重复计算。
      if (activeElement.groupId && !groupElementRangeMap[activeElement.groupId]) {
        // 找到当前选区中属于同一组的元素。
        const groupElements = activeElementList.value.filter(item => item.groupId === activeElement.groupId)
        // 计算该组整体范围，后续同组成员使用同一偏移量。
        groupElementRangeMap[activeElement.groupId] = getElementListRange(groupElements)
      }
    }

    // 根据不同的命令，计算对齐的位置
    if (command === ElementAlignCommands.LEFT) {
      // 左对齐：所有目标视觉左边界对齐到选区最小 x。
      elementList.forEach(element => {
        // 只处理当前选中的元素。
        if (activeElementIdList.value.includes(element.id)) {
          // 非组合元素直接按自身范围对齐。
          if (!element.groupId) {
            // 旋转元素 left 不等于视觉左边界，需要扣除旋转偏移。
            if ('rotate' in element && element.rotate) {
              const { offsetX } = getRectRotatedOffset({
                left: element.left,
                top: element.top,
                width: element.width,
                height: element.height,
                rotate: element.rotate,
              })
              element.left = minX - offsetX
            }
            // 未旋转元素 left 就是视觉左边界。
            else element.left = minX
          }
          // 组合元素按组合整体范围计算偏移，组内成员一起平移。
          else {
            const range = groupElementRangeMap[element.groupId]
            const offset = range.minX - minX
            element.left = element.left - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.RIGHT) {
      // 右对齐：所有目标视觉右边界对齐到选区最大 x。
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            // 线条宽度按起止点最大 x 计算，矩形类元素使用 width。
            const elWidth = element.type === 'line' ? Math.max(element.start[0], element.end[0]) : element.width
            // 旋转元素需要加回旋转偏移，保证视觉右边界对齐。
            if ('rotate' in element && element.rotate) {
              const { offsetX } = getRectRotatedOffset({
                left: element.left,
                top: element.top,
                width: element.width,
                height: element.height,
                rotate: element.rotate,
              })
              element.left = maxX - elWidth + offsetX
            }
            // 未旋转元素右边界为 left + width。
            else element.left = maxX - elWidth
          }
          else {
            // 组合元素按组合右边界计算偏移。
            const range = groupElementRangeMap[element.groupId]
            const offset = range.maxX - maxX
            element.left = element.left - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.TOP) {
      // 顶部对齐：所有目标视觉上边界对齐到选区最小 y。
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            // 旋转元素 top 不等于视觉上边界，需要扣除旋转偏移。
            if ('rotate' in element && element.rotate) {
              const { offsetY } = getRectRotatedOffset({
                left: element.left,
                top: element.top,
                width: element.width,
                height: element.height,
                rotate: element.rotate,
              })
              element.top = minY - offsetY
            }
            // 未旋转元素 top 就是视觉上边界。
            else element.top = minY
          }
          else {
            // 组合元素按组合上边界计算偏移。
            const range = groupElementRangeMap[element.groupId]
            const offset = range.minY - minY
            element.top = element.top - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.BOTTOM) {
      // 底部对齐：所有目标视觉下边界对齐到选区最大 y。
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            // 线条高度按起止点最大 y 计算，矩形类元素使用 height。
            const elHeight = element.type === 'line' ? Math.max(element.start[1], element.end[1]) : element.height
            // 旋转元素需要加回旋转偏移，保证视觉下边界对齐。
            if ('rotate' in element && element.rotate) {
              const { offsetY } = getRectRotatedOffset({
                left: element.left,
                top: element.top,
                width: element.width,
                height: element.height,
                rotate: element.rotate,
              })
              element.top = maxY - elHeight + offsetY
            }
            // 未旋转元素下边界为 top + height。
            else element.top = maxY - elHeight
          }
          else {
            // 组合元素按组合下边界计算偏移。
            const range = groupElementRangeMap[element.groupId]
            const offset = range.maxY - maxY
            element.top = element.top - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.HORIZONTAL) {
      // 计算选区水平中心线。
      const horizontalCenter = (minX + maxX) / 2
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            // 线条宽度按起止点最大 x 计算，矩形类元素使用 width。
            const elWidth = element.type === 'line' ? Math.max(element.start[0], element.end[0]) : element.width
            // 将元素自身中心移动到选区水平中心。
            element.left = horizontalCenter - elWidth / 2
          }
          else {
            // 组合元素按组合整体中心计算偏移。
            const range = groupElementRangeMap[element.groupId]
            const center = (range.maxX + range.minX) / 2
            const offset = center - horizontalCenter
            element.left = element.left - offset
          }
        }
      })
    }
    else if (command === ElementAlignCommands.VERTICAL) {
      // 计算选区垂直中心线。
      const verticalCenter = (minY + maxY) / 2
      elementList.forEach(element => {
        if (activeElementIdList.value.includes(element.id)) {
          if (!element.groupId) {
            // 线条高度按起止点最大 y 计算，矩形类元素使用 height。
            const elHeight = element.type === 'line' ? Math.max(element.start[1], element.end[1]) : element.height
            // 将元素自身中心移动到选区垂直中心。
            element.top = verticalCenter - elHeight / 2
          }
          else {
            // 组合元素按组合整体中心计算偏移。
            const range = groupElementRangeMap[element.groupId]
            const center = (range.maxY + range.minY) / 2
            const offset = center - verticalCenter
            element.top = element.top - offset
          }
        }
      })
    }

    // 写回对齐后的元素列表。
    slidesStore.updateSlide({ elements: elementList })
    // 记录历史快照，支持撤销本次对齐。
    addHistorySnapshot()
  }

  // 返回选中元素对齐方法。
  return {
    alignActiveElement,
  }
}
