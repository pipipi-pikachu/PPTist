<template>
  <div
    class="mobile-editable-element"
    :style="{
      zIndex: elementIndex,
    }"
  >
    <component
      :is="currentElementComponent"
      :elementInfo="elementInfo"
      :selectElement="selectElement"
      :contextmenus="() => null"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElementTypes, type PPTElement } from '../../types/slides'

import ImageElement from '../../components/element/ImageElement/index.vue'
import TextElement from '../../components/element/TextElement/index.vue'
import ShapeElement from '../../components/element/ShapeElement/index.vue'
import LineElement from '../../components/element/LineElement/index.vue'
import ChartElement from '../../components/element/ChartElement/index.vue'
import TableElement from '../../components/element/TableElement/index.vue'
import LatexElement from '../../components/element/LatexElement/index.vue'
import VideoElement from '../../components/element/VideoElement/index.vue'
import AudioElement from '../../components/element/AudioElement/index.vue'

const props = defineProps<{
  elementInfo: PPTElement
  elementIndex: number
  selectElement: (e: TouchEvent, element: PPTElement, canMove?: boolean) => void
}>()

const currentElementComponent = computed<unknown>(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElement,
    [ElementTypes.TEXT]: TextElement,
    [ElementTypes.SHAPE]: ShapeElement,
    [ElementTypes.LINE]: LineElement,
    [ElementTypes.CHART]: ChartElement,
    [ElementTypes.TABLE]: TableElement,
    [ElementTypes.LATEX]: LatexElement,
    [ElementTypes.VIDEO]: VideoElement,
    [ElementTypes.AUDIO]: AudioElement,
  }
  return elementTypeMap[props.elementInfo.type] || null
})
</script>
