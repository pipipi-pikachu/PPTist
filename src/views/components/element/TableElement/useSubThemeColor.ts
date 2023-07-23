import { ref, watch, type Ref } from 'vue'
import type { TableTheme } from '@/types/slides'
import { getTableSubThemeColor } from '@/utils/element'

// 通过表格的主题色计算辅助颜色

export default (theme: Ref<TableTheme | undefined>) => {
  const subThemeColor = ref(['', ''])
  watch(() => theme.value, () => {
    if (theme.value) {
      subThemeColor.value = getTableSubThemeColor(theme.value.color)
    }
  }, { immediate: true })

  return {
    subThemeColor,
  }
}