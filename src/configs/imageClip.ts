export const enum ClipPathTypes {
  RECT = 'rect',
  ELLIPSE = 'ellipse',
  POLYGON = 'polygon',
}

export const enum ClipPaths {
  RECT = 'rect',
  ROUNDRECT = 'roundRect',
  ELLIPSE = 'ellipse',
  TRIANGLE = 'triangle',
  PENTAGON = 'pentagon',
  RHOMBUS = 'rhombus',
  STAR = 'star',
}

export const CLIPPATHS = {
  rect: {
    name: '矩形',
    type: ClipPathTypes.RECT,
    radius: '0',
    style: '',
  },
  roundRect: {
    name: '圆角矩形',
    type: ClipPathTypes.RECT,
    radius: '10%',
    style: 'inset(0 0 0 0 round 10% 10% 10% 10%)',
  },
  ellipse: {
    name: '圆形',
    type: ClipPathTypes.ELLIPSE,
    style: 'ellipse(50% 50% at 50% 50%)',
  },
  triangle: {
    name: '三角形',
    type: ClipPathTypes.POLYGON,
    style: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    createPath: (width: number, height: number) => {
      return `M ${width / 2} 0 L 0 ${height} L ${width} ${height} Z`
    },
  },
  pentagon: {
    name: '五边形',
    type: ClipPathTypes.POLYGON,
    style: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    createPath: (width: number, height: number) => {
      return `M ${width / 2} 0 L ${width} ${0.38 * height} L ${0.82 * width} ${height} L ${0.18 * width} ${height} L 0 ${0.38 * height} Z`
    },
  },
  rhombus: {
    name: '菱形',
    type: ClipPathTypes.POLYGON,
    style: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    createPath: (width: number, height: number) => {
      return `M ${width / 2} 0 L ${width} ${height / 2} L ${width / 2} ${height} L 0 ${height / 2} Z`
    },
  },
}