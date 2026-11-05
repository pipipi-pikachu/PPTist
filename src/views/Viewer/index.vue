<template>
  <div class="pptist-viewer">
    <div class="viewer-header">
      <div class="title" :title="title">{{ title }}</div>
      <Button class="screening-btn" type="primary" @click="enterScreeningFromStart()">
        <i-icon-park-outline:ppt class="icon" /> 放映
      </Button>
    </div>
    <div class="viewer-body" ref="bodyRef">
      <div class="slide-item" v-for="(slide, index) in slides" :key="slide.id">
        <div class="slide-index">{{ index + 1 }}</div>
        <ThumbnailSlide class="slide-thumbnail" :slide="slide" :size="slideWidth" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useScreening from '@/hooks/useScreening'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import Button from '@/components/Button.vue'

const { title, slides } = storeToRefs(useSlidesStore())
const { enterScreeningFromStart } = useScreening()

const bodyRef = useTemplateRef<HTMLElement>('bodyRef')
const slideWidth = ref(960)

const updateSlideWidth = () => {
  if (!bodyRef.value) return
  slideWidth.value = Math.min(bodyRef.value.clientWidth - 48, 1200)
}

let observer: ResizeObserver | null = null
onMounted(() => {
  updateSlideWidth()
  if (bodyRef.value) {
    observer = new ResizeObserver(updateSlideWidth)
    observer.observe(bodyRef.value)
  }
})
onUnmounted(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
.pptist-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
.viewer-header {
  height: 48px;
  flex-shrink: 0;
  background-color: #fff;
  border-bottom: 1px solid $borderColor;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  .title {
    font-size: 14px;
    font-weight: 700;
    @include ellipsis-oneline();
  }
  .screening-btn {
    flex-shrink: 0;
    margin-left: 16px;

    .icon {
      margin-right: 4px;
    }
  }
}
.viewer-body {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}
.slide-item {
  flex-shrink: 0;

  & + .slide-item {
    margin-top: 24px;
  }
  .slide-index {
    font-size: 12px;
    color: #999;
    margin-bottom: 6px;
  }
  .slide-thumbnail {
    box-shadow: 0 2px 12px rgba(0, 0, 0, .12);
  }
}
</style>
