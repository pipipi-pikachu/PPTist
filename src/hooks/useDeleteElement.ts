import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

/**
 * 提供删除当前选中元素或清空当前页元素的操作。
 *
 * @returns 包含删除选中元素和删除当前页全部元素的方法集合。
 * @throws 当前 composable 不主动抛错；store 更新异常会向上表现为运行时错误。
 * @remarks
 * - 删除选中元素后会清空选区并记录历史快照。
 * - 当组合内部存在可独立操作的 activeGroupElementId 时，优先删除该组合成员。
 * - 删除全部元素不区分锁定、隐藏或选中状态，会清空当前页 elements。
 */
export default () => {
  // 获取主状态 store，用于读取和清空选中状态。
  const mainStore = useMainStore()
  // 获取幻灯片 store，用于更新当前页元素列表。
  const slidesStore = useSlidesStore()
  // 读取当前选中元素 ID 列表和组合内当前活动元素 ID。
  const { activeElementIdList, activeGroupElementId } = storeToRefs(mainStore)
  // 当前幻灯片响应式引用。
  const { currentSlide } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于删除后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 删除当前选中的元素。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 没有选中元素时直接返回，不更新 store，也不记录历史快照。
   * - 组合元素成员中存在被选中可独立操作的元素时，优先删除该成员。
   * - 否则默认删除所有 activeElementIdList 中的元素。
   */
  const deleteElement = () => {
    // 没有选中元素时无需删除，避免产生空快照。
    if (!activeElementIdList.value.length) return

    // 存放删除后的元素列表。
    let newElementList: PPTElement[] = []
    // 若正在单独操作组合内部元素，则只删除该成员。
    if (activeGroupElementId.value) {
      // 过滤掉组合内当前活动元素。
      newElementList = currentSlide.value.elements.filter(el => el.id !== activeGroupElementId.value)
    }
    // 普通选区删除时，删除所有选中元素。
    else {
      // 过滤掉 activeElementIdList 中的全部元素。
      newElementList = currentSlide.value.elements.filter(el => !activeElementIdList.value.includes(el.id))
    }

    // 删除后清空选区，避免选中状态引用已不存在的元素。
    mainStore.setActiveElementIdList([])
    // 写回删除后的元素列表。
    slidesStore.updateSlide({ elements: newElementList })
    // 记录历史快照，支持撤销本次删除。
    addHistorySnapshot()
  }

  /**
   * 删除当前幻灯片内的全部元素。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 当前页没有元素时直接返回，不记录历史快照。
   * - 该操作不检查元素是否锁定或隐藏，调用方应在入口层控制权限和确认弹窗。
   */
  const deleteAllElements = () => {
    // 当前页没有元素时无需处理，避免产生无意义快照。
    if (!currentSlide.value.elements.length) return
    // 清空选区，避免选中状态引用即将被删除的元素。
    mainStore.setActiveElementIdList([])
    // 将当前页元素列表置空。
    slidesStore.updateSlide({ elements: [] })
    // 记录历史快照，支持撤销清空操作。
    addHistorySnapshot()
  }

  // 返回删除相关操作方法，供快捷键、工具栏或上下文菜单调用。
  return {
    deleteElement,
    deleteAllElements,
  }
}
