<template>
  <div class="video-style-panel">
    <div class="title">视频预览封面</div>
    <div class="background-image-wrapper">
      <FileInput @change="files => setVideoPoster(files)">
        <div class="background-image">
          <div class="content" :style="{ backgroundImage: handleVideoElement.poster ? `url(${handleVideoElement.poster})` : '' }">
            <IconPlus />
          </div>
        </div>
      </FileInput>
    </div>
    <div class="row">
      <Button style="flex: 1;" @click="updateVideo({ poster: '' })">重置封面</Button>
    </div>

    <div class="row switch-row">
      <div style="width: 40%;">自动播放：</div>
      <div class="switch-wrapper" style="width: 60%;">
        <Switch 
          :value="handleVideoElement.autoplay" 
          @update:value="value => updateVideo({ autoplay: value })" 
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTVideoElement } from '@/types/slides'
import { getImageDataURL } from '@/utils/image'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import FileInput from '@/components/FileInput.vue'
import Button from '@/components/Button.vue'
import Switch from '@/components/Switch.vue'

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const handleVideoElement = handleElement as Ref<PPTVideoElement>

const { addHistorySnapshot } = useHistorySnapshot()

const updateVideo = (props: Partial<PPTVideoElement>) => {
  if (!handleElement.value) return
  slidesStore.updateElement({ id: handleElement.value.id, props })
  addHistorySnapshot()
}

// 设置视频预览封面
const setVideoPoster = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => updateVideo({ poster: dataURL }))
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.title {
  margin-bottom: 10px;
}
.background-image-wrapper {
  margin-bottom: 10px;
}
.background-image {
  height: 0;
  padding-bottom: 56.25%;
  border: 1px dashed $borderColor;
  border-radius: $borderRadius;
  position: relative;
  transition: all $transitionDelay;

  &:hover {
    border-color: $themeColor;
    color: $themeColor;
  }

  .content {
    @include absolute-0();

    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}
.switch-row {
  height: 32px;
}
.switch-wrapper {
  text-align: right;
}
</style>