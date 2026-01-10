import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { parse, type Shape, type Element, type ChartItem, type BaseElement } from 'pptxtojson'
import { nanoid } from 'nanoid'
import { useSlidesStore } from '@/store'
import { decrypt } from '@/utils/crypto'
import { type ShapePoolItem, SHAPE_LIST, SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from './useHistorySnapshot'
import message from '@/utils/message'
import { getSvgPathRange } from '@/utils/svgPathParser'
import type {
  Slide,
  TableCellStyle,
  TableCell,
  ChartType,
  SlideBackground,
  PPTShapeElement,
  PPTLineElement,
  PPTImageElement,
  ShapeTextAlign,
  PPTTextElement,
  ChartOptions,
  Gradient,
} from '@/types/slides'

const shapeVAlignMap: { [key: string]: ShapeTextAlign } = {
  'mid': 'middle',
  'down': 'bottom',
  'up': 'top',
}

const convertFontSizePtToPx = (html: string, ratio: number) => {
  return html.replace(/font-size:\s*([\d.]+)pt/g, (match, p1) => {
    return `font-size: ${(parseFloat(p1) * ratio).toFixed(1)}px`
  })
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
  const tagRegex = /<(div|p|li)(?![a-z0-9])[^>]*>/gi

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
  const { theme } = storeToRefs(useSlidesStore())

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
        const { slides, theme } = JSON.parse(reader.result as string)
        if (cover) {
          slidesStore.updateSlideIndex(0)
          slidesStore.setSlides(slides, (theme || {}))
          addHistorySnapshot()
        }
        else if (isEmptySlide.value) {
          slidesStore.setSlides(slides, (theme || {}))
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
        const { slides, theme } = JSON.parse(decrypt(reader.result as string))
        if (cover) {
          slidesStore.updateSlideIndex(0)
          slidesStore.setSlides(slides, (theme || {}))
          addHistorySnapshot()
        }
        else if (isEmptySlide.value) {
          slidesStore.setSlides(slides, (theme || {}))
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

  const parseLineElement = (el: Shape, ratio: number) => {
    let start: [number, number] = [0, 0]
    let end: [number, number] = [0, 0]

    if (!el.isFlipV && !el.isFlipH) { // 右下
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
      width: +((el.borderWidth || 1) * ratio).toFixed(2),
      left: el.left,
      top: el.top,
      start,
      end,
      style: el.borderType,
      color: el.borderColor,
      points: ['', /straightConnector/.test(el.shapType) ? 'arrow' : '']
    }
    if (el.rotate) {
      const { start, end, offset } = rotateLine(data, el.rotate)

      data.start = start
      data.end = end
      data.left = data.left + offset[0]
      data.top = data.top + offset[1]
    }
    if (/bentConnector/.test(el.shapType)) {
      data.broken2 = [
        Math.abs(data.start[0] - data.end[0]) / 2,
        Math.abs(data.start[1] - data.end[1]) / 2,
      ]
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
      let json = null
      try {
        json = await parse(e.target!.result as ArrayBuffer)
      }
      catch {
        exporting.value = false
        message.error('无法正确读取 / 解析该文件')
        return
      }

      let ratio = 96 / 72
      const width = json.size.width
      
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
              src: value.picBase64,
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
              rotate: value.rot + 90,
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
          const sortedElements = elements.sort((a, b) => a.order - b.order)

          for (const el of sortedElements) {
            const originWidth = el.width || 1
            const originHeight = el.height || 1
            const originLeft = el.left
            const originTop = el.top

            el.width = el.width * ratio
            el.height = el.height * ratio
            el.left = el.left * ratio
            el.top = el.top * ratio
  
            if (el.type === 'text') {
              if (el.autoFit && el.autoFit.type === 'text') {
                const fontScale = ratio * (el.autoFit.fontScale || 100) / 100
                const metrics = getParagraphMetrics(el.content, fontScale)
                const shapeEl: PPTShapeElement = {
                  type: 'shape',
                  id: nanoid(10),
                  width: el.width,
                  height: el.height,
                  left: el.left,
                  top: el.top,
                  rotate: el.rotate,
                  viewBox: [200, 200],
                  path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
                  fill: el.fill.type === 'color' ? el.fill.value : '',
                  fixedRatio: false,
                  outline: {
                    color: el.borderColor,
                    width: +(el.borderWidth * ratio).toFixed(2),
                    style: el.borderType,
                  },
                  text: {
                    content: convertFontSizePtToPx(el.content, fontScale),
                    defaultFontName: theme.value.fontName,
                    defaultColor: theme.value.fontColor,
                    align: shapeVAlignMap[el.vAlign] || 'middle',
                    lineHeight: 1,
                  },
                }
                if (metrics.lineHeight) shapeEl.text!.lineHeight = metrics.lineHeight
                if (metrics.margin) shapeEl.text!.paragraphSpace = metrics.margin
                slide.elements.push(shapeEl)
              }
              else {
                const metrics = getParagraphMetrics(el.content, ratio)
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
                  content: convertFontSizePtToPx(el.content, ratio),
                  lineHeight: 1,
                  outline: {
                    color: el.borderColor,
                    width: +(el.borderWidth * ratio).toFixed(2),
                    style: el.borderType,
                  },
                  fill: el.fill.type === 'color' ? el.fill.value : '',
                  vertical: el.isVertical,
                }
                if (el.shadow) {
                  textEl.shadow = {
                    h: el.shadow.h * ratio,
                    v: el.shadow.v * ratio,
                    blur: el.shadow.blur * ratio,
                    color: el.shadow.color,
                  }
                }
                slide.elements.push(textEl)
                if (metrics.lineHeight) textEl.lineHeight = metrics.lineHeight
                if (metrics.margin) textEl.paragraphSpace = metrics.margin
              }
            }
            else if (el.type === 'image') {
              const element: PPTImageElement = {
                type: 'image',
                id: nanoid(10),
                src: el.src,
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
              const clipShapeTypes = ['roundRect', 'ellipse', 'triangle', 'rhombus', 'pentagon', 'hexagon', 'heptagon', 'octagon', 'parallelogram', 'trapezoid']
              if (el.rect) {
                element.clip = {
                  shape: (el.geom && clipShapeTypes.includes(el.geom)) ? el.geom : 'rect',
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
              else if (el.geom && clipShapeTypes.includes(el.geom)) {
                element.clip = {
                  shape: el.geom,
                  range: [[0, 0], [100, 100]]
                }
              }
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
            else if (el.type === 'audio') {
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
            else if (el.type === 'video') {
              slide.elements.push({
                type: 'video',
                id: nanoid(10),
                src: (el.blob || el.src)!,
                width: el.width,
                height: el.height,
                left: el.left,
                top: el.top,
                rotate: 0,
                autoplay: false,
              })
            }
            else if (el.type === 'shape') {
              if (el.shapType === 'line' || /Connector/.test(el.shapType)) {
                const lineElement = parseLineElement(el, ratio)
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

                const pattern: string | undefined = el.fill?.type === 'image' ? el.fill.value.picBase64 : undefined

                const fill = el.fill?.type === 'color' ? el.fill.value : ''

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
                    content: convertFontSizePtToPx(el.content, ratio),
                    defaultFontName: theme.value.fontName,
                    defaultColor: theme.value.fontColor,
                    align: shapeVAlignMap[el.vAlign] || 'middle',
                  },
                  flipH: el.isFlipH,
                  flipV: el.isFlipV,
                }
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
    
                if (shape) {
                  element.path = shape.path
                  element.viewBox = shape.viewBox
    
                  if (shape.pathFormula) {
                    element.pathFormula = shape.pathFormula
                    element.viewBox = [el.width, el.height]
    
                    const pathFormula = SHAPE_PATH_FORMULAS[shape.pathFormula]
                    if ('editable' in pathFormula && pathFormula.editable) {
                      element.path = pathFormula.formula(el.width, el.height, pathFormula.defaultValue)
                      element.keypoints = pathFormula.defaultValue
                    }
                    else element.path = pathFormula.formula(el.width, el.height)
                  }
                }
                else if (el.path && el.path.indexOf('NaN') === -1) {
                  const { maxX, maxY } = getSvgPathRange(el.path)
                  element.path = el.path
                  if ((maxX / maxY) > (originWidth / originHeight)) {
                    element.viewBox = [maxX, maxX * originHeight / originWidth]
                  }
                  else {
                    element.viewBox = [maxY * originWidth / originHeight, maxY]
                  }
                }
                if (el.shapType === 'custom') {
                  if (el.path!.indexOf('NaN') !== -1) {
                    if (element.width === 0) element.width = 0.1
                    if (element.height === 0) element.height = 0.1
                    element.path = el.path!.replace(/NaN/g, '0')
                  }
                  else {
                    element.special = true
                    element.path = el.path!
                  }
                  const { maxX, maxY } = getSvgPathRange(element.path)
                  if ((maxX / maxY) > (originWidth / originHeight)) {
                    element.viewBox = [maxX, maxX * originHeight / originWidth]
                  }
                  else {
                    element.viewBox = [maxY * originWidth / originHeight, maxY]
                  }
                }
    
                if (element.path) slide.elements.push(element)
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

                  rowCells.push({
                    id: nanoid(10),
                    colspan: cellData.colSpan || 1,
                    rowspan: cellData.rowSpan || 1,
                    text: textDiv.innerText,
                    style: {
                      ...style,
                      align: ['left', 'right', 'center'].includes(align) ? (align as 'left' | 'right' | 'center') : 'left',
                      fontsize,
                      fontname,
                      color,
                      bold: cellData.fontBold,
                      backcolor: cellData.fillColor,
                    },
                  })
                  textDiv = null
                }
                data.push(rowCells)
              }
  
              const allWidth = el.colWidths.reduce((a, b) => a + b, 0)
              const colWidths: number[] = el.colWidths.map(item => item / allWidth)

              const firstCell = el.data[0][0]
              const border = firstCell.borders.top ||
                firstCell.borders.bottom ||
                el.borders.top ||
                el.borders.bottom ||
                firstCell.borders.left ||
                firstCell.borders.right ||
                el.borders.left ||
                el.borders.right
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
                outline: {
                  width: +(borderWidth * ratio || 2).toFixed(2),
                  style: borderStyle,
                  color: borderColor,
                },
                cellMinHeight: el.rowHeights[0] ? el.rowHeights[0] * ratio : 36,
              })
            }
            else if (el.type === 'chart') {
              let labels: string[]
              let legends: string[]
              let series: number[][]
  
              if (el.chartType === 'scatterChart' || el.chartType === 'bubbleChart') {
                labels = el.data[0].map((item, index) => `坐标${index + 1}`)
                legends = ['X', 'Y']
                series = el.data
              }
              else {
                const data = el.data as ChartItem[]
                labels = Object.values(data[0].xlabels)
                legends = data.map(item => item.key)
                series = data.map(item => item.values.map(v => v.y))
              }

              const options: ChartOptions = {}
  
              let chartType: ChartType = 'bar'

              switch (el.chartType) {
                case 'barChart':
                case 'bar3DChart':
                  chartType = 'bar'
                  if (el.barDir === 'bar') chartType = 'column'
                  if (el.grouping === 'stacked' || el.grouping === 'percentStacked') options.stack = true
                  break
                case 'lineChart':
                case 'line3DChart':
                  if (el.grouping === 'stacked' || el.grouping === 'percentStacked') options.stack = true
                  chartType = 'line'
                  break
                case 'areaChart':
                case 'area3DChart':
                  if (el.grouping === 'stacked' || el.grouping === 'percentStacked') options.stack = true
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
                themeColors: el.colors.length ? el.colors : theme.value.themeColors,
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
                if (el.isFlipH && 'isFlipH' in element) element.isFlipH = true
                if (el.isFlipV && 'isFlipV' in element) element.isFlipV = true
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
        addHistorySnapshot()
      }
      else if (isEmptySlide.value) {
        slidesStore.setSlides(slides)
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