import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { getElementRange, getElementListRange, getRectRotatedOffset } from '@/utils/element'
import useHistorySnapshot from './useHistorySnapshot'

interface ElementItem {
  min: number
  max: number
  el: PPTElement
}

interface GroupItem {
  groupId: string
  els: PPTElement[]
}

interface GroupElementsItem {
  min: number
  max: number
  els: PPTElement[]
}

type Item = ElementItem | GroupElementsItem

interface ElementWithPos {
  pos: number
  el: PPTElement
}

interface LastPos {
  min: number
  max: number
}

export default () => {
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeElementList } = storeToRefs(useMainStore())
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  const displayItemCount = computed(() => {
    let count = 0
    const groupIdList: string[] = []
    for (const el of activeElementList.value) {
      if (!el.groupId) count += 1
      else if (!groupIdList.includes(el.groupId)) {
        groupIdList.push(el.groupId)
        count += 1
      }
    }
    return count
  })
  // 水平均匀排列
  const uniformHorizontalDisplay = () => {
    const { minX, maxX } = getElementListRange(activeElementList.value)
    const copyOfActiveElementList: PPTElement[] = JSON.parse(JSON.stringify(activeElementList.value))
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // 分别获取普通元素和组合元素集合，并记录下每一项的范围
    const singleElemetList: ElementItem[] = []
    let groupList: GroupItem[] = []
    for (const el of copyOfActiveElementList) {
      if (!el.groupId) {
        const { minX, maxX } = getElementRange(el)
        singleElemetList.push({ min: minX, max: maxX, el })
      }
      else {
        const groupEl = groupList.find(item => item.groupId === el.groupId)
        if (!groupEl) groupList.push({ groupId: el.groupId, els: [el] })
        else {
          groupList = groupList.map(item => item.groupId === el.groupId ? { ...item, els: [...item.els, el] } : item)
        }
      }
    }
    const formatedGroupList: GroupElementsItem[] = []
    for (const groupItem of groupList) {
      const { minX, maxX } = getElementListRange(groupItem.els)
      formatedGroupList.push({ min: minX, max: maxX, els: groupItem.els })
    }

    // 将普通元素和组合元素集合组合在一起，然后将每一项按位置（从左到右）排序
    const list: Item[] = [...singleElemetList, ...formatedGroupList]
    list.sort((itemA, itemB) => itemA.min - itemB.min)

    // 计算元素均匀分布所需要的间隔：
    // (所选元素整体范围 - 所有所选元素宽度和) / (所选元素数 - 1)
    let totalWidth = 0
    for (const item of list) {
      const width = item.max - item.min
      totalWidth += width
    }
    const span = ((maxX - minX) - totalWidth) / (list.length - 1)

    // 按位置顺序依次计算每一个元素的目标位置
    // 第一项中的元素即为起点，无需计算
    // 从第二项开始，每一项的位置应该为：上一项位置 + 上一项宽度 + 间隔
    // 注意此处计算的位置（pos）并非元素最终的left值，而是目标位置范围最小值（元素旋转后的left值 ≠ 范围最小值）
    const sortedElementData: ElementWithPos[] = []

    const firstItem = list[0]
    let lastPos: LastPos = { min: firstItem.min, max: firstItem.max }

    if ('el' in firstItem) {
      sortedElementData.push({ pos: firstItem.min, el: firstItem.el })
    }
    else {
      for (const el of firstItem.els) {
        const { minX: pos } = getElementRange(el)
        sortedElementData.push({ pos, el })
      }
    }

    for (let i = 1; i < list.length; i++) {
      const item = list[i]
      const lastWidth = lastPos.max - lastPos.min
      const currentPos = lastPos.min + lastWidth + span
      const currentWidth = item.max - item.min
      lastPos = { min: currentPos, max: currentPos + currentWidth }

      if ('el' in item) {
        sortedElementData.push({ pos: currentPos, el: item.el })
      }
      else {
        for (const el of item.els) {
          const { minX } = getElementRange(el)
          const offset = minX - item.min
          sortedElementData.push({ pos: currentPos + offset, el })
        }
      }
    }

    // 根据目标位置计算元素最终目标left值
    // 对于旋转后的元素，需要计算旋转前后left的偏移来做校正
    for (const element of newElementList) {
      if (!activeElementIdList.value.includes(element.id)) continue

      for (const sortedItem of sortedElementData) {
        if (sortedItem.el.id === element.id) {
          if ('rotate' in element && element.rotate) {
            const { offsetX } = getRectRotatedOffset({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: element.rotate,
            })
            element.left = sortedItem.pos - offsetX
          }
          else element.left = sortedItem.pos
        }
      }
    }

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  // 垂直均匀排列（逻辑类似水平均匀排列方法）
  const uniformVerticalDisplay = () => {
    const { minY, maxY } = getElementListRange(activeElementList.value)
    const copyOfActiveElementList: PPTElement[] = JSON.parse(JSON.stringify(activeElementList.value))
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    const singleElemetList: ElementItem[] = []
    let groupList: GroupItem[] = []
    for (const el of copyOfActiveElementList) {
      if (!el.groupId) {
        const { minY, maxY } = getElementRange(el)
        singleElemetList.push({ min: minY, max: maxY, el })
      }
      else {
        const groupEl = groupList.find(item => item.groupId === el.groupId)
        if (!groupEl) groupList.push({ groupId: el.groupId, els: [el] })
        else {
          groupList = groupList.map(item => item.groupId === el.groupId ? { ...item, els: [...item.els, el] } : item)
        }
      }
    }
    const formatedGroupList: GroupElementsItem[] = []
    for (const groupItem of groupList) {
      const { minY, maxY } = getElementListRange(groupItem.els)
      formatedGroupList.push({ min: minY, max: maxY, els: groupItem.els })
    }

    const list: Item[] = [...singleElemetList, ...formatedGroupList]
    list.sort((itemA, itemB) => itemA.min - itemB.min)

    let totalHeight = 0
    for (const item of list) {
      const height = item.max - item.min
      totalHeight += height
    }
    const span = ((maxY - minY) - totalHeight) / (list.length - 1)

    const sortedElementData: ElementWithPos[] = []

    const firstItem = list[0]
    let lastPos: LastPos = { min: firstItem.min, max: firstItem.max }

    if ('el' in firstItem) {
      sortedElementData.push({ pos: firstItem.min, el: firstItem.el })
    }
    else {
      for (const el of firstItem.els) {
        const { minY: pos } = getElementRange(el)
        sortedElementData.push({ pos, el })
      }
    }

    for (let i = 1; i < list.length; i++) {
      const item = list[i]
      const lastHeight = lastPos.max - lastPos.min
      const currentPos = lastPos.min + lastHeight + span
      const currentHeight = item.max - item.min
      lastPos = { min: currentPos, max: currentPos + currentHeight }

      if ('el' in item) {
        sortedElementData.push({ pos: currentPos, el: item.el })
      }
      else {
        for (const el of item.els) {
          const { minY } = getElementRange(el)
          const offset = minY - item.min
          sortedElementData.push({ pos: currentPos + offset, el })
        }
      }
    }

    for (const element of newElementList) {
      if (!activeElementIdList.value.includes(element.id)) continue

      for (const sortedItem of sortedElementData) {
        if (sortedItem.el.id === element.id) {
          if ('rotate' in element && element.rotate) {
            const { offsetY } = getRectRotatedOffset({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: element.rotate,
            })
            element.top = sortedItem.pos - offsetY
          }
          else element.top = sortedItem.pos
        }
      }
    }

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  return {
    displayItemCount,
    uniformHorizontalDisplay,
    uniformVerticalDisplay,
  }
}