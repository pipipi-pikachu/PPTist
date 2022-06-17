<template>
  <div class="mobile-thumbnails">
    <div
      class="thumbnail-item"
      v-for="(slide, index) in slides"
      :key="slide.id"
      :class="{ 'active': slideIndex === index }"
      @click="changeSlideIndex(index)"
    >
      <div class="label">{{ index + 1 }}</div>
      <ThumbnailSlide class="thumbnail" :slide="slide" :size="120" :visible="index < slidesLoadLimit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useLoadSlides from '@/hooks/useLoadSlides'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const slidesStore = useSlidesStore()
const { slides, slideIndex } = storeToRefs(slidesStore)

const { slidesLoadLimit } = useLoadSlides()
const changeSlideIndex = (index: number) => {
  slidesStore.updateSlideIndex(index)
}
</script>

<style lang="scss" scoped>
.mobile-thumbnails {
  padding: 10px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
.thumbnail-item {
  position: relative;
  display: inline-block;
  outline: 2px solid #aaa;

  & + .thumbnail-item {
    margin-left: 10px;
  }

  &.active {
    outline-color: $themeColor;

    .label {
      background-color: $themeColor;
    }
  }
  .label {
    min-width: 20px;
    height: 14px;
    line-height: 14px;
    position: absolute;
    right: -1px;
    top: -1px;
    color: #fff;
    background-color: #aaa;
    z-index: 1;
    font-size: 12px;
    text-align: center;
    padding: 0 5px;
  }
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>