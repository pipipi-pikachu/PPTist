<template>
  <div 
    class="screen-element"
    :style="{
      zIndex: elementIndex,
      visibility: needWaitAnimation ? 'hidden' : 'visible',
    }"
  >
    <component
      :is="currentElementComponent"
      :elementInfo="elementInfo"
      target="screen"
    ></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { ElementTypes, PPTElement, Slide } from '@/types/slides'

import BaseImageElement from '@/views/components/element/ImageElement/BaseImageElement.vue'
import BaseTextElement from '@/views/components/element/TextElement/BaseTextElement.vue'
import BaseShapeElement from '@/views/components/element/ShapeElement/BaseShapeElement.vue'
import BaseLineElement from '@/views/components/element/LineElement/BaseLineElement.vue'
import BaseChartElement from '@/views/components/element/ChartElement/BaseChartElement.vue'

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
        [ElementTypes.CHART]: BaseChartElement,
      }
      return elementTypeMap[props.elementInfo.type] || null
    })

    const store = useStore<State>()
    const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

    const needWaitAnimation = computed(() => {
      const animations = currentSlide.value.animations || []
      const elementIndexInAnimation = animations.findIndex(animation => animation.elId === props.elementInfo.id)
      if(elementIndexInAnimation !== -1 && elementIndexInAnimation >= props.animationIndex) return true
      return false      
    })

    return {
      currentElementComponent,
      needWaitAnimation,
    }
  },
})
</script>