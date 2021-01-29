<template>
  <div class="slide-thumbnails">
    <div 
      class="thumbnail"
      :class="{ 'active': index === slideIndex }"
      v-for="(slide, index) in slides" 
      :key="slide.id"
      @click="turnSlideToIndex(index)"
    >
      <ThumbnailSlide :slide="slide" :size="150" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useStore } from '@/store'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

export default defineComponent({
  name: 'slide-thumbnails',
  components: {
    ThumbnailSlide,
  },
  props: {
    turnSlideToIndex: {
      type: Function as PropType<(index: number) => void>,
    },
  },
  setup() {
    const store = useStore()
    const slides = computed(() => store.state.slides)
    const slideIndex = computed(() => store.state.slideIndex)

    return {
      slides,
      slideIndex,
    }
  },
})
</script>

<style lang="scss" scoped>
.slide-thumbnails {
  height: 600px;
  padding: 5px 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: overlay;

  .thumbnail {
    width: 150px;
    margin-bottom: 12px;
    outline: 1px solid rgba($color: $themeColor, $alpha: .1);

    &.active {
      outline-color: $themeColor;
    }

    &:not(:nth-child(6n)) {
      margin-right: 12px;
    }
  }
}
</style>