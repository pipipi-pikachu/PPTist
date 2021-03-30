<template>
  <div class="slide-thumbnails">
    <div class="return-button">
      <IconArrowCircleLeft class="icon" @click="close()" />
    </div>
    <div class="slide-thumbnails-content">
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
  setup(props, { emit }) {
    const store = useStore()
    const slides = computed(() => store.state.slides)
    const slideIndex = computed(() => store.state.slideIndex)

    const close = () => emit('close')

    return {
      slides,
      slideIndex,
      close,
    }
  },
})
</script>

<style lang="scss" scoped>
.slide-thumbnails {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1a1a1a;
  z-index: 99;
}
.return-button {
  height: 60px;
  padding: 20px 30px 0;

  .icon {
    color: #fff;
    font-size: 36px;
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }
  }
}
.slide-thumbnails-content {
  height: calc(100% - 100px);
  padding: 20px 30px 30px 30px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: auto;
  overflow: overlay;

  .thumbnail {
    width: 150px;
    outline: 2px solid #aaa;
    margin-right: 12px;
    margin-bottom: 12px;

    &:hover {
      outline-color: $themeColor;
    }

    &.active {
      outline-width: 3px;
      outline-color: $themeColor;
    }
  }
}
</style>