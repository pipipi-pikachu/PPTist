import { computed, type Ref } from 'vue'
import { CLIPPATHS, ClipPathTypes } from '@/configs/imageClip'
import type { PPTImageElement } from '@/types/slides'

export default (element: Ref<PPTImageElement>) => {
  const clipShape = computed(() => {
    let _clipShape = CLIPPATHS.rect
    
    if (element.value.clip) {
      const shape = element.value.clip.shape || ClipPathTypes.RECT
      _clipShape = CLIPPATHS[shape]
    }
    if (_clipShape.radius !== undefined && element.value.radius) {
      _clipShape = {
        ..._clipShape,
        radius: `${element.value.radius}px`,
        style: `inset(0 round ${element.value.radius}px)`,
      }
    }

    return _clipShape
  })

  const imgPosition = computed(() => {
    if (!element.value.clip) {
      return {
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
      }
    }

    const [start, end] = element.value.clip.range

    const widthScale = (end[0] - start[0]) / 100
    const heightScale = (end[1] - start[1]) / 100
    const left = start[0] / widthScale
    const top = start[1] / heightScale

    return {
      left: -left + '%',
      top: -top + '%',
      width: 100 / widthScale + '%',
      height: 100 / heightScale + '%',
    }
  })

  return {
    clipShape,
    imgPosition,
  }
}