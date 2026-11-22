import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { parse, type Shape, type BaseElement, type Chart, type ChartItem, type Element, type ScatterSeries } from 'pptxtojson'
import { nanoid } from 'nanoid'
import tinycolor from 'tinycolor2'
import { SVGPathData } from 'svg-pathdata'
import { useSlidesStore } from '@/store'
import { decrypt } from '@/utils/crypto'
import { isFloatEqual } from '@/utils/common'
import { type ShapePoolItem, SHAPE_LIST, SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from './useHistorySnapshot'
import message from '@/utils/message'
import { toPoints } from '@/utils/svgPathParser'
import { loadGoogleFonts } from '@/utils/font'
import { parseTableText, serializeTableText } from '@/utils/prosemirror/table'
import type {
  Slide,
  TableCellStyle,
  TableCell,
  ChartType,
  SlideBackground,
  PPTShapeElement,
  PPTLineElement,
  LinePoint,
  PPTImageElement,
  TextAlignVertical,
  PPTTextElement,
  ChartOptions,
  ChartData,
  Gradient,
} from '@/types/slides'

const isPointChart = (chart: Pick<Chart, 'chartType'>) => chart.chartType === 'scatterChart' || chart.chartType === 'bubbleChart'

const convertImportedChart = (input: Chart) => {
  const groups = (input.chartType === 'comboChart' ? input.groups : [input]).filter(group => group.data.length)
  if (!groups.length) return null
  const first = groups[0]
  const compatible = groups.filter(group => isPointChart(group) === isPointChart(first))
  const chart = { ...first, colors: compatible.flatMap(group => group.colors) }
  let data: ChartData

  if (isPointChart(first)) {
    const series = compatible.flatMap<ScatterSeries>(group => group.chartType === 'scatterChart' || group.chartType === 'bubbleChart' ? group.data : []).map(item => ({
      key: item.key,
      values: item.values.filter(point => Number.isFinite(point.x) && Number.isFinite(point.y)),
    })).filter(item => item.values.length)
    if (!series.length) return null
    const xValues = series[0].values.map(point => point.x)
    const sharedX = series.every(item => item.values.length === xValues.length && item.values.every((point, index) => point.x === xValues[index]))
    if (sharedX) {
      data = {
        labels: xValues.map((_, index) => `坐标${index + 1}`),
        legends: ['X', ...series.map((item, index) => item.key || `Y${index + 1}`)],
        series: [xValues, ...series.map(item => item.values.map(point => point.y))],
      }
    }
    else {
      const points = series.flatMap(item => item.values)
      data = {
        labels: points.map((_, index) => `坐标${index + 1}`),
        legends: ['X', series.map(item => item.key).filter(Boolean).join(' / ') || 'Y'],
        series: [points.map(point => point.x), points.map(point => point.y)],
      }
    }
  }
  else {
    const series = compatible.flatMap<ChartItem>(group => group.chartType !== 'scatterChart' && group.chartType !== 'bubbleChart' ? group.data : [])
    data = {
      labels: Object.values(series[0].xlabels),
      legends: series.map(item => String(item.key)),
      series: series.map(item => item.values.map(point => point.y)),
    }
  }
  if (!data.series.length || !data.series[0]?.length) return null
  return { chart, data }
}

const hasImportedText = (content: string) => {
  if (!content) return false
  const doc = new DOMParser().parseFromString(content, 'text/html')
  return !!doc.body.textContent?.trim()
}

const getCustomLinePoints = (shape: Shape): [[number, number], [number, number]] | null => {
  if (shape.shapType !== 'custom' || !shape.path) return null

  try {
    const parsed = new SVGPathData(shape.path)
    const [move, segment] = parsed.commands
    if (parsed.commands.length === 2 && move.type === SVGPathData.MOVE_TO &&
      (segment.type === SVGPathData.LINE_TO || segment.type === SVGPathData.HORIZ_LINE_TO || segment.type === SVGPathData.VERT_LINE_TO)) {
      const [start, end] = parsed.toAbs().normalizeHVZ().commands
      if ('x' in start && 'y' in start && 'x' in end && 'y' in end &&
        [start.x, start.y, end.x, end.y].every(Number.isFinite) && (start.x !== end.x || start.y !== end.y)) {
        return [[start.x, start.y], [end.x, end.y]]
      }
    }
  }
  catch {
    // Some zero-axis custom paths from the parser contain NaN on that axis only.
  }

  if (!shape.strokeOnly) return null
  const axis = shape.width === 0 && shape.height > 0 ? 0 : shape.height === 0 && shape.width > 0 ? 1 : -1
  if (axis === -1) return null
  const match = /^\s*M\s*([^ML]+)\s*L\s*([^ML]+)\s*$/.exec(shape.path)
  if (!match) return null
  const points = match.slice(1).map(point => point.trim().split(/[\s,]+/))
  if (!points.every(point => point.length === 2 &&
    (point[axis] === 'NaN' || Number(point[axis]) === 0) && Number.isFinite(Number(point[1 - axis]))) ||
    Number(points[0][1 - axis]) === Number(points[1][1 - axis])) return null

  return points.map(point => axis === 0 ? [0, Number(point[1])] : [Number(point[0]), 0]) as [[number, number], [number, number]]
}

const getImportedShapeGeometry = (shape: Shape, linePoints?: [[number, number], [number, number]] | null): Pick<PPTShapeElement, 'path' | 'viewBox'> | null => {
  if (!shape.path) return null

  if (linePoints) {
    const minX = Math.min(linePoints[0][0], linePoints[1][0])
    const minY = Math.min(linePoints[0][1], linePoints[1][1])
    const width = Math.abs(linePoints[1][0] - linePoints[0][0])
    const height = Math.abs(linePoints[1][1] - linePoints[0][1])
    const box = shape.pathViewBox
    const hasViewBox = box && [box.x, box.y, box.width, box.height].every(Number.isFinite) && box.width > 0 && box.height > 0
    if (!hasViewBox && (width === 0 || height === 0)) {
      const x = box && Number.isFinite(box.x) ? box.x : minX
      const y = box && Number.isFinite(box.y) ? box.y : minY
      return {
        path: `M ${linePoints[0][0] - x} ${linePoints[0][1] - y} L ${linePoints[1][0] - x} ${linePoints[1][1] - y}`,
        viewBox: [box && box.width > 0 ? box.width : width || 1, box && box.height > 0 ? box.height : height || 1],
      }
    }
  }

  try {
    const parsed = new SVGPathData(shape.path)
    if (!parsed.commands.some(command => command.type !== SVGPathData.MOVE_TO && command.type !== SVGPathData.CLOSE_PATH)) return null
    if (parsed.commands.some(command => Object.values(command).some(value => typeof value === 'number' && !Number.isFinite(value)))) return null

    const viewBox = shape.pathViewBox
    if (viewBox && [viewBox.x, viewBox.y, viewBox.width, viewBox.height].every(Number.isFinite) && viewBox.width > 0 && viewBox.height > 0) {
      const path = viewBox.x || viewBox.y ? parsed.toAbs().translate(-viewBox.x, -viewBox.y).encode() : shape.path
      return { path, viewBox: [viewBox.width, viewBox.height] }
    }

    const { minX, minY, maxX, maxY } = parsed.getBounds()
    const width = maxX - minX
    const height = maxY - minY
    if (![minX, minY, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return null
    return {
      path: minX || minY ? parsed.toAbs().translate(-minX, -minY).encode() : shape.path,
      viewBox: [width, height],
    }
  }
  catch {
    return null
  }
}

const vAlignMap: Record<string, TextAlignVertical> = {
  'mid': 'middle',
  'down': 'bottom',
  'up': 'top',
}

const getAspectRatio = (width: number, height: number) => {
  if (!width || !height) return 0.5625

  let aspectRatio = height / width
  if (isFloatEqual(aspectRatio, 0.625)) aspectRatio = 0.625
  else if (isFloatEqual(aspectRatio, 0.75)) aspectRatio = 0.75
  else if (isFloatEqual(aspectRatio, 0.5625)) aspectRatio = 0.5625

  return aspectRatio
}

const getTextNodeStyleSpan = (textNode: Text, styleProp: 'fontSize' | 'color') => {
  let parent = textNode.parentElement

  while (parent) {
    if (parent.tagName === 'SPAN' && parent.style[styleProp]) return parent
    if (parent.tagName === 'LI') break
    parent = parent.parentElement
  }

  return null
}

const getListItemStyleValue = (li: HTMLLIElement, styleProp: 'fontSize' | 'color') => {
  const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT)
  let styleSpan: HTMLSpanElement | null = null
  let hasTextContent = false

  let currentNode = walker.nextNode()
  while (currentNode) {
    const textNode = currentNode as Text
    const textContent = textNode.textContent?.replace(/\s+/g, '')

    if (textContent) {
      const parentLi = textNode.parentElement?.closest('li')
      if (parentLi === li) {
        hasTextContent = true

        const currentStyleSpan = getTextNodeStyleSpan(textNode, styleProp)
        if (!currentStyleSpan) return ''
        if (!styleSpan) styleSpan = currentStyleSpan as HTMLSpanElement
        else if (styleSpan !== currentStyleSpan) return ''
      }
    }

    currentNode = walker.nextNode()
  }

  return hasTextContent && styleSpan ? styleSpan.style[styleProp] : ''
}

const promoteListTextStyle = (html: string) => {
  if (!/<(ul|ol)\b/i.test(html) || (!/font-size\s*:/i.test(html) && !/color\s*:/i.test(html))) return html

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const lists = doc.body.querySelectorAll<HTMLElement>('ul, ol')

  lists.forEach(list => {
    const listItems = Array.from(list.children).filter(child => child.tagName === 'LI') as HTMLLIElement[]
    if (!listItems.length) return

    if (!list.style.fontSize) {
      let fontSize = ''
      for (const li of listItems) {
        const currentFontSize = getListItemStyleValue(li, 'fontSize')
        if (!currentFontSize) {
          fontSize = ''
          break
        }
        if (!fontSize) fontSize = currentFontSize
        else if (fontSize !== currentFontSize) {
          fontSize = ''
          break
        }
      }
      if (fontSize) list.style.fontSize = fontSize
    }

    if (!list.style.color) {
      let color = ''
      for (const li of listItems) {
        const currentColor = getListItemStyleValue(li, 'color')
        if (!currentColor) {
          color = ''
          break
        }
        if (!color) color = currentColor
        else if (color !== currentColor) {
          color = ''
          break
        }
      }
      if (color) list.style.color = color
    }
  })

  return doc.body.innerHTML
}

const normalizeIndentValue = (indent: string, ratio: number) => {
  const value = parseFloat(indent)
  if (!value || value < 0) return 0

  let indentValue = 0
  if (indent.indexOf('em') !== -1) {
    indentValue = parseInt(indent)
  }
  else if (indent.indexOf('px') !== -1) {
    indentValue = Math.floor(parseInt(indent) / 16)
    if (!indentValue) indentValue = 1
  }
  else if (indent.indexOf('pt') !== -1) {
    indentValue = Math.floor(value * ratio / 16)
    if (!indentValue) indentValue = 1
  }

  if (indentValue > 8) indentValue = 8

  return indentValue
}

const convertTextContent = (html: string, ratio: number) => {
  if (!html) return ''
  const processedHtml = html.replace(/font-size:\s*([\d.]+)pt/g, (match, p1) => {
    return `font-size: ${Math.floor(parseFloat(p1) * ratio)}px`
  }).replace(/&nbsp;/g, ' ').replace(/style="([^"]*)"/g, (match, styleStr: string) => {
    let newStyle = styleStr
    const gradientMatch = styleStr.match(/background:\s*(linear-gradient\([^)]+\))/)

    if (gradientMatch) {
      const colorMatches = gradientMatch[1].match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?\([^)]+\)/g)
      if (colorMatches && colorMatches.length) {
        const colors = colorMatches.map(c => tinycolor(c))
        const avgColor = colors.reduce((acc, c) => {
          const rgb = c.toRgb()
          return {
            r: acc.r + rgb.r / colors.length,
            g: acc.g + rgb.g / colors.length,
            b: acc.b + rgb.b / colors.length,
          }
        }, { r: 0, g: 0, b: 0 })
        const hexColor = tinycolor(avgColor).toHexString()

        newStyle = newStyle
          .replace(/background:\s*linear-gradient\([^)]+\)\s*;?/g, '')
          .replace(/background-clip:\s*text\s*;?/g, '')
          .replace(/color:\s*transparent\s*;?/g, '')
        newStyle = `color: ${hexColor}; ${newStyle}`
      }
    }

    const marginLeftMatch = newStyle.match(/margin-left\s*:\s*([^;]+);?/i)
    const indentValue = marginLeftMatch ? normalizeIndentValue(marginLeftMatch[1], ratio) : 0

    newStyle = newStyle
      .replace(/margin-(top|bottom|left)\s*:\s*[^;]+;?/g, '')
      .replace(/text-indent\s*:\s*([^;]+);?/g, (match, p1) => {
        const textIndentValue = normalizeIndentValue(p1, ratio)
        return textIndentValue ? `text-indent: ${textIndentValue}em;` : ''
      })
      .replace(/^\s*;\s*/, '')
      .replace(/;\s*$/, ';')
      .trim()

    return [
      indentValue ? `data-indent="${indentValue}"` : '',
      newStyle ? `style="${newStyle}"` : '',
    ].filter(Boolean).join(' ')
  })

  return promoteListTextStyle(processedHtml)
}

const getMaxFontSize = (html: string, defaultFontSize: number = 18): number => {
  const fontSizeRegex = /font-size\s*:\s*(\d+(?:\.\d+)?)\s*pt/gi
  const fontSizes = [defaultFontSize]

  let match
  while ((match = fontSizeRegex.exec(html)) !== null) {
    const size = parseFloat(match[1])
    if (size > 0) fontSizes.push(size)
  }

  return Math.max(...fontSizes)
}

const getParagraphMetrics = (html: string, ratio: number) => {
  const tagRegex = /<(div|p)(?![a-z0-9])[^>]*>/gi

  const lineHeights = []
  const margins = []
  let paragraphCount = 0

  let match
  let paragraphIndex = 0
  while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0]
    paragraphCount++

    const styleRegex = /\bstyle\s*=\s*(['"])(.*?)\1/i
    const styleMatch = fullTag.match(styleRegex)

    let styleContent = ''
    if (styleMatch && styleMatch[2]) {
      styleContent = styleMatch[2]
    }

    const getProp = (propName: string) => {
      if (!styleContent) return null
      const propRegex = new RegExp(`${propName}\\s*:\\s*([^;]+)`, 'i')
      const propMatch = styleContent.match(propRegex)
      return propMatch ? propMatch[1].trim() : null
    }

    const marginTop = getProp('margin-top')
    const marginBottom = getProp('margin-bottom')
    const lineHeight = getProp('line-height')

    const tagStartIndex = match.index
    const tagName = match[1]
    let tagEndIndex = html.indexOf('</' + tagName + '>', tagStartIndex)
    if (tagEndIndex === -1) tagEndIndex = tagStartIndex + fullTag.length

    const paragraphHtml = html.substring(tagStartIndex, tagEndIndex)
    const maxFontSize = getMaxFontSize(paragraphHtml, 18)

    let lineHeightValue = 1
    if (lineHeight) {
      if (lineHeight.indexOf('pt') !== -1) {
        lineHeightValue = parseFloat(lineHeight.replace('pt', '')) / maxFontSize
      }
      else {
        lineHeightValue = parseFloat(lineHeight)
      }
    }
    lineHeights.push(lineHeightValue)

    const isFirstParagraph = paragraphIndex === 0
    const isLastParagraph = match.index + fullTag.length >= html.lastIndexOf('</' + tagName + '>')

    if (marginTop && !isFirstParagraph) {
      let marginTopValue = 0
      if (marginTop.indexOf('pt') !== -1) {
        marginTopValue = parseFloat(marginTop.replace('pt', ''))
      }
      else if (marginTop.indexOf('em') !== -1) {
        marginTopValue = parseFloat(marginTop.replace('em', '')) * maxFontSize
      }
      if (marginTopValue > 0) margins.push(marginTopValue)
    }

    if (marginBottom && !isLastParagraph) {
      let marginBottomValue = 0
      if (marginBottom.indexOf('pt') !== -1) {
        marginBottomValue = parseFloat(marginBottom.replace('pt', ''))
      }
      else if (marginBottom.indexOf('em') !== -1) {
        marginBottomValue = parseFloat(marginBottom.replace('em', '')) * maxFontSize
      }
      if (marginBottomValue > 0) margins.push(marginBottomValue)
    }

    paragraphIndex++
  }

  let lineHeight = 1
  if (lineHeights.length) {
    lineHeight = +(lineHeights.reduce((sum, height) => sum + height, 0) / paragraphCount).toFixed(2)
  }

  let margin = 0
  if (margins.length && paragraphCount > 1) {
    margin = margins.reduce((sum, margin) => sum + margin, 0) / (paragraphCount - 1)
  }

  return {
    lineHeight,
    margin: margin ? +(margin * ratio).toFixed(1) : null,
  }
}

export default () => {
  const slidesStore = useSlidesStore()
  const { theme, viewportRatio, viewportSize } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()
  const { addSlidesFromData } = useAddSlidesOrElements()
  const { isEmptySlide } = useSlideHandler()

  const exporting = ref(false)

  // 导入JSON文件
  const importJSON = (files: FileList | File[], cover = false) => {
    const file = files[0]

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      try {
        const { title, slides, theme, width, height } = JSON.parse(reader.result as string)
        const aspectRatio = getAspectRatio(width, height)

        if (cover) {
          slidesStore.updateSlideIndex(0)
          slidesStore.setSlides(slides, (theme || {}))
          if (title) slidesStore.setTitle(title)
          if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
          if (width && width !== viewportSize) slidesStore.setViewportSize(width)
          addHistorySnapshot()
        }
        else if (isEmptySlide.value) {
          slidesStore.setSlides(slides, (theme || {}))
          if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
          if (width && width !== viewportSize) slidesStore.setViewportSize(width)
          addHistorySnapshot()
        }
        else addSlidesFromData(slides)
      }
      catch {
        message.error('无法正确读取 / 解析该文件')
      }
    })
    reader.readAsText(file)
  }

  // 导入pptist文件
  const importSpecificFile = (files: FileList | File[], cover = false) => {
    const file = files[0]

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      try {
        const { title, slides, theme, width, height } = JSON.parse(decrypt(reader.result as string))
        const aspectRatio = getAspectRatio(width, height)

        if (cover) {
          slidesStore.updateSlideIndex(0)
          slidesStore.setSlides(slides, (theme || {}))
          if (title) slidesStore.setTitle(title)
          if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
          if (width && width !== viewportSize) slidesStore.setViewportSize(width)
          addHistorySnapshot()
        }
        else if (isEmptySlide.value) {
          slidesStore.setSlides(slides, (theme || {}))
          if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
          if (width && width !== viewportSize) slidesStore.setViewportSize(width)
          addHistorySnapshot()
        }
        else addSlidesFromData(slides)
      }
      catch {
        message.error('无法正确读取 / 解析该文件')
      }
    })
    reader.readAsText(file)
  }

  const rotateLine = (line: PPTLineElement, angleDeg: number) => {
    const { start, end } = line
      
    const angleRad = angleDeg * Math.PI / 180
    
    const midX = (start[0] + end[0]) / 2
    const midY = (start[1] + end[1]) / 2
    
    const startTransX = start[0] - midX
    const startTransY = start[1] - midY
    const endTransX = end[0] - midX
    const endTransY = end[1] - midY
    
    const cosA = Math.cos(angleRad)
    const sinA = Math.sin(angleRad)
    
    const startRotX = startTransX * cosA - startTransY * sinA
    const startRotY = startTransX * sinA + startTransY * cosA
    
    const endRotX = endTransX * cosA - endTransY * sinA
    const endRotY = endTransX * sinA + endTransY * cosA
    
    const startNewX = startRotX + midX
    const startNewY = startRotY + midY
    const endNewX = endRotX + midX
    const endNewY = endRotY + midY
    
    const beforeMinX = Math.min(start[0], end[0])
    const beforeMinY = Math.min(start[1], end[1])
    
    const afterMinX = Math.min(startNewX, endNewX)
    const afterMinY = Math.min(startNewY, endNewY)
    
    const startAdjustedX = startNewX - afterMinX
    const startAdjustedY = startNewY - afterMinY
    const endAdjustedX = endNewX - afterMinX
    const endAdjustedY = endNewY - afterMinY
    
    const startAdjusted: [number, number] = [startAdjustedX, startAdjustedY]
    const endAdjusted: [number, number] = [endAdjustedX, endAdjustedY]
    const offset = [afterMinX - beforeMinX, afterMinY - beforeMinY]
    
    return {
      start: startAdjusted,
      end: endAdjusted,
      offset,
    }
  }

  const parseLineEnd = (lineEnd?: { type?: string }): LinePoint => {
    if (!lineEnd || !lineEnd.type || lineEnd.type === 'none') return ''
    if (['triangle', 'stealth', 'arrow'].includes(lineEnd.type)) return 'arrow'
    if (['diamond', 'oval'].includes(lineEnd.type)) return 'dot'
    return ''
  }

  const parseLineElement = (el: Shape, ratio: number, customPoints?: [[number, number], [number, number]] | null) => {
    let start: [number, number] = [0, 0]
    let end: [number, number] = [0, 0]
    let rotateOffset: [number, number] = [0, 0]
    let left = el.left
    let top = el.top
    if (customPoints) {
      const minX = Math.min(customPoints[0][0], customPoints[1][0])
      const minY = Math.min(customPoints[0][1], customPoints[1][1])
      const spanX = Math.abs(customPoints[1][0] - customPoints[0][0])
      const spanY = Math.abs(customPoints[1][1] - customPoints[0][1])
      const box = el.pathViewBox
      const angle = (el.rotate || 0) * Math.PI / 180
      const mapped = customPoints.map(point => {
        let x = box && Number.isFinite(box.width) && box.width > 0
          ? (point[0] - box.x) / box.width * el.width
          : spanX ? (point[0] - minX) / spanX * el.width : 0
        let y = box && Number.isFinite(box.height) && box.height > 0
          ? (point[1] - box.y) / box.height * el.height
          : spanY ? (point[1] - minY) / spanY * el.height : 0
        if (el.isFlipH) x = el.width - x
        if (el.isFlipV) y = el.height - y
        const dx = x - el.width / 2
        const dy = y - el.height / 2
        return [
          dx * Math.cos(angle) - dy * Math.sin(angle) + el.width / 2,
          dx * Math.sin(angle) + dy * Math.cos(angle) + el.height / 2,
        ] as [number, number]
      })
      const offsetX = Math.min(mapped[0][0], mapped[1][0])
      const offsetY = Math.min(mapped[0][1], mapped[1][1])
      left += offsetX
      top += offsetY
      start = [mapped[0][0] - offsetX, mapped[0][1] - offsetY]
      end = [mapped[1][0] - offsetX, mapped[1][1] - offsetY]
    }
    else if (!el.isFlipV && !el.isFlipH) { // 右下
      start = [0, 0]
      end = [el.width, el.height]
    }
    else if (el.isFlipV && el.isFlipH) { // 左上
      start = [el.width, el.height]
      end = [0, 0]
    }
    else if (el.isFlipV && !el.isFlipH) { // 右上
      start = [0, el.height]
      end = [el.width, 0]
    }
    else { // 左下
      start = [el.width, 0]
      end = [0, el.height]
    }

    const data: PPTLineElement = {
      type: 'line',
      id: nanoid(10),
      width: +((el.borderWidth ?? 1) * ratio).toFixed(2),
      left,
      top,
      start,
      end,
      style: el.borderType,
      color: el.borderColor,
      points: [parseLineEnd(el.headEnd), parseLineEnd(el.tailEnd)]
    }
    if (el.link) data.link = { type: 'web', target: el.link }
    if (el.shadow) {
      data.shadow = {
        h: el.shadow.h * ratio,
        v: el.shadow.v * ratio,
        blur: el.shadow.blur * ratio,
        color: el.shadow.color,
      }
    }
    if (el.rotate && !customPoints) {
      const { start, end, offset } = rotateLine(data, el.rotate)

      data.start = start
      data.end = end
      data.left = data.left + offset[0]
      data.top = data.top + offset[1]
      rotateOffset = [offset[0], offset[1]]
    }
    if (/bentConnector/.test(el.shapType)) {
      const setDefaultBroken2 = () => {
        data.broken2 = [
          Math.abs(data.start[0] - data.end[0]) / 2,
          Math.abs(data.start[1] - data.end[1]) / 2,
        ]
      }

      const getPathPoints = (maxLength: number) => {
        if (!el.path) return []

        return toPoints(el.path).map(point => {
          if (!('x' in point) || !('y' in point)) return null
          if (typeof point.x !== 'number' || typeof point.y !== 'number') return null

          let x = el.pathViewBox?.width ? (point.x - el.pathViewBox.x) / el.pathViewBox.width * el.width : point.x * ratio
          let y = el.pathViewBox?.height ? (point.y - el.pathViewBox.y) / el.pathViewBox.height * el.height : point.y * ratio

          if (el.isFlipH) x = el.width - x
          if (el.isFlipV) y = el.height - y

          if (el.rotate) {
            const angleRad = el.rotate * Math.PI / 180
            const midX = (start[0] + end[0]) / 2
            const midY = (start[1] + end[1]) / 2
            const xTrans = x - midX
            const yTrans = y - midY
            const xRot = xTrans * Math.cos(angleRad) - yTrans * Math.sin(angleRad) + midX
            const yRot = xTrans * Math.sin(angleRad) + yTrans * Math.cos(angleRad) + midY
            const beforeMinX = Math.min(start[0], end[0])
            const beforeMinY = Math.min(start[1], end[1])
            x = xRot - beforeMinX - rotateOffset[0]
            y = yRot - beforeMinY - rotateOffset[1]
          }

          return [x, y]
        }).filter((point): point is [number, number] => !!point).slice(0, maxLength)
      }

      if (el.shapType === 'bentConnector2') {
        const pathPoints = getPathPoints(3)

        if (
          pathPoints.length >= 3 &&
          pathPoints.every(point => Number.isFinite(point[0]) && Number.isFinite(point[1]))
        ) {
          const deltaX = Math.abs(pathPoints[1][0] - pathPoints[0][0])
          const deltaY = Math.abs(pathPoints[1][1] - pathPoints[0][1])
          data.broken = deltaX >= deltaY ? [data.start[0], data.end[1]] : [data.end[0], data.start[1]]
        }
        else data.broken = [data.start[0], data.end[1]]
      }
      else if (el.shapType === 'bentConnector3') {
        const pathPoints = getPathPoints(4)

        if (
          pathPoints.length >= 4 &&
          pathPoints.every(point => Number.isFinite(point[0]) && Number.isFinite(point[1]))
        ) {
          const mid1 = pathPoints[1]
          const mid2 = pathPoints[2]
          const deltaX = Math.abs(pathPoints[1][0] - pathPoints[0][0])
          const deltaY = Math.abs(pathPoints[1][1] - pathPoints[0][1])

          data.broken2 = [
            (mid1[0] + mid2[0]) / 2,
            (mid1[1] + mid2[1]) / 2,
          ]
          data.broken2Direction = deltaX >= deltaY ? 'horizontal' : 'vertical'
        }
        else setDefaultBroken2()
      }
      else setDefaultBroken2()
    }
    if (/curvedConnector/.test(el.shapType)) {
      const cubic: [number, number] = [
        Math.abs(data.start[0] - data.end[0]) / 2,
        Math.abs(data.start[1] - data.end[1]) / 2,
      ]
      data.cubic = [cubic, cubic]
    }

    return data
  }

  const flipGroupElements = (elements: BaseElement[], axis: 'x' | 'y') => {
    const minX = Math.min(...elements.map(el => el.left))
    const maxX = Math.max(...elements.map(el => el.left + el.width))
    const minY = Math.min(...elements.map(el => el.top))
    const maxY = Math.max(...elements.map(el => el.top + el.height))

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    return elements.map(element => {
      const newElement = { ...element }

      if (axis === 'y') newElement.left = 2 * centerX - element.left - element.width
      if (axis === 'x') newElement.top = 2 * centerY - element.top - element.height
  
      return newElement
    })
  }

  const calculateRotatedPosition = (
    ax: number, // A 的 x
    ay: number, // A 的 y
    aw: number, // A 的宽
    ah: number, // A 的高
    bx: number, // B 相对 A 的 x (ox)
    by: number, // B 相对 A 的 y (oy)
    bw: number, // B 的宽
    bh: number, // B 的高
    ak: number, // A 的旋转角度（度，正顺时针）
    bk: number, // B 的旋转角度（度，正顺时针）
  ) => {
    const aRadians = ak * (Math.PI / 180)
    const aCos = Math.cos(aRadians)
    const aSin = Math.sin(aRadians)

    const aCenterX = ax + aw / 2
    const aCenterY = ay + ah / 2

    const corners = [
      { ox: bx, oy: by },
      { ox: bx + bw, oy: by },
      { ox: bx + bw, oy: by + bh },
      { ox: bx, oy: by + bh },
    ]

    let minX = Infinity
    let minY = Infinity

    for (const corner of corners) {
      const relativeX = corner.ox - aw / 2
      const relativeY = corner.oy - ah / 2

      const rotatedX = relativeX * aCos + relativeY * aSin
      const rotatedY = -relativeX * aSin + relativeY * aCos

      const graphicX = aCenterX + rotatedX
      const graphicY = aCenterY + rotatedY

      minX = Math.min(minX, graphicX)
      minY = Math.min(minY, graphicY)
    }

    const globalRotation = (bk + ak) % 360

    return { x: minX, y: minY, globalRotation }
  }

  // 导入PPTX文件
  const importPPTXFile = (files: FileList | File[], options?: { cover?: boolean; fixedViewport?: boolean }) => {
    const defaultOptions = {
      cover: false,
      fixedViewport: false, 
    }
    const { cover, fixedViewport } = { ...defaultOptions, ...options }

    const file = files[0]
    if (!file) return

    exporting.value = true

    const shapeList: ShapePoolItem[] = []
    for (const item of SHAPE_LIST) {
      shapeList.push(...item.children)
    }
    
    const reader = new FileReader()
    reader.onload = async e => {
      let json: Awaited<ReturnType<typeof parse>>
      try {
        json = await parse(e.target!.result as ArrayBuffer, {
          imageMode: 'base64',
          videoMode: 'blob',
          audioMode: 'blob',
          singleLineSpacingFactor: 1.15,
        })
      }
      catch {
        exporting.value = false
        message.error('无法正确读取 / 解析该文件')
        return
      }

      if (json.usedFonts && json.usedFonts.length) loadGoogleFonts(json.usedFonts)

      let ratio = 96 / 72
      const width = json.size.width
      const height = json.size.height

      const aspectRatio = getAspectRatio(width, height)
      
      if (fixedViewport) ratio = 1000 / width
      else slidesStore.setViewportSize(width * ratio)

      slidesStore.setTheme({ themeColors: json.themeColors })

      const slides: Slide[] = []
      for (const item of json.slides) {
        const { type, value } = item.fill
        let background: SlideBackground
        if (type === 'image') {
          background = {
            type: 'image',
            image: {
              src: value.base64,
              size: 'cover',
            },
          }
        }
        else if (type === 'gradient') {
          background = {
            type: 'gradient',
            gradient: {
              type: value.path === 'line' ? 'linear' : 'radial',
              colors: value.colors.map(item => ({
                ...item,
                pos: parseInt(item.pos),
              })),
              rotate: value.rot,
            },
          }
        }
        else if (type === 'pattern') {
          background = {
            type: 'solid',
            color: '#fff',
          }
        }
        else {
          background = {
            type: 'solid',
            color: value || '#fff',
          }
        }

        const slide: Slide = {
          id: nanoid(10),
          elements: [],
          background,
          remark: item.note || '',
        }

        const parseElements = (elements: Element[]) => {
          const sortedElements = elements.map(element => ({ ...element })).sort((a, b) => a.order - b.order)

          for (const el of sortedElements) {
            const customShapeLinePoints = el.type === 'shape' ? getCustomLinePoints(el) : null
            const customLinePoints = el.type === 'shape' && customShapeLinePoints && !hasImportedText(el.content) ? customShapeLinePoints : null
            let backstopSize = 1

            if (el.type === 'shape') {
              if (el.shapType === 'line' || /straightConnector/.test(el.shapType) || /bentConnector/.test(el.shapType) || /curvedConnector/.test(el.shapType) || customLinePoints) {
                backstopSize = 0
              }
            }

            const originWidth = el.width || backstopSize
            const originHeight = el.height || backstopSize
            const originLeft = el.left || 0
            const originTop = el.top || 0

            el.width = originWidth * ratio
            el.height = originHeight * ratio
            el.left = originLeft * ratio
            el.top = originTop * ratio
  
            if (el.type === 'text') {
              const autoFitType = el.autoFit?.type
              const isSelfAdaptive = autoFitType === 'shape'
              const fontScale = autoFitType === 'text' ? (el.autoFit!.fontScale || 100) / 100 : 1
              const textRatio = ratio * fontScale
              const metrics = getParagraphMetrics(el.content, textRatio)
              const textEl: PPTTextElement = {
                type: 'text',
                id: nanoid(10),
                width: el.width,
                height: el.height,
                left: el.left,
                top: el.top,
                rotate: el.rotate,
                defaultFontName: theme.value.fontName,
                defaultColor: theme.value.fontColor,
                content: convertTextContent(el.content, textRatio),
                lineHeight: 1,
                outline: {
                  color: el.borderColor,
                  width: +(el.borderWidth * ratio).toFixed(2),
                  style: el.borderType,
                },
                fill: el.fill?.type === 'color' ? el.fill.value : '',
                vertical: el.textDirection ? el.textDirection === 'eaVert' : el.isVertical,
              }
              if (!isSelfAdaptive) {
                textEl.fixedHeight = true
                textEl.vAlign = vAlignMap[el.vAlign] || 'top'
              }
              if (el.shadow) {
                textEl.shadow = {
                  h: el.shadow.h * ratio,
                  v: el.shadow.v * ratio,
                  blur: el.shadow.blur * ratio,
                  color: el.shadow.color,
                }
              }
              if (el.link) textEl.link = { type: 'web', target: el.link }
              if (el.textInset) textEl.inset = [el.textInset.t, el.textInset.r, el.textInset.b, el.textInset.l]
              if (metrics.lineHeight) textEl.lineHeight = metrics.lineHeight
              if (metrics.margin) textEl.paragraphSpace = metrics.margin
              slide.elements.push(textEl)
            }
            else if (el.type === 'image') {
              const element: PPTImageElement = {
                type: 'image',
                id: nanoid(10),
                src: el.base64,
                width: el.width,
                height: el.height,
                left: el.left,
                top: el.top,
                fixedRatio: true,
                rotate: el.rotate,
                flipH: el.isFlipH,
                flipV: el.isFlipV,
              }
              if (el.borderWidth) {
                element.outline = {
                  color: el.borderColor,
                  width: +(el.borderWidth * ratio).toFixed(2),
                  style: el.borderType,
                }
              }
              const clipShapeTypes = [
                'rect',
                'snip1Rect',
                'snip2DiagRect',
                'roundRect',
                'ellipse',
                'triangle',
                'rtTriangle',
                'diamond',
                'pentagon',
                'hexagon',
                'heptagon',
                'octagon',
                'chevron',
                'homePlate',
                'rightArrow',
                'parallelogram',
                'trapezoid'
              ]
              let geom = el.geom || 'rect'
              if (geom.indexOf('custom:') !== -1) geom = geom.replace('custom:', '')
              if (!clipShapeTypes.includes(geom)) geom = 'rect'

              if (el.rect) {
                element.clip = {
                  shape: geom,
                  range: [
                    [
                      el.rect.l || 0,
                      el.rect.t || 0,
                    ],
                    [
                      100 - (el.rect.r || 0),
                      100 - (el.rect.b || 0),
                    ],
                  ]
                }
              }
              else if (el.geom) {
                element.clip = {
                  shape: geom,
                  range: [[0, 0], [100, 100]]
                }
              }

              if (el.link) element.link = { type: 'web', target: el.link }
              slide.elements.push(element)
            }
            else if (el.type === 'math') {
              slide.elements.push({
                type: 'image',
                id: nanoid(10),
                src: el.picBase64,
                width: el.width,
                height: el.height,
                left: el.left,
                top: el.top,
                fixedRatio: true,
                rotate: 0,
              })
            }
            else if (el.type === 'audio' && el.blob) {
              slide.elements.push({
                type: 'audio',
                id: nanoid(10),
                src: el.blob,
                width: el.width,
                height: el.height,
                left: el.left,
                top: el.top,
                rotate: 0,
                fixedRatio: false,
                color: theme.value.themeColors[0],
                loop: false,
                autoplay: false,
              })
            }
            else if (el.type === 'video' && el.blob) {
              slide.elements.push({
                type: 'video',
                id: nanoid(10),
                src: el.blob,
                width: el.width,
                height: el.height,
                left: el.left,
                top: el.top,
                rotate: 0,
                autoplay: false,
              })
            }
            else if (el.type === 'shape') {
              if (el.shapType === 'line' || /straightConnector/.test(el.shapType) || /bentConnector/.test(el.shapType) || /curvedConnector/.test(el.shapType) || customLinePoints) {
                const lineElement = parseLineElement(el, ratio, customLinePoints)
                slide.elements.push(lineElement)
              }
              else {
                const shape = shapeList.find(item => item.pptxShapeType === el.shapType)

                const gradient: Gradient | undefined = el.fill?.type === 'gradient' ? {
                  type: el.fill.value.path === 'line' ? 'linear' : 'radial',
                  colors: el.fill.value.colors.map(item => ({
                    ...item,
                    pos: parseInt(item.pos),
                  })),
                  rotate: el.fill.value.rot,
                } : undefined

                const pattern: string | undefined = el.fill?.type === 'image' ? el.fill.value.base64 : undefined

                const fill = (!el.strokeOnly && el.fill?.type === 'color') ? el.fill.value : ''

                const metrics = getParagraphMetrics(el.content, ratio)
                
                const element: PPTShapeElement = {
                  type: 'shape',
                  id: nanoid(10),
                  width: el.width,
                  height: el.height,
                  left: el.left,
                  top: el.top,
                  viewBox: [200, 200],
                  path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
                  fill,
                  gradient,
                  pattern,
                  fixedRatio: false,
                  rotate: el.rotate,
                  outline: {
                    color: el.borderColor,
                    width: +(el.borderWidth * ratio).toFixed(2),
                    style: el.borderType,
                  },
                  text: {
                    content: convertTextContent(el.content, ratio),
                    defaultFontName: theme.value.fontName,
                    defaultColor: theme.value.fontColor,
                    align: vAlignMap[el.vAlign] || 'middle',
                  },
                  flipH: el.isFlipH,
                  flipV: el.isFlipV,
                }
                if (el.link) element.link = { type: 'web', target: el.link }
                if (el.textInset) element.text!.inset = [el.textInset.t, el.textInset.r, el.textInset.b, el.textInset.l]
                if (metrics.lineHeight) element.text!.lineHeight = metrics.lineHeight
                if (metrics.margin) element.text!.paragraphSpace = metrics.margin

                if (el.shadow) {
                  element.shadow = {
                    h: el.shadow.h * ratio,
                    v: el.shadow.v * ratio,
                    blur: el.shadow.blur * ratio,
                    color: el.shadow.color,
                  }
                }
    
                const importedGeometry = !shape ? getImportedShapeGeometry(el, customShapeLinePoints) : null
                if (!shape && !importedGeometry) continue
                if (shape) {
                  element.path = shape.path
                  element.viewBox = shape.viewBox
    
                  if (shape.pathFormula) {
                    element.pathFormula = shape.pathFormula
                    element.viewBox = [el.width, el.height]
    
                    const pathFormula = SHAPE_PATH_FORMULAS[shape.pathFormula]
                    if ('editable' in pathFormula && pathFormula.editable) {
                      let keypointValues = pathFormula.defaultValue
                      if (el.keypoints) {
                        let keypoint = 0
                        if (el.shapType === 'triangle') {
                          const val = el.keypoints.adj === undefined ? 1 : el.keypoints.adj
                          keypoint = val * 0.5
                        }
                        if (el.shapType === 'frame') {
                          const val = el.keypoints.adj1 === undefined ? 0.25 : el.keypoints.adj1
                          keypoint = val * 0.5
                        }
                        if (el.shapType === 'corner') {
                          const val1 = el.keypoints.adj1 === undefined ? 1 : el.keypoints.adj1
                          const val2 = el.keypoints.adj2 === undefined ? 1 : el.keypoints.adj2
                          keypoint = ((val1 + val2) / 2) * 0.5
                        }
                        if (el.shapType === 'diagStripe') {
                          const val = el.keypoints.adj === undefined ? 1 : el.keypoints.adj
                          keypoint = val * 0.5
                        }
                        if (el.shapType === 'donut') {
                          const val = el.keypoints.adj === undefined ? 0.5 : el.keypoints.adj
                          keypoint = val * 0.5
                        }
                        if (el.shapType === 'plus') {
                          const val = el.keypoints.adj === undefined ? 0.5 : el.keypoints.adj
                          keypoint = 1 - val
                        }
                        if (pathFormula.range && keypoint < pathFormula.range[0][0]) keypoint = pathFormula.range[0][0]
                        if (pathFormula.range && keypoint > pathFormula.range[0][1]) keypoint = pathFormula.range[0][1]
                        keypointValues = [keypoint]
                      }
                      const cornerPresets = ['roundRect', 'round1Rect', 'round2SameRect', 'round2DiagRect', 'snip1Rect', 'snip2SameRect', 'snip2DiagRect', 'snipRoundRect']
                      if (cornerPresets.includes(el.shapType) || el.shapType === 'trapezoid') {
                        const adjustment = (name: string, fallback: number) => {
                          const value = el.keypoints?.[name]
                          return Number.isFinite(value) ? value! * 0.5 : fallback
                        }
                        let values: number[]
                        if (el.shapType === 'trapezoid') {
                          const sourceWidth = el.pathViewBox?.width || originWidth
                          const sourceHeight = el.pathViewBox?.height || originHeight
                          const normalized = adjustment('adj', 0.25)
                          values = [Math.max(0, Math.min(0.5, normalized * Math.min(sourceWidth, sourceHeight) / sourceWidth))]
                        }
                        else if (['roundRect', 'round1Rect', 'snip1Rect'].includes(el.shapType)) values = [adjustment('adj', 0.16667)]
                        else if (el.shapType === 'snip2DiagRect') values = [adjustment('adj2', 0.16667), adjustment('adj1', 0)]
                        else if (el.shapType === 'snipRoundRect') values = [adjustment('adj1', 0.16667), adjustment('adj2', 0.16667)]
                        else values = [adjustment('adj1', 0.16667), adjustment('adj2', 0)]

                        keypointValues = values.map(value => Math.max(0, Math.min(value, 0.5)))
                      }
                      element.path = pathFormula.formula(el.width, el.height, keypointValues)
                      element.keypoints = keypointValues
                    }
                    else element.path = pathFormula.formula(el.width, el.height)

                    const sourceBox = el.pathViewBox
                    if (sourceBox && sourceBox.width > 0 && sourceBox.height > 0 &&
                      Number.isFinite(sourceBox.width) && Number.isFinite(sourceBox.height) &&
                      Math.abs(sourceBox.width / sourceBox.height - originWidth / originHeight) > 0.000001) {

                      element.path = pathFormula.formula(sourceBox.width, sourceBox.height, element.keypoints)
                      element.viewBox = [sourceBox.width, sourceBox.height]
                      delete element.pathFormula
                      delete element.keypoints
                    }
                  }
                }
                else if (importedGeometry) {
                  element.path = importedGeometry.path
                  element.viewBox = importedGeometry.viewBox
                }

                if (element.path && element.viewBox[0] && element.viewBox[1]) slide.elements.push(element)
              }
            }
            else if (el.type === 'table') {
              const row = el.data.length
              const col = el.data[0].length
  
              const style: TableCellStyle = {
                fontname: theme.value.fontName,
                color: theme.value.fontColor,
              }
              const data: TableCell[][] = []
              for (let i = 0; i < row; i++) {
                const rowCells: TableCell[] = []
                for (let j = 0; j < col; j++) {
                  const cellData = el.data[i][j]

                  let textDiv: HTMLDivElement | null = document.createElement('div')
                  textDiv.innerHTML = cellData.text
                  const p = textDiv.querySelector('p')
                  const align = p?.style.textAlign || 'left'

                  const span = textDiv.querySelector('span')
                  const fontsize = span?.style.fontSize ? (parseInt(span?.style.fontSize) * ratio).toFixed(1) + 'px' : ''
                  const fontname = span?.style.fontFamily || ''
                  const color = span?.style.color || cellData.fontColor
                  const fontWeight = span?.style.fontWeight || ''
                  const bold = fontWeight === 'bold' || +fontWeight >= 600 || cellData.fontBold
                  const em = span?.style.fontStyle === 'italic'
                  const textDecoration = span?.style.textDecoration || ''
                  const underline = textDecoration.includes('underline')
                  const strikethrough = textDecoration.includes('line-through')

                  textDiv.innerHTML = convertTextContent(cellData.text, ratio)
                  if (cellData.fontBold) textDiv.style.fontWeight = 'bold'

                  rowCells.push({
                    id: nanoid(10),
                    colspan: cellData.colSpan || 1,
                    rowspan: cellData.rowSpan || 1,
                    text: serializeTableText(parseTableText(textDiv.outerHTML)),
                    style: {
                      ...style,
                      vAlign: vAlignMap[cellData.vAlign] || 'middle',
                      align: ['left', 'right', 'center'].includes(align) ? (align as 'left' | 'right' | 'center') : 'left',
                      fontsize,
                      fontname,
                      color,
                      bold,
                      em,
                      underline,
                      strikethrough,
                      backcolor: cellData.fillColor,
                    },
                  })
                  textDiv = null
                }
                data.push(rowCells)
              }
  
              const allWidth = el.colWidths.reduce((a, b) => a + b, 0)
              const colWidths: number[] = el.colWidths.map(item => item / allWidth)
              const cellMinHeight = el.rowHeights[0] ? el.rowHeights[0] * ratio : 36
              const rowHeights = el.rowHeights.slice(0, row).map(height => Math.max(height * ratio, cellMinHeight))

              const isVisibleBorder = (b?: { borderColor?: string; borderWidth?: number }) => {
                if (!b || !b.borderWidth) return false
                const c = b.borderColor || ''
                if (/^#[0-9a-fA-F]{8}$/.test(c) && c.slice(-2).toLowerCase() === '00') return false
                return true
              }
              const borderCounter = new Map<string, { border: any; count: number }>()
              const collectBorders = (borders?: Record<string, any>) => {
                if (!borders) return
                for (const side of ['top', 'bottom', 'left', 'right'] as const) {
                  const b = borders[side]
                  if (!isVisibleBorder(b)) continue
                  const key = `${b.borderColor}|${b.borderWidth}|${b.borderType}`
                  const hit = borderCounter.get(key)
                  if (hit) hit.count++
                  else borderCounter.set(key, { border: b, count: 1 })
                }
              }
              collectBorders(el.borders)
              for (const rowCells of el.data) {
                for (const cell of rowCells) collectBorders(cell.borders)
              }
              const border = [...borderCounter.values()].sort((a, b) => b.count - a.count)[0]?.border
              const borderWidth = border?.borderWidth || 0
              const borderStyle = border?.borderType || 'solid'
              const borderColor = border?.borderColor || '#eeece1'
  
              slide.elements.push({
                type: 'table',
                id: nanoid(10),
                width: el.width,
                height: el.height,
                left: el.left,
                top: el.top,
                colWidths,
                rotate: 0,
                data,
                rowHeights,
                outline: {
                  width: +(borderWidth * ratio).toFixed(2),
                  style: borderStyle,
                  color: borderColor,
                },
                cellMinHeight,
              })
            }
            else if (el.type === 'chart') {
              const imported = convertImportedChart(el)
              if (!imported) continue
              const { chart, data } = imported
              const { labels, legends, series } = data
              const options: ChartOptions = {}
  
              let chartType: ChartType = 'bar'

              switch (chart.chartType) {
                case 'barChart':
                case 'bar3DChart':
                  chartType = 'bar'
                  if (chart.barDir === 'bar') chartType = 'column'
                  if (chart.grouping === 'stacked' || chart.grouping === 'percentStacked') options.stack = true
                  break
                case 'lineChart':
                case 'line3DChart':
                  if (chart.grouping === 'stacked' || chart.grouping === 'percentStacked') options.stack = true
                  chartType = 'line'
                  break
                case 'areaChart':
                case 'area3DChart':
                  if (chart.grouping === 'stacked' || chart.grouping === 'percentStacked') options.stack = true
                  chartType = 'area'
                  break
                case 'scatterChart':
                case 'bubbleChart':
                  chartType = 'scatter'
                  break
                case 'pieChart':
                case 'pie3DChart':
                  chartType = 'pie'
                  break
                case 'radarChart':
                  chartType = 'radar'
                  break
                case 'doughnutChart':
                  chartType = 'ring'
                  break
                default:
              }
  
              slide.elements.push({
                type: 'chart',
                id: nanoid(10),
                chartType: chartType,
                width: el.width,
                height: el.height,
                left: el.left,
                top: el.top,
                rotate: 0,
                themeColors: chart.colors.length ? chart.colors : theme.value.themeColors,
                textColor: theme.value.fontColor,
                data: {
                  labels,
                  legends,
                  series,
                },
                options,
              })
            }
            else if (el.type === 'group') {
              let elements: BaseElement[] = el.elements.map(_el => {
                let left = _el.left + originLeft
                let top = _el.top + originTop

                let rotate = 0
                if ('rotate' in _el) rotate = _el.rotate

                if (el.rotate) {
                  const { x, y, globalRotation } = calculateRotatedPosition(
                    originLeft,
                    originTop,
                    originWidth,
                    originHeight,
                    _el.left,
                    _el.top,
                    _el.width,
                    _el.height,
                    el.rotate,
                    rotate
                  )
                  left = x
                  top = y
                  rotate = globalRotation
                }

                const element = {
                  ..._el,
                  left,
                  top,
                }
                if (el.isFlipH && 'isFlipH' in element) element.isFlipH = !element.isFlipH
                if (el.isFlipV && 'isFlipV' in element) element.isFlipV = !element.isFlipV
                if ('rotate' in element && el.rotate) element.rotate = rotate

                return element
              })
              if (el.isFlipH) elements = flipGroupElements(elements, 'y')
              if (el.isFlipV) elements = flipGroupElements(elements, 'x')
              parseElements(elements)
            }
            else if (el.type === 'diagram') {
              const elements = el.elements.map(_el => ({
                ..._el,
                left: _el.left + originLeft,
                top: _el.top + originTop,
              }))
              parseElements(elements)
            }
          }
        }
        parseElements([...item.elements, ...item.layoutElements])
        slides.push(slide)
      }

      if (cover) {
        slidesStore.updateSlideIndex(0)
        slidesStore.setSlides(slides)
        if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
        addHistorySnapshot()
      }
      else if (isEmptySlide.value) {
        slidesStore.setSlides(slides)
        if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
        addHistorySnapshot()
      }
      else addSlidesFromData(slides)

      exporting.value = false
    }
    reader.readAsArrayBuffer(file)
  }

  return {
    importSpecificFile,
    importJSON,
    importPPTXFile,
    exporting,
  }
}
