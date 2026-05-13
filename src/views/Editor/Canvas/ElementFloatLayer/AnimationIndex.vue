<template>
  <div class="animation-index" :style="animationIndexStyle">
    <div class="index-item" v-for="index in indexList" :key="index">{{index + 1}}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import type { getElementRange } from '@/utils/element'

const props = defineProps<{
  elementInfo: PPTElement
  range: ReturnType<typeof getElementRange>
  indexList: number[]
}>()

const { canvasScale } = storeToRefs(useMainStore())

const animationIndexStyle = computed(() => {
  const { minX, minY } = props.range
  return {
    left: minX * canvasScale.value - 24 + 'px',
    top: minY * canvasScale.value + 'px',
  }
})
</script>

<style lang="scss" scoped>
.animation-index {
  position: absolute;
  font-size: 12px;

  .index-item {
    width: 18px;
    height: 18px;
    background-color: #fff;
    color: $themeColor;
    border: 1px solid $themeColor;
    display: flex;
    justify-content: center;
    align-items: center;

    & + .index-item {
      margin-top: 5px;
    }
  }
}
</style>
