<template>
  <div class="table-element-operate">
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
        v-for="point in textElementResizeHandlers"
        :key="point.direction"
        :type="point.direction"
        :rotate="elementInfo.rotate"
        :style="point.style"
        @mousedown.stop="$event => scaleElement($event, elementInfo, point.direction)"
      />
      <RotateHandler
        class="operate-rotate-handler" 
        :style="{ left: scaleWidth / 2 + 'px' }"
        @mousedown.stop="rotateElement(elementInfo)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { PPTTableElement } from '@/types/slides'
import { OperateResizeHandlers } from '@/types/edit'
import useCommonOperate from '../hooks/useCommonOperate'

import RotateHandler from './RotateHandler.vue'
import ResizeHandler from './ResizeHandler.vue'
import BorderLine from './BorderLine.vue'

export default defineComponent({
  name: 'table-element-operate',
  inheritAttrs: false,
  components: {
    RotateHandler,
    ResizeHandler,
    BorderLine,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTTableElement>,
      required: true,
    },
    handlerVisible: {
      type: Boolean,
      required: true,
    },
    rotateElement: {
      type: Function as PropType<(element: PPTTableElement) => void>,
      required: true,
    },
    scaleElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTTableElement, command: OperateResizeHandlers) => void>,
      required: true,
    },
  },
  setup(props) {
    const { canvasScale } = storeToRefs(useMainStore())

    const outlineWidth = computed(() => props.elementInfo.outline.width || 1)

    const scaleWidth = computed(() => (props.elementInfo.width + outlineWidth.value) * canvasScale.value)
    const scaleHeight = computed(() => props.elementInfo.height * canvasScale.value)

    const { textElementResizeHandlers, borderLines } = useCommonOperate(scaleWidth, scaleHeight)

    return {
      scaleWidth,
      textElementResizeHandlers,
      borderLines,
    }
  },
})
</script>