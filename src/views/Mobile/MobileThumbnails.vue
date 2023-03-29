<template>
  <div class="mobile-thumbnails">
    <Draggable 
      class="thumbnail-list"
      :modelValue="slides"
      :animation="200"
      :scroll="true"
      :scrollSensitivity="50"
      :delayOnTouchOnly="true"
      :delay="800"
      itemKey="id"
      @end="handleDragEnd"
    >
      <template #item="{ element, index }">
        <div
          class="thumbnail-item"
          :class="{ 'active': slideIndex === index }"
          @click="changeSlideIndex(index)"
        >
          <div class="label">{{ index + 1 }}</div>
          <ThumbnailSlide class="thumbnail" :slide="element" :size="120" :visible="index < slidesLoadLimit" />
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useLoadSlides from '@/hooks/useLoadSlides'
import useSlideHandler from '@/hooks/useSlideHandler'

import Draggable from 'vuedraggable'
import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const slidesStore = useSlidesStore()
const { slides, slideIndex } = storeToRefs(slidesStore)

const { sortSlides } = useSlideHandler()

const { slidesLoadLimit } = useLoadSlides()
const changeSlideIndex = (index: number) => {
  slidesStore.updateSlideIndex(index)
}

// 拖拽调整顺序后进行数据的同步
const handleDragEnd = (eventData: { newIndex: number; oldIndex: number }) => {
  const { newIndex, oldIndex } = eventData
  if (newIndex === undefined || oldIndex === undefined || newIndex === oldIndex) return
  sortSlides(newIndex, oldIndex)
}
</script>

<style lang="scss" scoped>
.mobile-thumbnails {
  padding: 10px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
.thumbnail-item {
  position: relative;
  display: inline-block;
  outline: 2px solid #aaa;

  & + .thumbnail-item {
    margin-left: 10px;
  }

  &.active {
    outline-color: $themeColor;

    .label {
      background-color: $themeColor;
    }
  }
  .label {
    min-width: 20px;
    height: 14px;
    line-height: 14px;
    position: absolute;
    right: -1px;
    top: -1px;
    color: #fff;
    background-color: #aaa;
    z-index: 1;
    font-size: 12px;
    text-align: center;
    padding: 0 5px;
  }
}
.sortable-chosen {
  top: -5px;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>