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

<script lang="ts">
import { defineComponent, computed } from 'vue'
import tinycolor from 'tinycolor2'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { VIEWPORT_SIZE } from '@/configs/canvas'
import { SlideBackground } from '@/types/slides'

export default defineComponent({
  name: 'grid-lines',
  setup() {
    const { canvasScale } = storeToRefs(useMainStore())
    const { currentSlide, viewportRatio } = storeToRefs(useSlidesStore())

    const background = computed<SlideBackground | undefined>(() => currentSlide.value?.background)

    // 计算网格线的颜色，避免与背景的颜色太接近
    const gridColor = computed(() => {
      const bgColor = background.value?.color || '#fff'
      const colorList = ['#000', '#fff']
      return tinycolor.mostReadable(bgColor, colorList, { includeFallbackColors: true }).setAlpha(.5).toRgbString()
    })

    const gridSize = 50

    // 计算网格路径
    const getPath = () => {
      const maxX = VIEWPORT_SIZE
      const maxY = VIEWPORT_SIZE * viewportRatio.value

      let path = ''
      for (let i = 0; i <= Math.floor(maxY / gridSize); i++) {
        path += `M0 ${i * gridSize} L${maxX} ${i * gridSize} `
      }
      for (let i = 0; i <= Math.floor(maxX / gridSize); i++) {
        path += `M${i * gridSize} 0 L${i * gridSize} ${maxY} `
      }
      return path
    }

    return {
      canvasScale,
      gridColor,
      width: VIEWPORT_SIZE,
      height: VIEWPORT_SIZE * viewportRatio.value,
      path: getPath(),
    }
  },
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