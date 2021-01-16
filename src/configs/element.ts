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
  left: 300,
  top: 81.25,
  width: 400,
  height: 400,
  data: {
    labels: ['类别1', '类别2', '类别3', '类别4', '类别5'],
    series: [
      [12, 19, 5, 2, 18],
    ],
  },
}

export const DEFAULT_TABLE = {
  left: 0,
  top: 0,
  outline: {
    width: 2,
    style: 'solid',
    color: DEFAULT_COLOR,
  },
}

export const DEFAULT_FORMULA = {
  left: 0,
  top: 0,
}

export const MIN_SIZE = {
  text: 20,
  image: 20,
  shape: 15,
  chart: 200,
  table: 20,
  formula: 20,
}