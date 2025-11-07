<template>
  <MoveablePanel 
    class="image-lib-panel" 
    :width="360" 
    :height="580" 
    :left="-270" 
    :top="90"
    :contentStyle="{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }"
    title="图片库（来自 pexels.com）" 
    @close="close()"
  >
    <div class="container" v-loading="{ state: loading, text: '加载中...' }">
      <div class="tools">
        <Input class="input" v-model:value="searchWord" placeholder="搜索图片" @enter="search()">
          <template #prefix>
            <Popover class="more-icon" trigger="click" v-model:value="orientationVisible">
              <template #content>
                <PopoverMenuItem
                  center
                  v-for="item in orientationOptions"
                  :key="item.key"
                  @click="setOrientation(item.key); orientationVisible = false"
                >{{ item.label }}</PopoverMenuItem>
              </template>
              <div class="search-orientation">{{ orientationMap[orientation] }} <IconDown :size="14" /></div>
            </Popover>
          </template>
          <template #suffix>
            <div class="search-btn" @click="search()"><IconSearch /></div>
          </template>
        </Input>
      </div>

      <div class="imgs-wrap">
        <ImageWaterfallViewer 
          :list="imgs"
          :columnSpacing="5"
          :columnWidth="160"
        >
          <template v-slot:default="props">
            <div class="img-item">
              <img :src="props.src">
              <div class="mask">
                <Button type="primary" size="small" @click="createImageElement(props.src)">插入</Button>
              </div>
            </div>
          </template>
        </ImageWaterfallViewer>
      </div>
    </div>
  </MoveablePanel>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import api from '@/services'
import { useMainStore } from '@/store/main'
import useCreateElement from '@/hooks/useCreateElement'
import message from '@/utils/message'
import Button from '@/components/Button.vue'
import MoveablePanel from '@/components/MoveablePanel.vue'
import ImageWaterfallViewer from '@/components/ImageWaterfallViewer.vue'
import Input from '@/components/Input.vue'
import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'

interface ImageItem {
  id: number
  width: number
  height: number
  src: string
}

type Orientation = 'landscape' | 'portrait' | 'square' | 'all'

const mainStore = useMainStore()

const { createImageElement } = useCreateElement()

const imgs = ref<ImageItem[]>([])
const loading = ref(false)
const orientationVisible = ref(false)
const searchWord = ref('')
const orientation = ref<Orientation>('all')
const orientationOptions: {
  key: Orientation
  label: string
}[] = [
  { key: 'all', label: '全部' },
  { key: 'landscape', label: '横向' },
  { key: 'portrait', label: '纵向' },
  { key: 'square', label: '方形' },
]
const orientationMap: { [key: string]: string } = {
  'all': '全部',
  'landscape': '横向',
  'portrait': '纵向',
  'square': '方形',
}

const close = () => {
  mainStore.setImageLibPanelState(false)
}

onMounted(() => {
  search('风景')
})

const search = (q?: string) => {  
  const query = q || searchWord.value
  if (!query) return message.error('请输入搜索关键词')
  loading.value = true

  api.searchImage({
    query,
    per_page: 50,
    orientation: orientation.value,
  }).then(ret => {
    imgs.value = ret.data
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

const setOrientation = (value: Orientation) => {
  orientation.value = value
  if (searchWord.value) search()
}
</script>

<style lang="scss" scoped>
.image-lib-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.tools {
  flex-shrink: 0;
  margin-bottom: 10px;
}
.search-orientation {
  color: #999;
  padding-left: 5px;
  cursor: pointer;
}
.search-btn {
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: $themeColor;
  }
}
.imgs-wrap {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
.img-item {
  border-radius: $borderRadius;
  overflow: hidden;
  position: relative;

  &:hover .mask {
    display: flex;
  }

  .mask {
    position: absolute;
    inset: 0;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .25);
  }
}
</style>
