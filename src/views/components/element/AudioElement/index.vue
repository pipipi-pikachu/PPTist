<template>
  <div class="editable-element-audio"
    :class="{ 'lock': elementInfo.lock }"
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
      <div 
        class="element-content" 
        v-contextmenu="contextmenus" 
        @mousedown="$event => handleSelectElement($event)"
        @touchstart="$event => handleSelectElement($event)"
      >
        <IconVolumeNotice 
          class="audio-icon" 
          :style="{
            fontSize: audioIconSize,
            color: elementInfo.color,
          }"
        />
        <AudioPlayer
          class="audio-player"
          v-if="handleElementId === elementInfo.id"
          :style="{ ...audioPlayerPosition }"
          :src="elementInfo.src" 
          :loop="elementInfo.loop"
          :scale="canvasScale"
          @mousedown.stop=""
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTAudioElement } from '@/types/slides'
import type { ContextmenuItem } from '@/components/Contextmenu/types'

import AudioPlayer from './AudioPlayer.vue'

const props = defineProps<{
  elementInfo: PPTAudioElement
  selectElement: (e: MouseEvent | TouchEvent, element: PPTAudioElement, canMove?: boolean) => void
  contextmenus: () => ContextmenuItem[] | null
}>()

const { canvasScale, handleElementId } = storeToRefs(useMainStore())
const { viewportRatio, viewportSize } = storeToRefs(useSlidesStore())

const audioIconSize = computed(() => {
  return Math.min(props.elementInfo.width, props.elementInfo.height) + 'px'
})
const audioPlayerPosition = computed(() => {
  const canvasWidth = viewportSize.value
  const canvasHeight = viewportSize.value * viewportRatio.value

  const audioWidth = 280 / canvasScale.value
  const audioHeight = 50 / canvasScale.value

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

const handleSelectElement = (e: MouseEvent | TouchEvent) => {
  if (props.elementInfo.lock) return
  e.stopPropagation()

  props.selectElement(e, props.elementInfo)
}
</script>

<style lang="scss" scoped>
.editable-element-audio {
  position: absolute;

  &.lock .audio-icon {
    cursor: default;
  }
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
}
.audio-icon {
  cursor: move;
}
.audio-player {
  position: absolute;
}
</style>
