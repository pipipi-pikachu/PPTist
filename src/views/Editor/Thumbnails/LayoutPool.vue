<template>
  <div class="layout-pool">
    <div class="header">页面模板</div>
    <div class="list">
      <div 
        class="layout-item"
        v-for="slide in layouts" 
        :key="slide.id"
      >
        <ThumbnailSlide class="thumbnail" :slide="slide" :size="180" />

        <div class="btns">
          <Button class="btn" type="primary" size="small" @click="insertTemplate(slide)">插入模板</Button>
        </div>
      </div>
    </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import Button from '@/components/Button.vue'

const emit = defineEmits<{
  (event: 'select', payload: Slide): void
}>()

const slidesStore = useSlidesStore()
const { layouts } = storeToRefs(slidesStore)

const insertTemplate = (slide: Slide) => {
  emit('select', slide)
}
</script>

<style lang="scss" scoped>
.layout-pool {
  width: 382px;
  height: 500px;
}
.header {
  height: 40px;
  margin: -10px -10px 10px;
  padding: 10px 12px 0;
  background-color: $lightGray;
  border-bottom: 1px solid $borderColor;
}
.list {
  height: calc(100% - 50px);
  padding: 2px;
  margin-right: -10px;
  padding-right: 10px;
  overflow: auto;
  @include flex-grid-layout();
}
.layout-item {
  position: relative;
  @include flex-grid-layout-children(2, 48%);

  &:nth-last-child(2), &:last-child {
    margin-bottom: 0;
  }

  &:hover .btns {
    opacity: 1;
  }

  &:hover .thumbnail {
    outline-color: $themeColor;
  }

  .btns {
    @include absolute-0();

    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    background-color: rgba($color: #000, $alpha: .25);
    opacity: 0;
    transition: opacity $transitionDelay;
  }

  .thumbnail {
    outline: 2px solid $borderColor;
    transition: outline $transitionDelay;
    border-radius: $borderRadius;
    cursor: pointer;
  }
}
</style>