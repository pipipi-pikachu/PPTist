<template>
  <div class="base-element-chart"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div class="element-content">
      <ElementOutline
        :width="elementInfo.width"
        :height="elementInfo.height"
        :outline="elementInfo.outline"
      />
      <Chart
        :type="elementInfo.chartType"
        :width="elementInfo.width"
        :height="elementInfo.height"
        :data="elementInfo.data"
        :scale="scale"
        :options="target === 'thumbnail' ? { tooltips: { enabled: false } } : {}"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from 'vue'
import { PPTChartElement } from '@/types/slides'

import ElementOutline from '@/views/components/element/ElementOutline.vue'
import Chart from '@/components/Chart.vue'

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
    target: {
      type: String as PropType<'thumbnail' | 'screen'>,
      required: true,
    },
  },
  setup() {
    const scale = inject('scale') || 1

    return {
      scale,
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
}
</style>
