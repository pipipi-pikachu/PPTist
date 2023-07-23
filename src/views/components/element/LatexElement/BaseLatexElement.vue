<template>
  <div 
    class="base-element-latex"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div class="element-content">
        <svg 
          overflow="visible" 
          :width="elementInfo.width"
          :height="elementInfo.height"
          :stroke="elementInfo.color" 
          :stroke-width="elementInfo.strokeWidth" 
          fill="none" 
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <g 
            :transform="`scale(${elementInfo.width / elementInfo.viewBox[0]}, ${elementInfo.height / elementInfo.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`"
          >
            <path :d="elementInfo.path"></path>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PPTLatexElement } from '@/types/slides'

defineProps<{
  elementInfo: PPTLatexElement
}>()
</script>

<style lang="scss" scoped>
.base-element-latex {
  position: absolute;
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  width: 100%;
  height: 100%;
  position: relative;

  svg {
    transform-origin: 0 0;
    overflow: visible;
  }
}
</style>
