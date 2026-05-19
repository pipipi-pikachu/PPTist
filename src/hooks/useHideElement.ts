import { storeToRefs } from 'pinia'
import { useSlidesStore, useMainStore } from '@/store'

/**
 * 提供当前幻灯片元素显示/隐藏相关操作。
 *
 * @returns 包含切换单个元素隐藏、显示当前页全部元素、隐藏当前页全部元素的方法集合。
 * @throws 当前 composable 不主动抛错；Pinia store 或当前幻灯片状态异常时会按运行时错误表现。
 * @remarks
 * - 隐藏状态保存在 mainStore.hiddenElementIdList 中，不会直接修改 slide.elements 数据。
 * - 隐藏当前选中元素时会清空选中状态，避免用户继续操作不可见元素。
 * - showAllElements/hideAllElements 只针对当前幻灯片元素，保留其他页面已有隐藏状态。
 */
export default () => {
  // 获取幻灯片 store，用于读取当前页元素列表。
  const slidesStore = useSlidesStore()
  // 获取主状态 store，用于读写选中元素和隐藏元素列表。
  const mainStore = useMainStore()
  // 解构当前幻灯片响应式引用，保证页面切换后操作目标随之更新。
  const { currentSlide } = storeToRefs(slidesStore)
  // 解构当前选中元素 ID 列表和全局隐藏元素 ID 列表。
  const { activeElementIdList, hiddenElementIdList } = storeToRefs(mainStore)

  /**
   * 切换指定元素的隐藏状态。
   *
   * @param id - 需要显示或隐藏的元素 ID。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 如果元素已在隐藏列表中，则本次操作会将其移出隐藏列表。
   * - 如果元素未在隐藏列表中，则本次操作会将其加入隐藏列表。
   * - 如果被隐藏的元素当前处于选中状态，会清空选中列表，避免后续操作作用到不可见元素。
   */
  const toggleHideElement = (id: string) => {
    // 判断目标元素当前是否已经处于隐藏列表中。
    if (hiddenElementIdList.value.includes(id)) {
      // 已隐藏时，通过过滤目标 ID 生成新的隐藏列表，实现显示该元素。
      mainStore.setHiddenElementIdList(hiddenElementIdList.value.filter(item => item !== id))
    }
    // 未隐藏时，将目标 ID 追加到隐藏列表中。
    else mainStore.setHiddenElementIdList([...hiddenElementIdList.value, id])
  
    // 如果当前隐藏/显示操作涉及已选中元素，则清空选区，避免隐藏元素仍被编辑。
    if (activeElementIdList.value.includes(id)) mainStore.setActiveElementIdList([])
  }
  
  /**
   * 显示当前幻灯片中的全部元素。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 该函数只移除当前页元素的隐藏 ID，不影响其他幻灯片中被隐藏的元素。
   */
  const showAllElements = () => {
    // 收集当前幻灯片中全部元素 ID，作为本次需要取消隐藏的目标集合。
    const currentSlideElIdList = currentSlide.value.elements.map(item => item.id)
    // 保留不属于当前页的隐藏 ID，避免跨页面隐藏状态被误清空。
    const needHiddenElementIdList = hiddenElementIdList.value.filter(item => !currentSlideElIdList.includes(item))
    // 写回过滤后的隐藏列表，当前页元素因此全部显示。
    mainStore.setHiddenElementIdList(needHiddenElementIdList)
  }

  /**
   * 隐藏当前幻灯片中的全部元素。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 当前实现会把当前页元素 ID 追加到隐藏列表中，不主动去重，保持既有行为。
   * - 如果当前存在选中元素，会清空选区，避免隐藏后继续操作。
   */
  const hideAllElements = () => {
    // 收集当前幻灯片全部元素 ID，作为本次需要隐藏的目标集合。
    const currentSlideElIdList = currentSlide.value.elements.map(item => item.id)
    // 将当前页元素 ID 追加到全局隐藏列表，保留其他页面隐藏状态。
    mainStore.setHiddenElementIdList([...hiddenElementIdList.value, ...currentSlideElIdList])
    // 隐藏全部元素后，如果之前有选中元素，则清空选中状态。
    if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])
  }

  // 返回元素隐藏相关操作方法，供编辑器面板、快捷键或上下文菜单调用。
  return {
    toggleHideElement,
    showAllElements,
    hideAllElements,
  }
}
