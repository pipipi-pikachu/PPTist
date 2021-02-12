import { ref, Ref, watch } from 'vue'
import tinycolor from 'tinycolor2'
import { TableTheme } from '@/types/slides'

// 通过表格的主题色计算辅助颜色

export default (theme: Ref<TableTheme | undefined>) => {
  const subThemeColor = ref(['', ''])
  watch(() => theme.value, () => {
    if (theme.value) {
      const rgba = tinycolor(theme.value.color).toRgb()
      const subRgba1 = { r: rgba.r, g: rgba.g, b: rgba.b, a: rgba.a * 0.3 }
      const subRgba2 = { r: rgba.r, g: rgba.g, b: rgba.b, a: rgba.a * 0.1 }
      subThemeColor.value = [
        `rgba(${[subRgba1.r, subRgba1.g, subRgba1.b, subRgba1.a].join(',')})`,
        `rgba(${[subRgba2.r, subRgba2.g, subRgba2.b, subRgba2.a].join(',')})`,
      ]
    }
  }, { immediate: true })

  return {
    subThemeColor,
  }
}