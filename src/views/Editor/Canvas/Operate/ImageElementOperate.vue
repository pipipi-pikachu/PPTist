<template>
  <div class="image-element-operate" :class="{ 'cliping': isCliping }">
    <BorderLine 
      class="operate-border-line"
      v-for="line in borderLines" 
      :key="line.type" 
      :type="line.type" 
      :style="line.style"
    />
    <template v-if="handlerVisible">
      <ResizeHandler
        class="operate-resize-handler" 
        v-for="point in resizeHandlers"
        :key="point.direction"
        :type="point.direction"
        :rotate="elementInfo.rotate"
        :style="point.style"
        @mousedown.stop="$event => scaleElement($event, elementInfo, point.direction)"
      />
      <RotateHandler
        class="operate-rotate-handler" 
        :style="{ left: scaleWidth / 2 + 'px' }"
        @mousedown.stop="$event => rotateElement($event, elementInfo)"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import type { PPTImageElement } from '@/types/slides'
import type { OperateResizeHandlers } from '@/types/edit'
import useCommonOperate from '../hooks/useCommonOperate'

import RotateHandler from './RotateHandler.vue'
import ResizeHandler from './ResizeHandler.vue'
import BorderLine from './BorderLine.vue'

const props = defineProps<{
  elementInfo: PPTImageElement
  handlerVisible: boolean
  rotateElement: (e: MouseEvent, element: PPTImageElement) => void
  scaleElement: (e: MouseEvent, element: PPTImageElement, command: OperateResizeHandlers) => void
}>()

const { canvasScale, clipingImageElementId } = storeToRefs(useMainStore())

const isCliping = computed(() => clipingImageElementId.value === props.elementInfo.id)

const scaleWidth = computed(() => props.elementInfo.width * canvasScale.value)
const scaleHeight = computed(() => props.elementInfo.height * canvasScale.value)
const { resizeHandlers, borderLines } = useCommonOperate(scaleWidth, scaleHeight)
</script>

<style lang="scss" scoped>
.image-element-operate.cliping {
  visibility: hidden;
}
</style>