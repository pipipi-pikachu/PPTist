<template>
  <div 
    class="viewport-background"
    :style="backgroundStyle"
  >
    <GridLines v-if="gridLineSize" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { SlideBackground } from '@/types/slides'
import GridLines from './GridLines.vue'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

const { gridLineSize } = storeToRefs(useMainStore())
const { currentSlide } = storeToRefs(useSlidesStore())
const background = computed<SlideBackground | undefined>(() => currentSlide.value?.background)

const { backgroundStyle } = useSlideBackgroundStyle(background)
</script>

<style lang="scss" scoped>
.viewport-background {
  width: 100%;
  height: 100%;
  background-position: center;
  position: absolute;
}
</style>
