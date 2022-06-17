<template>
  <div class="editable-element-chart"
    :class="{ 'lock': elementInfo.lock }"
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
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)"
        @touchstart="$event => handleSelectElement($event)"
        @dblclick="openDataEditor()"
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
          :legends="elementInfo.data.legends"
          :legend="elementInfo.legend || ''"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { PPTChartElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import emitter, { EmitterEvents } from '@/utils/emitter'

import ElementOutline from '@/views/components/element/ElementOutline.vue'
import Chart from './Chart.vue'

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTChartElement>,
    required: true,
  },
  selectElement: {
    type: Function as PropType<(e: MouseEvent | TouchEvent, element: PPTChartElement, canMove?: boolean) => void>,
    required: true,
  },
  contextmenus: {
    type: Function as PropType<() => ContextmenuItem[] | null>,
  },
})

const handleSelectElement = (e: MouseEvent | TouchEvent) => {
  if (props.elementInfo.lock) return
  e.stopPropagation()

  props.selectElement(e, props.elementInfo)
}

const openDataEditor = () => {
  emitter.emit(EmitterEvents.OPEN_CHART_DATA_EDITOR)
}
</script>

<style lang="scss" scoped>
.editable-element-chart {
  position: absolute;

  &.lock .element-content {
    cursor: default;
  }
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: move;
}
</style>
