<template>
  <div class="text-element-operate">
    <template v-if="handlerVisible">
      <ResizeHandler
        class="operate-resize-handler" 
        v-for="point in resizeHandlers"
        :key="point.handler"
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
import { OperateLineHandlers } from '@/types/edit'

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
      type: Function as PropType<(e: MouseEvent, element: PPTLineElement, command: OperateLineHandlers) => void>,
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
        const ctrlHandler = (props.elementInfo.curve || props.elementInfo.broken) as [number, number]

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

    return {
      resizeHandlers,
    }
  },
})
</script>