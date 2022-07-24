import tinycolor from 'tinycolor2'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { Slide } from '@/types/slides'
import { PresetTheme } from '@/configs/theme'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const slidesStore = useSlidesStore()
  const { slides, currentSlide, theme } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  // 获取指定幻灯片内所有颜色（主要的）
  const getSlideAllColors = (slide: Slide) => {
    const colors: string[] = []
    for (const el of slide.elements) {
      if (el.type === 'shape' && tinycolor(el.fill).getAlpha() !== 0) {
        const color = tinycolor(el.fill).toRgbString()
        if (!colors.includes(color)) colors.push(color)
      }
      if (el.type === 'text' && el.fill && tinycolor(el.fill).getAlpha() !== 0) {
        const color = tinycolor(el.fill).toRgbString()
        if (!colors.includes(color)) colors.push(color)
      }
      if (el.type === 'table' && el.theme && tinycolor(el.theme.color).getAlpha() !== 0) {
        const color = tinycolor(el.theme.color).toRgbString()
        if (!colors.includes(color)) colors.push(color)
      }
      if (el.type === 'chart' && el.fill && tinycolor(el.fill).getAlpha() !== 0) {
        const color = tinycolor(el.fill).toRgbString()
        if (!colors.includes(color)) colors.push(color)
      }
      if (el.type === 'line' && tinycolor(el.color).getAlpha() !== 0) {
        const color = tinycolor(el.color).toRgbString()
        if (!colors.includes(color)) colors.push(color)
      }
      if (el.type === 'audio' && tinycolor(el.color).getAlpha() !== 0) {
        const color = tinycolor(el.color).toRgbString()
        if (!colors.includes(color)) colors.push(color)
      }
    }
    return colors
  }
  
  // 创建原颜色与新颜色的对应关系表
  const createSlideThemeColorMap = (slide: Slide, newColors: string[]): { [key: string]: string } => {
    const oldColors = getSlideAllColors(slide)
    const themeColorMap = {}
  
    if (oldColors.length > newColors.length) {
      const analogous = tinycolor(newColors[0]).analogous(oldColors.length - newColors.length + 10)
      const otherColors = analogous.map(item => item.toHexString()).slice(1)
      newColors.push(...otherColors)
    }
    for (let i = 0; i < oldColors.length; i++) {
      themeColorMap[oldColors[i]] = newColors[i]
    }
  
    return themeColorMap
  }
  
  // 设置幻灯片主题
  const setSlideTheme = (slide: Slide, theme: PresetTheme) => {
    const colorMap = createSlideThemeColorMap(slide, theme.colors)
  
    if (!slide.background || slide.background.type !== 'image') {
      slide.background = {
        type: 'solid',
        color: theme.background,
      }
    }
    for (const el of slide.elements) {
      if (el.type === 'shape') {
        el.fill = colorMap[tinycolor(el.fill).toRgbString()] || el.fill
        if (el.gradient) delete el.gradient
      }
      if (el.type === 'text') {
        if (el.fill) el.fill = colorMap[tinycolor(el.fill).toRgbString()] || el.fill
        el.defaultColor = theme.fontColor
        el.defaultFontName = theme.fontname
      }
      if (el.type === 'table') {
        if (el.theme) el.theme.color = colorMap[tinycolor(el.theme.color).toRgbString()] || el.theme.color
        for (const rowCells of el.data) {
          for (const cell of rowCells) {
            if (cell.style) {
              cell.style.color = theme.fontColor
              cell.style.fontname = theme.fontname
            }
          }
        }
      }
      if (el.type === 'chart') {
        el.themeColor = [colorMap[tinycolor(el.themeColor[0]).toRgbString()]] || el.themeColor
        el.gridColor = theme.fontColor
      }
      if (el.type === 'line') el.color = colorMap[tinycolor(el.color).toRgbString()] || el.color
      if (el.type === 'audio') el.color = colorMap[tinycolor(el.color).toRgbString()] || el.color
      if (el.type === 'latex') el.color = theme.fontColor
    }
  }
  
  // 应用预置主题（单页）
  const applyPresetThemeToSingleSlide = (theme: PresetTheme) => {
    const newSlide: Slide = JSON.parse(JSON.stringify(currentSlide.value))
    setSlideTheme(newSlide, theme)
    slidesStore.updateSlide({
      background: newSlide.background,
      elements: newSlide.elements,
    })
    addHistorySnapshot()
  }
  
  // 应用预置主题（全部）
  const applyPresetThemeToAllSlides = (theme: PresetTheme) => {
    const newSlides: Slide[] = JSON.parse(JSON.stringify(slides.value))
    for (const slide of newSlides) {
      setSlideTheme(slide, theme)
    }
    slidesStore.setTheme({
      backgroundColor: theme.background,
      themeColor: theme.colors[0],
      fontColor: theme.fontColor,
      fontName: theme.fontname,
    })
    slidesStore.setSlides(newSlides)
    addHistorySnapshot()
  }
  
  // 将当前主题配置应用到全部页面
  const applyThemeToAllSlides = () => {
    const newSlides: Slide[] = JSON.parse(JSON.stringify(slides.value))
    const { themeColor, backgroundColor, fontColor, fontName } = theme.value
  
    for (const slide of newSlides) {
      if (!slide.background || slide.background.type !== 'image') {
        slide.background = {
          type: 'solid',
          color: backgroundColor
        }
      }
  
      for (const el of slide.elements) {
        if (el.type === 'shape') el.fill = themeColor
        else if (el.type === 'line') el.color = themeColor
        else if (el.type === 'text') {
          el.defaultColor = fontColor
          el.defaultFontName = fontName
          if (el.fill) el.fill = themeColor
        }
        else if (el.type === 'table') {
          if (el.theme) el.theme.color = themeColor
          for (const rowCells of el.data) {
            for (const cell of rowCells) {
              if (cell.style) {
                cell.style.color = fontColor
                cell.style.fontname = fontName
              }
            }
          }
        }
        else if (el.type === 'chart') {
          el.themeColor = [themeColor]
          el.gridColor = fontColor
        }
        else if (el.type === 'latex') el.color = fontColor
        else if (el.type === 'audio') el.color = themeColor
      }
    }
    slidesStore.setSlides(newSlides)
    addHistorySnapshot()
  }

  return {
    applyPresetThemeToSingleSlide,
    applyPresetThemeToAllSlides,
    applyThemeToAllSlides,
  }
}