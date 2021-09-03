<template>
  <div class="base-element-video"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div class="element-content" :style="{ backgroundImage: `url(${elementInfo.poster})` }">
      <IconPlayOne class="icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PPTTableElement } from '@/types/slides'

export default defineComponent({
  name: 'base-element-video',
  props: {
    elementInfo: {
      type: Object as PropType<PPTTableElement>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.base-element-video {
  position: absolute;
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
