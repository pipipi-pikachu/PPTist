<template>
  <div class="base-element-audio screen-element-audio"
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
        <i-icon-park-outline:volume-notice 
          class="audio-icon" 
          :style="{
            fontSize: audioIconSize,
            color: elementInfo.color,
          }"
          @click="toggle()"
        />
        <AudioPlayer
          class="audio-player"
          ref="audioPlayerRef"
          v-if="inCurrentSlide"
          :style="{ ...audioPlayerPosition }"
          :src="elementInfo.src"
          :loop="elementInfo.loop"
          :autoplay="elementInfo.autoplay && !hasEntranceAnimation"
          :scale="scale"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { PPTAudioElement } from '@/types/slides'
import { injectKeySlideId, injectKeySlideScale } from '@/types/injectKey'

import AudioPlayer from './AudioPlayer.vue'

const props = defineProps<{
  elementInfo: PPTAudioElement
}>()

const { viewportRatio, currentSlide, viewportSize } = storeToRefs(useSlidesStore())

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

const audioIconSize = computed(() => {
  return Math.min(props.elementInfo.width, props.elementInfo.height) + 'px'
})
const audioPlayerPosition = computed(() => {
  const canvasWidth = viewportSize.value
  const canvasHeight = viewportSize.value * viewportRatio.value

  const audioWidth = 280 / scale.value
  const audioHeight = 50 / scale.value

  const elWidth = props.elementInfo.width
  const elHeight = props.elementInfo.height
  const elLeft = props.elementInfo.left
  const elTop = props.elementInfo.top

  let left = 0
  let top = elHeight
  
  if (elLeft + audioWidth >= canvasWidth) left = elWidth - audioWidth
  if (elTop + elHeight + audioHeight >= canvasHeight) top = -audioHeight

  return {
    left: left + 'px',
    top: top + 'px',
  }
})

const audioPlayerRef = useTemplateRef<InstanceType<typeof AudioPlayer>>('audioPlayerRef')
const toggle = () => {
  if (!audioPlayerRef.value) return
  audioPlayerRef.value.toggle()
}
</script>

<style lang="scss" scoped>
.screen-element-audio {
  position: absolute;
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    .audio-player {
      display: block;
    }
  }
}
.audio-icon {
  cursor: pointer;
}
.audio-player {
  position: absolute;
  display: none;
}
</style>
