<template>
  <div class="audio-style-panel">
    <div class="row">
      <div style="flex: 2;">图标颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="handleAudioElement.color"
            @update:modelValue="value => updateAudio({ color: value })"
          />
        </template>
        <ColorButton :color="handleAudioElement.color" style="flex: 3;" />
      </Popover>
    </div>

    <div class="row switch-row">
      <div style="flex: 2;">自动播放：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch 
          :checked="handleAudioElement.autoplay" 
          @change="checked => updateAudio({ autoplay: checked as boolean })" 
        />
      </div>
    </div>

    <div class="row switch-row">
      <div style="flex: 2;">循环播放：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch 
          :checked="handleAudioElement.loop" 
          @change="checked => updateAudio({ loop: checked as boolean })" 
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTAudioElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '../common/ColorButton.vue'

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