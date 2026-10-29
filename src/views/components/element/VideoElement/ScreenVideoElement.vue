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
          :autoplay="elementInfo.autoplay && !hasEntranceAnimation"
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

const props = defineProps<{
  elementInfo: PPTVideoElement
}>()

const { currentSlide } = storeToRefs(useSlidesStore())

const scale = inject(injectKeySlideScale) || ref(1)
const slideId = inject(injectKeySlideId) || ref('')

const inCurrentSlide = computed(() => currentSlide.value.id === slideId.value)

// 元素设置了“自动播放”且设有入场动画时，若元素仍处于入场动画前的隐藏状态则先不触发原生 autoplay；
// 元素已可见（入场动画已执行完毕，如切回已播放页面）时则不再抑制，正常自动播放。
const hasEntranceAnimation = computed(() => {
  if (!currentSlide.value?.animations) return false
  const hasInAnimation = currentSlide.value.animations.some(item => item.elId === props.elementInfo.id && item.type === 'in')
  if (!hasInAnimation) return false
  const el = document.querySelector(`#screen-element-${props.elementInfo.id}`)
  if (el && getComputedStyle(el).visibility === 'visible') return false
  return true
})
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
