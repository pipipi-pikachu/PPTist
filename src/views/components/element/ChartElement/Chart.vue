<template>
  <div class="chart">
    <div 
      class="chart-content"
      ref="chartRef"
      :style="{
        width: width + 'px',
        height: height + 'px',
        transform: `scale(${1 / slideScale})`,
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, PropType, ref, Ref, watch } from 'vue'
import upperFirst from 'lodash/upperFirst'
import tinycolor from 'tinycolor2'
import Chartist, {
  IChartistLineChart,
  IChartistBarChart,
  IChartistPieChart,
  ILineChartOptions,
  IBarChartOptions,
  IPieChartOptions,
} from 'chartist'
import { ChartData, ChartType } from '@/types/slides'

import 'chartist/dist/scss/chartist.scss'

export default defineComponent({
  name: 'chart',
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    type: {
      type: String as PropType<ChartType>,
      required: true,
    },
    data: {
      type: Object as PropType<ChartData>,
      required: true,
    },
    options: {
      type: Object as PropType<ILineChartOptions & IBarChartOptions & IPieChartOptions>,
    },
    themeColor: {
      type: String,
      required: true,
    },
    gridColor: {
      type: String,
    },
  },
  setup(props) {
    const chartRef = ref<HTMLElement>()
    const slideScale: Ref<number> = inject('slideScale') || ref(1)

    let chart: IChartistLineChart | IChartistBarChart | IChartistPieChart | undefined

    const getDataAndOptions = () => {
      const propsOptopns = props.options || {}
      const options = {
        ...propsOptopns,
        width: props.width * slideScale.value,
        height: props.height * slideScale.value,
      }
      const data = props.type === 'pie' ? { ...props.data, series: props.data.series[0] } : props.data
      return { data, options }
    }

    const renderChart = () => {
      if (!chartRef.value) return

      const type = upperFirst(props.type)
      const { data, options } = getDataAndOptions()
      chart = new Chartist[type](chartRef.value, data, options)
    }

    const updateChart = () => {
      if (!chart) {
        renderChart()
        return
      }
      const { data, options } = getDataAndOptions()
      chart.update(data, options)
    }

    watch([
      () => props.width,
      () => props.height,
      () => props.data,
      slideScale,
    ], updateChart)

    onMounted(renderChart)

    // 更新主题配色：获取主题色的相近颜色作为主题配色
    const updateTheme = () => {
      if (!chartRef.value) return

      const colors = tinycolor(props.themeColor).analogous(10)
      for (let i = 0; i < 10; i++) {
        const color = colors[i].toRgbString()
        chartRef.value.style.setProperty(`--theme-color-${i + 1}`, color)
      }
    }

    watch(() => props.themeColor, updateTheme)
    onMounted(updateTheme)

    // 更新网格颜色，包括坐标的文字部分
    const updateGridColor = () => {
      if (!chartRef.value) return
      if (props.gridColor) chartRef.value.style.setProperty(`--grid-color`, props.gridColor)
    }

    watch(() => props.gridColor, updateGridColor)
    onMounted(updateGridColor)

    return {
      slideScale,
      chartRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.chart-content {
  transform-origin: 0 0;
}
</style>

<style lang="scss">
.chart-content {
  $ct-series-names: (a, b, c, d, e, f, g, h, i, j);

  --theme-color-1: #666;
  --theme-color-2: #666;
  --theme-color-3: #666;
  --theme-color-4: #666;
  --theme-color-5: #666;
  --theme-color-6: #666;
  --theme-color-7: #666;
  --theme-color-8: #666;
  --theme-color-9: #666;
  --theme-color-10: #666;

  @for $i from 1 to length($ct-series-names) {
    $color: var(--theme-color-#{$i});

    .ct-series-#{nth($ct-series-names, $i)} .ct-line {
      stroke: $color;
    }
    .ct-series-#{nth($ct-series-names, $i)} .ct-point {
      stroke: $color;
    }
    .ct-series-#{nth($ct-series-names, $i)} .ct-area {
      fill: $color;
    }
    .ct-series-#{nth($ct-series-names, $i)} .ct-bar {
      stroke: $color;
    }
    .ct-series-#{nth($ct-series-names, $i)} .ct-slice-pie {
      fill: $color;
    }
    .ct-series-#{nth($ct-series-names, $i)} .ct-slice-donut {
      stroke: $color;
    }
  }

  --grid-color: rgba(0, 0, 0, 0.4);

  .ct-grid {
    stroke: var(--grid-color);
  }
  .ct-label {
    fill: var(--grid-color);
    color: var(--grid-color);
  }
}
</style>