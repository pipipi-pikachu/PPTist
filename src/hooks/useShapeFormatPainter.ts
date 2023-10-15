import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import type { PPTShapeElement } from '@/types/slides'

export default () => {
  const mainStore = useMainStore()
  const { shapeFormatPainter, handleElement } = storeToRefs(mainStore)

  const toggleShapeFormatPainter = (keep = false) => {
    const _handleElement = handleElement.value as PPTShapeElement

    if (shapeFormatPainter.value) mainStore.setShapeFormatPainter(null)
    else {
      mainStore.setShapeFormatPainter({
        keep,
        fill: _handleElement.fill,
        gradient: _handleElement.gradient,
        outline: _handleElement.outline,
        opacity: _handleElement.opacity,
        shadow: _handleElement.shadow,
      })
    }
  }

  return {
    toggleShapeFormatPainter,
  }
}
