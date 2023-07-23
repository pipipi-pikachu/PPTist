import { computed, type Ref } from 'vue'
import type { ImageElementFilters, ImageElementFilterKeys } from '@/types/slides'

export default (filters: Ref<ImageElementFilters | undefined>) => {
  const filter = computed(() => {
    if (!filters.value) return ''
    let filter = ''
    const keys = Object.keys(filters.value) as ImageElementFilterKeys[]
    for (const key of keys) {
      filter += `${key}(${filters.value[key]}) `
    }
    return filter
  })

  return {
    filter,
  }
}