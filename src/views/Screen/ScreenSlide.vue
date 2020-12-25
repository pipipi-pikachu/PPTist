<template>
  <div 
    class="screen-slide"
    :style="{
      width: VIEWPORT_SIZE + 'px',
      height: VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO + 'px',
      transform: `scale(${scale})`,
    }"
  >
    <div class="background" :style="{ ...backgroundStyle }"></div>
    <BaseElement
      v-for="(element, index) in slide.elements"
      :key="element.id"
      :elementInfo="element"
      :elementIndex="index + 1"
    />
  </div>
</template>

<script lang="ts">
import { computed, PropType, defineComponent } from 'vue'
import { Slide } from '@/types/slides'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

import BaseElement from '@/views/_element/BaseElement.vue'

export default defineComponent({
  name: 'screen-slide',
  components: {
    BaseElement,
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
  },
  setup(props) {
    const background = computed(() => props.slide.background)
    const { backgroundStyle } = useSlideBackgroundStyle(background)

    return {
      backgroundStyle,
      VIEWPORT_SIZE,
      VIEWPORT_ASPECT_RATIO,
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
  background-position: center;
  background-size: cover;
  position: absolute;
}
</style>