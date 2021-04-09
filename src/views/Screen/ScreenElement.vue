<template>
  <div 
    class="screen-element"
    :id="`screen-element-${elementInfo.id}`"
    :style="{
      zIndex: elementIndex,
      color: theme.fontColor,
      fontFamily: theme.fontName,
      visibility: needWaitAnimation ? 'hidden' : 'visible',
    }"
  >
    <component
      :is="currentElementComponent"
      :elementInfo="elementInfo"
    ></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useStore } from '@/store'
import { ElementTypes, PPTElement, Slide } from '@/types/slides'

import BaseImageElement from '@/views/components/element/ImageElement/BaseImageElement.vue'
import BaseTextElement from '@/views/components/element/TextElement/BaseTextElement.vue'
import BaseShapeElement from '@/views/components/element/ShapeElement/BaseShapeElement.vue'
import BaseLineElement from '@/views/components/element/LineElement/BaseLineElement.vue'
import ScreenChartElement from '@/views/components/element/ChartElement/ScreenChartElement.vue'
import BaseTableElement from '@/views/components/element/TableElement/BaseTableElement.vue'

export default defineComponent({
  name: 'screen-element',
  props: {
    elementInfo: {
      type: Object as PropType<PPTElement>,
      required: true,
    },
    elementIndex: {
      type: Number,
      required: true,
    },
    animationIndex: {
      type: Number,
      default: -1,
    },
  },
  setup(props) {
    const currentElementComponent = computed(() => {
      const elementTypeMap = {
        [ElementTypes.IMAGE]: BaseImageElement,
        [ElementTypes.TEXT]: BaseTextElement,
        [ElementTypes.SHAPE]: BaseShapeElement,
        [ElementTypes.LINE]: BaseLineElement,
        [ElementTypes.CHART]: ScreenChartElement,
        [ElementTypes.TABLE]: BaseTableElement,
      }
      return elementTypeMap[props.elementInfo.type] || null
    })

    const store = useStore()
    const theme = computed(() => store.state.theme)
    const currentSlide = computed<Slide>(() => store.getters.currentSlide)

    // 判断元素是否需要等待执行入场动画：等待执行的元素需要先隐藏
    const needWaitAnimation = computed(() => {
      const animations = currentSlide.value.animations || []
      const elementIndexInAnimation = animations.findIndex(animation => animation.elId === props.elementInfo.id)
      if (elementIndexInAnimation !== -1 && elementIndexInAnimation >= props.animationIndex) return true
      return false      
    })

    return {
      currentElementComponent,
      needWaitAnimation,
      theme,
    }
  },
})
</script>