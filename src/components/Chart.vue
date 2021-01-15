<template>
  <div 
    class="chart"
    :style="{
      width: width * scale + 'px',
      height: height * scale + 'px',
      transform: `scale(${1 / scale})`,
    }"
  >
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import Chart from 'chart.js'
import { ChartData, ChartType } from '@/types/slides'

const commonConfigs = {
  backgroundColor: 'rgba(209, 68, 36, 0.3)',
  borderColor: 'rgba(209, 68, 36)',
  borderWidth: 2,
}

const defaultOptions: Chart.ChartOptions = {
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  hover: {
    animationDuration: 0,
  },
  responsiveAnimationDuration: 0,
  layout: {
    padding: {
      left: 5,
      right: 5,
      top: 5,
      bottom: 5,
    },
  },
  legend: {
    display: false,
  },
  elements: {
    line: {
      tension: 0,
      fill: false,
      ...commonConfigs,
    },
    rectangle: {
      ...commonConfigs,
    },
    arc: {
      ...commonConfigs,
    },
  },
}

export default defineComponent({
  name: 'chart',
  props: {
    type: {
      type: String as PropType<ChartType>,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    data: {
      type: Object as PropType<ChartData>,
      required: true,
    },
    options: {
      type: Object as PropType<Chart.ChartOptions>,
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    let chart: Chart

    const data = computed(() => ({
      labels: props.data.labels,
      datasets: props.data.series.map(item => ({ data: item })),
    }))

    const options = computed(() => {
      const options = props.options || {}
      return { ...defaultOptions, ...options }
    })

    watch(data, () => {
      if(!chart) return
      chart.data = data.value
      chart.update()
    })

    onMounted(() => {
      if(!canvasRef.value) return
      const ctx = canvasRef.value.getContext('2d') as CanvasRenderingContext2D
      chart = new Chart(ctx, {
        type: props.type,
        data: data.value,
        options: options.value,
      })
    })

    onUnmounted(() => chart.destroy())

    return {
      canvasRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.chart {
  transform-origin: 0 0;
}
</style>