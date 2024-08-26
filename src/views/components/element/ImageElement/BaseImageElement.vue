<template>
  <div 
    class="base-element-image"
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
        :style="{
          filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
          transform: flipStyle,
        }"
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
import type { PPTImageElement } from '@/types/slides'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useElementFlip from '@/views/components/element/hooks/useElementFlip'
import useClipImage from './useClipImage'
import useFilter from './useFilter'

import ImageOutline from './ImageOutline/index.vue'

const props = defineProps<{
  elementInfo: PPTImageElement
}>()

const shadow = computed(() => props.elementInfo.shadow)
const { shadowStyle } = useElementShadow(shadow)

const flipH = computed(() => props.elementInfo.flipH)
const flipV = computed(() => props.elementInfo.flipV)
const { flipStyle } = useElementFlip(flipH, flipV)

const imageElement = computed(() => props.elementInfo)
const { clipShape, imgPosition } = useClipImage(imageElement)

const filters = computed(() => props.elementInfo.filters)
const { filter } = useFilter(filters)
</script>

<style lang="scss" scoped>
.base-element-image {
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
