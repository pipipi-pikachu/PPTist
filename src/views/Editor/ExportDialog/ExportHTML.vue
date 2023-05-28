<template>
  <div class="export-html-dialog">
    <div class="thumbnails-view">
      <div class="thumbnails" ref="htmlThumbnailsRef">
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
        <div class="title">{{t('export.rangeExport')}}：</div>
        <RadioGroup
            class="config-item"
            v-model:value="rangeType"
        >
          <RadioButton style="width: 50%;" value="all">{{t('export.allSlides')}}</RadioButton>
          <RadioButton style="width: 50%;" value="current">{{t('export.currentSlide')}}</RadioButton>
        </RadioGroup>
      </div>
      <div class="row">
        <div class="title">{{t('export.margin')}}：</div>
        <div class="config-item">
          <Switch v-model:checked="padding" />
        </div>
      </div>
    </div>

    <div class="btns">
      <Button class="btn export" type="primary" @click="exportHtml()">{{t('export.html.tab')}}</Button>
      <Button class="btn close" @click="emit('close')">{{t('export.cancelButton')}}</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import {
  Button,
  Select,
  Switch,
  Radio,
} from 'ant-design-vue'
import usei18n from '@/hooks/usei18n'
import { archiveHtml } from '@/utils/archiveHtml'

const {t} = usei18n()
const { Group: RadioGroup, Button: RadioButton } = Radio
const SelectOption = Select.Option
const parser = new DOMParser()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { slides, currentSlide, viewportRatio } = storeToRefs(useSlidesStore())

const htmlThumbnailsRef = ref<HTMLElement>()
const rangeType = ref<'all' | 'current'>('all')
const padding = ref(true)

const exportHtml = () => {
  if (!htmlThumbnailsRef.value) return

  archiveHtml(htmlThumbnailsRef.value)
}
</script>

<style lang="scss" scoped>
.export-html-dialog {
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