import { computed, Ref } from 'vue'
import { ImageElementFilters } from '@/types/slides'

export default (filters: Ref<ImageElementFilters | undefined>) => {
  const filter = computed(() => {
    if (!filters.value) return ''
    let filter = ''
    for (const key of Object.keys(filters.value)) {
      filter += `${key}(${filters.value[key]}) `
    }
    return filter
  })

  return {
    filter,
  }
}