<template>
  <div class="audio-style-panel">
    <div class="row">
      <div style="width: 40%;">图标颜色：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="handleAudioElement.color"
            @update:modelValue="value => updateAudio({ color: value })"
          />
        </template>
        <ColorButton :color="handleAudioElement.color" />
      </Popover>
    </div>

    <div class="row switch-row">
      <div style="width: 40%;">自动播放：</div>
      <div class="switch-wrapper" style="width: 60%;">
        <Switch 
          :value="handleAudioElement.autoplay" 
          @update:value="value => updateAudio({ autoplay: value })" 
        />
      </div>
    </div>

    <div class="row switch-row">
      <div style="width: 40%;">循环播放：</div>
      <div class="switch-wrapper" style="width: 60%;">
        <Switch 
          :value="handleAudioElement.loop" 
          @update:value="value => updateAudio({ loop: value })" 
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTAudioElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '@/components/ColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Switch from '@/components/Switch.vue'
import Popover from '@/components/Popover.vue'

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const handleAudioElement = handleElement as Ref<PPTAudioElement>

const { addHistorySnapshot } = useHistorySnapshot()

const updateAudio = (props: Partial<PPTAudioElement>) => {
  if (!handleElement.value) return
  slidesStore.updateElement({ id: handleElement.value.id, props })
  addHistorySnapshot()
}
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