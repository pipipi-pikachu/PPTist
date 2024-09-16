import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { parse, type Shape, type Element, type ChartItem } from 'pptxtojson'
import { nanoid } from 'nanoid'
import { useSlidesStore } from '@/store'
import { decrypt } from '@/utils/crypto'
import { type ShapePoolItem, SHAPE_LIST, SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'
import useSlideHandler from '@/hooks/useSlideHandler'
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
  ShapeTextAlign,
  PPTTextElement,
  ChartOptions,
} from '@/types/slides'

const convertFontSizePtToPx = (html: string, ratio: number) => {
  return html.replace(/font-size:\s*([\d.]+)pt/g, (match, p1) => {
    return `font-size: ${(parseFloat(p1) * ratio).toFixed(1)}px`
  })
}

export default () => {
  const slidesStore = useSlidesStore()
  const { theme } = storeToRefs(useSlidesStore())

  const { addSlidesFromData } = useAddSlidesOrElements()
  const { isEmptySlide } = useSlideHandler()

  const exporting = ref(false)

  // 导入pptist文件
  const importSpecificFile = (files: FileList, cover = false) => {
    const file = files[0]

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      try {
        const slides = JSON.parse(decrypt(reader.result as string))
        if (cover) {
          slidesStore.updateSlideIndex(0)
          slidesStore.setSlides(slides)
        }
        else if (isEmptySlide.value) slidesStore.setSlides(slides)
        else addSlidesFromData(slides)
      }
      catch {
        message.error('无法正确读取 / 解析该文件')
      }
    })
    reader.readAsText(file)
  }

  const parseLineElement = (el: Shape) => {
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
      width: el.borderWidth || 1,
      left: el.left,
      top: el.top,
      start,
      end,
      style: el.borderType,
      color: el.borderColor,
      points: ['', /straightConnector/.test(el.shapType) ? 'arrow' : '']
    }
    if (/bentConnector/.test(el.shapType)) {
      data.broken2 = [
        Math.abs(start[0] - end[0]) / 2,
        Math.abs(start[1] - end[1]) / 2,
      ]
    }

    return data
  }

  // 导入PPTX文件
  const importPPTXFile = (files: FileList) => {
    const file = files[0]
    if (!file) return

    exporting.value = true

    const shapeList: ShapePoolItem[] = []
    for (const item of SHAPE_LIST) {
      shapeList.push(...item.children)
    }
    
    const reader = new FileReader()
    reader.onload = async e => {
      const json = await parse(e.target!.result as ArrayBuffer)

      const ratio = 96 / 72
      const width = json.size.width

      slidesStore.setViewportSize(width * ratio)

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
              type: 'linear',
              colors: value.colors.map(item => ({
                ...item,
                pos: parseInt(item.pos),
              })),
              rotate: value.rot,
            },
          }
        }
        else {
          background = {
            type: 'solid',
            color: value,
          }
        }

        const slide: Slide = {
          id: nanoid(10),
          elements: [],
          background,
        }

        const parseElements = (elements: Element[]) => {
          for (const el of elements) {
            const originWidth = el.width || 1
            const originHeight = el.height || 1
            const originLeft = el.left
            const originTop = el.top

            el.width = el.width * ratio
            el.height = el.height * ratio
            el.left = el.left * ratio
            el.top = el.top * ratio
  
            if (el.type === 'text') {
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
                  width: el.borderWidth,
                  style: el.borderType,
                },
                fill: el.fillColor,
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
            }
            else if (el.type === 'image') {
              slide.elements.push({
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
                color: theme.value.themeColor,
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
                const lineElement = parseLineElement(el)
                slide.elements.push(lineElement)
              }
              else {
                const shape = shapeList.find(item => item.pptxShapeType === el.shapType)

                const vAlignMap: { [key: string]: ShapeTextAlign } = {
                  'mid': 'middle',
                  'down': 'bottom',
                  'up': 'top',
                }
                
                const element: PPTShapeElement = {
                  type: 'shape',
                  id: nanoid(10),
                  width: el.width,
                  height: el.height,
                  left: el.left,
                  top: el.top,
                  viewBox: [200, 200],
                  path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
                  fill: el.fillColor || 'none',
                  fixedRatio: false,
                  rotate: el.rotate,
                  outline: {
                    color: el.borderColor,
                    width: el.borderWidth,
                    style: el.borderType,
                  },
                  text: {
                    content: convertFontSizePtToPx(el.content, ratio),
                    defaultFontName: theme.value.fontName,
                    defaultColor: theme.value.fontColor,
                    align: vAlignMap[el.vAlign] || 'middle',
                  },
                  flipH: el.isFlipH,
                  flipV: el.isFlipV,
                }
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
                if (el.shapType === 'custom') {
                  if (el.path!.indexOf('NaN') !== -1) element.path = ''
                  else {
                    element.special = true
                    element.path = el.path!
  
                    const { maxX, maxY } = getSvgPathRange(element.path)
                    element.viewBox = [maxX || originWidth, maxY || originHeight]
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
  
              const colWidths: number[] = new Array(col).fill(1 / col)
  
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
                  width: el.borderWidth || 2,
                  style: el.borderType,
                  color: el.borderColor || '#eeece1',
                },
                cellMinHeight: 36,
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
                themeColors: [theme.value.themeColor],
                textColor: theme.value.fontColor,
                data: {
                  labels,
                  legends,
                  series,
                },
                options,
              })
            }
            else if (el.type === 'group' || el.type === 'diagram') {
              const elements = el.elements.map(_el => ({
                ..._el,
                left: _el.left + originLeft,
                top: _el.top + originTop,
              }))
              parseElements(elements)
            }
          }
        }
        parseElements(item.elements)
        slides.push(slide)
      }
      slidesStore.updateSlideIndex(0)
      slidesStore.setSlides(slides)
      exporting.value = false
    }
    reader.readAsArrayBuffer(file)
  }

  return {
    importSpecificFile,
    importPPTXFile,
    exporting,
  }
}