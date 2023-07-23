<template>
  <div class="alignment-line" :style="{ left, top }">
    <div :class="['line', type]" :style="sizeStyle"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { AlignmentLineAxis } from '@/types/edit'

const props = defineProps<{
  type: 'vertical' | 'horizontal'
  axis: AlignmentLineAxis
  length: number
  canvasScale: number
}>()

// 吸附对齐线的位置
const left = computed(() => props.axis.x * props.canvasScale + 'px')
const top = computed(() => props.axis.y * props.canvasScale + 'px')

// 吸附对齐线的长度
const sizeStyle = computed(() => {
  if (props.type === 'vertical') return { height: props.length * props.canvasScale + 'px' }
  return { width: props.length * props.canvasScale + 'px' }
})
</script>

<style lang="scss" scoped>
.alignment-line {
  position: absolute;
  z-index: 100;

  .line {
    width: 0;
    height: 0;
    border: 0 dashed $themeColor;

    &.vertical {
      transform: translateY(-0.5px);
      border-left-width: 1px;
    }
    &.horizontal {
      transform: translateX(-0.5px);
      border-top-width: 1px;
    }
  }
}
</style>