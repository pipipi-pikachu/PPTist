import { createRandomCode } from '@/utils/common'
import { getImageSize } from '@/utils/image'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { TableElementCell } from '@/types/slides'
import {
  DEFAULT_IMAGE,
  DEFAULT_TEXT,
  DEFAULT_SHAPE,
  DEFAULT_LINE,
  DEFAULT_CHART,
  DEFAULT_TABLE,
} from '@/configs/defaultElement'

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

export const insertImage = (imgUrl: string) => {
  getImageSize(imgUrl).then(({ width, height }) => {
    const scale = width / height

    if(scale < VIEWPORT_ASPECT_RATIO && width > VIEWPORT_SIZE) {
      width = VIEWPORT_SIZE
      height = width * scale
    }
    else if(height > VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO) {
      height = VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO
      width = height / scale
    }

    return {
      ...DEFAULT_IMAGE,
      elId: createRandomCode(),
      imgUrl,
      width,
      height,
    }
  })
}

export const insertChart = (chartType: string, data: Object) => {
  return {
    ...DEFAULT_CHART,
    elId: createRandomCode(),
    chartType,
    data,
  }
}

export const insertTable = (rowCount: number, colCount: number) => {
  const row: TableElementCell[] = new Array(colCount).fill({ colspan: 1, rowspan: 1, content: '' })
  const data: TableElementCell[][] = new Array(rowCount).fill(row)

  const DEFAULT_CELL_WIDTH = 80
  const DEFAULT_CELL_HEIGHT = 35
  const DEFAULT_BORDER_WIDTH = 2

  const colSizes: number[] = new Array(colCount).fill(DEFAULT_CELL_WIDTH)
  const rowSizes: number[] = new Array(rowCount).fill(DEFAULT_CELL_HEIGHT)

  return {
    ...DEFAULT_TABLE,
    elId: createRandomCode(),
    width: colCount * DEFAULT_CELL_WIDTH + DEFAULT_BORDER_WIDTH,
    height: rowCount * DEFAULT_CELL_HEIGHT + DEFAULT_BORDER_WIDTH,
    colSizes,
    rowSizes,
    data,
  }
}

export const insertText = (position: CommonElementPosition) => {
  const { left, top, width, height } = position
  return {
    ...DEFAULT_TEXT,
    elId: createRandomCode(),
    left, 
    top, 
    width, 
    height,
  }
}

export const insertShape = (position: CommonElementPosition, svgCode: string) => {
  const { left, top, width, height } = position
  return {
    ...DEFAULT_SHAPE,
    elId: createRandomCode(),
    left, 
    top, 
    width, 
    height,
    svgCode,
  }
}

export const insertLine = (position: LineElementPosition, marker: [string, string], lineType: string) => {
  const { left, top, start, end } = position

  return {
    ...DEFAULT_LINE,
    elId: createRandomCode(),
    left, 
    top, 
    start,
    end,
    marker,
    lineType,
  }
}