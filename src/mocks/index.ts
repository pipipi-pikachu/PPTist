import { Slide } from '@/types/slides'

export const slides: Slide[] = [
  {
    id: 'test123456',
    elements: [
      {
        type: 'shape',
        id: '4cbRxp',
        left: 0,
        top: 200,
        width: 546,
        height: 362.5,
        viewBox: 200,
        path: 'M 0 0 L 0 200 L 200 200 Z',
        fill: '#d14424',
        fixedRatio: false,
        opacity: 0.7,
        rotate: 0
      },
      {
        type: 'shape',
        id: 'ookHrf',
        left: 0,
        top: 0,
        width: 300,
        height: 320,
        viewBox: 200,
        path: 'M 0 0 L 0 200 L 200 200 Z',
        fill: '#d14424',
        fixedRatio: false,
        flip: {
          x: 180,
          y: 0,
        },
        rotate: 0
      },
      {
        type: 'text',
        id: 'idn7Mx',
        left: 355,
        top: 65.25,
        width: 585,
        height: 188,
        content: '<p style=\'\'><strong><span style=\'font-size:  112px\'>PPTIST</span></strong></p>',
        rotate: 0
      },
      {
        type: 'text',
        id: '7stmVP',
        left: 355,
        top: 253.25,
        width: 585,
        height: 56,
        content: '<p style=\'\'><span style=\'font-size:  24px\'>基于 Vue 3.x + TypeScript 的在线演示文稿应用</span></p>',
        rotate: 0
      },
      {
        type: 'line',
        id: 'FnpZs4',
        left: 361,
        top: 238,
        start: [0, 0],
        end: [549, 0],
        points: ['', ''],
        color: '#d14424',
        style: 'solid',
        width: 2,
      },
    ],
    background: {
      type: 'solid',
      color: '#ffffff',
    },
  }
]