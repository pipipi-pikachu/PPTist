<template>
  <div
    class="operate"
    :class="{ 'multi-select': isMultiSelect && !isActive }"
    :style="{
      top: elementInfo.top * canvasScale + 'px',
      left: elementInfo.left * canvasScale + 'px',
      transform: `rotate(${rotate}deg)`,
      transformOrigin: `${elementInfo.width * canvasScale / 2}px ${height * canvasScale / 2}px`,
    }"
  >
    <component
      v-if="isSelected"
      :is="currentOperateComponent"
      :elementInfo="elementInfo"
      :handlerVisible="!elementInfo.lock && (isActiveGroupElement || !isMultiSelect)"
      :rotateElement="rotateElement"
      :scaleElement="scaleElement"
      :dragLineElement="dragLineElement"
      :moveShapeKeypoint="moveShapeKeypoint"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import {
  ElementTypes,
  type PPTElement,
  type PPTLineElement,
  type PPTVideoElement,
  type PPTAudioElement,
  type PPTShapeElement,
  type PPTChartElement,
} from '@/types/slides'
import type { OperateLineHandlers, OperateResizeHandlers } from '@/types/edit'

import ImageElementOperate from './ImageElementOperate.vue'
import TextElementOperate from './TextElementOperate.vue'
import ShapeElementOperate from './ShapeElementOperate.vue'
import LineElementOperate from './LineElementOperate.vue'
import TableElementOperate from './TableElementOperate.vue'
import CommonElementOperate from './CommonElementOperate.vue'

const props = defineProps<{
  elementInfo: PPTElement
  isSelected: boolean
  isActive: boolean
  isActiveGroupElement: boolean
  isMultiSelect: boolean
  rotateElement: (e: MouseEvent, element: Exclude<PPTElement, PPTChartElement | PPTLineElement | PPTVideoElement | PPTAudioElement>) => void
  scaleElement: (e: MouseEvent, element: Exclude<PPTElement, PPTLineElement>, command: OperateResizeHandlers) => void
  dragLineElement: (e: MouseEvent, element: PPTLineElement, command: OperateLineHandlers) => void
  moveShapeKeypoint: (e: MouseEvent, element: PPTShapeElement, index: number) => void
}>()

const { canvasScale } = storeToRefs(useMainStore())

const currentOperateComponent = computed<unknown>(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElementOperate,
    [ElementTypes.TEXT]: TextElementOperate,
    [ElementTypes.SHAPE]: ShapeElementOperate,
    [ElementTypes.LINE]: LineElementOperate,
    [ElementTypes.TABLE]: TableElementOperate,
    [ElementTypes.CHART]: CommonElementOperate,
    [ElementTypes.LATEX]: CommonElementOperate,
    [ElementTypes.VIDEO]: CommonElementOperate,
    [ElementTypes.AUDIO]: CommonElementOperate,
  }
  return elementTypeMap[props.elementInfo.type] || null
})

const rotate = computed(() => 'rotate' in props.elementInfo ? props.elementInfo.rotate : 0)
const height = computed(() => 'height' in props.elementInfo ? props.elementInfo.height : 0)
</script>

<style lang="scss" scoped>
.operate {
  position: absolute;
  z-index: 100;
  user-select: none;

  &.multi-select {
    opacity: 0.2;
  }
}
</style>
