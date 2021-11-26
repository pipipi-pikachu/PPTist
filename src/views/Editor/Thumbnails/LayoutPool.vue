<template>
  <div class="layout-pool">
    <div 
      class="layout-item"
      v-for="slide in layouts" 
      :key="slide.id"
      @click="selectSlideTemplate(slide)"
    >
      <ThumbnailSlide class="thumbnail" :slide="slide" :size="180" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { Slide } from '@/types/slides'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

export default defineComponent({
  name: 'layout-pool',
  emits: ['select'],
  components: {
    ThumbnailSlide,
  },
  setup(props, { emit }) {
    const { layouts } = storeToRefs(useSlidesStore())

    const selectSlideTemplate = (slide: Slide) => {
      emit('select', slide)
    }

    return {
      layouts,
      selectSlideTemplate,
    }
  },
})
</script>

<style lang="scss" scoped>
.layout-pool {
  width: 394px;
  height: 500px;
  padding: 2px;
  margin-right: -12px;
  padding-right: 12px;
  overflow: auto;

  @include flex-grid-layout();
}
.layout-item {
  @include flex-grid-layout-children(2, 48%);

  .thumbnail {
    outline: 1px solid $borderColor;
    cursor: pointer;

    &:hover {
      outline-color: $themeColor;
    }
  }
}
</style>