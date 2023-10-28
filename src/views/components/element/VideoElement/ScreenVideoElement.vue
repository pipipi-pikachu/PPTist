<template>
  <div class="base-element-video screen-element-video"
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
        <VideoPlayer
          v-if="inCurrentSlide"
          :width="elementInfo.width"
          :height="elementInfo.height"
          :src="elementInfo.src" 
          :poster="elementInfo.poster"  
          :autoplay="elementInfo.autoplay"
          :scale="scale" 
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { PPTVideoElement } from '@/types/slides'
import { injectKeySlideId, injectKeySlideScale } from '@/types/injectKey'

import VideoPlayer from './VideoPlayer/index.vue'

defineProps<{
  elementInfo: PPTVideoElement
}>()

const { currentSlide } = storeToRefs(useSlidesStore())

const scale = inject(injectKeySlideScale) || ref(1)
const slideId = inject(injectKeySlideId) || ref('')

const inCurrentSlide = computed(() => currentSlide.value.id === slideId.value)
</script>

<style lang="scss" scoped>
.screen-element-video {
  position: absolute;
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  width: 100%;
  height: 100%;
}
</style>
