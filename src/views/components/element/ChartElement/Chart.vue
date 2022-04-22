<template>
  <div 
    class="chart"
    :style="{ flexDirection: legend === 'top' ? 'column-reverse' : 'column' }"
  >
    <div 
      class="chart-content"
      ref="chartRef"
      :style="{
        width: width + 'px',
        height: chartHeight + 'px',
        transform: `scale(${1 / slideScale})`,
      }"
    ></div>
    <div class="legends" :style="{ transform: `scale(${1 / slideScale})` }" v-if="legend">
      <div 
        class="legend" 
        v-for="(legend, index) in legends" 
        :key="index"
        :style="{ color: gridColor }"
      >
        <div class="block" :style="{ backgroundColor: themeColors[index] }"></div>
        {{legend}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, PropType, ref, watch } from 'vue'
import { upperFirst } from 'lodash'
import tinycolor from 'tinycolor2'
import Chartist, {
  IChartistLineChart,
  IChartistBarChart,
  IChartistPieChart,
} from 'chartist'
import { ChartData, ChartOptions, ChartType } from '@/types/slides'
import { injectKeySlideScale } from '@/types/injectKey'

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
      type: Object as PropType<ChartOptions>,
    },
    themeColor: {
      type: Array as PropType<string[]>,
      required: true,
    },
    legends: {
      type: Array as PropType<string[]>,
      required: true,
    },
    gridColor: {
      type: String,
    },
    legend: {
      type: String as PropType<'' | 'top' | 'bottom'>,
    },
  },
  setup(props) {
    const chartRef = ref<HTMLElement>()
    const slideScale = inject(injectKeySlideScale) || ref(1)

    let chart: IChartistLineChart | IChartistBarChart | IChartistPieChart | undefined

    const chartHeight = computed(() => {
      if (props.legend) return props.height - 20
      return props.height
    })

    const getDataAndOptions = () => {
      const propsOptopns = props.options || {}
      const options = {
        ...propsOptopns,
        width: props.width * slideScale.value,
        height: chartHeight.value * slideScale.value,
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
      () => props.options,
      slideScale,
    ], updateChart)

    onMounted(renderChart)

    const themeColors = computed(() => {
      let colors: string[] = []
      if (props.themeColor.length >= 10) colors = props.themeColor
      else if (props.themeColor.length === 1) colors = tinycolor(props.themeColor[0]).analogous(10).map(color => color.toHexString())
      else {
        const len = props.themeColor.length
        const supplement = tinycolor(props.themeColor[len - 1]).analogous(10 + 1 - len).map(color => color.toHexString())
        colors = [...props.themeColor.slice(0, len - 1), ...supplement]
      }
      return colors
    })

    // 更新主题配色：
    // 如果当前所设置的主题色数小于10，剩余部分获取最后一个主题色的相近颜色作为配色
    const updateTheme = () => {
      if (!chartRef.value) return

      for (let i = 0; i < 10; i++) {
        chartRef.value.style.setProperty(`--theme-color-${i + 1}`, themeColors.value[i])
      }
    }

    watch(themeColors, updateTheme)
    onMounted(updateTheme)

    // 更新网格颜色，包括坐标的文字部分
    const updateGridColor = () => {
      if (!chartRef.value) return
      if (props.gridColor) chartRef.value.style.setProperty(`--grid-color`, props.gridColor)
    }

    watch(() => props.gridColor, updateGridColor)
    onMounted(updateGridColor)

    return {
      chartHeight,
      themeColors,
      slideScale,
      chartRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.chart {
  display: flex;
}

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

.legends {
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
.legend {
  display: flex;
  align-items: center;

  & + .legend {
    margin-left: 10px;
  }

  .block {
    width: 10px;
    height: 10px;
    margin-right: 5px;
  }
}
</style>