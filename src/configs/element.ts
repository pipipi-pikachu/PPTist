const DEFAULT_COLOR = '#41464b'

export enum ElementTypes {
  TEXT = '文本',
  IMAGE = '图片',
  SHAPE = '形状',
  LINE = '线条',
  CHART = '图表',
  TABLE = '表格',
}

export const DEFAULT_TEXT = {
  left: 0,
  top: 0,
  width: 300,
  height: 0,
  opacity: 1,
  lineHeight: 1.5,
  segmentSpacing: 5,
  content: '请输入内容',
}

export const DEFAULT_IMAGE = {
  left: 0,
  top: 0,
  lockRatio: true,
}

export const DEFAULT_SHAPE = {
  fill: DEFAULT_COLOR,
  lockRatio: false,
}

export const DEFAULT_LINE = {
  style: 'solid',
  marker: ['', ''],
  width: 4,
  color: DEFAULT_COLOR,
}

export const DEFAULT_CHART = {
  left: 0,
  top: 0,
  width: 500,
  height: 500,
}

export const DEFAULT_TABLE = {
  left: 0,
  top: 0,
  isLock: false,
  borderStyle: 'solid',
  borderWidth: 2,
  borderColor: DEFAULT_COLOR,
}