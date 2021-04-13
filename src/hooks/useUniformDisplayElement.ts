import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { getElementRange, getElementListRange, getRectRotatedRange } from '@/utils/element'
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

    copyOfActiveElementList.sort((elementA, elementB) => {
      const { minX: elAMinX } = getElementRange(elementA)
      const { minX: elBMinX } = getElementRange(elementB)
      return elAMinX - elBMinX
    })

    let totaiWidth = 0
    for (const element of activeElementList.value) {
      const { minX: elMinX, maxX: elMaxX } = getElementRange(element)
      totaiWidth += (elMaxX - elMinX)
    }
    const span = ((maxX - minX) - totaiWidth) / (activeElementList.value.length - 1)

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

    for (const element of newElementList) {
      if (!activeElementIdList.value.includes(element.id)) continue

      for (const sortedItem of sortedElementData) {
        if (sortedItem.el.id === element.id) {
          if ('rotate' in element && element.rotate) {
            const { xRange: originXRange } = getRectRotatedRange({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: 0,
            })
            const { xRange: rotatedXRange } = getRectRotatedRange({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: element.rotate,
            })
            const offsetX = rotatedXRange[0] - originXRange[0]
            element.left = sortedItem.pos - offsetX
          }
          else element.left = sortedItem.pos
        }
      }
    }

    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    addHistorySnapshot()
  }

  // 垂直均匀排列
  const uniformVerticalDisplay = () => {
    const { minY, maxY } = getElementListRange(activeElementList.value)
    const copyOfActiveElementList: PPTElement[] = JSON.parse(JSON.stringify(activeElementList.value))
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    copyOfActiveElementList.sort((elementA, elementB) => {
      const { minY: elAMinY } = getElementRange(elementA)
      const { minY: elBMinY } = getElementRange(elementB)
      return elAMinY - elBMinY
    })

    let totaiHeight = 0
    for (const element of activeElementList.value) {
      const { minY: elMinY, maxY: elMaxY } = getElementRange(element)
      totaiHeight += (elMaxY - elMinY)
    }
    const span = ((maxY - minY) - totaiHeight) / (activeElementList.value.length - 1)

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
            const { yRange: originYRange } = getRectRotatedRange({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: 0,
            })
            const { yRange: rotatedYRange } = getRectRotatedRange({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: element.rotate,
            })
            const offsetY = rotatedYRange[0] - originYRange[0]
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