export const SHAPES = [
  {
    key: 'rect',
    path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z'
  },
  {
    key: 'rect-2',
    path: 'M 0 200 L 0 0 L 150 0 L 200 50 L 200 200 L 0 200'
  },
  {
    key: 'rect-3',
    path: 'M 0 150 L 0 0 L 150 0 L 200 50 L 200 200 L 50 200 L 0 150'
  },
  {
    key: 'roundRect',
    path: 'M 20 0 L 180 0 Q 200 0 200 20 L 200 180 Q 200 200 180 200 L 20 200 Q 0 200 0 180 L 0 20 Q 0 0 20 0 '
  },
  {
    key: 'roundRect-2',
    path: 'M 0 50 Q 0 0 50 0 L 150 0 Q 200 0 200 50 L 200 150 Q 200 200 150 200 L 50 200 Q 0 200 0 150 L 0 50 Z'
  },
  {
    key: 'roundRect-3',
    path: 'M 0 0 L 140 0 Q 200 0 200 60 L 200 200 L 60 200 Q 0 200 0 140 L 0 0 Z'
  },
  {
    key: 'roundRect-4',
    path: 'M 0 0 L 140 0 Q 200 0 200 60 L 200 200 L 0 200 L 0 0 Z'
  },
  {
    key: 'ellipse',
    path: 'M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z'
  },
  {
    key: 'ellipse-half',
    path: 'M 0 200 A 50 100 0 1 1 200 200 L 0 200 Z'
  },  
  {
    key: 'ellipse-quarter',
    path: 'M 200 0 Q 0 0 0 200 L 200 200 L 200 0'
  },
  {
    key: 'pie',
    path: 'M 100 0 A 100 100 0 1 1 0 100 L 100 100 L 100 0 Z'
  },
  {
    key: 'pie-2',
    path: 'M 200 100 A 100 100 0 1 1 160 20 L 100 100 Z'
  },
  {
    key: 'triangle',
    path: 'M 100 0 L 0 200 L 200 200 L 100 0 Z'
  },
  {
    key: 'triangle-2',
    path: 'M 0 0 L 200 0 L 100 200 L 0 0 Z'
  },
  {
    key: 'triangle-3',
    path: 'M 0 100 L 200 0 L 200 200 L 0 100 Z'
  },
  {
    key: 'triangle-4',
    path: 'M 0 0 L 200 100 L 0 200 L 0 0 Z'
  },
  {
    key: 'triangle-5',
    path: 'M 0 0 L 0 200 L 200 200 Z'
  },
  {
    key: 'triangle-6',
    path: 'M 0 0 L 200 0 L 200 200 Z'
  },
  {
    key: 'parallelogram',
    path: 'M 50 0 L 200 0 L 150 200 L 0 200 L 50 0 Z'
  },
  {
    key: 'diamond',
    path: 'M 100 0 L 0 100 L 100 200 L 200 100 L 100 0 Z'
  },
  {
    key: 'trapezoid',
    path: 'M 50 0 L 150 0 L 200 200 L 0 200 L 50 0 Z'
  },
  {
    key: 'pentagon',
    path: 'M 100 0 L 0 90 L 50 200 L 150 200 L 200 90 L 100 0 Z'
  },
  {
    key: 'hexagon',
    path: 'M 100 0 L 0 60 L 0 140 L 100 200 L 200 140 L 200 60 L 100 0 Z'
  },
  {
    key: 'octagon',
    path: 'M 60 0 L 140 0 L 200 60 L 200 140 L 140 200 L 60 200 L 0 140 L 0 60 L 60 0 Z'
  },
  {
    key: 'water',
    path: 'M 100 0 A 100 100 0 1 1 0 100 L 0 0 L 100 0 Z'
  },  
  {
    key: 'leaf',
    path: 'M 0 0 Q 200 0 200 200 Q 0 200 0 0'
  },
  {
    key: 'leaf-2',
    path: 'M 0 200 Q 0 0 200 0 Q 200 200 0 200'
  },
  {
    key: 'moon',
    path: 'M 100 0 A 50 50 0 1 0 200 120 A 100 100 0 1 1 100 0'
  },
  {
    key: 'star',
    path: 'M 100 0 L 122 70 L 196 70 L 136 114 L 158 182 L 100 140 L 42 182 L 64 114 L 4 70 L 78 70 Z'
  },
  {
    key: 'lightning',
    path: 'M 120 0 L 100 80 L 200 80 L 80 200 L 100 120 L 0 120 L 120 0'
  },
  {
    key: 'cloud',
    path: 'M 190 100 C 200 120 190 160 150 160 C 130 190 110 190 80 170 C 50 180 20 170 20 140 C 0 130 0 80 30 70 C 30 30 50 20 90 30 C 120 10 140 10 160 40 C 200 40 200 70 190 100'
  },
  {
    key: 'arrow',
    path: 'M 100 0 L 0 100 L 50 100 L 50 200 L 150 200 L 150 100 L 200 100 L 100 0 Z'
  },
  {
    key: 'arrow-2',
    path: 'M 100 200 L 200 100 L 150 100 L 150 0 L 50 0 L 50 100 L 0 100 L 100 200 Z'
  },
  {
    key: 'arrow-3',
    path: 'M 0 100 L 100 0 L 100 50 L 200 50 L 200 150 L 100 150 L 100 200 L 0 100 Z'
  },
  {
    key: 'arrow-4',
    path: 'M 200 100 L 100 0 L 100 50 L 0 50 L 0 150 L 100 150 L 100 200 L 200 100 Z'
  },
  {
    key: 'arrow-5',
    path: 'M 50 100 L 0 50 L 125 50 L 125 0 L 200 100 L 125 200 L 125 150 L 0 150 Z'
  },
  {
    key: 'arrow-6',
    path: 'M 150 100 L 200 50 L 75 50 L 75 0 L 0 100 L 75 200 L 75 150 L 200 150 Z'
  },
  {
    key: 'arrow-7',
    path: 'M 100 150 L 50 200 L 50 75 L 0 75 L 100 0 L 200 75 L 150 75 L 150 200 Z'
  },
  {
    key: 'arrow-8',
    path: 'M 100 50 L 50 0 L 50 125 L 0 125 L 100 200 L 200 125 L 150 125 L 150 0 Z'
  },
  {
    key: 'arrow-9',
    path: 'M 40 120 L 0 160 L 40 200 L 40 180 L 180 180 L 180 40 L 200 40 L 160 0 L 120 40 L 140 40 L 140 140 L 40 140 Z'
  },
  {
    key: 'arrow-10',
    path: 'M 160 60 L 160 80 L 200 40 L 160 0 L 160 20 L 20 20 L 20 160 L 0 160 L 40 200 L 80 160 L 60 160 L 60 60 Z'
  },
  {
    key: 'arrow-11',
    path: 'M 100 0 L 0 40 L 60 40 L 60 160 L 0 160 L 100 200 L 200 160 L 140 160 L 140 40 L 200 40 Z'
  },
  {
    key: 'arrow-12',
    path: 'M 0 100 L 40 200 L 40 140 L 160 140 L 160 200 L 200 100 L 160 0 L 160 60 L 40 60 L 40 0 Z'
  },
  {
    key: 'arrow-13',
    path: 'M 0 200 Q 0 25 150 25 L 150 0 L 200 50 L 150 100 L 150 75 Q 0 75 0 200',
  },
  {
    key: 'arrow-14',
    path: 'M 200 200 Q 175 25 50 25 L 50 0 L 0 50 L 50 100 L 50 75 Q 175 75 200 200'
  },
  {
    key: 'message',
    path: 'M 0 0 L 200 0 L 200 150 L 80 150 L 40 200 L 40 150 L 0 150 L 0 0 Z'
  },
  {
    key: 'message-2',
    path: 'M 0 0 L 200 0 L 200 150 L 160 150 L 160 200 L 120 150 L 0 150 L 0 10 Z'
  },
  {
    key: 'v',
    path: 'M 0 0 L 120 0 L 200 100 L 120 200 L 0 200 L 80 100 L 0 0 Z'
  },
  {
    key: 'v-2',
    path: 'M 80 0 L 200 0 L 120 100 L 200 200 L 80 200 L 0 100 L 80 0 Z'
  },
  {
    key: 'point',
    path: 'M 0 0 L 140 0 L 200 100 L 140 200 L 0 200 L 0 100 L 0 0 Z'
  },
  {
    key: 'point-2',
    path: 'M 60 0 L 200 0 L 200 100 L 200 200 L 60 200 L 0 100 L 60 0 Z'
  },
  {
    key: 'plus-wide',
    path: 'M 50 0 L 150 0 L 150 50 L 200 50 L 200 150 L 150 150 L 150 200 L 50 200 L 50 150 L 0 150 L 0 50 L 50 50 L 50 0'
  },
  {
    key: 'plus',
    path: 'M 70 0 L 70 70 L 0 70 L 0 130 L 70 130 L 70 200 L 130 200 L 130 130 L 200 130 L 200 70 L 130 70 L 130 0 L 70 0 Z'
  },
  {
    key: 'cross',
    path: 'M 40 0 L 0 40 L 60 100 L 0 160 L 40 200 L 100 140 L 160 200 L 200 160 L 140 100 L 200 40 L 160 0 L 100 60 L 40 0 Z'
  },
  {
    key: 'funnel',
    path: 'M 0 0 L 200 0 L 0 200 L 200 200 L 0 0 Z'
  },
  {
    key: 'funnel-2',
    path: 'M 200 0 Q 0 100 200 200 L 0 200 Q 200 100 0 0 L 200 0 Z'
  },
  {
    key: 'funnel-3',
    path: 'M 200 0 Q 100 100 200 200 L 0 200 Q 100 100 0 0 L 200 0 Z'
  },
  {
    key: 'flag',
    path: 'M 0 0 Q 50 50 100 25 Q 150 0 200 50 L 200 200 Q 150 150 100 175 Q 50 200 0 150 L 0 0 Z'
  },
  {
    key: 'crown',
    path: 'M 0 200 L 200 200 L 180 60 L 140 100 L 100 0 L 60 100 L 20 60 L 0 200 Z'
  },
  {
    key: 'sector',
    path: 'M 200 100 A 50 50 0 1 1 0 100 L 100 0 L 200 100 Z'
  },
  {
    key: 'sector-2',
    path: 'M 0 100 A 50 50 0 1 1 200 100 L 100 200 L 0 100 Z'
  },
  {
    key: 'sector-3',
    path: 'M 200 200 L 125 0 Q 0 0 0 125 Z'
  },
  {
    key: 'darts',
    path: 'M 100 0 L 60 60 L 0 100 L 60 140 L 100 200 L 140 140 L 200 100 L 140 60 L 100 0 Z'
  },
  {
    key: 'break',
    path: 'M 0 0 L 150 0 L 200 50 L 150 100 L 200 150 L 150 200 L 0 200 L 50 150 L 0 100 L 50 50 L 0 0 Z'
  },
  {
    key: 'spray',
    path: 'M 0 100 A 50 50 0 1 1 200 100 Q 100 50 100 200 Q 100 50 0 100 Z'
  },
  {
    key: 'pinecones',
    path: 'M 100 0 Q 0 50 0 175 Q 100 225 200 175 Q 200 50 100 0'
  },
  {
    key: 'triangular-arrow',
    path: 'M 50 100 L 0 0 L 200 100 L 0 200 Z'
  },
  {
    key: 'triangular-arrow-2',
    path: 'M 100 150 L 0 200 L 100 0 L 200 200 Z'
  },
  {
    key: 'triangular-arrow-3',
    path: 'M 150 100 L 200 200 L 0 100 L 200 0 Z'
  },
  {
    key: 'triangular-arrow-4',
    path: 'M 100 50 L 200 0 L 100 200 L 0 0 Z'
  },
  {
    key: 'border',
    path: 'M 0 0 L 200 0 L 160 40 L 40 40 L 40 160 L 0 200 Z'
  },
  {
    key: 'border-2',
    path: 'M 200 200 L 200 0 L 160 40 L 160 160 L 40 160 L 0 200 Z'
  },
  {
    key: 'border-3',
    path: 'M 40 40 L 200 40 L 200 0 L 0 0 L 0 200 L 40 200 Z'
  },
  {
    key: 'border-4',
    path: 'M 200 200 L 200 0 L 160 0 L 160 160 L 0 160 L 0 200 Z'
  },
  {
    key: 'flower',
    path: 'M 100 100 Q 50 50 100 0 Q 150 50 100 100 Q 150 50 200 100 Q 150 150 100 100 Q 150 150 100 200 Q 50 150 100 100 Q 50 150 0 100 Q 50 50 100 100'
  },
  {
    key: 'flower-2',
    path: 'M 100 100 Q 25 0 100 0 Q 175 0 100 100 Q 200 25 200 100 Q 200 175 100 100 Q 175 200 100 200 Q 25 200 100 100 Q 0 175 0 100 Q 0 25 100 100'
  },
  {
    key: 'flower-3',
    path: 'M 100 100 L 50 0 L 0 50 L 100 100 L 0 150 L 50 200 L 100 100 L 150 200 L 200 150 L 100 100 L 200 50 L 150 0 L 100 100'
  },
  {
    key: 'brace-left',
    path: 'M 200 0 L 80 20 L 80 90 L 0 100 L 80 110 L 80 180 L 200 200',
    type: 'line'
  },
  {
    key: 'brace-right',
    path: 'M 0 0 L 120 20 L 120 90 L 200 100 L 120 110 L 120 180 L 0 200',
    type: 'line'
  },
  {
    key: 'fillet-brace-left',
    path: 'M 200 0 Q 80 0 80 40 L 80 90 L 0 100 L 80 110 L 80 160 Q 80 200 200 200',
    type: 'line'
  },
  {
    key: 'fillet-brace-right',
    path: 'M 0 0 Q 120 0 120 40 L 120 90 L 200 100 L 120 110 L 120 160 Q 120 200 0 200',
    type: 'line'
  },
  {
    key: 'bracket-left',
    path: 'M 200 0 L 0 0 L 0 200 L 200 200',
    type: 'line'
  },
  {
    key: 'bracket-right',
    path: 'M 0 0 L 200 0 L 200 200 L 0 200',
    type: 'line'
  },
  {
    key: 'parentheses-left',
    path: 'M 200 0 Q 0 0 0 100 Q 0 200 200 200',
    type: 'line'
  },
  {
    key: 'parentheses-right',
    path: 'M 0 0 Q 200 0 200 100 Q 200 200 0 200',
    type: 'line'
  },
]