<template>
  <div
    class="operate"
    :style="{
      top: elementInfo.top * canvasScale + 'px',
      left: elementInfo.left * canvasScale + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
      'transform-origin': `${elementInfo.width * canvasScale / 2}px ${elementInfo.height * canvasScale / 2}px`,
    }"
  >
    <component
      :is="currentOperateComponent"
      :elementInfo="elementInfo"
      :isSelected="isSelected"
      :isActive="isActive"
      :isActiveGroupElement="isActiveGroupElement"
      :isMultiSelect="isMultiSelect"
      :animationIndex="animationIndex"
      :rotateElement="rotateElement"
      :scaleElement="scaleElement"
    ></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { PPTElement } from '@/types/slides'
import { OperateResizeHandler } from '@/types/edit'

import ImageElementOperate from './ImageElementOperate.vue'
import TextElementOperate from './TextElementOperate.vue'
import { useStore } from 'vuex'
import { State } from '@/store'

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
    animationIndex: {
      type: Number,
      default: -1,
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

    const currentOperateComponent = computed(() => {
      const elementTypeMap = {
        'image': ImageElementOperate,
        'text': TextElementOperate,
      }
      return elementTypeMap[props.elementInfo.type] || null
    })

    return {
      currentOperateComponent,
      canvasScale,
    }
  },
})
</script>

<style lang="scss" scoped>
.operate {
  position: absolute;
  z-index: 100;
  user-select: none;
}
</style>