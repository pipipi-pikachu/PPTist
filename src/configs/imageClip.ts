export const CLIPPATHS = {
  rect: {
    name: '矩形',
    type: 'rect',
    radius: '0',
    style: '',
  },
  roundRect: {
    name: '圆角矩形',
    type: 'rect',
    radius: '10%',
    style: 'inset(0 0 0 0 round 10% 10% 10% 10%)',
  },
  ellipse: {
    name: '圆形',
    type: 'ellipse',
    style: 'ellipse(50% 50% at 50% 50%)',
  },
  triangle: {
    name: '三角形',
    type: 'polygon',
    style: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    createPath: (width: number, height: number) => {
      return `M ${width / 2} 0 L 0 ${height} L ${width} ${height} Z`
    },
  },
  pentagon: {
    name: '五边形',
    type: 'polygon',
    style: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    createPath: (width: number, height: number) => {
      return `M ${width / 2} 0 L ${width} ${0.38 * height} L ${0.82 * width} ${height} L ${0.18 * width} ${height} L 0 ${0.38 * height} Z`
    },
  },
  rhombus: {
    name: '菱形',
    type: 'polygon',
    style: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    createPath: (width: number, height: number) => {
      return `M ${width / 2} 0 L ${width} ${height / 2} L ${width / 2} ${height} L 0 ${height / 2} Z`
    },
  },
  star: {
    name: '五角星',
    type: 'polygon',
    style: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    createPath: (width: number, height: number) => {
      return `M ${width / 2} 0 L ${0.61 * width} ${0.35 * height} L ${0.98 * width} ${0.35 * height} L ${0.68 * width} ${0.57 * height} L ${0.79 * width} ${0.91 * height} L ${0.50 * width} ${0.70 * height} L ${0.21 * width} ${0.91 * height} L ${0.32 * width} ${0.57 * height} L ${0.02 * width} ${0.35 * height} L ${0.39 * width} ${0.35 * height} Z`
    },
  },
}