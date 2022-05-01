<template>
  <div class="mobile" ref="mobileRef">
    <Alert
      class="tip"
      message="注意"
      description="移动设备下仅支持预览，请在PC上进行编辑"
      type="warning"
      closable
      show-icon
    />
    <div class="thumbnail-list">
      <div class="thumbnail-item" v-for="(slide, index) in slides" :key="slide.id">
        <ThumbnailSlide 
          :slide="slide" 
          :size="slideWidth" 
          :visible="index < slidesLoadLimit" 
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useLoadSlides from '@/hooks/useLoadSlides'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

export default defineComponent({
  name: 'thumbnails',
  components: {
    ThumbnailSlide,
  },
  setup() {
    const { slides } = storeToRefs(useSlidesStore())

    const { slidesLoadLimit } = useLoadSlides()

    const mobileRef = ref<HTMLElement>()
    const slideWidth = ref(0)

    onMounted(() => {
      if (!mobileRef.value) return
      slideWidth.value = mobileRef.value.clientWidth - 10
    })

    return {
      slides,
      slidesLoadLimit,
      mobileRef,
      slideWidth,
    }
  },
})
</script>

<style lang="scss" scoped>
.mobile {
  height: 100%;
  overflow: auto;
  background-color: #f9f9f9;
}
.tip {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}
.thumbnail-list {
  padding: 10px;
}
.thumbnail-item {
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);

  & + .thumbnail-item {
    margin-top: 10px;
  }
}
</style>