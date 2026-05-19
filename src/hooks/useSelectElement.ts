import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'

/**
 * 提供元素选择相关操作。
 *
 * @returns 包含全选当前页可选元素和选择指定元素的方法集合。
 * @throws 当前 composable 不主动抛错；store 状态异常时会按运行时错误表现。
 * @remarks
 * - 隐藏元素和锁定元素不会被普通选择逻辑选中。
 * - handleElementId 表示当前正在被操作控件命中的元素，重复选择该元素时会直接返回。
 * - 该 hook 只更新 activeElementIdList，不直接修改幻灯片数据。
 */
export default () => {
  // 获取主状态 store，用于读取隐藏元素、操作元素和写入选中列表。
  const mainStore = useMainStore()
  // 当前幻灯片响应式引用，用于读取当前页元素列表。
  const { currentSlide } = storeToRefs(useSlidesStore())
  // 隐藏元素 ID 列表和当前操作元素 ID。
  const { hiddenElementIdList, handleElementId } = storeToRefs(mainStore)

  /**
   * 将当前页面全部可选元素设置为选中状态。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 锁定元素和隐藏元素会被排除，避免用户通过全选绕过锁定/隐藏限制。
   */
  const selectAllElements = () => {
    // 过滤出未锁定且未隐藏的元素，作为可被选中的集合。
    const unlockedElements = currentSlide.value.elements.filter(el => !el.lock && !hiddenElementIdList.value.includes(el.id))
    // 将可选元素映射为 ID 列表。
    const newActiveElementIdList = unlockedElements.map(el => el.id)
    // 写入新的选中列表。
    mainStore.setActiveElementIdList(newActiveElementIdList)
  }
  
  /**
   * 将指定元素设置为唯一选中元素。
   *
   * @param id - 需要选中的元素 ID。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 如果目标元素正在被 handle 操作、处于隐藏状态或已锁定，则不会改变选中状态。
   * - 该函数不校验 ID 是否真实存在；若 ID 不存在且未被拦截，会写入 activeElementIdList。
   */
  const selectElement = (id: string) => {
    // 当前操作控件已经命中该元素时，不重复设置选中状态。
    if (handleElementId.value === id) return
    // 隐藏元素不能被选中。
    if (hiddenElementIdList.value.includes(id)) return
    
    // 收集当前页所有锁定元素，用于阻止锁定元素被普通选择。
    const lockedElements = currentSlide.value.elements.filter(el => el.lock)
    // 目标 ID 属于锁定元素时，不改变选中状态。
    if (lockedElements.some(el => el.id === id)) return
  
    // 将目标元素设置为唯一选中元素。
    mainStore.setActiveElementIdList([id])
  }

  // 返回选择操作方法，供画布点击、快捷键和批量操作入口调用。
  return {
    selectAllElements,
    selectElement,
  }
}
