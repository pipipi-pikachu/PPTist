<template>
  <div
    class="mobile-operate"
    :style="{
      top: elementInfo.top * canvasScale + 'px',
      left: elementInfo.left * canvasScale + 'px',
      transform: `rotate(${rotate}deg)`,
      transformOrigin: `${elementInfo.width * canvasScale / 2}px ${elementInfo.height * canvasScale / 2}px`,
    }"
  >
    <template v-if="isSelected">
      <BorderLine 
        class="operate-border-line"
        v-for="line in borderLines" 
        :key="line.type" 
        :type="line.type" 
        :style="line.style"
      />
      <ResizeHandler
        class="operate-resize-handler" 
        v-for="point in resizeHandlers"
        :key="point.direction"
        :type="point.direction"
        :rotate="elementInfo.rotate"
        :style="point.style"
        @touchstart.stop="$event => scaleElement($event, elementInfo, point.direction)"
      />
      <RotateHandler
        class="operate-rotate-handler" 
        :style="{ left: scaleWidth / 2 + 'px' }"
        v-if="!cannotRotate"
        @touchstart.stop="$event => rotateElement($event, elementInfo as CanRotatePPTElement)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PPTElement, PPTLineElement, PPTChartElement, PPTVideoElement, PPTAudioElement } from '@/types/slides'
import useCommonOperate from '@/views/Editor/Canvas/hooks/useCommonOperate'
import type { OperateResizeHandlers } from '@/types/edit'

import BorderLine from '@/views/Editor/Canvas/Operate/BorderLine.vue'
import ResizeHandler from '@/views/Editor/Canvas/Operate/ResizeHandler.vue'
import RotateHandler from '@/views/Editor/Canvas/Operate/RotateHandler.vue'

type CanRotatePPTElement = Exclude<PPTElement, PPTChartElement | PPTLineElement | PPTVideoElement | PPTAudioElement>

const props = defineProps<{
  elementInfo: Exclude<PPTElement, PPTLineElement>
  isSelected: boolean
  canvasScale: number
  scaleElement: (e: MouseEvent, element: Exclude<PPTElement, PPTLineElement>, command: OperateResizeHandlers) => void
  rotateElement: (e: MouseEvent, element: CanRotatePPTElement) => void
}>()

const rotate = computed(() => 'rotate' in props.elementInfo ? props.elementInfo.rotate : 0)

const scaleWidth = computed(() => props.elementInfo.width * props.canvasScale)
const scaleHeight = computed(() => props.elementInfo.height * props.canvasScale)
const {
  borderLines,
  resizeHandlers: _resizeHandlers,
  textElementResizeHandlers,
} = useCommonOperate(scaleWidth, scaleHeight)

const resizeHandlers = props.elementInfo.type === 'text' || props.elementInfo.type === 'table' ? textElementResizeHandlers : _resizeHandlers

const cannotRotate = computed(() => ['chart', 'video', 'audio'].includes(props.elementInfo.type))
</script>

<style lang="scss" scoped>
.mobile-operate {
  position: absolute;
  z-index: 100;
  user-select: none;
}
</style>