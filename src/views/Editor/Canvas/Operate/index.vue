<template>
  <div
    class="operate"
    :class="{ 'multi-select': isMultiSelect && !isActive }"
    v-if="isSelected"
    :style="{
      top: elementInfo.top * canvasScale + 'px',
      left: elementInfo.left * canvasScale + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
      transformOrigin: `${elementInfo.width * canvasScale / 2}px ${elementInfo.height * canvasScale / 2}px`,
    }"
  >
    <component
      :is="currentOperateComponent"
      :elementInfo="elementInfo"
      :isActiveGroupElement="isActiveGroupElement"
      :isMultiSelect="isMultiSelect"
      :rotateElement="rotateElement"
      :scaleElement="scaleElement"
    ></component>

    <div 
      class="animation-index"
      v-if="toolbarState === 'elAnimation' && elementIndexInAnimation !== -1"
    >
      {{elementIndexInAnimation + 1}}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, Ref } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { OperateResizeHandler } from '@/types/edit'

import ImageElementOperate from './ImageElementOperate.vue'
import TextElementOperate from './TextElementOperate.vue'
import ShapeElementOperate from './ShapeElementOperate.vue'

export default defineComponent({
  name: 'operate',
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
  },
  setup(props) {
    const store = useStore<State>()
    const canvasScale = computed(() => store.state.canvasScale)
    const toolbarState = computed(() => store.state.toolbarState)
    const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

    const currentOperateComponent = computed(() => {
      const elementTypeMap = {
        'image': ImageElementOperate,
        'text': TextElementOperate,
        'shape': ShapeElementOperate,
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
    opacity: .3;
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
  margin-bottom: 3px;
}
</style>