<template>
  <div class="text-element-operate">
    <template v-if="handlerVisible">
      <ResizeHandler
        class="operate-resize-handler" 
        v-for="point in resizeHandlers"
        :key="point.direction"
        :type="point.direction"
        :style="point.style"
        @mousedown.stop="$event => dragLineElement($event, elementInfo, point.handler)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { PPTLineElement } from '@/types/slides'
import { OperateLineHandler, OperateLineHandlers } from '@/types/edit'

import ResizeHandler from './ResizeHandler.vue'

export default defineComponent({
  name: 'text-element-operate',
  inheritAttrs: false,
  components: {
    ResizeHandler,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTLineElement>,
      required: true,
    },
    handlerVisible: {
      type: Boolean,
      required: true,
    },
    dragLineElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTLineElement, command: OperateLineHandler) => void>,
      required: true,
    },
  },
  setup(props) {
    const { canvasScale } = storeToRefs(useMainStore())

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

      if (props.elementInfo.curve || props.elementInfo.broken) {
        const midHandler = (props.elementInfo.curve || props.elementInfo.broken) as [number, number]

        handlers.push({
          handler: OperateLineHandlers.MID,
          style: {
            left: midHandler[0] * canvasScale.value + 'px',
            top: midHandler[1] * canvasScale.value + 'px',
          }
        })
      }
      return handlers
    })

    return {
      resizeHandlers,
    }
  },
})
</script>