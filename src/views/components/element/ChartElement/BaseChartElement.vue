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
          :width="elementInfo.width * zoom"
          :height="elementInfo.height * zoom"
          :type="elementInfo.chartType"
          :data="elementInfo.data"
          :options="elementInfo.options"
          :themeColor="elementInfo.themeColor"
          :gridColor="elementInfo.gridColor"
          :legends="elementInfo.data.legends"
          :legend="elementInfo.legend || ''"
          :style="{ zoom: 1 / zoom }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, PropType, ref } from 'vue'
import { PPTChartElement } from '@/types/slides'
import { injectKeySlideScale } from '@/types/injectKey'

import ElementOutline from '@/views/components/element/ElementOutline.vue'
import Chart from './Chart.vue'

defineProps({
  elementInfo: {
    type: Object as PropType<PPTChartElement>,
    required: true,
  },
})

const slideScale = inject(injectKeySlideScale) || ref(1)

const needScaleSize = computed(() => slideScale.value < 1)
const zoom = computed(() => needScaleSize.value ? 1 / slideScale.value : 1)
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
</style>