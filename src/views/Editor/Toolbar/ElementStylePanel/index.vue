<template>
  <div class="element-style-panel">
    <div v-if="!currentPanelComponent">
      请先选中要编辑的元素
    </div>
    <component v-if="handleElement" :is="currentPanelComponent"></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { ElementTypes } from '@/types/slides'

import TextStylePanel from './TextStylePanel.vue'
import ImageStylePanel from './ImageStylePanel.vue'
import ShapeStylePanel from './ShapeStylePanel.vue'
import LineStylePanel from './LineStylePanel.vue'
import ChartStylePanel from './ChartStylePanel/index.vue'
import TableStylePanel from './TableStylePanel.vue'
import LatexStylePanel from './LatexStylePanel.vue'
import VideoStylePanel from './VideoStylePanel.vue'
import AudioStylePanel from './AudioStylePanel.vue'

export default defineComponent({
  name: 'element-style-panel',
  setup() {
    const { handleElement } = storeToRefs(useMainStore())

    const currentPanelComponent = computed(() => {
      if (!handleElement.value) return null
      
      const panelMap = {
        [ElementTypes.TEXT]: TextStylePanel,
        [ElementTypes.IMAGE]: ImageStylePanel,
        [ElementTypes.SHAPE]: ShapeStylePanel,
        [ElementTypes.LINE]: LineStylePanel,
        [ElementTypes.CHART]: ChartStylePanel,
        [ElementTypes.TABLE]: TableStylePanel,
        [ElementTypes.LATEX]: LatexStylePanel,
        [ElementTypes.VIDEO]: VideoStylePanel,
        [ElementTypes.AUDIO]: AudioStylePanel,
      }
      return panelMap[handleElement.value.type] || null
    })

    return {
      handleElement,
      currentPanelComponent,
    }
  },
})
</script>