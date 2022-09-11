import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import { getImageSize } from '@/utils/image'
import { VIEWPORT_SIZE } from '@/configs/canvas'
import { PPTLineElement, PPTElement, TableCell, TableCellStyle, PPTShapeElement, PPTChartElement, ChartOptions, PresetChartType } from '@/types/slides'
import { ShapePoolItem, SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import { LinePoolItem } from '@/configs/lines'
import { CHART_TYPES } from '@/configs/chartTypes'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

interface CommonElementPosition {
  top: number
  left: number
  width: number
  height: number
}

interface LineElementPosition {
  top: number
  left: number
  start: [number, number]
  end: [number, number]
}

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { creatingElement } = storeToRefs(mainStore)
  const { theme, viewportRatio } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  // 创建（插入）一个元素并将其设置为被选中元素
  const createElement = (element: PPTElement, callback?: () => void) => {
    slidesStore.addElement(element)
    mainStore.setActiveElementIdList([element.id])

    if (creatingElement.value) mainStore.setCreatingElement(null)

    setTimeout(() => {
      mainStore.setEditorareaFocus(true)
    }, 0)

    if (callback) callback()

    addHistorySnapshot()
  }

  /**
   * 创建图片元素
   * @param src 图片地址
   */
  const createImageElement = (src: string) => {
    getImageSize(src).then(({ width, height }) => {
      const scale = height / width
  
      if (scale < viewportRatio.value && width > VIEWPORT_SIZE) {
        width = VIEWPORT_SIZE
        height = width * scale
      }
      else if (height > VIEWPORT_SIZE * viewportRatio.value) {
        height = VIEWPORT_SIZE * viewportRatio.value
        width = height / scale
      }

      createElement({
        type: 'image',
        id: nanoid(10),
        src,
        width,
        height,
        left: (VIEWPORT_SIZE - width) / 2,
        top: (VIEWPORT_SIZE * viewportRatio.value - height) / 2,
        fixedRatio: true,
        rotate: 0,
      })
    })
  }
  
  /**
   * 创建图表元素
   * @param chartType 图表类型
   */
  const createChartElement = (type: PresetChartType) => {
    const newElement: PPTChartElement = {
      type: 'chart',
      id: nanoid(10),
      chartType: CHART_TYPES[type],
      left: 300,
      top: 81.25,
      width: 400,
      height: 400,
      rotate: 0,
      themeColor: [theme.value.themeColor],
      gridColor: theme.value.fontColor,
      data: {
        labels: ['类别1', '类别2', '类别3', '类别4', '类别5'],
        legends: ['系列1'],
        series: [
          [12, 19, 5, 2, 18],
        ],
      },
    }

    let options: ChartOptions = {}
    if (type === 'horizontalBar') options = { horizontalBars: true }
    else if (type === 'area') options = { showArea: true }
    else if (type === 'scatter') options = { showLine: false }
    else if (type === 'ring') options = { donut: true }

    createElement({
      ...newElement,
      options,
    })
  }
  
  /**
   * 创建表格元素
   * @param row 行数
   * @param col 列数
   */
  const createTableElement = (row: number, col: number) => {
    const style: TableCellStyle = {
      fontname: theme.value.fontName,
      color: theme.value.fontColor,
    }
    const data: TableCell[][] = []
    for (let i = 0; i < row; i++) {
      const rowCells: TableCell[] = []
      for (let j = 0; j < col; j++) {
        rowCells.push({ id: nanoid(10), colspan: 1, rowspan: 1, text: '', style })
      }
      data.push(rowCells)
    }

    const DEFAULT_CELL_WIDTH = 100
    const DEFAULT_CELL_HEIGHT = 36

    const colWidths: number[] = new Array(col).fill(1 / col)

    const width = col * DEFAULT_CELL_WIDTH
    const height = row * DEFAULT_CELL_HEIGHT

    createElement({
      type: 'table',
      id: nanoid(10),
      width,
      height,
      colWidths,
      rotate: 0,
      data,
      left: (VIEWPORT_SIZE - width) / 2,
      top: (VIEWPORT_SIZE * viewportRatio.value - height) / 2,
      outline: {
        width: 2,
        style: 'solid',
        color: '#eeece1',
      },
      theme: {
        color: theme.value.themeColor,
        rowHeader: true,
        rowFooter: false,
        colHeader: false,
        colFooter: false,
      },
      cellMinHeight: 36,
    })
  }
  
  /**
   * 创建文本元素
   * @param position 位置大小信息
   * @param content 文本内容
   */
  
  interface CreateTextData {
    content?: string
    vertical?: boolean
  }
  const createTextElement = (position: CommonElementPosition, data?: CreateTextData) => {
    const { left, top, width, height } = position
    const content = data?.content || ''
    const vertical = data?.vertical || false

    const id = nanoid(10)
    createElement({
      type: 'text',
      id,
      left, 
      top, 
      width, 
      height,
      content,
      rotate: 0,
      defaultFontName: theme.value.fontName,
      defaultColor: theme.value.fontColor,
      vertical,
    }, () => {
      setTimeout(() => {
        const editorRef: HTMLElement | null = document.querySelector(`#editable-element-${id} .ProseMirror`)
        if (editorRef) editorRef.focus()
      }, 0)
    })
  }
  
  /**
   * 创建形状元素
   * @param position 位置大小信息
   * @param data 形状路径信息
   */
  const createShapeElement = (position: CommonElementPosition, data: ShapePoolItem) => {
    const { left, top, width, height } = position
    const newElement: PPTShapeElement = {
      type: 'shape',
      id: nanoid(10),
      left, 
      top, 
      width, 
      height,
      viewBox: data.viewBox,
      path: data.path,
      fill: theme.value.themeColor,
      fixedRatio: false,
      rotate: 0,
    }
    if (data.special) newElement.special = true
    if (data.pathFormula) {
      newElement.pathFormula = data.pathFormula
      newElement.viewBox = [width, height]

      const pathFormula = SHAPE_PATH_FORMULAS[data.pathFormula]
      if ('editable' in pathFormula) {
        newElement.path = pathFormula.formula(width, height, pathFormula.defaultValue)
        newElement.keypoint = pathFormula.defaultValue
      }
      else newElement.path = pathFormula.formula(width, height)
    }
    createElement(newElement)
  }
  
  /**
   * 创建线条元素
   * @param position 位置大小信息
   * @param data 线条的路径和样式
   */
  const createLineElement = (position: LineElementPosition, data: LinePoolItem) => {
    const { left, top, start, end } = position

    const newElement: PPTLineElement = {
      type: 'line',
      id: nanoid(10),
      left, 
      top, 
      start,
      end,
      points: data.points,
      color: theme.value.themeColor,
      style: data.style,
      width: 2,
    }
    if (data.isBroken) newElement.broken = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
    if (data.isCurve) newElement.curve = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
    if (data.isCubic) newElement.cubic = [[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2], [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]]
    createElement(newElement)
  }
  
  /**
   * 创建LaTeX元素
   * @param svg SVG代码
   */
  const createLatexElement = (data: { path: string; latex: string; w: number; h: number; }) => {
    createElement({
      type: 'latex',
      id: nanoid(10),
      width: data.w,
      height: data.h,
      rotate: 0,
      left: (VIEWPORT_SIZE - data.w) / 2,
      top: (VIEWPORT_SIZE * viewportRatio.value - data.h) / 2,
      path: data.path,
      latex: data.latex,
      color: theme.value.fontColor,
      strokeWidth: 2,
      viewBox: [data.w, data.h],
      fixedRatio: true,
    })
  }
  
  /**
   * 创建视频元素
   * @param src 视频地址
   */
  const createVideoElement = (src: string) => {
    createElement({
      type: 'video',
      id: nanoid(10),
      width: 500,
      height: 300,
      rotate: 0,
      left: (VIEWPORT_SIZE - 500) / 2,
      top: (VIEWPORT_SIZE * viewportRatio.value - 300) / 2,
      src,
    })
  }
  
  /**
   * 创建音频元素
   * @param src 音频地址
   */
  const createAudioElement = (src: string) => {
    createElement({
      type: 'audio',
      id: nanoid(10),
      width: 50,
      height: 50,
      rotate: 0,
      left: (VIEWPORT_SIZE - 50) / 2,
      top: (VIEWPORT_SIZE * viewportRatio.value - 50) / 2,
      loop: false,
      autoplay: false,
      fixedRatio: true,
      color: theme.value.themeColor,
      src,
    })
  }

  return {
    createImageElement,
    createChartElement,
    createTableElement,
    createTextElement,
    createShapeElement,
    createLineElement,
    createLatexElement,
    createVideoElement,
    createAudioElement,
  }
}