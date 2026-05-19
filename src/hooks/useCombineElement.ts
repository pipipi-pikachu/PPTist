import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

/**
 * 提供元素组合与取消组合能力。
 *
 * @returns 包含是否可组合、组合选中元素、取消组合选中元素的方法集合。
 * @throws 当前 composable 不主动抛错；JSON 深拷贝、ID 生成、store 更新或历史快照写入异常会按运行时错误表现。
 * @remarks
 * - 组合的本质是给多个元素写入同一个 `groupId`。
 * - 组合后会调整元素数组顺序，确保组合成员在图层数组中连续，便于后续整体移动和层级调整。
 * - 取消组合只删除选中元素的 groupId，不删除元素本身。
 */
export default () => {
  // 获取主状态 store，用于读取选区、当前操作元素，并更新选中状态。
  const mainStore = useMainStore()
  // 获取幻灯片 store，用于更新当前页元素列表。
  const slidesStore = useSlidesStore()
  // 当前选中元素 ID、元素实体列表和当前操作元素 ID。
  const { activeElementIdList, activeElementList, handleElementId } = storeToRefs(mainStore)
  // 当前幻灯片响应式引用。
  const { currentSlide } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于组合状态变化后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 判断当前选中的元素是否可以组合。
   *
   * @returns 当选区至少包含两个元素，且不是已经处于同一组合时返回 `true`。
   * @remarks
   * - 少于两个元素不能组合。
   * - 未组合元素可以组合。
   * - 如果所有选中元素已经属于同一 groupId，则不允许重复组合。
   */
  const canCombine = computed(() => {
    // 组合至少需要两个元素。
    if (activeElementList.value.length < 2) return false

    // 以第一个选中元素的 groupId 作为判断基准。
    const firstGroupId = activeElementList.value[0].groupId
    // 第一个元素未组合时，说明当前选区可以创建新组合。
    if (!firstGroupId) return true

    // 判断所有选中元素是否都已经属于同一个组合。
    const inSameGroup = activeElementList.value.every(el => (el.groupId && el.groupId) === firstGroupId)
    // 如果已经是同一组，不允许重复组合；否则允许重新组合。
    return !inSameGroup
  })

  /**
   * 组合当前选中的元素。
   *
   * @returns 无显式返回值。
   * @throws JSON 深拷贝、nanoid、store 更新或历史快照写入异常会向上表现为运行时错误。
   * @remarks
   * - 给当前选中的元素赋予一个相同的新 groupId。
   * - 组合成员会被重新插入为连续层级块，插入位置保持在原选区最高层附近。
   */
  const combineElements = () => {
    // 没有选中元素时不做任何处理。
    if (!activeElementList.value.length) return

    // 生成一个新元素列表进行后续操作
    let newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // 生成分组ID
    const groupId = nanoid(10)

    // 收集需要组合的元素列表，并赋上唯一分组ID
    const combineElementList: PPTElement[] = []
    // 遍历当前页元素，按选中 ID 找到需要组合的元素。
    for (const element of newElementList) {
      // 只处理当前选中的元素。
      if (activeElementIdList.value.includes(element.id)) {
        // 写入统一 groupId，使这些元素成为同一个组合。
        element.groupId = groupId
        // 收集组合成员，后续用于调整层级连续性。
        combineElementList.push(element)
      }
    }

    // 确保该组合内所有元素成员的层级是连续的，具体操作方法为：
    // 先获取到该组合内最上层元素的层级，将本次需要组合的元素从新元素列表中移除，
    // 再根据最上层元素的层级位置，将上面收集到的需要组合的元素列表一起插入到新元素列表中合适的位置
    // 找到组合成员中最高层元素在原列表中的位置。
    const combineElementMaxLevel = newElementList.findIndex(_element => _element.id === combineElementList[combineElementList.length - 1].id)
    // 提取组合成员 ID，用于从原列表中批量移除。
    const combineElementIdList = combineElementList.map(_element => _element.id)
    // 先移除分散在元素列表中的组合成员。
    newElementList = newElementList.filter(_element => !combineElementIdList.includes(_element.id))

    // 计算连续插入位置，使组合块整体保持在原选区最高层附近。
    const insertLevel = combineElementMaxLevel - combineElementList.length + 1
    // 将组合成员作为连续块插入元素列表。
    newElementList.splice(insertLevel, 0, ...combineElementList)

    // 写回组合后的元素列表。
    slidesStore.updateSlide({ elements: newElementList })
    // 记录历史快照，支持撤销组合操作。
    addHistorySnapshot()
  }

  /**
   * 取消组合当前选中的元素。
   *
   * @returns 无显式返回值。
   * @throws JSON 深拷贝、store 更新或历史快照写入异常会向上表现为运行时错误。
   * @remarks
   * - 只移除当前选中元素的 groupId。
   * - 取消组合后会重置选区，优先选中当前 handleElementId。
   */
  const uncombineElements = () => {
    // 没有选中元素时不做任何处理。
    if (!activeElementList.value.length) return
    // 判断选区中是否至少存在一个组合元素。
    const hasElementInGroup = activeElementList.value.some(item => item.groupId)
    // 没有组合元素时无需取消组合。
    if (!hasElementInGroup) return
    
    // 深拷贝当前页元素列表，避免直接修改响应式原对象。
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
    // 遍历元素列表，移除选中组合成员的 groupId。
    for (const element of newElementList) {
      // 只处理当前选中的、并且拥有 groupId 的元素。
      if (activeElementIdList.value.includes(element.id) && element.groupId) delete element.groupId
    }
    // 写回取消组合后的元素列表。
    slidesStore.updateSlide({ elements: newElementList })

    // 取消组合后，需要重置激活元素状态
    // 默认重置为当前正在操作的元素,如果不存在则重置为空
    // 如果当前存在 handleElementId，则将其作为新的唯一选中元素。
    const handleElementIdList = handleElementId.value ? [handleElementId.value] : []
    // 写入重置后的选中列表。
    mainStore.setActiveElementIdList(handleElementIdList)

    // 记录历史快照，支持撤销取消组合操作。
    addHistorySnapshot()
  }

  // 返回组合相关状态和操作方法。
  return {
    canCombine,
    combineElements,
    uncombineElements,
  }
}
