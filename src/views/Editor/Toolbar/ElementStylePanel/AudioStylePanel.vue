<template>
  <div class="audio-style-panel">
    <div class="row">
      <div style="flex: 2;">图标颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="handleElement.color"
            @update:modelValue="value => updateAudio({ color: value })"
          />
        </template>
        <ColorButton :color="handleElement.color" style="flex: 3;" />
      </Popover>
    </div>

    <div class="row switch-row">
      <div style="flex: 2;">自动播放：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch 
          :checked="handleElement.autoplay" 
          @change="checked => updateAudio({ autoplay: checked })" 
        />
      </div>
    </div>

    <div class="row switch-row">
      <div style="flex: 2;">循环播放：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch 
          :checked="handleElement.loop" 
          @change="checked => updateAudio({ loop: checked })" 
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTAudioElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '../common/ColorButton.vue'

export default defineComponent({
  name: 'audio-style-panel',
  components: {
    ColorButton,
  },
  setup() {
    const slidesStore = useSlidesStore()
    const { handleElement } = storeToRefs(useMainStore())

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateAudio = (props: Partial<PPTAudioElement>) => {
      if (!handleElement.value) return
      slidesStore.updateElement({ id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
      handleElement,
      updateAudio,
    }
  }
})
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.switch-row {
  height: 32px;
}
.switch-wrapper {
  text-align: right;
}
</style>