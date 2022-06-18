<template>
  <div class="screen-element-audio"
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
        <IconVolumeNotice 
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
          :autoplay="elementInfo.autoplay"
          :scale="scale"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, PropType, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { PPTAudioElement } from '@/types/slides'
import { injectKeySlideId, injectKeySlideScale } from '@/types/injectKey'
import { VIEWPORT_SIZE } from '@/configs/canvas'

import AudioPlayer from './AudioPlayer.vue'

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTAudioElement>,
    required: true,
  },
})

const { viewportRatio, currentSlide } = storeToRefs(useSlidesStore())

const scale = inject(injectKeySlideScale) || ref(1)
const slideId = inject(injectKeySlideId) || ref('')

const inCurrentSlide = computed(() => currentSlide.value.id === slideId.value)

const audioIconSize = computed(() => {
  return Math.min(props.elementInfo.width, props.elementInfo.height) + 'px'
})
const audioPlayerPosition = computed(() => {
  const canvasWidth = VIEWPORT_SIZE
  const canvasHeight = VIEWPORT_SIZE * viewportRatio.value

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

const audioPlayerRef = ref<typeof AudioPlayer>()
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
