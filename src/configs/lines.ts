export const LINES = [
  { type: 'line', path: 'M0,0 L20,20', style: 'solid', marker: ['', ''] },
  { type: 'line', path: 'M0,0 L20,20', style: 'solid', marker: ['', 'arrow'] },
  { type: 'line', path: 'M0,0 L20,20', style: 'solid', marker: ['arrow', 'arrow'] },
  { type: 'line', path: 'M0,0 L20,20', style: 'solid', marker: ['', 'cusp'] },
  { type: 'line', path: 'M0,0 L20,20', style: 'solid', marker: ['cusp', 'cusp'] },
  { type: 'line', path: 'M0,0 L20,20', style: 'solid', marker: ['', 'dot'] },
  { type: 'line', path: 'M0,0 L20,20', style: 'solid', marker: ['dot', 'dot'] },
  { type: 'line', path: 'M0,0 L20,20', style: 'dashed', marker: ['', ''] },
  { type: 'line', path: 'M0,0 L20,20', style: 'dashed', marker: ['', 'arrow'] },
  { type: 'line', path: 'M0,0 L20,20', style: 'dashed', marker: ['arrow', 'arrow'] },

  { type: 'polyline-x', path: 'M0,0 L0,20 L20,20', style: 'solid', marker: ['', 'arrow'] },
  { type: 'polyline-y', path: 'M0,0 L20,0 L20,20', style: 'solid', marker: ['', 'arrow'] },

  { type: 'polyline-x2', path: 'M0,0 L10,0 L10,20 L20,20', style: 'solid', marker: ['', 'arrow'] },
  { type: 'polyline-y2', path: 'M0,0 L0,10 L20,10 L20,20', style: 'solid', marker: ['', 'arrow'] },

  { type: 'curve-x', path: 'M0,0 C20,0 0,20 20,20', style: 'solid', marker: ['', 'arrow'] },
  { type: 'curve-y', path: 'M0,0 C0,20 20,0 20,20', style: 'solid', marker: ['', 'arrow'] },
]