export const DEFAULT_BAR_DATA = {
  axisData: ['类别1', '类别2', '类别3', '类别4', '类别5'],
  series: [
    { name: '系列1', data: [120, 200, 150, 80, 70] },
    { name: '系列2', data: [80, 220, 170, 180, 40] }
  ]
}

export const DEFAULT_PIE_DATA = [
  { name: '类别1', value: 335 },
  { name: '类别2', value: 310 },
  { name: '类别3', value: 234 },
  { name: '类别4', value: 135 },
  { name: '类别5', value: 1548 },
]

export const CHARTS = [
  {
    key: 'bar',
    name: '柱状图',
    value: DEFAULT_BAR_DATA,
  },
  {
    key: 'barY',
    name: '条形图',
    value: DEFAULT_BAR_DATA,
  },
  {
    key: 'line',
    name: '折线图',
    value: DEFAULT_BAR_DATA,
  },
  {
    key: 'pie',
    name: '饼状图',
    value: DEFAULT_PIE_DATA,
  },
  {
    key: 'pieDoughnut',
    name: '环形图',
    value: DEFAULT_PIE_DATA,
  },
]

export const CHART_THEME = {
  purple: ['#8a7ca8', '#e098c7', '#8fd3e8', '#71669e', '#cc70af'],
  shine: ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa'],
  halloween: ['#ff715e', '#ffaf51', '#ffee51', '#797fba', '#715c87'],
  vintage: ['#d87c7c', '#919e8b', '#d7ab82', '#6e7074', '#61a0a8'],
  dark: ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53'],
  westeros: ['#516b91', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0'],
  wonderland: ['#4ea397', '#22c3aa', '#7bd9a5', '#d0648a', '#f58db2'],
  chalk: ['#fc97af', '#87f7cf', '#f7f494', '#72ccff', '#f7c5a0'],
}