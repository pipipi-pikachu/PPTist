<template>
  <div class="bottom-thumbnails">
    <div class="thumbnails"
      ref="thumbnailsRef"
      @wheel.prevent="$event => handleMousewheelThumbnails($event)"
    >
      <div 
        class="thumbnail"
        :class="{ 'active': index === slideIndex }"
        v-for="(slide, index) in slides" 
        :key="slide.id"
        @click="turnSlideToIndex(index)"
      >
        <ThumbnailSlide :slide="slide" :size="100 / viewportRatio" :visible="index < slidesLoadLimit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, useTemplateRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useLoadSlides from '@/hooks/useLoadSlides'
import useExecPlay from './hooks/useExecPlay'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const { slides, slideIndex, viewportRatio } = storeToRefs(useSlidesStore())

const thumbnailsRef = useTemplateRef<HTMLElement>('thumbnailsRef')

const { turnSlideToIndex } = useExecPlay()
const { slidesLoadLimit } = useLoadSlides()

const handleMousewheelThumbnails = (e: WheelEvent) => {
  if (!thumbnailsRef.value) return
  thumbnailsRef.value.scrollBy(e.deltaY, 0)
}

watch(slideIndex, () => {
  nextTick(() => {
    if (!thumbnailsRef.value) return

    const activeThumbnailRef: HTMLElement | null = thumbnailsRef.value.querySelector('.thumbnail.active')
    if (!activeThumbnailRef) return

    const width = thumbnailsRef.value.offsetWidth
    const offsetLeft = activeThumbnailRef.offsetLeft + activeThumbnailRef.clientWidth / 2
    thumbnailsRef.value.scrollTo({ left: offsetLeft - width / 2, behavior: 'smooth' })
  })
})
</script>

<style lang="scss" scoped>
.bottom-thumbnails {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: -120px;
  z-index: 4;
  transition: bottom $transitionDelay;

  &::after {
    content: '';
    width: 100%;
    height: 3px;
    position: absolute;
    left: 0;
    top: -3px;
  }

  &:hover {
    bottom: 0;
    z-index: 20;
  }
}
.thumbnails {
  height: 120px;
  padding: 10px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: rgba($color: #000, $alpha: .75);
  position: relative;
}
.thumbnail {
  display: inline-block;
  outline: 2px solid #aaa;

  & + .thumbnail {
    margin-left: 10px;
  }

  &:hover {
    outline-color: $themeColor;
  }

  &.active {
    outline-width: 3px;
    outline-color: $themeColor;
  }
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>