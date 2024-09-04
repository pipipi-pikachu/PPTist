<template>
  <div class="slide-toolbar">
    <div class="remark">
      <textarea
        :value="remark"
        placeholder="点击输入演讲者备注"
        @input="$event => handleInputMark($event)"
      ></textarea>
    </div>
    <div class="toolbar">
      <ButtonGroup class="row">
        <Button style="flex: 1;" @click="createSlide()"><IconPlus class="icon" /> 新幻灯片</Button>
        <Button style="flex: 1;" @click="copyAndPasteSlide()"><IconCopy class="icon" /> 复制</Button>
        <Button style="flex: 1;" @click="deleteSlide()"><IconDelete class="icon" /> 删除</Button>
      </ButtonGroup>
      <ButtonGroup class="row">
        <Button style="flex: 1;" @click="insertTextElement()"><IconFontSize class="icon" /> 文字</Button>
        <Button style="flex: 1;">
          <FileInput @change="files => insertImageElement(files)">
            <IconPicture class="icon" />图片
          </FileInput>
        </Button>
        <Button style="flex: 1;" @click="insertShapeElement('square')"><IconSquare class="icon" /> 矩形</Button>
        <Button style="flex: 1;" @click="insertShapeElement('round')"><IconRound class="icon" /> 圆形</Button>
      </ButtonGroup>
    </div>

    <MobileThumbnails />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useSlideHandler from '@/hooks/useSlideHandler'
import useCreateElement from '@/hooks/useCreateElement'
import { getImageDataURL } from '@/utils/image'
import type { ShapePoolItem } from '@/configs/shapes'

import MobileThumbnails from '../MobileThumbnails.vue'
import FileInput from '@/components/FileInput.vue'
import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'

const slidesStore = useSlidesStore()
const { viewportRatio, currentSlide, viewportSize } = storeToRefs(slidesStore)

const { createSlide, copyAndPasteSlide, deleteSlide, } = useSlideHandler()
const { createTextElement, createImageElement, createShapeElement } = useCreateElement()

const insertTextElement = () => {
  const width = 400
  const height = 56

  createTextElement({
    left: (viewportSize.value - width) / 2,
    top: (viewportSize.value * viewportRatio.value - height) / 2,
    width,
    height,
  }, { content: '<p>新添加文本</p>' })
}

const insertImageElement = (files: FileList) => {
  if (!files || !files[0]) return
  getImageDataURL(files[0]).then(dataURL => createImageElement(dataURL))
}

const insertShapeElement = (type: 'square' | 'round') => {
  const square: ShapePoolItem = {
    viewBox: [200, 200],
    path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
  }
  const round: ShapePoolItem = {
    viewBox: [200, 200],
    path: 'M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z',
  }
  const shape = { square, round }

  const size = 200

  createShapeElement({
    left: (viewportSize.value - size) / 2,
    top: (viewportSize.value * viewportRatio.value - size) / 2,
    width: size,
    height: size,
  }, shape[type])
}

const remark = computed(() => currentSlide.value?.remark || '')

const handleInputMark = (e: Event) => {
  const value = (e.target as HTMLTextAreaElement).value
  slidesStore.updateSlide({ remark: value })
}
</script>

<style lang="scss" scoped>
.slide-toolbar {
  height: 230px;
  background-color: #fff;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}
.remark {
  position: relative;
  flex: 1;
  border-bottom: 1px solid $borderColor;
  line-height: 1.5;

  textarea {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    resize: none;
    border: 0;
    outline: 0;
    padding: 8px 10px;
    font-size: 12px;
    box-sizing: border-box;

    @include absolute-0();
  }
}
.toolbar {
  height: 90px;
  border-bottom: 1px solid $borderColor;
  padding: 10px;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  .icon {
    margin-right: 3px;
  }
}
</style>