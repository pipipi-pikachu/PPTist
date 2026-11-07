<template>
  <div class="slide-animation-panel">
    <div class="animation-pool">
      <button
        type="button"
        class="animation-item" 
        :class="{ 'active': currentTurningMode === item.value }" 
        v-for="item in animations" 
        :key="item.value"
        :aria-pressed="currentTurningMode === item.value"
        @click="updateTurningMode(item.value)"
        @keydown.enter.stop
        @keydown.space.stop
        @keydown.tab.stop
      >
        <span :class="['animation-block', item.value]" :data-label="item.label">{{item.label}}</span>
      </button>
    </div>
    <Button style="width: 100%;" @click="applyAllSlide()"><i-icon-park-outline:check /> {{ t('应用到全部') }}</Button>
  </div>
</template>

<script lang="ts" setup>
import { t } from '@/i18n'

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { TurningMode } from '@/types/slides'
import { SLIDE_ANIMATIONS } from '@/configs/animation'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import message from '@/utils/message'
import Button from '@/components/Button.vue'

const slidesStore = useSlidesStore()
const { slides, currentSlide } = storeToRefs(slidesStore)

const currentTurningMode = computed(() => currentSlide.value.turningMode || 'slideY')

const animations = SLIDE_ANIMATIONS

const { addHistorySnapshot } = useHistorySnapshot()

// 修改播放时的切换页面方式
const updateTurningMode = (mode: TurningMode) => {
  if (mode === currentTurningMode.value) return
  slidesStore.updateSlide({ turningMode: mode })
  addHistorySnapshot()
}

// 将当前页的切换页面方式应用到全部页面
const applyAllSlide = () => {
  const newSlides = slides.value.map(slide => {
    return {
      ...slide,
      turningMode: currentSlide.value.turningMode,
    }
  })
  slidesStore.setSlides(newSlides)
  message.success(t('已应用到全部'))
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.animation-pool {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 10px;
}
.animation-item {
  min-width: 0;
  height: 56px;
  padding: 4px;
  border: 1px solid $borderColor;
  border-radius: $borderRadius;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  position: relative;
  font: inherit;
  font-size: 12px;
  line-height: 1.5;
  color: $textColor;
  text-align: center;
  outline: 0;
  cursor: pointer;
  user-select: none;
  transition: border-color $transitionDelayFast, box-shadow $transitionDelayFast;

  &:hover, &:focus-visible {
    border-color: rgba($color: $themeColor, $alpha: .5);
  }

  &:focus-visible {
    outline: 2px solid rgba($color: $themeColor, $alpha: .3);
    outline-offset: 2px;
  }

  &.active {
    border-color: $themeColor;
    box-shadow: inset 0 0 0 1px $themeColor;

    .animation-block {
      background-color: rgba($color: $themeColor, $alpha: .08);
      color: $themeColor;
    }
  }
}
.animation-block {
  width: 100%;
  height: 100%;
  padding: 4px;
  border-radius: $borderRadius;
  background-color: $lightGray;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  @mixin elAnimation($animationType) {
    content: attr(data-label);
    width: 100%;
    height: 100%;
    padding: 4px;
    position: absolute;
    left: 0;
    top: 0;
    background-color: $themeColor;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    animation: $animationType $transitionDelaySlow linear;
  }

  @each $mode in fade, slideX, slideY, slideX3D, slideY3D, rotate, scaleY, scaleX, scale, scaleReverse, wipeX, wipeY, circle, diamond, slideDiagonal, slideDiagonalReverse, revealX, revealY, flipY, flipX {
    &.#{$mode}::after {
      .animation-item:hover &, .animation-item:focus-visible & {
        @include elAnimation($mode);
      }
    }
  }

  &.rotate::after {
    transform-origin: 0 0;
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes slideX {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes slideY {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes slideX3D {
  0% {
    transform: translateX(100%) scale(.5);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes slideY3D {
  0% {
    transform: translateY(100%) scale(.5);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes rotate {
  0% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(0);
  }
}
@keyframes scaleY {
  0% {
    transform: scaleY(.1);
  }
  100% {
    transform: scaleY(1);
  }
}
@keyframes scaleX {
  0% {
    transform: scaleX(.1);
  }
  100% {
    transform: scaleY(1);
  }
}
@keyframes scale {
  0% {
    transform: scale(.25);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes scaleReverse {
  0% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes wipeX {
  from {
    clip-path: inset(0 0 0 100%);
  }
  to {
    clip-path: inset(0);
  }
}
@keyframes wipeY {
  from {
    clip-path: inset(100% 0 0 0);
  }
  to {
    clip-path: inset(0);
  }
}
@keyframes circle {
  from {
    clip-path: circle(0% at 50% 50%);
  }
  to {
    clip-path: circle(75% at 50% 50%);
  }
}
@keyframes diamond {
  from {
    clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%);
  }
  to {
    clip-path: polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%);
  }
}
@keyframes slideDiagonal {
  from {
    transform: translate(100%, 100%);
  }
  to {
    transform: translate(0, 0);
  }
}
@keyframes slideDiagonalReverse {
  from {
    transform: translate(-100%, 100%);
  }
  to {
    transform: translate(0, 0);
  }
}
@keyframes revealX {
  from {
    clip-path: inset(0 50%);
  }
  to {
    clip-path: inset(0);
  }
}
@keyframes revealY {
  from {
    clip-path: inset(50% 0);
  }
  to {
    clip-path: inset(0);
  }
}
@keyframes flipY {
  from {
    transform: perspective(128px) rotateY(90deg);
    opacity: 0;
  }
  to {
    transform: perspective(128px) rotateY(0deg);
    opacity: 1;
  }
}
@keyframes flipX {
  from {
    transform: perspective(128px) rotateX(-90deg);
    opacity: 0;
  }
  to {
    transform: perspective(128px) rotateX(0deg);
    opacity: 1;
  }
}
</style>