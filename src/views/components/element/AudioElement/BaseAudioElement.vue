<template>
  <div class="base-element-audio"
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
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTAudioElement } from '@/types/slides'

export default defineComponent({
  name: 'base-element-audio',
  props: {
    elementInfo: {
      type: Object as PropType<PPTAudioElement>,
      required: true,
    },
  },
  setup(props) {
    const audioIconSize = computed(() => {
      return Math.min(props.elementInfo.width, props.elementInfo.height) + 'px'
    })

    return {
      audioIconSize,
    }
  },
})
</script>

<style lang="scss" scoped>
.base-element-audio {
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
}
.audio-icon {
  cursor: move;
}
</style>
