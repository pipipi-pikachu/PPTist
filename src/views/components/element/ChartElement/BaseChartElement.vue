<template>
  <div class="base-element-chart"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div 
      class="element-content"
      :style="{
        backgroundColor: elementInfo.fill,
      }"
    >
      <ElementOutline
        :width="elementInfo.width"
        :height="elementInfo.height"
        :outline="elementInfo.outline"
      />
      <IconChartHistogram :fill="elementInfo.themeColor" strokeWidth="2" :size="size" v-if="chartType === 'bar'" />
      <IconChartHistogramOne :fill="elementInfo.themeColor" strokeWidth="2" :size="size" v-else-if="chartType === 'horizontalBar'" />
      <IconChartLine :fill="elementInfo.themeColor" strokeWidth="2" :size="size" v-else-if="chartType === 'line'" />
      <IconChartLineArea :fill="elementInfo.themeColor" strokeWidth="2" :size="size" v-else-if="chartType === 'area'" />
      <IconChartScatter :fill="elementInfo.themeColor" strokeWidth="2" :size="size" v-else-if="chartType === 'scatter'" />
      <IconChartPie :fill="elementInfo.themeColor" strokeWidth="2" :size="size" v-else-if="chartType === 'pie'" />
      <IconChartRing :fill="elementInfo.themeColor" strokeWidth="2" :size="size" v-else-if="chartType === 'ring'" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTChartElement } from '@/types/slides'

import ElementOutline from '@/views/components/element/ElementOutline.vue'

export default defineComponent({
  name: 'base-element-chart',
  components: {
    ElementOutline,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTChartElement>,
      required: true,
    },
  },
  setup(props) {
    const size = computed(() => Math.min(props.elementInfo.width, props.elementInfo.height))

    const chartType = computed(() => {
      const _chartType = props.elementInfo.chartType
      const _options = props.elementInfo.options

      if (_chartType === 'bar') {
        if (_options?.horizontalBars) return 'horizontalBar'
        return 'bar'
      }
      else if (_chartType === 'line') {
        if (_options?.showArea) return 'area'
        else if (_options && _options.showLine === false) return 'scatter'
        return 'line'
      }
      else if (_chartType === 'pie') {
        if (_options?.donut) return 'ring'
        return 'pie'
      }

      return ''
    })

    return {
      size,
      chartType,
    }
  },
})
</script>

<style lang="scss" scoped>
.base-element-chart {
  position: absolute;
}

.element-content {
  width: 100%;
  height: 100%;
  opacity: .5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
