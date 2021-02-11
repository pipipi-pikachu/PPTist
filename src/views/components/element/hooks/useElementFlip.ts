import { computed, Ref } from 'vue'
import { ImageOrShapeFlip } from '@/types/slides'

// 计算元素的翻转样式
export default (flip: Ref<ImageOrShapeFlip | undefined>) => {
  const flipStyle = computed(() => {
    if (flip.value) {
      let style = ''
      
      const { x, y } = flip.value
      if (x && y) style = `rotateX(${x}deg) rotateY(${y}deg)`
      else if (x) style = `rotateX(${x}deg)`
      else if (y) style = `rotateY(${y}deg)`

      return style
    }
    return ''
  })

  return {
    flipStyle,
  }
}