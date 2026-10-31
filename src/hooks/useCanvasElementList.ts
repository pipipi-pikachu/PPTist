import { computed, ref, watchEffect, type Ref } from 'vue'
import type { PPTElement, Slide } from '@/types/slides'
import { isSameLineConnection, resolveLineConnections } from '@/utils/element'

const shouldResolveLineConnections = (elements: PPTElement[], previousElements: PPTElement[]) => {
  if (elements.length !== previousElements.length) return true

  return elements.some((element, index) => {
    const previous = previousElements[index]
    if (element === previous) return false
    if (element.id !== previous.id || element.type !== previous.type) return true

    // 锚点只依赖形状外框，内部路径和关键点变化不影响连接。
    if (element.type === 'shape' && previous.type === 'shape') {
      return element.left !== previous.left || element.top !== previous.top ||
        element.width !== previous.width || element.height !== previous.height || element.rotate !== previous.rotate
    }
    return element.type === 'line' && previous.type === 'line' && !isSameLineConnection(element, previous)
  })
}

export default (currentSlide: Ref<Slide | undefined>) => {
  const localElements = ref<PPTElement[]>([])

  watchEffect(() => {
    localElements.value = currentSlide.value ? JSON.parse(JSON.stringify(currentSlide.value.elements)) : []
  })

  const elementList = computed({
    get: () => localElements.value,
    set: (elements: PPTElement[]) => {
      localElements.value = shouldResolveLineConnections(elements, localElements.value) ? resolveLineConnections(elements) : elements
    },
  })

  return {
    elementList,
  }
}
