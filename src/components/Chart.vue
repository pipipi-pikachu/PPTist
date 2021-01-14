<template>
  <div 
    class="chart"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref } from 'vue'
import Chart from 'chart.js'

interface ChartData {
  labels: string[];
  values: number[][];
}

// const data = {
//   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//   values: [
//     [12, 19, 3, 5, 2, 3],
//     [22, 9, 13, 25, 12, 5],
//   ]
// }

// bar
// horizontalBar
// line
// radar
// pie
// doughnut
// polarArea

export default defineComponent({
  name: 'chart',
  props: {
    type: {
      type: String,
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
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    let chart: Chart

    const data = computed(() => ({
      labels: props.data.labels,
      datasets: props.data.values.map(item => {
        return {
          data: item,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          borderWidth: 1,
        }
      }),
    }))

    onMounted(() => {
      if(!canvasRef.value) return
      const ctx = canvasRef.value.getContext('2d') as CanvasRenderingContext2D
      chart = new Chart(ctx, {
        type: props.type,
        data: data.value,
        options: {
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
              left: 8,
              right: 8,
              top: 8,
              bottom: 8
            },
          },
          legend: {
            display: false,
          },
          elements: {
            line: {
              tension: 0,
              fill: false,
            },
          },
        },
      })
    })

    onUnmounted(() => chart.destroy())

    return {
      canvasRef,
    }
  },
})
</script>