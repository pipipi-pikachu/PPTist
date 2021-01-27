<template>
  <div class="screen-element-chart"
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
      <Chart
        :width="elementInfo.width"
        :height="elementInfo.height"
        :type="elementInfo.chartType"
        :data="elementInfo.data"
        :options="elementInfo.options"
        :themeColor="elementInfo.themeColor"
        :gridColor="elementInfo.gridColor"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PPTChartElement } from '@/types/slides'

import ElementOutline from '@/views/components/element/ElementOutline.vue'
import Chart from './Chart.vue'

export default defineComponent({
  name: 'screen-element-chart',
  components: {
    ElementOutline,
    Chart,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTChartElement>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.screen-element-chart {
  position: absolute;
}

.element-content {
  width: 100%;
  height: 100%;
}
</style>
