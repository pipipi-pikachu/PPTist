<template>
  <div class="toolbar-content">
    <button class="toolbar-btn" @click="clipImage()">
      <i-icon-park-outline:tailoring class="icon" />
      <span>裁剪</span>
    </button>
    <FileInput @change="files => replaceImage(files)">
      <button class="toolbar-btn">
        <i-icon-park-outline:transform class="icon" />
        <span>替换</span>
      </button>
    </FileInput>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import type { PPTImageElement } from '@/types/slides'
import useImageHandler from '@/hooks/useImageHandler'

import FileInput from '@/components/FileInput.vue'

defineProps<{
  elementInfo: PPTImageElement
}>()

const mainStore = useMainStore()
const { handleElementId } = storeToRefs(mainStore)
const { replaceImage } = useImageHandler()

const clipImage = () => {
  mainStore.setClipingImageElementId(handleElementId.value)
}

</script>

<style lang="scss" scoped>
.toolbar-content {
  width: max-content;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  gap: 4px;
}
.toolbar-btn {
  min-width: 30px;
  height: 30px;
  flex-shrink: 0;
  padding: 0 5px;
  border: 0;
  color: $textColor;
  background-color: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  border-radius: $borderRadius;
  cursor: pointer;

  &:hover {
    background-color: $lightGray;
  }

  .icon {
    flex-shrink: 0;
    font-size: 16px;
  }
  span {
    flex-shrink: 0;
    font-size: 12px;
    margin-left: 5px;
  }
}
</style>
