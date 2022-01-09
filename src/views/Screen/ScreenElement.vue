<template>
  <div 
    class="screen-element"
    :class="{ 'link': elementInfo.link }"
    :id="`screen-element-${elementInfo.id}`"
    :style="{
      zIndex: elementIndex,
      color: theme.fontColor,
      fontFamily: theme.fontName,
      visibility: needWaitAnimation ? 'hidden' : 'visible',
    }"
    :title="elementInfo.link?.target || ''"
    @click="openLink()"
  >
    <component
      :is="currentElementComponent"
      :elementInfo="elementInfo"
    ></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { ElementTypes, PPTElement } from '@/types/slides'

import BaseImageElement from '@/views/components/element/ImageElement/BaseImageElement.vue'
import BaseTextElement from '@/views/components/element/TextElement/BaseTextElement.vue'
import BaseShapeElement from '@/views/components/element/ShapeElement/BaseShapeElement.vue'
import BaseLineElement from '@/views/components/element/LineElement/BaseLineElement.vue'
import ScreenChartElement from '@/views/components/element/ChartElement/ScreenChartElement.vue'
import BaseTableElement from '@/views/components/element/TableElement/BaseTableElement.vue'
import BaseLatexElement from '@/views/components/element/LatexElement/BaseLatexElement.vue'
import ScreenVideoElement from '@/views/components/element/VideoElement/ScreenVideoElement.vue'
import ScreenAudioElement from '@/views/components/element/AudioElement/ScreenAudioElement.vue'

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
    turnSlideToId: {
      type: Function as PropType<(id: string) => void>,
      required: true,
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
        [ElementTypes.LATEX]: BaseLatexElement,
        [ElementTypes.VIDEO]: ScreenVideoElement,
        [ElementTypes.AUDIO]: ScreenAudioElement,
      }
      return elementTypeMap[props.elementInfo.type] || null
    })

    const { currentSlide, theme } = storeToRefs(useSlidesStore())

    // 判断元素是否需要等待执行入场动画：等待执行的元素需要先隐藏
    const needWaitAnimation = computed(() => {
      const animations = currentSlide.value.animations || []
      const elementIndexInAnimation = animations.findIndex(animation => animation.elId === props.elementInfo.id)
      if (elementIndexInAnimation !== -1 && elementIndexInAnimation >= props.animationIndex) return true
      return false      
    })

    // 打开元素绑定的超链接
    const openLink = () => {
      const link = props.elementInfo.link
      if (link) {
        if (link.type === 'web') window.open(link.target)
        else if (link.type === 'slide') props.turnSlideToId(link.target)
      }
    }

    return {
      currentElementComponent,
      needWaitAnimation,
      theme,
      openLink,
    }
  },
})
</script>

<style lang="scss" scoped>
.link {
  cursor: pointer;
}
</style>