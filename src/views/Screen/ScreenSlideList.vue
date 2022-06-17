<template>
  <div class="screen-slide-list">
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
          width: slideWidth + 'px',
          height: slideHeight + 'px',
        }"
        v-if="Math.abs(slideIndex - index) < 2 || slide.animations?.length"
      >
        <ScreenSlide 
          :slide="slide" 
          :scale="scale"
          :animationIndex="animationIndex"
          :turnSlideToId="turnSlideToId"
          :manualExitFullscreen="manualExitFullscreen"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { injectKeySlideScale } from '@/types/injectKey'
import { VIEWPORT_SIZE } from '@/configs/canvas'

import ScreenSlide from './ScreenSlide.vue'

const props = defineProps({
  slideWidth: {
    type: Number,
    required: true,
  },
  slideHeight: {
    type: Number,
    required: true,
  },
  animationIndex: {
    type: Number,
    required: true,
  },
  turnSlideToId: {
    type: Function as PropType<(id: string) => void>,
    required: true,
  },
  manualExitFullscreen: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

const { slides, slideIndex, currentSlide } = storeToRefs(useSlidesStore())

const scale = computed(() => props.slideWidth / VIEWPORT_SIZE)
provide(injectKeySlideScale, scale)
</script>

<style lang="scss" scoped>
.screen-slide-list {
  background: #1d1d1d;
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
</style>