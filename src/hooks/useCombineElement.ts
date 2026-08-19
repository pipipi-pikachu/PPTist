import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTAnimation, PPTElement } from '@/types/slides'
import { isGroupAnimation } from '@/utils/animation'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeElementList, handleElementId } = storeToRefs(mainStore)
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 判断当前选中的元素是否可以组合
   */
  const canCombine = computed(() => {
    if (activeElementList.value.length < 2) return false

    const firstGroupId = activeElementList.value[0].groupId
    if (!firstGroupId) return true

    const inSameGroup = activeElementList.value.every(el => (el.groupId && el.groupId) === firstGroupId)
    return !inSameGroup
  })

  /**
   * 组合当前选中的元素：给当前选中的元素赋予一个相同的分组ID
   */
  const combineElements = () => {
    if (!activeElementList.value.length) return

    // 生成一个新元素列表进行后续操作
    let newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // 生成分组ID
    const groupId = nanoid(10)

    // 收集需要组合的元素列表，并赋上唯一分组ID
    const combineElementList: PPTElement[] = []
    for (const element of newElementList) {
      if (activeElementIdList.value.includes(element.id)) {
        element.groupId = groupId
        combineElementList.push(element)
      }
    }

    // 确保该组合内所有元素成员的层级是连续的，具体操作方法为：
    // 先获取到该组合内最上层元素的层级，将本次需要组合的元素从新元素列表中移除，
    // 再根据最上层元素的层级位置，将上面收集到的需要组合的元素列表一起插入到新元素列表中合适的位置
    const combineElementMaxLevel = newElementList.findIndex(_element => _element.id === combineElementList[combineElementList.length - 1].id)
    const combineElementIdList = combineElementList.map(_element => _element.id)
    newElementList = newElementList.filter(_element => !combineElementIdList.includes(_element.id))

    const insertLevel = combineElementMaxLevel - combineElementList.length + 1
    newElementList.splice(insertLevel, 0, ...combineElementList)

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  /**
   * 取消组合元素：移除选中元素的分组ID
   */
  const uncombineElements = () => {
    if (!activeElementList.value.length) return
    const hasElementInGroup = activeElementList.value.some(item => item.groupId)
    if (!hasElementInGroup) return

    // 收集本次被解散的组合ID
    const uncombinedGroupIds: string[] = []
    for (const element of activeElementList.value) {
      if (element.groupId && !uncombinedGroupIds.includes(element.groupId)) uncombinedGroupIds.push(element.groupId)
    }

    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
    for (const element of newElementList) {
      if (activeElementIdList.value.includes(element.id) && element.groupId) delete element.groupId
    }

    // 若被解散的组合设置过整体动画，将其转换为各个成员的独立动画，避免动画配置丢失
    // 转换后的首个动画保持原有的触发方式，其余动画与之同时执行，从而保留原本的整体动画效果
    const animations = currentSlide.value.animations
    if (animations?.length) {
      const newAnimations: PPTAnimation[] = []
      for (const animation of animations) {
        if (!isGroupAnimation(animation) || !uncombinedGroupIds.includes(animation.elId)) {
          newAnimations.push(animation)
          continue
        }

        const memberIds = currentSlide.value.elements.filter(el => el.groupId === animation.elId).map(el => el.id)
        memberIds.forEach((elId, index) => {
          newAnimations.push({
            ...animation,
            id: index === 0 ? animation.id : nanoid(10),
            elId,
            target: 'element',
            trigger: index === 0 ? animation.trigger : 'meantime',
          })
        })
      }
      slidesStore.updateSlide({ elements: newElementList, animations: newAnimations })
    }
    else slidesStore.updateSlide({ elements: newElementList })

    // 取消组合后，需要重置激活元素状态
    // 默认重置为当前正在操作的元素,如果不存在则重置为空
    const handleElementIdList = handleElementId.value ? [handleElementId.value] : []
    mainStore.setActiveElementIdList(handleElementIdList)

    addHistorySnapshot()
  }

  return {
    canCombine,
    combineElements,
    uncombineElements,
  }
}