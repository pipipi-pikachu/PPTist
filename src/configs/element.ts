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
  type: 'text',
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
  type: 'image',
  left: 0,
  top: 0,
  lockRatio: true,
}

export const DEFAULT_SHAPE = {
  type: 'shape',
  fill: DEFAULT_COLOR,
  lockRatio: false,
}

export const DEFAULT_LINE = {
  type: 'line',
  style: 'solid',
  marker: ['', ''],
  width: 4,
  color: DEFAULT_COLOR,
}

export const DEFAULT_CHART = {
  type: 'chart',
  left: 0,
  top: 0,
  width: 500,
  height: 500,
}

export const DEFAULT_TABLE = {
  type: 'table',
  left: 0,
  top: 0,
  isLock: false,
  borderStyle: 'solid',
  borderWidth: 2,
  borderColor: DEFAULT_COLOR,
}

export enum OPERATE_KEYS {
  LEFT_TOP = 1,
  TOP = 2,
  RIGHT_TOP = 3,
  LEFT = 4,
  RIGHT = 5,
  LEFT_BOTTOM = 6,
  BOTTOM = 7,
  RIGHT_BOTTOM = 8,
}