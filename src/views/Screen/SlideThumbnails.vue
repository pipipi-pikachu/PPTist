<template>
  <div class="slide-thumbnails">
    <div class="return-button">
      <IconArrowCircleLeft class="icon" @click="emit('close')" />
    </div>
    <div class="slide-thumbnails-content">
      <div 
        class="thumbnail"
        :class="{ 'active': index === slideIndex }"
        v-for="(slide, index) in slides" 
        :key="slide.id"
        @click="turnSlide(index)"
      >
        <ThumbnailSlide :slide="slide" :size="150" :visible="index < slidesLoadLimit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useLoadSlides from '@/hooks/useLoadSlides'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const props = defineProps<{
  turnSlideToIndex: (index: number) => void
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { slides, slideIndex } = storeToRefs(useSlidesStore())

const { slidesLoadLimit } = useLoadSlides()

const turnSlide = (index: number) => {
  props.turnSlideToIndex(index)
  emit('close')
}
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

  @include overflow-overlay();

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