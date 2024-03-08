import { computed, type Ref } from 'vue'
import type { PPTElementGlow, PPTElementShadow } from '@/types/slides'

// 计算元素的阴影样式
export default (shadow: Ref<PPTElementShadow | undefined>, glow: Ref<PPTElementGlow|undefined>) => {
  const shadowStyle = computed(() => {
    const s = []
    if (shadow.value) {
      const { h, v, blur, color } = shadow.value
      s.push( `${h}px ${v}px ${blur}px ${color}`)
    }
    if (glow.value) {
      const { size, color } = glow.value
      const n = Math.max(Math.ceil((size || 0) / 3) - 2, 1)
      const m = Math.floor(n / 2)
      const blur = Math.min(((size || 0) / 3), 3)
      for (let x = 0; x <= n; x++) {
        for (let y = 0; y <= n; y++) {
          s.push(`${x - m}px ${y - m}px ${blur}px ${color}`)
        }
      }

    }
    return s.join(', ')
  })

  return {
    shadowStyle,
  }
}