<template>
  <div 
    class="multi-select-operate"
    :style="{
      left: minX + 'px',
      top: minY + 'px',
      transform: `scale(${1 / canvasScale})`,
    }"
  >
    <BorderLine v-for="line in borderLines" :key="line.type" :type="line.type" :style="line.style" />

    <template v-if="!disableResizablePoint">
      <ResizablePoint
        v-for="point in resizablePoints"
        :key="point.type"
        :type="point.type"
        :style="point.style"
        @mousedown.stop="scaleMultiElement($event, { minX, maxX, minY, maxY }, point.direction)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, PropType, watch, toRefs, onMounted } from 'vue'
import { OPERATE_KEYS } from '@/configs/element'
import { PPTElement, ElementTypes } from '@/types/slides'
import { getElementListRange } from './utils/elementRange'
import { ElementScaleHandler, OperateResizablePointTypes, OperateBorderLineTypes } from '@/types/edit'

import ResizablePoint from '@/views/_common/_operate/ResizablePoint.vue'
import BorderLine from '@/views/_common/_operate/BorderLine.vue'

interface Range {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export default defineComponent({
  name: 'multi-select-operate',
  components: {
    ResizablePoint,
    BorderLine,
  },
  props: {
    canvasScale: {
      type: Number,
      required: true,
    },
    activeElementList: {
      type: Array as PropType<PPTElement[]>,
      required: true,
    },
    scaleMultiElement: {
      type: Function as PropType<(e: MouseEvent, range: Range, command: ElementScaleHandler) => void>,
      required: true,
    },
  },
  setup(props) {
    const range = reactive({
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    })

    const width = computed(() => (range.maxX - range.minX) * props.canvasScale)
    const height = computed(() => (range.maxY - range.minY) * props.canvasScale)

    const resizablePoints = computed(() => {
      return [
        { type: OperateResizablePointTypes.TL, direction: OPERATE_KEYS.LEFT_TOP, style: {} },
        { type: OperateResizablePointTypes.TC, direction: OPERATE_KEYS.TOP, style: {left: width.value / 2 + 'px'} },
        { type: OperateResizablePointTypes.TR, direction: OPERATE_KEYS.RIGHT_TOP, style: {left: width.value + 'px'} },
        { type: OperateResizablePointTypes.ML, direction: OPERATE_KEYS.LEFT, style: {top: height.value / 2 + 'px'} },
        { type: OperateResizablePointTypes.MR, direction: OPERATE_KEYS.RIGHT, style: {left: width.value + 'px', top: height.value / 2 + 'px'} },
        { type: OperateResizablePointTypes.BL, direction: OPERATE_KEYS.LEFT_BOTTOM, style: {top: height.value + 'px'} },
        { type: OperateResizablePointTypes.BC, direction: OPERATE_KEYS.BOTTOM, style: {left: width.value / 2 + 'px', top: height.value + 'px'} },
        { type: OperateResizablePointTypes.BR, direction: OPERATE_KEYS.RIGHT_BOTTOM, style: {left: width.value + 'px', top: height.value + 'px'} },
      ]
    })

    const borderLines = computed(() => {
      return [
        { type: OperateBorderLineTypes.T, style: {width: width.value + 'px'} },
        { type: OperateBorderLineTypes.B, style: {top: height.value + 'px', width: width.value + 'px'} },
        { type: OperateBorderLineTypes.L, style: {height: height.value + 'px'} },
        { type: OperateBorderLineTypes.R, style: {left: width.value + 'px', height: height.value + 'px'} },
      ]
    })

    const disableResizablePoint = computed(() => {
      return props.activeElementList.some(item => {
        if(
          (item.type === ElementTypes.IMAGE || item.type === ElementTypes.SHAPE) && 
          !item.rotate
        ) return false
        return true
      })
    })

    const setRange = () => {
      const { minX, maxX, minY, maxY } = getElementListRange(props.activeElementList)
      range.minX = minX
      range.maxX = maxX
      range.minY = minY
      range.maxY = maxY
    }

    onMounted(setRange)
    watch(props.activeElementList, setRange)

    return {
      ...toRefs(range),
      borderLines,
      disableResizablePoint,
      resizablePoints,
    }
  },
})
</script>

<style lang="scss" scoped>
.multi-select-operate {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>