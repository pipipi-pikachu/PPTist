import { computed, type Ref } from 'vue'
import type { PPTElementOutline } from '@/types/slides'

// 计算边框相关属性值，主要是对默认值的处理
export default (outline: Ref<PPTElementOutline | undefined>) => {
  const outlineWidth = computed(() => outline.value?.width ?? 0)
  const outlineStyle = computed(() => outline.value?.style || 'solid')
  const outlineColor = computed(() => outline.value?.color || '#d14424')

  const strokeDashArray = computed(() => {
    if (outlineStyle.value !== 'dashed') return '0 0'
    const size = outlineWidth.value
    return size <= 6 ? `${size * 4.5} ${size * 2}` : `${size * 4} ${size * 1.5}`
  })

  return {
    outlineWidth,
    outlineStyle,
    outlineColor,
    strokeDashArray,
  }
}