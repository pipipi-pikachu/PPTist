<template>
  <div 
    class="clip-wrapper" 
    :style="{
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
    v-if="isCliping"
  >
    <ImageClipHandler
      :src="elementInfo.src"
      :clipData="elementInfo.clip"
      :width="elementInfo.width"
      :height="elementInfo.height"
      :top="elementInfo.top"
      :left="elementInfo.left"
      :clipPath="clipShape.style"
      @clip="range => clip(range)"
    />
  </div>
  <div class="image-element-operate" v-else>
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
import { computed, defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { PPTImageElement } from '@/types/slides'
import { OperateResizeHandler, ImageClipedEmitData } from '@/types/edit'
import { CLIPPATHS, ClipPathTypes } from '@/configs/imageClip'
import useCommonOperate from '../hooks/useCommonOperate'

import RotateHandler from './RotateHandler.vue'
import ResizeHandler from './ResizeHandler.vue'
import BorderLine from './BorderLine.vue'
import ImageClipHandler from './ImageClipHandler.vue'

export default defineComponent({
  name: 'image-element-operate',
  inheritAttrs: false,
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
    const clipingImageElementId = computed(() => store.state.clipingImageElementId)

    const scaleWidth = computed(() => props.elementInfo.width * canvasScale.value)
    const scaleHeight = computed(() => props.elementInfo.height * canvasScale.value)
    const { resizeHandlers, borderLines } = useCommonOperate(scaleWidth, scaleHeight)

    const clipShape = computed(() => {
      if(!props.elementInfo || !props.elementInfo.clip) return CLIPPATHS.rect
      const shape = props.elementInfo.clip.shape || ClipPathTypes.RECT

      return CLIPPATHS[shape]
    })

    const isCliping = computed(() => clipingImageElementId.value === props.elementInfo.id)

    const clip = (data: ImageClipedEmitData) => {
      store.commit(MutationTypes.SET_CLIPING_IMAGE_ELEMENT_ID, '')
      
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
      clipShape,
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
.clip-wrapper {
  position: relative;
}
</style>