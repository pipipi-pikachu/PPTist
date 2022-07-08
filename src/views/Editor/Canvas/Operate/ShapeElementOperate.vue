<template>
  <div class="shape-element-operate">
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
        @mousedown.stop="rotateElement(elementInfo)"
      />
      <div 
        class="operate-keypoint-handler" 
        v-if="elementInfo.keypoint !== undefined"
        :style="keypointStyle"
        @mousedown.stop="$event => moveShapeKeypoint($event, elementInfo)"
      ></div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { PPTShapeElement } from '@/types/slides'
import { OperateResizeHandlers } from '@/types/edit'
import { SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import useCommonOperate from '../hooks/useCommonOperate'

import RotateHandler from './RotateHandler.vue'
import ResizeHandler from './ResizeHandler.vue'
import BorderLine from './BorderLine.vue'

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTShapeElement>,
    required: true,
  },
  handlerVisible: {
    type: Boolean,
    required: true,
  },
  rotateElement: {
    type: Function as PropType<(element: PPTShapeElement) => void>,
    required: true,
  },
  scaleElement: {
    type: Function as PropType<(e: MouseEvent, element: PPTShapeElement, command: OperateResizeHandlers) => void>,
    required: true,
  },
  moveShapeKeypoint: {
    type: Function as PropType<(e: MouseEvent, element: PPTShapeElement) => void>,
    required: true,
  },
})

const { canvasScale } = storeToRefs(useMainStore())

const scaleWidth = computed(() => props.elementInfo.width * canvasScale.value)
const scaleHeight = computed(() => props.elementInfo.height * canvasScale.value)
const { resizeHandlers, borderLines } = useCommonOperate(scaleWidth, scaleHeight)

const keypointStyle = computed(() => {
  if (!props.elementInfo.pathFormula || !props.elementInfo.keypoint) return {}

  const pathFormula = SHAPE_PATH_FORMULAS[props.elementInfo.pathFormula]
  if ('editable' in pathFormula) {
    const keypointPos = pathFormula.getBaseSize(props.elementInfo.width, props.elementInfo.height) * props.elementInfo.keypoint
    if (pathFormula.relative === 'left') return { left: keypointPos * canvasScale.value + 'px' }
    if (pathFormula.relative === 'right') return { left: (props.elementInfo.width - keypointPos) * canvasScale.value + 'px' }
    if (pathFormula.relative === 'center') return { left: (props.elementInfo.width - keypointPos) / 2 * canvasScale.value + 'px' }
    if (pathFormula.relative === 'top') return { top: keypointPos * canvasScale.value + 'px' }
    if (pathFormula.relative === 'bottom') return { top: (props.elementInfo.height - keypointPos) * canvasScale.value + 'px' }
  }
  return {}
})
</script>

<style lang="scss" scoped>
.operate-keypoint-handler {
  position: absolute;
  width: 10px;
  height: 10px;
  left: 0;
  top: 0;
  margin: -5px 0 0 -5px;
  border: 1px solid $themeColor;
  background-color: #ffe873;
  border-radius: 1px;
}
</style>