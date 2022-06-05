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
        <FileInput @change="files => insertImageElement(files)">
          <Button style="flex: 1;" @click="insertImageElement()"><IconPicture class="icon" /> 图片</Button>
        </FileInput>
        <Button style="flex: 1;" @click="insertShapeElement('square')"><IconSquare class="icon" /> 矩形</Button>
        <Button style="flex: 1;" @click="insertShapeElement('round')"><IconRound class="icon" /> 圆形</Button>
      </ButtonGroup>
    </div>

    <MobileThumbnails />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useSlideHandler from '@/hooks/useSlideHandler'
import useCreateElement from '@/hooks/useCreateElement'
import { getImageDataURL } from '@/utils/image'
import { ShapePoolItem } from '@/configs/shapes'
import { VIEWPORT_SIZE } from '@/configs/canvas'

import MobileThumbnails from '../MobileThumbnails.vue'

export default defineComponent({
  name: 'slide-toolbar',
  components: {
    MobileThumbnails,
  },
  setup() {
    const slidesStore = useSlidesStore()
    const { viewportRatio, currentSlide } = storeToRefs(slidesStore)

    const { createSlide, copyAndPasteSlide, deleteSlide, } = useSlideHandler()
    const { createTextElement, createImageElement, createShapeElement } = useCreateElement()

    const insertTextElement = () => {
      const width = 400
      const height = 56

      createTextElement({
        left: (VIEWPORT_SIZE - width) / 2,
        top: (VIEWPORT_SIZE * viewportRatio.value - height) / 2,
        width,
        height,
      }, '<p><span style=\"font-size: 24px\">新添加文本</span></p>')
    }

    const insertImageElement = (files: File[]) => {
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
        left: (VIEWPORT_SIZE - size) / 2,
        top: (VIEWPORT_SIZE * viewportRatio.value - size) / 2,
        width: size,
        height: size,
      }, shape[type])
    }

    const remark = computed(() => currentSlide.value?.remark || '')

    const handleInputMark = (e: Event) => {
      const value = (e.target as HTMLTextAreaElement).value
      slidesStore.updateSlide({ remark: value })
    }

    return {
      remark,
      createSlide,
      copyAndPasteSlide,
      deleteSlide,
      insertTextElement,
      insertImageElement,
      insertShapeElement,
      handleInputMark,
    }
  },
})
</script>

<style lang="scss" scoped>
.slide-toolbar {
  height: 230px;
  background-color: #fff;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
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
    background-color: transparent;

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