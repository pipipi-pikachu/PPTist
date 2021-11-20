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
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
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
        <Chart
          :class="{ 'need-scale': needScaleSize }"
          :width="chartWidth"
          :height="chartHeight"
          :type="elementInfo.chartType"
          :data="elementInfo.data"
          :options="elementInfo.options"
          :themeColor="elementInfo.themeColor"
          :gridColor="elementInfo.gridColor"
          :legends="elementInfo.data.legends"
          :legend="elementInfo.legend || ''"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTChartElement } from '@/types/slides'

import ElementOutline from '@/views/components/element/ElementOutline.vue'
import Chart from './Chart.vue'

export default defineComponent({
  name: 'base-element-chart',
  components: {
    ElementOutline,
    Chart,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTChartElement>,
      required: true,
    },
    needScaleSize: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    return {
      chartWidth: computed(() => props.needScaleSize ? props.elementInfo.width * 10 : props.elementInfo.width),
      chartHeight: computed(() => props.needScaleSize ? props.elementInfo.height * 10 : props.elementInfo.height),
    }
  },
})
</script>

<style lang="scss" scoped>
.base-element-chart {
  position: absolute;
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  width: 100%;
  height: 100%;
}
.need-scale {
  zoom: .1;
}
</style>