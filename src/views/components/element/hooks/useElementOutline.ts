import { computed, Ref } from 'vue'
import { PPTElementOutline } from '@/types/slides'

export default (outline: Ref<PPTElementOutline | undefined>) => {
  const outlineWidth = computed(() => (outline.value && outline.value.width !== undefined) ? outline.value.width : 0)
  const outlineStyle = computed(() => (outline.value && outline.value.style !== undefined) ? outline.value.style : 'solid')
  const outlineColor = computed(() => (outline.value && outline.value.color !== undefined) ? outline.value.color : '#d14424')

  return {
    outlineWidth,
    outlineStyle,
    outlineColor,
  }
}