<template>
  <div class="line-element-operate">
    <template v-if="handlerVisible">
      <ResizeHandler
        class="operate-resize-handler" 
        v-for="point in resizeHandlers"
        :key="point.handler"
        :style="point.style"
        @mousedown.stop="$event => dragLineElement($event, elementInfo, point.handler)"
      />

      <svg 
        :width="svgWidth || 1" 
        :height="svgHeight || 1" 
        :stroke="elementInfo.color"
        overflow="visible" 
        :style="{ transform: `scale(${canvasScale})` }"
      >
        <template v-if="elementInfo.curve">
          <g>
            <line class="anchor-line" :x1="elementInfo.start[0]" :y1="elementInfo.start[1]" :x2="elementInfo.curve[0]" :y2="elementInfo.curve[1]"></line>
            <line class="anchor-line" :x1="elementInfo.end[0]" :y1="elementInfo.end[1]" :x2="elementInfo.curve[0]" :y2="elementInfo.curve[1]"></line>
          </g>
        </template>
        <template v-if="elementInfo.cubic">
          <g v-for="(item, index) in elementInfo.cubic" :key="index">
            <line class="anchor-line" v-if="index === 0" :x1="elementInfo.start[0]" :y1="elementInfo.start[1]" :x2="item[0]" :y2="item[1]"></line>
            <line class="anchor-line" v-if="index === 1" :x1="elementInfo.end[0]" :y1="elementInfo.end[1]" :x2="item[0]" :y2="item[1]"></line>
          </g>
        </template>
      </svg>
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
import type { PPTLineElement } from '@/types/slides'
import { OperateLineHandlers } from '@/types/edit'

import ResizeHandler from './ResizeHandler.vue'

const props = defineProps<{
  elementInfo: PPTLineElement
  handlerVisible: boolean
  dragLineElement: (e: MouseEvent, element: PPTLineElement, command: OperateLineHandlers) => void
}>()

const { canvasScale } = storeToRefs(useMainStore())

const svgWidth = computed(() => Math.max(props.elementInfo.start[0], props.elementInfo.end[0]))
const svgHeight = computed(() => Math.max(props.elementInfo.start[1], props.elementInfo.end[1]))

const resizeHandlers = computed(() => {
  const handlers = [
    {
      handler: OperateLineHandlers.START,
      style: {
        left: props.elementInfo.start[0] * canvasScale.value + 'px',
        top: props.elementInfo.start[1] * canvasScale.value + 'px',
      }
    },
    {
      handler: OperateLineHandlers.END,
      style: {
        left: props.elementInfo.end[0] * canvasScale.value + 'px',
        top: props.elementInfo.end[1] * canvasScale.value + 'px',
      }
    },
  ]

  if (props.elementInfo.curve || props.elementInfo.broken || props.elementInfo.broken2) {
    const ctrlHandler = (props.elementInfo.curve || props.elementInfo.broken || props.elementInfo.broken2) as [number, number]

    handlers.push({
      handler: OperateLineHandlers.C,
      style: {
        left: ctrlHandler[0] * canvasScale.value + 'px',
        top: ctrlHandler[1] * canvasScale.value + 'px',
      }
    })
  }
  else if (props.elementInfo.cubic) {
    const [ctrlHandler1, ctrlHandler2] = props.elementInfo.cubic
    handlers.push({
      handler: OperateLineHandlers.C1,
      style: {
        left: ctrlHandler1[0] * canvasScale.value + 'px',
        top: ctrlHandler1[1] * canvasScale.value + 'px',
      }
    })
    handlers.push({
      handler: OperateLineHandlers.C2,
      style: {
        left: ctrlHandler2[0] * canvasScale.value + 'px',
        top: ctrlHandler2[1] * canvasScale.value + 'px',
      }
    })
  }

  return handlers
})
</script>

<style lang="scss" scoped>
svg {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  transform-origin: 0 0;
}
.anchor-line {
  stroke-width: 1px;
  stroke-dasharray: 5 5;
  opacity: .5;
}
</style>