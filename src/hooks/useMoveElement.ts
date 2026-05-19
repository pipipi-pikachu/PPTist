import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { KEYS } from '@/configs/hotkey'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

/**
 * 提供通过方向命令移动当前选中元素的操作。
 *
 * @returns 包含 `moveElement` 的方法集合。
 * @throws 当前 composable 不主动抛错；store 更新异常会向上表现为运行时错误。
 * @remarks
 * - 普通多选时移动 `activeElementIdList` 中的全部元素。
 * - 当组合内部存在可独立操作的 `activeGroupElementId` 时，优先只移动该组合成员。
 * - 每次移动完成后都会记录历史快照，支持撤销/重做。
 */
export default () => {
  // 获取幻灯片 store，用于更新当前页元素位置。
  const slidesStore = useSlidesStore()
  // 读取选中元素列表和组合内当前操作元素 ID。
  const { activeElementIdList, activeGroupElementId } = storeToRefs(useMainStore())
  // 当前幻灯片响应式引用。
  const { currentSlide } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于移动后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 将元素向指定方向移动指定距离。
   *
   * @param command - 移动方向，通常来自快捷键配置中的 `KEYS.LEFT/RIGHT/UP/DOWN`。
   * @param step - 移动距离，默认 1 个画布单位。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 组合元素成员中存在被选中可独立操作的元素时，优先移动该成员。
   * - 否则默认移动所有被选中的元素。
   * - 未识别的 command 会保持元素位置不变，但仍会更新 slide 并记录快照，这是既有行为。
   */
  const moveElement = (command: string, step = 1) => {
    // 存放移动后的新元素列表。
    let newElementList: PPTElement[] = []

    /**
     * 根据方向命令移动单个元素。
     *
     * @param el - 待移动元素。
     * @returns 拷贝并更新 left/top 后的新元素对象。
     * @throws 当前内部函数不主动抛错。
     * @remarks 该函数不修改原元素对象，返回浅拷贝结果。
     */
    const move = (el: PPTElement) => {
      // 提取当前元素位置，后续根据方向命令修改。
      let { left, top } = el
      // 根据快捷键方向命令调整 left 或 top。
      switch (command) {
        // 向左移动时减少 x 坐标。
        case KEYS.LEFT:
          left = left - step
          break
        // 向右移动时增加 x 坐标。
        case KEYS.RIGHT:
          left = left + step
          break
        // 向上移动时减少 y 坐标。
        case KEYS.UP:
          top = top - step
          break
        // 向下移动时增加 y 坐标。
        case KEYS.DOWN:
          top = top + step
          break
        // 未识别方向保持原位置不变。
        default: break
      }
      // 返回更新后元素拷贝，保留其他业务字段。
      return { ...el, left, top }
    }

    // 如果当前正在单独操作组合内某个成员，则只移动该成员。
    if (activeGroupElementId.value) {
      // 遍历当前页元素，命中 activeGroupElementId 的元素执行移动。
      newElementList = currentSlide.value.elements.map(el => {
        // 只对组合内当前活动元素应用移动，其余元素保持原引用。
        return activeGroupElementId.value === el.id ? move(el) : el
      })
    }
    // 否则移动普通选区中的全部元素。
    else {
      // 遍历当前页元素，命中 activeElementIdList 的元素执行移动。
      newElementList = currentSlide.value.elements.map(el => {
        // 选中元素移动，未选中元素保持不变。
        return activeElementIdList.value.includes(el.id) ? move(el) : el
      })
    }

    // 写回移动后的元素列表。
    slidesStore.updateSlide({ elements: newElementList })
    // 记录历史快照，支持撤销本次移动。
    addHistorySnapshot()
  }

  // 返回移动操作方法，供快捷键或工具交互调用。
  return {
    moveElement,
  }
}
