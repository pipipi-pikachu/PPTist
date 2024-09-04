<template>
  <div class="screen-slide-list">
    <div 
      :class="[
        'slide-item', 
        `turning-mode-${slide.turningMode}`,
        {
          'current': index === slideIndex,
          'before': index < slideIndex,
          'after': index > slideIndex,
          'hide': (index === slideIndex - 1 || index === slideIndex + 1) && slide.turningMode !== slidesWithTurningMode[slideIndex].turningMode,
        }
      ]"
      v-for="(slide, index) in slidesWithTurningMode" 
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
import { computed, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { injectKeySlideScale } from '@/types/injectKey'
import { SLIDE_ANIMATIONS } from '@/configs/animation'

import ScreenSlide from './ScreenSlide.vue'

const props = defineProps<{
  slideWidth: number
  slideHeight: number
  animationIndex: number
  turnSlideToId: (id: string) => void
  manualExitFullscreen: () => void
}>()

const { slides, slideIndex, viewportSize } = storeToRefs(useSlidesStore())

const slidesWithTurningMode = computed(() => {
  return slides.value.map(slide => {
    let turningMode = slide.turningMode
    if (!turningMode) turningMode = 'slideY'
    if (turningMode === 'random') {
      const turningModeKeys = SLIDE_ANIMATIONS.filter(item => !['random', 'no'].includes(item.value)).map(item => item.value)
      turningMode = turningModeKeys[Math.floor(Math.random() * turningModeKeys.length)]
    }
    return {
      ...slide,
      turningMode,
    }
  })
})

const scale = computed(() => props.slideWidth / viewportSize.value)
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
  &.turning-mode-slideX3D {
    transition: transform .5s;
    &.before {
      transform: translateX(-100%) scale(.5);
    }
    &.after {
      transform: translateX(100%) scale(.5);
    }
  }
  &.turning-mode-slideY3D {
    transition: transform .5s;
    &.before {
      transform: translateY(-100%) scale(.5);
    }
    &.after {
      transform: translateY(100%) scale(.5);
    }
  }
  &.turning-mode-rotate {
    transition: transform .5s;
    transform-origin: 0 0;
    &.before {
      transform: rotate(90deg);
    }
    &.after {
      transform: rotate(-90deg);
    }
  }
  &.turning-mode-scaleY {
    transition: transform .5s;
    &.before {
      transform: scaleY(.1);
    }
    &.after {
      transform: scaleY(.1);
    }
  }
  &.turning-mode-scaleX {
    transition: transform .5s;
    &.before {
      transform: scaleX(.1);
    }
    &.after {
      transform: scaleX(.1);
    }
  }
  &.turning-mode-scale {
    transition: transform .5s;
    &.before {
      transform: scale(.25);
    }
    &.after {
      transform: scale(.25);
    }
  }
  &.turning-mode-scaleReverse {
    transition: transform .5s;
    &.before {
      transform: scale(2);
    }
    &.after {
      transform: scale(2);
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