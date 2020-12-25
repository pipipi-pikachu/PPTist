<template>
  <div 
    class="text-element-operate" 
    :class="{
      'selected': isSelected,
      'multi-select': isMultiSelect && isSelected,
      'active': isActive,
    }"
  >
    <BorderLine 
      class="operate-border-line"
      v-for="line in borderLines" 
      :key="line.type" 
      :type="line.type" 
      :style="line.style"
    />
    <template v-if="!elementInfo.lock && (isActiveGroupElement || !isMultiSelect)">
      <ResizeHandler
        class="operate-resize-handler" 
        v-for="point in textElementResizeHandlers"
        :key="point.direction"
        :type="point.direction"
        :style="point.style"
        @mousedown.stop="$event => scaleElement($event, elementInfo, point.direction)"
      />
      <RotateHandler
        class="operate-rotate-handler" 
        :style="{ left: scaleWidth / 2 + 'px' }"
        @mousedown.stop="rotateElement(elementInfo)"
      />
    </template>

    <AnimationIndex v-if="animationIndex !== -1" :animationIndex="animationIndex" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'

import { PPTTextElement } from '@/types/slides'
import { OperateResizeHandler } from '@/types/edit'
import useCommonOperate from '../hooks/useCommonOperate'

import RotateHandler from './RotateHandler.vue'
import ResizeHandler from './ResizeHandler.vue'
import BorderLine from './BorderLine.vue'
import AnimationIndex from './AnimationIndex.vue'

export default defineComponent({
  name: 'text-element-operate',
  components: {
    RotateHandler,
    ResizeHandler,
    BorderLine,
    AnimationIndex,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTTextElement>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isActiveGroupElement: {
      type: Boolean,
      required: true,
    },
    isMultiSelect: {
      type: Boolean,
      required: true,
    },
    animationIndex: {
      type: Number,
      required: true,
    },
    rotateElement: {
      type: Function as PropType<(element: PPTTextElement) => void>,
      required: true,
    },
    scaleElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTTextElement, command: OperateResizeHandler) => void>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore<State>()
    const canvasScale = computed(() => store.state.canvasScale)

    const scaleWidth = computed(() => props.elementInfo.width * canvasScale.value)
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

<style lang="scss" scoped>
.text-element-operate {
  &.selected {
    .operate-border-line,
    .operate-resize-handler,
    .operate-rotate-handler {
      display: block;
    }
  }

  &.multi-select:not(.active) .operate-border-line {
    border-color: rgba($color: $themeColor, $alpha: .3);
  }

  .operate-border-line,
  .operate-resize-handler,
  .operate-rotate-handler {
    display: none;
  }
}
</style>