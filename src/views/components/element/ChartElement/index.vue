<template>
  <div class="editable-element-chart"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
    @mousedown="$event => handleSelectElement($event)"
  >
    <div 
      class="element-content" 
      v-contextmenu="contextmenus"
    >
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
        :scale="canvasScale"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { PPTChartElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'

import ElementOutline from '@/views/components/element/ElementOutline.vue'
import Chart from '@/components/Chart.vue'

export default defineComponent({
  name: 'editable-element-chart',
  components: {
    ElementOutline,
    Chart,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTChartElement>,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTChartElement, canMove?: boolean) => void>,
      required: true,
    },
    contextmenus: {
      type: Function as PropType<() => ContextmenuItem[]>,
    },
  },
  setup(props) {
    const handleSelectElement = (e: MouseEvent) => {
      if(props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo)
    }

    const store = useStore<State>()
    const canvasScale = computed(() => store.state.canvasScale)

    return {
      handleSelectElement,
      canvasScale,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-chart {
  position: absolute;
  cursor: move;

  &.lock .element-content {
    cursor: default;
  }
}

.element-content {
  width: 100%;
  height: 100%;
}
</style>
