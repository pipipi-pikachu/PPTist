const DEFAULT_COLOR = '#d14424'

export const ELEMENT_TYPE = {
  'text': '文本',
  'image': '图片',
  'shape': '形状',
  'line': '线条',
  'chart': '图表',
  'table': '表格',
}

export const DEFAULT_TEXT = {
  content: '请输入内容',
}

export const DEFAULT_IMAGE = {
  left: 0,
  top: 0,
  fixedRatio: true,
}

export const DEFAULT_SHAPE = {
  fill: DEFAULT_COLOR,
  fixedRatio: false,
}

export const DEFAULT_LINE = {
  style: 'solid',
  width: 4,
  color: DEFAULT_COLOR,
}

export const DEFAULT_CHART = {
  left: 0,
  top: 0,
  width: 500,
  height: 500,
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    series: [
      [12, 19, 3, 5, 2, 18],
    ]
  },
}

export const DEFAULT_TABLE = {
  left: 0,
  top: 0,
  outline: {
    width: 2,
    style: 'solid',
    color: DEFAULT_COLOR
  },
}