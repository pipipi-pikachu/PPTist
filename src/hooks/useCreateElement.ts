import { useStore } from 'vuex'
import { MutationTypes } from '@/store'
import { createRandomCode } from '@/utils/common'
import { getImageSize } from '@/utils/image'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { ChartType, PPTElement, TableCell } from '@/types/slides'
import { ShapePoolItem } from '@/configs/shapes'
import { LinePoolItem } from '@/configs/lines'
import {
  DEFAULT_IMAGE,
  DEFAULT_TEXT,
  DEFAULT_SHAPE,
  DEFAULT_LINE,
  DEFAULT_CHART,
  DEFAULT_TABLE,
} from '@/configs/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

interface CommonElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface LineElementPosition {
  top: number;
  left: number;
  start: [number, number];
  end: [number, number];
}

export default () => {
  const store = useStore()

  const { addHistorySnapshot } = useHistorySnapshot()

  

  const createElement = (element: PPTElement) => {
    store.commit(MutationTypes.ADD_ELEMENT, element)
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [element.id])
    addHistorySnapshot()
  }

  const createImageElement = (src: string) => {
    getImageSize(src).then(({ width, height }) => {
      const scale = width / height
  
      if(scale < VIEWPORT_ASPECT_RATIO && width > VIEWPORT_SIZE) {
        width = VIEWPORT_SIZE
        height = width * scale
      }
      else if(height > VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO) {
        height = VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO
        width = height / scale
      }

      createElement({
        ...DEFAULT_IMAGE,
        type: 'image',
        id: createRandomCode(),
        src,
        width,
        height,
      })
    })
  }
  
  const createChartElement = (chartType: ChartType) => {
    createElement({
      ...DEFAULT_CHART,
      type: 'chart',
      id: createRandomCode(),
      chartType,
    })
  }
  
  const createTableElement = (row: number, col: number) => {
    const rowCells: TableCell[] = new Array(col).fill({ id: createRandomCode(), colspan: 1, rowspan: 1, text: '' })
    const data: TableCell[][] = new Array(row).fill(rowCells)

    const DEFAULT_CELL_WIDTH = 100
    const DEFAULT_CELL_HEIGHT = 40

    const colWidths: number[] = new Array(col).fill(1 / col)

    createElement({
      ...DEFAULT_TABLE,
      type: 'table',
      id: createRandomCode(),
      width: col * DEFAULT_CELL_WIDTH,
      height: row * DEFAULT_CELL_HEIGHT,
      colWidths,
      data,
    })
  }
  
  const createTextElement = (position: CommonElementPosition) => {
    const { left, top, width, height } = position
    createElement({
      ...DEFAULT_TEXT,
      type: 'text',
      id: createRandomCode(),
      left, 
      top, 
      width, 
      height,
    })
  }
  
  const createShapeElement = (position: CommonElementPosition, data: ShapePoolItem) => {
    const { left, top, width, height } = position
    createElement({
      ...DEFAULT_SHAPE,
      type: 'shape',
      id: createRandomCode(),
      left, 
      top, 
      width, 
      height,
      viewBox: data.viewBox,
      path: data.path,
    })
  }
  
  const createLineElement = (position: LineElementPosition, data: LinePoolItem) => {
    const { left, top, start, end } = position
    createElement({
      ...DEFAULT_LINE,
      type: 'line',
      id: createRandomCode(),
      left, 
      top, 
      start,
      end,
      points: data.points,
    })
  }

  return {
    createImageElement,
    createChartElement,
    createTableElement,
    createTextElement,
    createShapeElement,
    createLineElement,
  }
}