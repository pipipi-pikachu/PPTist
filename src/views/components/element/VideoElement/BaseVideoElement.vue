<template>
  <div class="base-element-video"
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
      <div class="element-content" :style="{ backgroundImage: elementInfo.poster ? `url(${elementInfo.poster})` : '' }">
        <IconPlayOne class="icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PPTVideoElement } from '@/types/slides'

defineProps<{
  elementInfo: PPTVideoElement
}>()
</script>

<style lang="scss" scoped>
.base-element-video {
  position: absolute;
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  width: 100%;
  height: 100%;
  background-color: #000;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon {
  font-size: 140px;
  color: #aaa;
}
</style>
