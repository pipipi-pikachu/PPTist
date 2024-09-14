import tinycolor from 'tinycolor2'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'
import type { PresetTheme } from '@/configs/theme'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

interface ThemeValueWithArea {
  area: number
  value: string
}

export default () => {
  const slidesStore = useSlidesStore()
  const { slides, currentSlide, theme } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  // 获取指定幻灯片内的主要主题样式，并以在当中的占比进行排序
  const getSlidesThemeStyles = (slide: Slide | Slide[]) => {
    const slides = Array.isArray(slide) ? slide : [slide]

    const backgroundColorValues: ThemeValueWithArea[] = []
    const themeColorValues: ThemeValueWithArea[] = []
    const fontColorValues: ThemeValueWithArea[] = []
    const fontNameValues: ThemeValueWithArea[] = []

    for (const slide of slides) {
      if (slide.background) {
        if (slide.background.type === 'solid' && slide.background.color) {
          backgroundColorValues.push({ area: 1, value: slide.background.color })
        }
        else if (slide.background.type === 'gradient' && slide.background.gradient) {
          const len = slide.background.gradient.colors.length
          backgroundColorValues.push(...slide.background.gradient.colors.map(item => ({
            area: 1 / len,
            value: item.color,
          })))
        }
        else backgroundColorValues.push({ area: 1, value: theme.value.backgroundColor })
      }
      for (const el of slide.elements) {
        const elWidth = el.width
        let elHeight = 0
        if (el.type === 'line') {
          const [startX, startY] = el.start
          const [endX, endY] = el.end
          elHeight = Math.sqrt(Math.pow(Math.abs(startX - endX), 2) + Math.pow(Math.abs(startY - endY), 2))
        }
        else elHeight = el.height
  
        const area = elWidth * elHeight
  
        if (el.type === 'shape' || el.type === 'text') {
          if (el.fill) {
            themeColorValues.push({ area, value: el.fill })
          }
          if (el.type === 'shape' && el.gradient) {
            const len = el.gradient.colors.length
            themeColorValues.push(...el.gradient.colors.map(item => ({
              area: 1 / len * area,
              value: item.color,
            })))
          }

          const text = (el.type === 'shape' ? el.text?.content : el.content) || ''
          if (!text) continue

          const plainText = text.replace(/<[^>]+>/g, '').replace(/\s*/g, '')
          const matchForColor = text.match(/<[^>]+color: .+?<\/.+?>/g)
          const matchForFont = text.match(/<[^>]+font-family: .+?<\/.+?>/g)
  
          let defaultColorPercent = 1
          let defaultFontPercent = 1
  
          if (matchForColor) {
            for (const item of matchForColor) {
              const ret = item.match(/color: (.+?);/)
              if (!ret) continue
              const text = item.replace(/<[^>]+>/g, '').replace(/\s*/g, '')
              const color = ret[1]
              const percentage = text.length / plainText.length
              defaultColorPercent = defaultColorPercent - percentage
              
              fontColorValues.push({
                area: area * percentage,
                value: color,
              })
            }
          }
          if (matchForFont) {
            for (const item of matchForFont) {
              const ret = item.match(/font-family: (.+?);/)
              if (!ret) continue
              const text = item.replace(/<[^>]+>/g, '').replace(/\s*/g, '')
              const font = ret[1]
              const percentage = text.length / plainText.length
              defaultFontPercent = defaultFontPercent - percentage
              
              fontNameValues.push({
                area: area * percentage,
                value: font,
              })
            }
          }
  
          if (defaultColorPercent) {
            const _defaultColor = el.type === 'shape' ? el.text?.defaultColor : el.defaultColor
            const defaultColor = _defaultColor || theme.value.fontColor
            fontColorValues.push({
              area: area * defaultColorPercent,
              value: defaultColor,
            })
          }
          if (defaultFontPercent) {
            const _defaultFont = el.type === 'shape' ? el.text?.defaultFontName : el.defaultFontName
            const defaultFont = _defaultFont || theme.value.fontName
            fontNameValues.push({
              area: area * defaultFontPercent,
              value: defaultFont,
            })
          }
        }
        else if (el.type === 'table') {
          const cellCount = el.data.length * el.data[0].length
          let cellWithFillCount = 0
          for (const row of el.data) {
            for (const cell of row) {
              if (cell.style?.backcolor) {
                cellWithFillCount += 1
                themeColorValues.push({ area: area / cellCount, value: cell.style?.backcolor })
              }
              if (cell.text) {
                const percent = (cell.text.length >= 10) ? 1 : (cell.text.length / 10)
                if (cell.style?.color) {
                  fontColorValues.push({ area: area / cellCount * percent, value: cell.style?.color })
                }
                if (cell.style?.fontname) {
                  fontColorValues.push({ area: area / cellCount * percent, value: cell.style?.fontname })
                }
              }
            }
          }
          if (el.theme) {
            const percent = 1 - cellWithFillCount / cellCount
            themeColorValues.push({ area: area * percent, value: el.theme.color })
          }
        }
        else if (el.type === 'chart') {
          if (el.fill) {
            themeColorValues.push({ area: area * 0.5, value: el.fill })
          }
          themeColorValues.push({ area: area * 0.5, value: el.themeColors[0] })
        }
        else if (el.type === 'line') {
          themeColorValues.push({ area, value: el.color })
        }
        else if (el.type === 'audio') {
          themeColorValues.push({ area, value: el.color })
        }
        else if (el.type === 'latex') {
          fontColorValues.push({ area, value: el.color })
        }
      }
    }
    
    const backgroundColors: { [key: string]: number } = {}
    for (const item of backgroundColorValues) {
      const color = tinycolor(item.value).toRgbString()
      if (color === 'rgba(0, 0, 0, 0)') continue
      if (!backgroundColors[color]) backgroundColors[color] = item.area
      else backgroundColors[color] += item.area
    }

    const themeColors: { [key: string]: number } = {}
    for (const item of themeColorValues) {
      const color = tinycolor(item.value).toRgbString()
      if (color === 'rgba(0, 0, 0, 0)') continue
      if (!themeColors[color]) themeColors[color] = item.area
      else themeColors[color] += item.area
    }

    const fontColors: { [key: string]: number } = {}
    for (const item of fontColorValues) {
      const color = tinycolor(item.value).toRgbString()
      if (color === 'rgba(0, 0, 0, 0)') continue
      if (!fontColors[color]) fontColors[color] = item.area
      else fontColors[color] += item.area
    }
  
    const fontNames: { [key: string]: number } = {}
    for (const item of fontNameValues) {
      if (!fontNames[item.value]) fontNames[item.value] = item.area
      else fontNames[item.value] += item.area
    }

    return {
      backgroundColors: Object.keys(backgroundColors).sort((a, b) => backgroundColors[b] - backgroundColors[a]),
      themeColors: Object.keys(themeColors).sort((a, b) => themeColors[b] - themeColors[a]),
      fontColors: Object.keys(fontColors).sort((a, b) => fontColors[b] - fontColors[a]),
      fontNames: Object.keys(fontNames).sort((a, b) => fontNames[b] - fontNames[a]),
    }
  }

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
      if (el.type === 'chart' && el.themeColors[0] && tinycolor(el.themeColors[0]).getAlpha() !== 0) {
        const color = tinycolor(el.themeColors[0]).toRgbString()
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
    const themeColorMap: { [key: string]: string } = {}
  
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
        el.themeColors = [colorMap[tinycolor(el.themeColors[0]).toRgbString()]] || el.themeColors
        el.textColor = theme.fontColor
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
  const applyThemeToAllSlides = (applyAll = false) => {
    const newSlides: Slide[] = JSON.parse(JSON.stringify(slides.value))
    const { themeColor, backgroundColor, fontColor, fontName, outline, shadow } = theme.value
  
    for (const slide of newSlides) {
      if (!slide.background || slide.background.type !== 'image') {
        slide.background = {
          type: 'solid',
          color: backgroundColor
        }
      }
  
      for (const el of slide.elements) {
        if (applyAll) {
          if ('outline' in el && el.outline) el.outline = outline
          if ('shadow' in el && el.shadow) el.shadow = shadow
        }

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
          el.themeColors = [themeColor]
          el.textColor = fontColor
        }
        else if (el.type === 'latex') el.color = fontColor
        else if (el.type === 'audio') el.color = themeColor
      }
    }
    slidesStore.setSlides(newSlides)
    addHistorySnapshot()
  }

  return {
    getSlidesThemeStyles,
    applyPresetThemeToSingleSlide,
    applyPresetThemeToAllSlides,
    applyThemeToAllSlides,
  }
}