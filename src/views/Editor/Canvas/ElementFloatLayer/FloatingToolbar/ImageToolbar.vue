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
import { type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTImageElement } from '@/types/slides'
import { getImageDataURL, getImageSize } from '@/utils/image'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import FileInput from '@/components/FileInput.vue'

defineProps<{
  elementInfo: PPTImageElement
  placement: 'top' | 'bottom'
}>()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(mainStore)

const handleImageElement = handleElement as Ref<PPTImageElement>

const { addHistorySnapshot } = useHistorySnapshot()

const clipImage = () => {
  mainStore.setClipingImageElementId(handleElementId.value)
}

const replaceImage = (files: FileList) => {
  const imageFile = files[0]
  const imageElement = handleImageElement.value
  const imageElementId = handleElementId.value
  if (!imageFile || !imageElement || imageElement.type !== 'image' || !imageElementId) return

  getImageDataURL(imageFile).then(dataURL => {
    const originWidth = imageElement.width
    const originHeight = imageElement.height
    const originLeft = imageElement.left
    const originTop = imageElement.top
    const centerX = originLeft + originWidth / 2
    const centerY = originTop + originHeight / 2

    getImageSize(dataURL).then(({ width, height }) => {
      const h = originHeight
      const w = width * (originHeight / height)
      const l = centerX - w / 2
      const t = centerY - h / 2

      slidesStore.removeElementProps({
        id: imageElementId,
        propName: 'clip',
      })
      slidesStore.updateElement({
        id: imageElementId,
        props: { src: dataURL, width: w, height: h, left: l, top: t },
      })
      addHistorySnapshot()
    })
  })
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
