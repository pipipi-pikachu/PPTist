<template>
  <div class="image-style-panel">
    <div 
      class="origin-image"
      :style="{ backgroundImage: `url(${handleElement.src})` }"
    ></div>

    <ButtonGroup class="row">
      <Button style="flex: 5;" @click="clipImage()"><IconTailoring class="btn-icon" /> 裁剪图片</Button>
      <Popover trigger="click" v-model:visible="clipPanelVisible">
        <template #content>
          <div class="clip">
            <div class="title">按形状裁剪：</div>
            <div class="shape-clip">
              <div 
                class="shape-clip-item" 
                v-for="(item, key) in shapeClipPathOptions" 
                :key="key"
                @click="presetImageClip(key)"
              >
                <div class="shape" :style="{ backgroundImage: `url(${handleElement.src})`, clipPath: item.style }"></div>
              </div>
            </div>

            <template v-for="type in ratioClipOptions" :key="type.label">
              <div class="title" v-if="type.label">{{type.label}}：</div>
              <ButtonGroup class="row">
                <Button 
                  style="flex: 1;"
                  v-for="item in type.children"
                  :key="item.key"
                  @click="presetImageClip('rect', item.ratio)"
                >{{item.key}}</Button>
              </ButtonGroup>
            </template>
          </div>
        </template>
        <Button class="no-padding" style="flex: 1;"><IconDown /></Button>
      </Popover>
    </ButtonGroup>

    <Popover trigger="click">
      <template #content>
        <div class="filter">
          <div class="filter-item" v-for="filter in filterOptions" :key="filter.key">
            <div class="name">{{filter.label}}</div>
            <Slider
              class="filter-slider"
              :max="filter.max"
              :min="filter.min"
              :step="filter.step"
              :value="filter.value"
              @change="value => updateFilter(filter, value)"
            />
            <div class="value">{{filter.value}}</div>
          </div>
        </div>
      </template>
      <Button class="full-width-btn"><IconColorFilter class="btn-icon" /> 设置滤镜</Button>
    </Popover>
  
    <ElementFlip />
    <Divider />
    <ElementOutline />
    <Divider />
    <ElementShadow />
    <Divider />
    
    <FileInput @change="files => replaceImage(files)">
      <Button class="full-width-btn"><IconTransform class="btn-icon" /> 替换图片</Button>
    </FileInput>
    <Button class="full-width-btn" @click="resetImage()"><IconUndo class="btn-icon" /> 重置样式</Button>
    <Button class="full-width-btn" @click="setBackgroundImage()"><IconTheme class="btn-icon" /> 设为背景</Button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTImageElement, Slide } from '@/types/slides'
import { CLIPPATHS } from '@/configs/imageClip'
import { getImageDataURL } from '@/utils/image'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'
import ElementFlip from '../common/ElementFlip.vue'

interface FilterOption {
  label: string;
  key: string;
  default: number;
  value: number;
  unit: string;
  max: number;
  step: number;
}

const defaultFilters: FilterOption[] = [
  { label: '模糊', key: 'blur', default: 0, value: 0, unit: 'px', max: 10, step: 1 },
  { label: '亮度', key: 'brightness', default: 100, value: 100, unit: '%', max: 200, step: 5 },
  { label: '对比度', key: 'contrast', default: 100, value: 100, unit: '%', max: 200, step: 5 },
  { label: '灰度', key: 'grayscale', default: 0, value: 0, unit: '%', max: 100, step: 5 },
  { label: '饱和度', key: 'saturate', default: 100, value: 100, unit: '%', max: 200, step: 5 },
  { label: '色相', key: 'hue-rotate', default: 0, value: 0, unit: 'deg', max: 360, step: 10 },
  { label: '不透明度', key: 'opacity', default: 100, value: 100, unit: '%', max: 100, step: 5 },
]

const shapeClipPathOptions = CLIPPATHS
const ratioClipOptions = [
  {
    label: '纵横比（方形）',
    children: [
      { key: '1:1', ratio: 1 / 1 },
    ],
  },
  {
    label: '纵横比（纵向）',
    children: [
      { key: '2:3', ratio: 3 / 2 },
      { key: '3:4', ratio: 4 / 3 },
      { key: '3:5', ratio: 5 / 3 },
      { key: '4:5', ratio: 5 / 4 },
    ],
  },
  {
    label: '纵横比（横向）',
    children: [
      { key: '3:2', ratio: 2 / 3 },
      { key: '4:3', ratio: 3 / 4 },
      { key: '5:3', ratio: 3 / 5 },
      { key: '5:4', ratio: 4 / 5 },
    ],
  },
  {
    children: [
      { key: '16:9', ratio: 9 / 16 },
      { key: '16:10', ratio: 10 / 16 },
    ],
  },
]

export default defineComponent({
  name: 'image-style-panel',
  components: {
    ElementOutline,
    ElementShadow,
    ElementFlip,
  },
  setup() {
    const store = useStore()
    const handleElement = computed<PPTImageElement>(() => store.getters.handleElement)
    const currentSlide = computed<Slide>(() => store.getters.currentSlide)

    const clipPanelVisible = ref(false)

    const filterOptions = ref<FilterOption[]>(JSON.parse(JSON.stringify(defaultFilters)))

    watch(handleElement, () => {
      if (!handleElement.value || handleElement.value.type !== 'image') return
      
      const filters = handleElement.value.filters
      if (filters) {
        filterOptions.value = defaultFilters.map(item => {
          if (filters[item.key] !== undefined) return { ...item, value: parseInt(filters[item.key]) }
          return item
        })
      }
      else filterOptions.value = JSON.parse(JSON.stringify(defaultFilters))
    }, { deep: true, immediate: true })

    const { addHistorySnapshot } = useHistorySnapshot()

    // 设置滤镜
    const updateFilter = (filter: FilterOption, value: number) => {
      const originFilters = handleElement.value.filters || {}
      const filters = { ...originFilters, [filter.key]: `${value}${filter.unit}` }
      const props = { filters }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    // 打开自由裁剪
    const clipImage = () => {
      store.commit(MutationTypes.SET_CLIPING_IMAGE_ELEMENT_ID, handleElement.value.id)
      clipPanelVisible.value = false
    }

    // 获取原始图片的位置大小
    const getImageElementDataBeforeClip = () => {

      // 图片当前的位置大小和裁剪范围
      const imgWidth = handleElement.value.width
      const imgHeight = handleElement.value.height
      const imgLeft = handleElement.value.left
      const imgTop = handleElement.value.top
      const originClipRange = handleElement.value.clip ? handleElement.value.clip.range : [[0, 0], [100, 100]]

      const originWidth = imgWidth / ((originClipRange[1][0] - originClipRange[0][0]) / 100)
      const originHeight = imgHeight / ((originClipRange[1][1] - originClipRange[0][1]) / 100)
      const originLeft = imgLeft - originWidth * (originClipRange[0][0] / 100)
      const originTop = imgTop - originHeight * (originClipRange[0][1] / 100)

      return {
        originClipRange,
        originWidth,
        originHeight,
        originLeft,
        originTop,
      }
    }

    // 预设裁剪
    const presetImageClip = (shape: string, ratio = 0) => {
      const {
        originClipRange,
        originWidth,
        originHeight,
        originLeft,
        originTop,
      } = getImageElementDataBeforeClip()
      
      // 纵横比裁剪（形状固定为矩形）
      if (ratio) {
        const imageRatio = originHeight / originWidth

        const min = 0
        const max = 100
        let range

        if (imageRatio > ratio) {
          const distance = ((1 - ratio / imageRatio) / 2) * 100
          range = [[min, distance], [max, max - distance]]
        }
        else {
          const distance = ((1 - imageRatio / ratio) / 2) * 100
          range = [[distance, min], [max - distance, max]]
        }
        store.commit(MutationTypes.UPDATE_ELEMENT, {
          id: handleElement.value.id,
          props: {
            clip: { ...handleElement.value.clip, shape, range },
            left: originLeft + originWidth * (range[0][0] / 100),
            top: originTop + originHeight * (range[0][1] / 100),
            width: originWidth * (range[1][0] - range[0][0]) / 100,
            height: originHeight * (range[1][1] - range[0][1]) / 100,
          },
        })
      }
      // 形状裁剪（保持当前裁剪范围）
      else {
        store.commit(MutationTypes.UPDATE_ELEMENT, {
          id: handleElement.value.id,
          props: {
            clip: { ...handleElement.value.clip, shape, range: originClipRange }
          },
        })
      }
      clipImage()
      addHistorySnapshot()
    }

    // 替换图片（保持当前的样式）
    const replaceImage = (files: File[]) => {
      const imageFile = files[0]
      if (!imageFile) return
      getImageDataURL(imageFile).then(dataURL => {
        const props = { src: dataURL }
        store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      })
      addHistorySnapshot()
    }

    // 重置图片：清除全部样式
    const resetImage = () => {
      if (handleElement.value.clip) {
        const {
          originWidth,
          originHeight,
          originLeft,
          originTop,
        } = getImageElementDataBeforeClip()

        store.commit(MutationTypes.UPDATE_ELEMENT, {
          id: handleElement.value.id,
          props: {
            left: originLeft,
            top: originTop,
            width: originWidth,
            height: originHeight,
          },
        })
      }

      store.commit(MutationTypes.REMOVE_ELEMENT_PROPS, {
        id: handleElement.value.id,
        propName: ['clip', 'outline', 'flip', 'shadow', 'filters'],
      })
      addHistorySnapshot()
    }

    // 将图片设置为背景
    const setBackgroundImage = () => {
      const background = {
        ...currentSlide.value.background,
        type: 'image',
        image: handleElement.value.src,
        imageSize: 'cover',
      }
      store.commit(MutationTypes.UPDATE_SLIDE, { background })
      addHistorySnapshot()
    }

    return {
      clipPanelVisible,
      shapeClipPathOptions,
      ratioClipOptions,
      filterOptions,
      handleElement,
      updateFilter,
      clipImage,
      presetImageClip,
      replaceImage,
      resetImage,
      setBackgroundImage,
    }
  },
})
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.switch-wrapper {
  text-align: right;
}
.origin-image {
  height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: $lightGray;
  margin-bottom: 10px;
}
.full-width-btn {
  width: 100%;
  margin-bottom: 10px;
}
.btn-icon {
  margin-right: 3px;
}

.filter {
  width: 280px;
  font-size: 12px;
}
.filter-item {
  padding: 8px 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  .name {
    width: 60px;
  }
  .filter-slider {
    flex: 1;
    margin: 0 6px;
  }
  .value {
    width: 40px;
    text-align: right;
  }
}

.clip {
  width: 260px;
  font-size: 12px;

  .title {
    margin-bottom: 5px;
  }
}
.shape-clip {
  margin-bottom: 10px;

  @include flex-grid-layout();
}
.shape-clip-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @include flex-grid-layout-children(5, 16%);

  .shape {
    width: 40px;
    height: 40px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>