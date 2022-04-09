<template>
  <div class="export-img-dialog">
    <div class="thumbnails-view">
      <div class="thumbnails" ref="imageThumbnailsRef">
        <ThumbnailSlide 
          class="thumbnail" 
          v-for="slide in slides" 
          :key="slide.id" 
          :slide="slide" 
          :size="1600" 
        />
      </div>
    </div>
    <div class="configs">
      <div class="row">
        <div class="title">导出格式：</div>
        <RadioGroup
          class="config-item"
          v-model:value="format"
        >
          <RadioButton value="jpeg">JPEG</RadioButton>
          <RadioButton value="png">PNG</RadioButton>
        </RadioGroup>
      </div>

      <div class="row">
        <div class="title">图片质量：</div>
        <Slider
          class="config-item"
          :min="0"
          :max="1"
          :step="0.1"
          v-model:value="quality"
        />
      </div>

      <div class="row">
        <div class="title">忽略在线字体：</div>
        <div class="config-item">
          <Switch v-model:checked="ignoreWebfont" />
        </div>
      </div>

      <div class="tip">
        提示：导出时默认会忽略在线字体，若您在幻灯片中使用了在线字体，且不希望导出图片中丢失相关样式，可以选择关闭【忽略在线字体】选项，但要注意，这将会导致导出用时大幅度增加。
      </div>

      <div class="btns">
        <Button class="btn export" type="primary" @click="expImage()">导出图片</Button>
        <Button class="btn close" @click="close()">关闭</Button>
      </div>
    </div>

    <FullscreenSpin :loading="exporting" tip="正在导出..." />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useExport from '@/hooks/useExport'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

export default defineComponent({
  name: 'export-img-dialog',
  components: {
    ThumbnailSlide,
  },
  setup(props, { emit }) {
    const { slides } = storeToRefs(useSlidesStore())

    const imageThumbnailsRef = ref<HTMLElement>()
    const format = ref<'jpeg' | 'png'>('jpeg')
    const quality = ref(1)
    const ignoreWebfont = ref(true)

    const close = () => emit('close')

    const { exportImage, exporting } = useExport()

    const expImage = () => {
      if (!imageThumbnailsRef.value) return
      exportImage(imageThumbnailsRef.value, format.value, quality.value, ignoreWebfont.value)
    }
    
    return {
      imageThumbnailsRef,
      slides,
      format,
      quality,
      ignoreWebfont,
      exporting,
      expImage,
      close,
    }
  },
})
</script>

<style lang="scss" scoped>
.export-img-dialog {
  height: 500px;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.thumbnails-view {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }
}
.configs {
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
  }

  .title {
    width: 100px;
  }
  .config-item {
    flex: 1;
  }

  .tip {
    font-size: 12px;
    color: #aaa;
    line-height: 1.8;
  }

  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;

    .export {
      flex: 1;
    }
    .close {
      width: 100px;
      margin-left: 10px;
    }
  }
}
</style>