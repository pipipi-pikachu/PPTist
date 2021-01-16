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
  },
  setup(props) {
    const chartRef = ref<HTMLElement | null>(null)
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
      if(!chartRef.value) return

      const type = upperFirst(props.type)
      const { data, options } = getDataAndOptions()
      chart = new Chartist[type](chartRef.value, data, options)
    }

    const updateChart = () => {
      if(!chart) {
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