import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { getElementRange, getElementListRange, getRectRotatedOffset } from '@/utils/element'
import useHistorySnapshot from './useHistorySnapshot'

interface SortedElementData {
  el: PPTElement;
  pos: number;
}

export default () => {
  const store = useStore()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const activeElementList = computed<PPTElement[]>(() => store.getters.activeElementList)
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()

  // 水平均匀排列
  const uniformHorizontalDisplay = () => {
    const { minX, maxX } = getElementListRange(activeElementList.value)
    const copyOfActiveElementList: PPTElement[] = JSON.parse(JSON.stringify(activeElementList.value))
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // 将选中的元素按位置（从左到右）排序
    copyOfActiveElementList.sort((elementA, elementB) => {
      const { minX: elAMinX } = getElementRange(elementA)
      const { minX: elBMinX } = getElementRange(elementB)
      return elAMinX - elBMinX
    })

    // 计算元素均匀分布所需要的间隔：
    // (所选元素整体范围 - 所有所选元素宽度和) / (所选元素数 - 1)
    let totalWidth = 0
    for (const element of activeElementList.value) {
      const { minX: elMinX, maxX: elMaxX } = getElementRange(element)
      totalWidth += (elMaxX - elMinX)
    }
    const span = ((maxX - minX) - totalWidth) / (activeElementList.value.length - 1)

    // 将所选元素按位置顺序依次计算目标位置
    // 注意pos并非元素目标left值，而是目标位置范围最小值（元素旋转后的left值 ≠ 范围最小值）
    const sortedElementData: SortedElementData[] = []
    for (const element of copyOfActiveElementList) {
      if (!sortedElementData.length) {
        const { minX: firstElMinX } = getElementRange(element)
        sortedElementData.push({ el: element, pos: firstElMinX })
        continue
      }
      
      const lastItemElement = sortedElementData[sortedElementData.length - 1].el
      const lastItemPos = sortedElementData[sortedElementData.length - 1].pos
      const { minX: lastElementMinX, maxX: lastElementMaxX } = getElementRange(lastItemElement)
      const lastElementWidth = lastElementMaxX - lastElementMinX
      
      sortedElementData.push({ el: element, pos: lastItemPos + lastElementWidth + span })
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

    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    addHistorySnapshot()
  }

  // 垂直均匀排列（逻辑类似水平均匀排列方法）
  const uniformVerticalDisplay = () => {
    const { minY, maxY } = getElementListRange(activeElementList.value)
    const copyOfActiveElementList: PPTElement[] = JSON.parse(JSON.stringify(activeElementList.value))
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    copyOfActiveElementList.sort((elementA, elementB) => {
      const { minY: elAMinY } = getElementRange(elementA)
      const { minY: elBMinY } = getElementRange(elementB)
      return elAMinY - elBMinY
    })

    let totalHeight = 0
    for (const element of activeElementList.value) {
      const { minY: elMinY, maxY: elMaxY } = getElementRange(element)
      totalHeight += (elMaxY - elMinY)
    }
    const span = ((maxY - minY) - totalHeight) / (activeElementList.value.length - 1)

    const sortedElementData: SortedElementData[] = []
    for (const element of copyOfActiveElementList) {
      if (!sortedElementData.length) {
        const { minY: firstElMinY } = getElementRange(element)
        sortedElementData.push({ el: element, pos: firstElMinY })
        continue
      }
      
      const lastItemElement = sortedElementData[sortedElementData.length - 1].el
      const lastItemPos = sortedElementData[sortedElementData.length - 1].pos
      const { minY: lastElementMinY, maxY: lastElementMaxY } = getElementRange(lastItemElement)
      const lastElementHeight = lastElementMaxY - lastElementMinY
      
      sortedElementData.push({ el: element, pos: lastItemPos + lastElementHeight + span })
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

    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    addHistorySnapshot()
  }

  return {
    uniformHorizontalDisplay,
    uniformVerticalDisplay,
  }
}