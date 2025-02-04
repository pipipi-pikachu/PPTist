<template>
  <div class="templates">
    <div class="header">
      <Tabs 
        :tabs="tabs" 
        v-model:value="activeTab"
        card 
      />
    </div>
    <div class="list">
      <div 
        class="slide-item"
        v-for="slide in slides" 
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
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'
import api from '@/services'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import Button from '@/components/Button.vue'
import Tabs from '@/components/Tabs.vue'

interface TabItem {
  key: string
  label: string
}

const emit = defineEmits<{
  (event: 'select', payload: Slide): void
}>()

const slidesStore = useSlidesStore()
const { templates } = storeToRefs(slidesStore)
const slides = ref<Slide[]>([])

const tabs = computed<TabItem[]>(() => {
  return templates.value.map(item => ({
    label: item.name,
    key: item.id,
  }))
})
const activeTab = ref('')

const insertTemplate = (slide: Slide) => {
  emit('select', slide)
}

watch(activeTab, () => {
  if (!activeTab.value) return
  api.getFileData(activeTab.value).then(ret => {
    slides.value = ret.slides
  })
})

onMounted(() => {
  activeTab.value = templates.value[0].id
})
</script>

<style lang="scss" scoped>
.templates {
  width: 382px;
  height: 500px;
}
.header {
  margin: -10px -10px 10px;
}
.list {
  height: calc(100% - 50px);
  padding: 2px;
  margin-right: -10px;
  padding-right: 10px;
  overflow: auto;
  @include flex-grid-layout();
}
.slide-item {
  position: relative;
  @include flex-grid-layout-children(2, 48%);

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