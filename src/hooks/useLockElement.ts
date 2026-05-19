import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

/**
 * 提供元素锁定与解锁相关操作。
 *
 * @returns 包含锁定选中元素和解锁指定元素的方法集合。
 * @throws 当前 composable 不主动抛错；JSON 深拷贝或 store 更新异常会向上表现为运行时错误。
 * @remarks
 * - 锁定状态写入元素自身的 `lock` 字段，因此会改变当前幻灯片元素数据。
 * - 每次锁定或解锁后都会记录历史快照，支持撤销/重做。
 * - 解锁组合内任一元素时，会解锁同 groupId 的全部组合成员并选中整组。
 */
export default () => {
  // 获取主状态 store，用于读取和更新当前选中元素。
  const mainStore = useMainStore()
  // 获取幻灯片 store，用于更新当前页元素列表。
  const slidesStore = useSlidesStore()
  // 当前选中的元素 ID 列表。
  const { activeElementIdList } = storeToRefs(mainStore)
  // 当前幻灯片响应式引用。
  const { currentSlide } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于操作完成后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 锁定当前选中的元素，并清空选中状态。
   *
   * @returns 无显式返回值。
   * @throws `JSON.parse(JSON.stringify())` 深拷贝失败或 store 更新失败时会产生运行时异常。
   * @remarks
   * - 只锁定 `activeElementIdList` 中的元素。
   * - 锁定后元素不可继续作为普通选中目标，因此会清空 activeElementIdList。
   * - 当前函数不处理空选区的提前返回，保持既有行为。
   */
  const lockElement = () => {
    // 对当前页元素做深拷贝，避免直接修改 Pinia 中原数组引用。
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
  
    // 遍历当前页元素，命中选中 ID 的元素写入锁定状态。
    for (const element of newElementList) {
      // 只有当前选中的元素会被锁定。
      if (activeElementIdList.value.includes(element.id)) element.lock = true
    }
    // 用更新后的元素列表覆盖当前幻灯片元素数据。
    slidesStore.updateSlide({ elements: newElementList })
    // 锁定后清空选中状态，避免锁定元素仍显示为可编辑状态。
    mainStore.setActiveElementIdList([])
    // 记录历史快照，支持撤销本次锁定操作。
    addHistorySnapshot()
  }

  /**
   * 解除元素的锁定状态，并将其设置为当前选择元素。
   *
   * @param handleElement - 需要解锁的元素。
   * @returns 无显式返回值。
   * @throws `JSON.parse(JSON.stringify())` 深拷贝失败或 store 更新失败时会产生运行时异常。
   * @remarks
   * - 如果传入元素属于组合，则解锁同一 groupId 下的全部元素，并选中整组。
   * - 如果传入元素不属于组合，则只解锁该元素，并将其设置为唯一选中元素。
   */
  const unlockElement = (handleElement: PPTElement) => {
    // 深拷贝当前页元素，保证后续修改不会直接污染原始响应式对象。
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // 组合元素解锁时需要同步处理整组，避免组内部分元素仍锁定造成交互不一致。
    if (handleElement.groupId) {
      // 收集同组元素 ID，解锁后用于选中整组。
      const groupElementIdList = []
      // 遍历当前页元素，找到同 groupId 的组合成员。
      for (const element of newElementList) {
        // 命中同组元素时解除锁定并记录 ID。
        if (element.groupId === handleElement.groupId) {
          // 解除当前组合成员锁定状态。
          element.lock = false
          // 收集组合成员 ID，稍后设置为选中列表。
          groupElementIdList.push(element.id)
        }
      }
      // 写回解锁后的元素列表。
      slidesStore.updateSlide({ elements: newElementList })
      // 将整组选中，便于用户继续进行组合操作。
      mainStore.setActiveElementIdList(groupElementIdList)
    }
    // 非组合元素只需要解锁自身。
    else {
      // 遍历当前页元素，查找目标元素。
      for (const element of newElementList) {
        // 命中目标 ID 后解除锁定并结束循环。
        if (element.id === handleElement.id) {
          // 解除目标元素锁定状态。
          element.lock = false
          // 目标已处理，提前结束遍历。
          break
        }
      }
      // 写回解锁后的元素列表。
      slidesStore.updateSlide({ elements: newElementList })
      // 将解锁元素设为唯一选中元素。
      mainStore.setActiveElementIdList([handleElement.id])
    }
    // 记录历史快照，支持撤销本次解锁操作。
    addHistorySnapshot()
  }

  // 返回锁定/解锁操作方法，供工具栏、右键菜单或快捷键调用。
  return {
    lockElement,
    unlockElement,
  }
}
