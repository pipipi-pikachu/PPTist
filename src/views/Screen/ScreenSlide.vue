<template>
  <div 
    class="screen-slide"
    :style="{
      width: VIEWPORT_SIZE + 'px',
      height: VIEWPORT_SIZE * viewportRatio + 'px',
      transform: `scale(${scale})`,
    }"
  >
    <div class="background" :style="{ ...backgroundStyle }"></div>
    <ScreenElement
      v-for="(element, index) in slide.elements"
      :key="element.id"
      :elementInfo="element"
      :elementIndex="index + 1"
      :animationIndex="animationIndex"
    />
  </div>
</template>

<script lang="ts">
import { computed, PropType, defineComponent } from 'vue'
import { useStore } from '@/store'
import { Slide } from '@/types/slides'
import { VIEWPORT_SIZE } from '@/configs/canvas'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

import ScreenElement from './ScreenElement.vue'

export default defineComponent({
  name: 'screen-slide',
  components: {
    ScreenElement,
  },
  props: {
    slide: {
      type: Object as PropType<Slide>,
      required: true,
    },
    scale: {
      type: Number,
      required: true,
    },
    animationIndex: {
      type: Number,
      default: -1,
    },
  },
  setup(props) {
    const store = useStore()
    const viewportRatio = computed(() => store.state.viewportRatio)

    const background = computed(() => props.slide.background)
    const { backgroundStyle } = useSlideBackgroundStyle(background)

    return {
      backgroundStyle,
      VIEWPORT_SIZE,
      viewportRatio,
    }
  },
})
</script>

<style lang="scss" scoped>
.screen-slide {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
}
.background {
  width: 100%;
  height: 100%;
  background-position: center;
  position: absolute;
}
</style>