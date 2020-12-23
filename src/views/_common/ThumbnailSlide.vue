<template>
  <div class="thumbnail-slide"
    :style="{
      width: size + 'px',
      height: size * VIEWPORT_ASPECT_RATIO + 'px',
    }"
  >
    <div 
      class="elements-wrapper"
      :style="{
        width: VIEWPORT_SIZE + 'px',
        height: VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO + 'px',
        transform: `scale(${size / VIEWPORT_SIZE})`,
      }"
    >
      <div class="background" :style="{ ...backgroundStyle }"></div>

      <template v-for="(element, index) in slide.elements" :key="element.elId">
        <BaseElement
          :elementInfo="element"
          :elementIndex="index + 1"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, PropType, defineComponent } from 'vue'
import { Slide } from '@/types/slides'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

import BaseElement from '@/views/_common/_element/BaseElement.vue'

export default defineComponent({
  name: 'thumbnail-slide',
  components: {
    BaseElement,
  },
  props: {
    slide: {
      type: Object as PropType<Slide>,
      required: true,
    },
    size: {
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
.thumbnail-slide {
  background-color: #fff;
  overflow: hidden;
}
.elements-wrapper {
  transform-origin: 0 0;
}
.background {
  background-position: center;
  background-size: cover;
  position: absolute;
}
</style>