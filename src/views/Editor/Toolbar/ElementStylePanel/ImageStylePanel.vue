<template>
  <div class="image-style-panel">
    <div 
      class="origin-image"
      :style="{ backgroundImage: `url(${handleElement.src})` }"
    ></div>

    <Button class="full-width-btn" @click="clipImage()">裁剪图片</Button>

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
            <div class="value">{{`${filter.value}${filter.unit}`}}</div>
          </div>
        </div>
      </template>
      <Button class="full-width-btn">设置滤镜</Button>
    </Popover>
    
    <div class="row">
      <div style="flex: 2;">水平翻转：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch 
          :checked="flip.x === 180" 
          @change="checked => updateImage({ flip: { x: checked ? 180 : 0, y: flip.y } })" 
        />
      </div>
    </div>
    <div class="row">
      <div style="flex: 2;">垂直翻转：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch 
          :checked="flip.y === 180" 
          @change="checked => updateImage({ flip: { x: flip.x, y: checked ? 180 : 0 } })" 
        />
      </div>
    </div>

    <Divider />
    <ElementOutline />
    <Divider />
    <ElementShadow />
    <Divider />
    
    <Button class="full-width-btn">替换图片</Button>
    <Button class="full-width-btn">重置样式</Button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, watch } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { PPTImageElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'

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

export default defineComponent({
  name: 'image-style-panel',
  components: {
    ElementOutline,
    ElementShadow,
  },
  setup() {
    const store = useStore<State>()
    const handleElement: Ref<PPTImageElement> = computed(() => store.getters.handleElement)

    const flip = ref({
      x: 0,
      y: 0,
    })

    const filterOptions: Ref<FilterOption[]> = ref(JSON.parse(JSON.stringify(defaultFilters)))

    watch(handleElement, () => {
      if(!handleElement.value) return

      if(handleElement.value.flip) {
        flip.value = {
          x: handleElement.value.flip.x || 0,
          y: handleElement.value.flip.y || 0,
        }
      }
      else flip.value = { x: 0, y: 0 }

      const filters = handleElement.value.filters
      if(filters) {
        filterOptions.value = defaultFilters.map(item => {
          if(filters[item.key] !== undefined) return { ...item, value: parseInt(filters[item.key]) }
          return item
        })
      }
      else filterOptions.value = JSON.parse(JSON.stringify(defaultFilters))
    }, { deep: true, immediate: true })

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateImage = (props: Partial<PPTImageElement>) => {
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    const updateFilter = (filter: FilterOption, value: number) => {
      const originFilters = handleElement.value.filters || {}
      const filters = { ...originFilters, [filter.key]: `${value}${filter.unit}` }
      const props = { filters }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    const clipImage = () => {
      setTimeout(() => {
        store.commit(MutationTypes.SET_CLIPING_IMAGE_ELEMENT_ID, handleElement.value.id)
      }, 0)
    }

    return {
      filterOptions,
      flip,
      handleElement,
      updateImage,
      updateFilter,
      clipImage,
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
</style>