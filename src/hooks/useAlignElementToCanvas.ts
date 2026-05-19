import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { ElementAlignCommands } from '@/types/edit'
import { getElementListRange } from '@/utils/element'
import useHistorySnapshot from './useHistorySnapshot'

/**
 * 提供将当前选中元素整体对齐到画布的操作。
 *
 * @returns 包含 `alignElementToCanvas` 的方法集合。
 * @throws 当前 composable 不主动抛错；JSON 深拷贝、store 更新或历史快照写入异常会按运行时错误表现。
 * @remarks
 * - 多个选中元素会被视为一个整体，先计算整体外接范围，再整体平移到画布目标位置。
 * - 对齐到画布时不会改变元素相对位置，只改变每个选中元素的 left/top。
 * - 每次执行都会记录历史快照。
 */
export default () => {
  // 获取幻灯片 store，用于读取当前页元素、画布尺寸并更新元素位置。
  const slidesStore = useSlidesStore()
  // 读取选中元素 ID 和选中元素实体列表。
  const { activeElementIdList, activeElementList } = storeToRefs(useMainStore())
  // 读取当前页、画布比例和画布宽度基准。
  const { currentSlide, viewportRatio, viewportSize } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于对齐后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 将所有选中的元素作为整体对齐到画布。
   *
   * @param command - 对齐方向或方式。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - `CENTER` 同时做水平和垂直居中。
   * - `HORIZONTAL` 仅水平居中，`VERTICAL` 仅垂直居中。
   * - 空选区会让范围计算产生无穷值，调用方应在入口层控制可用状态。
   */
  const alignElementToCanvas = (command: ElementAlignCommands) => {
    // 画布宽度使用当前 viewportSize。
    const viewportWidth = viewportSize.value
    // 画布高度由宽度和比例计算得到。
    const viewportHeight = viewportSize.value * viewportRatio.value
    // 获取当前选区整体外接范围，作为整体平移的基准。
    const { minX, maxX, minY, maxY } = getElementListRange(activeElementList.value)
  
    // 深拷贝当前页元素列表，避免直接修改响应式原对象。
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
    // 遍历当前页全部元素，只调整选中元素。
    for (const element of newElementList) {
      // 未选中的元素保持原位置。
      if (!activeElementIdList.value.includes(element.id)) continue
      
      // 水平垂直居中
      if (command === ElementAlignCommands.CENTER) {
        // 计算选区中心相对画布垂直中心的偏移。
        const offsetY = minY + (maxY - minY) / 2 - viewportHeight / 2
        // 计算选区中心相对画布水平中心的偏移。
        const offsetX = minX + (maxX - minX) / 2 - viewportWidth / 2
        // 所有选中元素减去同一垂直偏移，保持相对位置不变。
        element.top = element.top - offsetY 
        // 所有选中元素减去同一水平偏移，保持相对位置不变。
        element.left = element.left - offsetX           
      }

      // 顶部对齐
      if (command === ElementAlignCommands.TOP) {
        // 计算选区顶部到画布顶部的偏移。
        const offsetY = minY - 0
        // 平移所有选中元素，使选区顶部贴齐画布顶部。
        element.top = element.top - offsetY            
      }

      // 垂直居中
      else if (command === ElementAlignCommands.VERTICAL) {
        // 计算选区中心相对画布垂直中心的偏移。
        const offsetY = minY + (maxY - minY) / 2 - viewportHeight / 2
        // 只平移垂直方向。
        element.top = element.top - offsetY            
      }

      // 底部对齐
      else if (command === ElementAlignCommands.BOTTOM) {
        // 计算选区底部到画布底部的偏移。
        const offsetY = maxY - viewportHeight
        // 平移所有选中元素，使选区底部贴齐画布底部。
        element.top = element.top - offsetY       
      }
      
      // 左侧对齐
      else if (command === ElementAlignCommands.LEFT) {
        // 计算选区左侧到画布左侧的偏移。
        const offsetX = minX - 0
        // 平移所有选中元素，使选区左侧贴齐画布左侧。
        element.left = element.left - offsetX            
      }

      // 水平居中
      else if (command === ElementAlignCommands.HORIZONTAL) {
        // 计算选区中心相对画布水平中心的偏移。
        const offsetX = minX + (maxX - minX) / 2 - viewportWidth / 2
        // 只平移水平方向。
        element.left = element.left - offsetX            
      }

      // 右侧对齐
      else if (command === ElementAlignCommands.RIGHT) {
        // 计算选区右侧到画布右侧的偏移。
        const offsetX = maxX - viewportWidth
        // 平移所有选中元素，使选区右侧贴齐画布右侧。
        element.left = element.left - offsetX            
      }
    }

    // 写回对齐后的元素列表。
    slidesStore.updateSlide({ elements: newElementList })
    // 记录历史快照，支持撤销本次对齐。
    addHistorySnapshot()
  }

  // 返回画布对齐操作方法。
  return {
    alignElementToCanvas,
  }
}
