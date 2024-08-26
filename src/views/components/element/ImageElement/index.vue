<template>
  <div 
    class="editable-element-image"
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
      <ImageClipHandler
        v-if="isCliping"
        :src="elementInfo.src"
        :clipData="elementInfo.clip"
        :width="elementInfo.width"
        :height="elementInfo.height"
        :top="elementInfo.top"
        :left="elementInfo.left"
        :rotate="elementInfo.rotate"
        :clipPath="clipShape.style"
        @clip="range => handleClip(range)"
      />
      <div 
        class="element-content"
        v-else
        :style="{
          filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
          transform: flipStyle,
        }"
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)" 
        @touchstart="$event => handleSelectElement($event)" 
      >
        <ImageOutline :elementInfo="elementInfo" />

        <div class="image-content" :style="{ clipPath: clipShape.style }">
          <img 
            :src="elementInfo.src" 
            :draggable="false" 
            :style="{
              top: imgPosition.top,
              left: imgPosition.left,
              width: imgPosition.width,
              height: imgPosition.height,
              filter: filter,
            }" 
            @dragstart.prevent
            alt=""
          />
          <div class="color-mask"
            v-if="elementInfo.colorMask"
            :style="{
              backgroundColor: elementInfo.colorMask,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { ImageElementClip, PPTImageElement } from '@/types/slides'
import type { ImageClipedEmitData } from '@/types/edit'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useElementFlip from '@/views/components/element/hooks/useElementFlip'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useClipImage from './useClipImage'
import useFilter from './useFilter'

import ImageOutline from './ImageOutline/index.vue'
import ImageClipHandler from './ImageClipHandler.vue'

const props = defineProps<{
  elementInfo: PPTImageElement
  selectElement: (e: MouseEvent | TouchEvent, element: PPTImageElement, canMove?: boolean) => void
  contextmenus: () => ContextmenuItem[] | null
}>()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { clipingImageElementId } = storeToRefs(mainStore)

const isCliping = computed(() => clipingImageElementId.value === props.elementInfo.id)

const { addHistorySnapshot } = useHistorySnapshot()

const shadow = computed(() => props.elementInfo.shadow)
const { shadowStyle } = useElementShadow(shadow)

const flipH = computed(() => props.elementInfo.flipH)
const flipV = computed(() => props.elementInfo.flipV)
const { flipStyle } = useElementFlip(flipH, flipV)

const imageElement = computed(() => props.elementInfo)
const { clipShape, imgPosition } = useClipImage(imageElement)

const filters = computed(() => props.elementInfo.filters)
const { filter } = useFilter(filters)

const handleSelectElement = (e: MouseEvent | TouchEvent) => {
  if (props.elementInfo.lock) return
  e.stopPropagation()
  props.selectElement(e, props.elementInfo)
}

const handleClip = (data: ImageClipedEmitData | null) => {
  mainStore.setClipingImageElementId('')
  
  if (!data) return

  const { range, position } = data
  const originClip: ImageElementClip = props.elementInfo.clip || { shape: 'rect', range: [[0, 0], [100, 100]] }

  const left = props.elementInfo.left + position.left
  const top = props.elementInfo.top + position.top
  const width = props.elementInfo.width + position.width
  const height = props.elementInfo.height + position.height

  let centerOffsetX = 0
  let centerOffsetY = 0

  if (props.elementInfo.rotate) {
    const centerX = (left + width / 2) - (props.elementInfo.left + props.elementInfo.width / 2)
    const centerY = -((top + height / 2) - (props.elementInfo.top + props.elementInfo.height / 2))

    const radian = -props.elementInfo.rotate * Math.PI / 180

    const rotatedCenterX = centerX * Math.cos(radian) - centerY * Math.sin(radian)
    const rotatedCenterY = centerX * Math.sin(radian) + centerY * Math.cos(radian)

    centerOffsetX = rotatedCenterX - centerX
    centerOffsetY = -(rotatedCenterY - centerY)
  }

  const _props = {
    clip: { ...originClip, range },
    left: left + centerOffsetX,
    top: top + centerOffsetY,
    width,
    height,
  }
  slidesStore.updateElement({ id: props.elementInfo.id, props: _props })
  
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.editable-element-image {
  position: absolute;

  &.lock .element-content {
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
  position: relative;
  cursor: move;

  .image-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  img {
    position: absolute;
  }
}
.color-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
