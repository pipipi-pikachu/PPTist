import { ref, Ref, watchEffect } from 'vue'
import { ImageOrShapeFlip } from '@/types/slides'

export default (flip: Ref<ImageOrShapeFlip | undefined>) => {
  const flipStyle = ref('')

  watchEffect(() => {
    if (flip.value) {
      const { x, y } = flip.value
      if (x && y) flipStyle.value = `rotateX(${x}deg) rotateY(${y}deg)`
      else if (x) flipStyle.value = `rotateX(${x}deg)`
      else if (y) flipStyle.value = `rotateY(${y}deg)`
      else flipStyle.value = ''
    }
    else flipStyle.value = ''
  })

  return {
    flipStyle,
  }
}