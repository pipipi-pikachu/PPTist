<template>
  <ImageClipHandler
    v-if="isCliping"
    :src="elementInfo.src"
    :clipData="elementInfo.clip"
    :canvasScale="canvasScale"
    :width="elementInfo.width"
    :height="elementInfo.height"
    :top="elementInfo.top"
    :left="elementInfo.left"
    :clipPath="clipShape.style"
    @clip="range => clip(range)"
  />
  <div 
    class="image-element-operate" 
    v-else
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
        v-for="point in resizeHandlers"
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'

import { PPTImageElement } from '@/types/slides'
import { OperateResizeHandler, ImageClipedEmitData } from '@/types/edit'
import useCommonOperate from '../hooks/useCommonOperate'

import RotateHandler from './RotateHandler.vue'
import ResizeHandler from './ResizeHandler.vue'
import BorderLine from './BorderLine.vue'
import ImageClipHandler from './ImageClipHandler.vue'

export default defineComponent({
  name: 'image-element-operate',
  components: {
    RotateHandler,
    ResizeHandler,
    BorderLine,
    ImageClipHandler,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTImageElement>,
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
    rotateElement: {
      type: Function as PropType<(element: PPTImageElement) => void>,
      required: true,
    },
    scaleElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTImageElement, command: OperateResizeHandler) => void>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore<State>()
    const canvasScale = computed(() => store.state.canvasScale)

    const scaleWidth = computed(() => props.elementInfo.width * canvasScale.value)
    const scaleHeight = computed(() => props.elementInfo.height * canvasScale.value)
    const { resizeHandlers, borderLines } = useCommonOperate(scaleWidth, scaleHeight)

    const clipingImageElId = ref('')

    const isCliping = computed(() => clipingImageElId.value === props.elementInfo.id)

    const clip = (data: ImageClipedEmitData) => {
      clipingImageElId.value = ''
      
      if(!data) return

      const { range, position } = data
      const originClip = props.elementInfo.clip || {}
      
      const _props = {
        clip: { ...originClip, range },
        left: props.elementInfo.left + position.left,
        top: props.elementInfo.top + position.top,
        width: props.elementInfo.width + position.width,
        height: props.elementInfo.height + position.height,
      }
      console.log(_props)
    }

    return {
      scaleWidth,
      resizeHandlers,
      borderLines,
      isCliping,
      clip,
    }
  },
})
</script>

<style lang="scss" scoped>
.image-element-operate {
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