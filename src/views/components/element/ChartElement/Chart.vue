<template>
  <div class="chart" ref="chartRef"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'
import tinycolor from 'tinycolor2'
import type { ChartData, ChartOptions, ChartType } from '@/types/slides'
import { getChartOption } from './chartOption'

import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart, ScatterChart, RadarChart } from 'echarts/charts'
import { LegendComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  LegendComponent,
  SVGRenderer,
])

const props = defineProps<{
  width: number
  height: number
  type: ChartType
  data: ChartData
  themeColors: string[]
  textColor?: string
  options?: ChartOptions
}>()

let chart: echarts.ECharts | null = null
const chartRef = ref<HTMLElement>()

const themeColors = computed(() => {
  let colors: string[] = []
  if (props.themeColors.length >= 10) colors = props.themeColors
  else if (props.themeColors.length === 1) colors = tinycolor(props.themeColors[0]).analogous(10).map(color => color.toRgbString())
  else {
    const len = props.themeColors.length
    const supplement = tinycolor(props.themeColors[len - 1]).analogous(10 + 1 - len).map(color => color.toRgbString())
    colors = [...props.themeColors.slice(0, len - 1), ...supplement]
  }
  return colors
})

const updateOption = () => {
  const option = getChartOption({
    type: props.type,
    data: props.data,
    themeColors: themeColors.value,
    textColor: props.textColor,
    lineSmooth: props.options?.lineSmooth || false,
    stack: props.options?.stack || false,
  })
  if (option) chart!.setOption(option, true)
}

onMounted(() => {
  chart = echarts.init(chartRef.value, null, { renderer: 'svg' })
  updateOption()

  const resizeListener = () => chart!.resize()
  const resizeObserver = new ResizeObserver(resizeListener)
  resizeObserver.observe(chartRef.value!)
})

watch(() => props.type, updateOption)
watch(() => props.data, updateOption)
watch(() => props.themeColors, updateOption)
watch(() => props.textColor, updateOption)
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>