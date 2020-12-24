import { useStore } from 'vuex'
import { MutationTypes } from '@/store'
import { createRandomCode } from '@/utils/common'
import { getImageSize } from '@/utils/image'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { PPTElement, TableElementCell } from '@/types/slides'
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
  
  const createChartElement = (chartType: string, data: string) => {
    createElement({
      ...DEFAULT_CHART,
      type: 'chart',
      id: createRandomCode(),
      chartType,
      data,
    })
  }
  
  const createTableElement = (rowCount: number, colCount: number) => {
    const row: TableElementCell[] = new Array(colCount).fill({ colspan: 1, rowspan: 1, content: '' })
    const data: TableElementCell[][] = new Array(rowCount).fill(row)
  
    const DEFAULT_CELL_WIDTH = 80
    const DEFAULT_CELL_HEIGHT = 35
    const DEFAULT_BORDER_WIDTH = 2
  
    const colSizes: number[] = new Array(colCount).fill(DEFAULT_CELL_WIDTH)
    const rowSizes: number[] = new Array(rowCount).fill(DEFAULT_CELL_HEIGHT)
  
    createElement({
      ...DEFAULT_TABLE,
      type: 'table',
      id: createRandomCode(),
      width: colCount * DEFAULT_CELL_WIDTH + DEFAULT_BORDER_WIDTH,
      height: rowCount * DEFAULT_CELL_HEIGHT + DEFAULT_BORDER_WIDTH,
      colSizes,
      rowSizes,
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
  
  const createShapeElement = (position: CommonElementPosition, svgCode: string) => {
    const { left, top, width, height } = position
    createElement({
      ...DEFAULT_SHAPE,
      type: 'shape',
      id: createRandomCode(),
      left, 
      top, 
      width, 
      height,
      svgCode,
    })
  }
  
  const createLineElement = (position: LineElementPosition, points: [string, string], lineType: string) => {
    const { left, top, start, end } = position
    createElement({
      ...DEFAULT_LINE,
      type: 'line',
      id: createRandomCode(),
      left, 
      top, 
      start,
      end,
      points,
      lineType,
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