<template>
  <div
    class="operate"
    :class="{ 'multi-select': isMultiSelect && !isActive }"
    :style="{
      top: elementInfo.top * canvasScale + 'px',
      left: elementInfo.left * canvasScale + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
      transformOrigin: `${elementInfo.width * canvasScale / 2}px ${elementInfo.height * canvasScale / 2}px`,
    }"
  >
    <component
      v-if="isSelected"
      :is="currentOperateComponent"
      :elementInfo="elementInfo"
      :handlerVisible="!elementInfo.lock && (isActiveGroupElement || !isMultiSelect)"
      :rotateElement="rotateElement"
      :scaleElement="scaleElement"
      :dragLineElement="dragLineElement"
    ></component>

    <div 
      class="animation-index"
      v-if="toolbarState === 'elAnimation' && elementIndexInAnimation !== -1"
    >
      {{elementIndexInAnimation + 1}}
    </div>

    <LinkHandler 
      :elementInfo="elementInfo" 
      :openLinkDialog="openLinkDialog" 
      v-if="isActive && elementInfo.link" 
      @mousedown.stop 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { ElementTypes, PPTElement } from '@/types/slides'
import { OperateLineHandler, OperateResizeHandler } from '@/types/edit'

import ImageElementOperate from './ImageElementOperate.vue'
import TextElementOperate from './TextElementOperate.vue'
import ShapeElementOperate from './ShapeElementOperate.vue'
import LineElementOperate from './LineElementOperate.vue'
import TableElementOperate from './TableElementOperate.vue'
import CommonElementOperate from './CommonElementOperate.vue'
import LinkHandler from './LinkHandler.vue'

export default defineComponent({
  name: 'operate',
  components: {
    LinkHandler,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTElement>,
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
      type: Function as PropType<(element: PPTElement) => void>,
      required: true,
    },
    scaleElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTElement, command: OperateResizeHandler) => void>,
      required: true,
    },
    dragLineElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTElement, command: OperateLineHandler) => void>,
      required: true,
    },
    openLinkDialog: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const { canvasScale, toolbarState } = storeToRefs(useMainStore())
    const { currentSlide } = storeToRefs(useSlidesStore())

    const currentOperateComponent = computed(() => {
      const elementTypeMap = {
        [ElementTypes.IMAGE]: ImageElementOperate,
        [ElementTypes.TEXT]: TextElementOperate,
        [ElementTypes.SHAPE]: ShapeElementOperate,
        [ElementTypes.LINE]: LineElementOperate,
        [ElementTypes.TABLE]: TableElementOperate,
        [ElementTypes.CHART]: CommonElementOperate,
        [ElementTypes.LATEX]: CommonElementOperate,
        [ElementTypes.VIDEO]: CommonElementOperate,
        [ElementTypes.AUDIO]: CommonElementOperate,
      }
      return elementTypeMap[props.elementInfo.type] || null
    })

    const elementIndexInAnimation = computed(() => {
      const animations = currentSlide.value.animations || []
      return animations.findIndex(animation => animation.elId === props.elementInfo.id)
    })

    return {
      currentOperateComponent,
      canvasScale,
      toolbarState,
      elementIndexInAnimation,
    }
  },
})
</script>

<style lang="scss" scoped>
.operate {
  position: absolute;
  z-index: 100;
  user-select: none;

  &.multi-select {
    opacity: 0;
  }
}
.animation-index {
  position: absolute;
  top: 0;
  left: -24px;
  font-size: 12px;
  width: 18px;
  height: 18px;
  background-color: #fff;
  color: $themeColor;
  border: 1px solid $themeColor;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>