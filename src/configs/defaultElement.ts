const DEFAULT_COLOR = '#888'

export const DEFAULT_TEXT = {
  type: 'text',
  left: 0,
  top: 0,
  width: 300,
  height: 0,
  padding: 5,
  opacity: 1,
  lineHeight: 1.5,
  segmentSpacing: 5,
  textType: 'content',
  content: '<div>“单击此处添加文本”</div>',
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

export const DEFAULT_SHAPE_LINE = {
  type: 'shape',
  borderStyle: 'solid',
  borderWidth: 2,
  borderColor: DEFAULT_COLOR,
  fill: 'rgba(0, 0, 0, 0)',
  lockRatio: false,
}

export const DEFAULT_ICON = {
  type: 'icon',
  left: 0,
  top: 0,
  width: 80,
  height: 80,
  color: DEFAULT_COLOR,
  lockRatio: true,
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

export const DEFAULT_IFRAME = {
  type: 'iframe',
  left: 0,
  top: 0,
  width: 800,
  height: 480,
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