import { ChartType } from '@/types/slides'

interface ChartTypes {
  [propName: string]: ChartType
}

export const CHART_TYPES: ChartTypes = {
  bar: 'bar',
  horizontalBar: 'bar',
  line: 'line',
  area: 'line',
  scatter: 'line',
  pie: 'pie',
  ring: 'pie',
}