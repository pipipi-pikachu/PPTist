<template>
  <div class="templates">
    <div class="catalogs">
      <div class="catalog" 
        :class="{ 'active': activeCatalog === item.id }" 
        v-for="item in templates" 
        :key="item.id"
        @click="changeCatalog(item.id)"
      >{{ item.name }}</div>
    </div>
    <div class="content" v-loading="{ state: loading, text: '加载中...' }">
      <div class="header">
        <div class="types">
          <div class="type" 
            :class="{ 'active': activeType === item.value }"
            v-for="item in types"
            :key="item.value"
            @click="activeType = item.value"
          >{{ item.label }}</div>
        </div>
        <div class="insert-all" @click="insertTemplates(slides)">插入全部</div>
      </div>
      <div class="list" ref="listRef">
        <template v-for="slide in slides" :key="slide.id">
          <div 
            class="slide-item"
            v-if="slide.type === activeType || activeType === 'all'"
          >
            <ThumbnailSlide class="thumbnail" :slide="slide" :size="180" />
    
            <div class="btns">
              <Button class="btn" type="primary" size="small" @click="insertTemplate(slide)">插入模板</Button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'
import api from '@/services'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import Button from '@/components/Button.vue'

const emit = defineEmits<{
  (event: 'select', payload: Slide): void
  (event: 'selectAll', payload: Slide[]): void
}>()

const slidesStore = useSlidesStore()
const { templates } = storeToRefs(slidesStore)

const slides = ref<Slide[]>([])
const listRef = useTemplateRef<HTMLElement>('listRef')
const types = ref<{
  label: string
  value: string
}[]>([
  { label: '全部', value: 'all' },
  { label: '封面', value: 'cover' },
  { label: '目录', value: 'contents' },
  { label: '过渡', value: 'transition' },
  { label: '内容', value: 'content' },
  { label: '结束', value: 'end' },
])
const activeType = ref('all')

const activeCatalog = ref('')
const loading = ref(false)

const insertTemplate = (slide: Slide) => {
  emit('select', slide)
}

const insertTemplates = (slides: Slide[]) => {
  emit('selectAll', slides)
}

const changeCatalog = (id: string) => {
  loading.value = true
  activeCatalog.value = id
  api.getMockData(activeCatalog.value).then(ret => {
    slides.value = ret.slides
    loading.value = false

    if (listRef.value) listRef.value.scrollTo(0, 0) 
  }).catch(() => {
    loading.value = false
  })
}

onMounted(() => {
  changeCatalog(templates.value[0].id)
})
</script>

<style lang="scss" scoped>
.templates {
  width: 500px;
  height: 500px;
  display: flex;
  user-select: none;
}
.catalogs {
  width: 108px;
  margin-right: 10px;
  padding-right: 10px;
  border-right: 1px solid $borderColor;
  overflow: auto;

  .catalog {
    padding: 7px 8px;
    border-radius: $borderRadius;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }

    &.active {
      color: $themeColor;
      background-color: rgba($color: $themeColor, $alpha: .05);
      border-right: 2px solid $themeColor;
      font-weight: 700;
    }

    & + .catalog {
      margin-top: 3px; 
    }
  }
}
.content {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-right: 4px;

  &:hover .insert-all {
    opacity: 1;
    transition: opacity $transitionDelay;
  }
}
.types {
  display: flex;

  .type {
    border-radius: $borderRadius;
    padding: 3px 8px;
    font-size: 12px;
    cursor: pointer;

    & +.type {
      margin-left: 4px;
    }

    &.active {
      color: $themeColor;
      background-color: rgba($color: $themeColor, $alpha:.05);
      font-weight: 700;
    }

    &:hover {
      background-color: #f5f5f5;
    }
  }
}
.insert-all {
  opacity: 0;
  font-size: 12px;
  color: $themeColor;
  text-decoration: underline;
  cursor: pointer;
}
.list {
  width: 392px;
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