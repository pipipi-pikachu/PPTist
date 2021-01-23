import { useStore } from 'vuex'
import { MutationTypes } from '@/store'
import { createRandomCode } from '@/utils/common'
import { getImageSize } from '@/utils/image'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { ChartType, PPTElement } from '@/types/slides'
import { ShapePoolItem } from '@/configs/shapes'
import { LinePoolItem } from '@/configs/lines'
import {
  DEFAULT_IMAGE,
  DEFAULT_TEXT,
  DEFAULT_SHAPE,
  DEFAULT_LINE,
  DEFAULT_CHART,
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
  
  const createTableElement = (rowCount: number, colCount: number) => {
    console.log(rowCount, colCount)
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