export const ELEMENT_SIZE_RANGE = {
  text: { width: 15, height: 15 },
  image: { width: 15, height: 15 },
  shape: { width: 15, height: 15 },
  icon: { width: 15, height: 15 },
  chart: { width: 200, height: 200 },
  iframe: { width: 200, height: 200 },
  table: { width: 50, height: 30 },
}

export const ELEMENT_TYPE_TABS = {
  text: { key: 'element-text', label: '文本属性' },
  image: { key: 'element-image', label: '图片属性' },
  shape: { key: 'element-shape', label: '形状属性' },
  icon: { key: 'element-icon', label: '图标属性' },
  line: { key: 'element-line', label: '线条属性' },
  chart: { key: 'element-chart', label: '图表属性' },
  iframe: { key: 'element-iframe', label: 'Iframe属性' },
  table: { key: 'element-table', label: '表格属性' },
}

export const ELEMENTS = {
  text: '文本',
  image: '图片',
  shape: '形状',
  icon: '图标',
  line: '线条',
  chart: '图表',
  iframe: 'Iframe',
  table: '表格',
}

export const OPERATE_KEYS = {
  LEFT_TOP: 1,
  TOP: 2,
  RIGHT_TOP: 3,
  LEFT: 4,
  RIGHT: 5,
  LEFT_BOTTOM: 6,
  BOTTOM: 7,
  RIGHT_BOTTOM: 8,
}