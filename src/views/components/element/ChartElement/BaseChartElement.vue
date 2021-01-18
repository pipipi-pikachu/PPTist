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
      <IconChartLine :fill="color" strokeWidth="2" :size="size" v-if="elementInfo.chartType === 'line'" />
      <IconChartHistogram :fill="color" strokeWidth="2" :size="size" v-else-if="elementInfo.chartType === 'bar'" />
      <IconChartProportion :fill="color" strokeWidth="2" :size="size" v-else-if="elementInfo.chartType === 'pie'" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTChartElement } from '@/types/slides'
import { CHART_THEME_COLORS } from '@/configs/chartTheme'

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
    const color = computed(() => {
      return props.elementInfo.themeColors ? props.elementInfo.themeColors[0] : CHART_THEME_COLORS[0][0]
    })

    return {
      size,
      color,
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
  background-color: rgba($color: #000, $alpha: .05);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
