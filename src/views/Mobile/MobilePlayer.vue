<template>
  <div class="mobile-player" 
    :style="{
      width: playerSize.width + 'px',
      height: playerSize.height + 'px',
      transform: `rotate(90deg) translateY(-${playerSize.height}px)`,
    }"
  >
    <div 
      class="screen-slide-list" 
      @click="toolVisible = !toolVisible"
      @touchstart="$event => touchStartListener($event)"
      @touchend="$event => touchEndListener($event)"
    >
      <div 
        :class="[
          'slide-item', 
          `turning-mode-${slide.turningMode || 'slideY'}`,
          {
            'current': index === slideIndex,
            'before': index < slideIndex,
            'after': index > slideIndex,
            'hide': (index === slideIndex - 1 || index === slideIndex + 1) && slide.turningMode !== currentSlide.turningMode,
          }
        ]"
        v-for="(slide, index) in slides" 
        :key="slide.id"
      >
        <div 
          class="slide-content" 
          :style="{
            width: slideSize.width + 'px',
            height: slideSize.height + 'px',
          }"
          v-if="Math.abs(slideIndex - index) < 2"
        >
          <ThumbnailSlide 
            :slide="slide" 
            :size="slideSize.width" 
          />
        </div>
      </div>
    </div>

    <template v-if="toolVisible">
      <div class="header">
        <div class="back" @click="changeMode('preview')"><IconLogout /> 退出播放</div>
      </div>
      <MobileThumbnails class="thumbnails" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Mode } from '@/types/mobile'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import MobileThumbnails from './MobileThumbnails.vue'

defineProps<{
  changeMode: (mode: Mode) => void
}>()

const slidesStore = useSlidesStore()
const { slides, slideIndex, currentSlide, viewportRatio } = storeToRefs(slidesStore)

const toolVisible = ref(false)

const playerSize = ref({ width: 0, height: 0 })

onMounted(() => {
  if (slideIndex.value !== 0) slidesStore.updateSlideIndex(0)

  playerSize.value = {
    width: document.body.clientHeight,
    height: document.body.clientWidth,
  }
})

const slideSize = computed(() => {
  const playerRatio = playerSize.value.height / playerSize.value.width

  let slideWidth = 0
  let slideHeight = 0

  if (playerRatio >= viewportRatio.value) {
    slideWidth = playerSize.value.width
    slideHeight = slideWidth * viewportRatio.value
  }
  else {
    slideHeight = playerSize.value.height
    slideWidth = slideHeight / viewportRatio.value
  }

  return {
    width: slideWidth,
    height: slideHeight,
  }
})

const touchInfo = ref<{ x: number; y: number; } | null>(null)
const touchStartListener = (e: TouchEvent) => {
  touchInfo.value = {
    x: e.changedTouches[0].pageX,
    y: e.changedTouches[0].pageY,
  }
}
const touchEndListener = (e: TouchEvent) => {
  if (!touchInfo.value) return

  const offsetY = Math.abs(touchInfo.value.y - e.changedTouches[0].pageY)
  const offsetX = e.changedTouches[0].pageX - touchInfo.value.x

  if ( Math.abs(offsetX) > offsetY && Math.abs(offsetX) > 50 ) {
    touchInfo.value = null

    if (offsetX < 0 && slideIndex.value > 0) slidesStore.updateSlideIndex(slideIndex.value - 1)
    if (offsetX > 0 && slideIndex.value < slides.value.length - 1) slidesStore.updateSlideIndex(slideIndex.value + 1)
  }
}
</script>

<style lang="scss" scoped>
.mobile-player {
  transform-origin: 0 0;
  background-color: #1d1d1d;
  position: relative;
}
.screen-slide-list {
  position: relative;
  width: 100%;
  height: 100%;
}
.slide-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &.current {
    z-index: 2;
  }

  &.hide {
    opacity: 0;
  }

  &.turning-mode-no {
    &.before {
      transform: translateY(-100%);
    }
    &.after {
      transform: translateY(100%);
    }
  }
  &.turning-mode-fade {
    transition: opacity .75s;
    &.before {
      pointer-events: none;
      opacity: 0;
    }
    &.after {
      pointer-events: none;
      opacity: 0;
    }
  }
  &.turning-mode-slideX {
    transition: transform .35s;
    &.before {
      transform: translateX(-100%);
    }
    &.after {
      transform: translateX(100%);
    }
  }
  &.turning-mode-slideY {
    transition: transform .35s;
    &.before {
      transform: translateY(-100%);
    }
    &.after {
      transform: translateY(100%);
    }
  }
}
.slide-content {
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: rgba($color: #1d1d1d, $alpha: .7);
  text-align: right;
  font-size: 13px;
  color: #fff;
  animation: slideInDown .15s;

  .back {
    height: 100%;
  }
}
.thumbnails {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: rgba($color: #1d1d1d, $alpha: .7);
  overflow: auto !important;
  animation: slideInUp .15s;
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes slideInDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>