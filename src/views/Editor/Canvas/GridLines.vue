<template>
  <svg class="grid-lines">
    <path 
      :style="{
        transform: `scale(${canvasScale})`,
      }" 
      :d="path" 
      fill="none" 
      :stroke="gridColor" 
      stroke-width="0.3" 
      stroke-dasharray="5"
    ></path>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import tinycolor from 'tinycolor2'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { SlideBackground } from '@/types/slides'

const { canvasScale, gridLineSize } = storeToRefs(useMainStore())
const { currentSlide, viewportRatio, viewportSize } = storeToRefs(useSlidesStore())

const background = computed<SlideBackground | undefined>(() => currentSlide.value?.background)

// 计算网格线的颜色，避免与背景的颜色太接近
const gridColor = computed(() => {
  const bgColor = background.value?.color || '#fff'
  const colorList = ['#000', '#fff']
  return tinycolor.mostReadable(bgColor, colorList, { includeFallbackColors: true }).setAlpha(.5).toRgbString()
})

// 网格路径
const path = computed(() => {
  const maxX = viewportSize.value
  const maxY = viewportSize.value * viewportRatio.value

  let p = ''
  for (let i = 0; i <= Math.floor(maxY / gridLineSize.value); i++) {
    p += `M0 ${i * gridLineSize.value} L${maxX} ${i * gridLineSize.value} `
  }
  for (let i = 0; i <= Math.floor(maxX / gridLineSize.value); i++) {
    p += `M${i * gridLineSize.value} 0 L${i * gridLineSize.value} ${maxY} `
  }
  return p
})
</script>

<style lang="scss" scoped>
.grid-lines {
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 999;
  pointer-events: none;

  @include absolute-0();
}
</style>