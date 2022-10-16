<template>
  <div class="export-pdf-dialog">
    <div class="thumbnails-view">
      <div class="thumbnails" ref="pdfThumbnailsRef">
        <ThumbnailSlide 
          class="thumbnail" 
          :slide="currentSlide" 
          :size="1600" 
          v-if="rangeType === 'current'"
        />
        <template v-else>
          <ThumbnailSlide 
            class="thumbnail" 
            :class="{ 'break-page': (index + 1) % count === 0 }"
            v-for="(slide, index) in slides" 
            :key="slide.id" 
            :slide="slide" 
            :size="1600" 
          />
        </template>
      </div>
    </div>
    <div class="configs">
      <div class="row">
        <div class="title">导出范围：</div>
        <RadioGroup
          class="config-item"
          v-model:value="rangeType"
        >
          <RadioButton style="width: 50%;" value="all">全部幻灯片</RadioButton>
          <RadioButton style="width: 50%;" value="current">当前幻灯片</RadioButton>
        </RadioGroup>
      </div>
      <div class="row">
        <div class="title">每页数量：</div>
        <Select 
          class="config-item"
          v-model:value="count"
        >
          <SelectOption :value="1">1</SelectOption>
          <SelectOption :value="2">2</SelectOption>
          <SelectOption :value="3">3</SelectOption>
        </Select>
      </div>
      <div class="row">
        <div class="title">边缘留白：</div>
        <div class="config-item">
          <Switch v-model:checked="padding" />
        </div>
      </div>
      <div class="tip">
        注意：若打印预览与实际样式不一致，请在弹出的打印窗口中勾选【背景图形】选项。
      </div>
    </div>

    <div class="btns">
      <Button class="btn export" type="primary" @click="expPDF()">打印 / 导出 PDF</Button>
      <Button class="btn close" @click="emit('close')">关闭</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { print } from '@/utils/print'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { slides, currentSlide, viewportRatio } = storeToRefs(useSlidesStore())

const pdfThumbnailsRef = ref<HTMLElement>()
const rangeType = ref<'all' | 'current'>('all')
const count = ref(1)
const padding = ref(true)

const expPDF = () => {
  if (!pdfThumbnailsRef.value) return
  const pageSize = {
    width: 1600,
    height: rangeType.value === 'all' ? 1600 * viewportRatio.value * count.value : 1600 * viewportRatio.value,
    margin: padding.value ? 50 : 0,
  }
  print(pdfThumbnailsRef.value, pageSize)
}
</script>

<style lang="scss" scoped>
.export-pdf-dialog {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.thumbnails-view {
  @include absolute-0();

  &::after {
    content: '';
    background-color: #fff;
    @include absolute-0();
  }
}
.thumbnail {
  &.break-page {
    break-after: page;
  }
}
.configs {
  width: 300px;
  height: calc(100% - 100px);
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
    margin-top: 25px;
  }
}
.btns {
  width: 300px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  .export {
    flex: 1;
  }
  .close {
    width: 100px;
    margin-left: 10px;
  }
}
</style>