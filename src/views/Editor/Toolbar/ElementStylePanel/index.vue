<template>
  <div class="element-style-panel">
    <component :is="currentPanelComponent"></component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
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
import MultiStylePanel from './MultiStylePanel.vue'

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

const { activeElementIdList, activeElementList, handleElement, activeGroupElementId } = storeToRefs(useMainStore())

const currentPanelComponent = computed<unknown>(() => {
  if (activeElementIdList.value.length > 1) {
    if (!activeGroupElementId.value) return MultiStylePanel

    const activeGroupElement = activeElementList.value.find(item => item.id === activeGroupElementId.value)
    return activeGroupElement ? (panelMap[activeGroupElement.type] || null) : null
  }

  return handleElement.value ? (panelMap[handleElement.value.type] || null) : null
})
</script>