<template>
  <div class="slide-style-panel">
    <div class="title">背景填充</div>
    <div class="row">
      <Select 
        style="flex: 10;" 
        :value="background.type" 
        @change="value => updateBackgroundType(value)"
      >
        <SelectOption value="solid">纯色填充</SelectOption>
        <SelectOption value="image">图片填充</SelectOption>
        <SelectOption value="gradient">渐变填充</SelectOption>
      </Select>
      <div style="flex: 1;"></div>

      <Popover trigger="click" v-if="background.type === 'solid'">
        <template #content>
          <ColorPicker
            :modelValue="background.color"
            @update:modelValue="color => updateBackground({ color })"
          />
        </template>
        <ColorButton :color="background.color || '#fff'" style="flex: 10;" />
      </Popover>

      <Select 
        style="flex: 10;" 
        :value="background.size || 'cover'" 
        @change="value => updateBackground({ imageSize: value })"
        v-else-if="background.type === 'image'"
      >
        <SelectOption value="initial">原始大小</SelectOption>
        <SelectOption value="contain">缩放</SelectOption>
        <SelectOption value="repeat">拼贴</SelectOption>
        <SelectOption value="cover">缩放铺满</SelectOption>
      </Select>

      <Select 
        style="flex: 10;" 
        :value="background.gradientType" 
        @change="value => updateBackground({ gradientType: value })"
        v-else
      >
        <SelectOption value="linear">线性渐变</SelectOption>
        <SelectOption value="radial">径向渐变</SelectOption>
      </Select>
    </div>

    <div class="background-image-wrapper" v-if="background.type === 'image'">
      <FileInput @change="files => uploadBackgroundImage(files)">
        <div class="background-image">
          <div class="content" :style="{ backgroundImage: `url(${background.image})` }">
            <IconPlus />
          </div>
        </div>
      </FileInput>
    </div>

    <div class="background-gradient-wrapper" v-if="background.type === 'gradient'">
      <div class="row">
        <div style="flex: 2;">起点颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="background.gradientColor[0]"
              @update:modelValue="value => updateBackground({ gradientColor: [value, background.gradientColor[1]] })"
            />
          </template>
          <ColorButton :color="background.gradientColor[0]" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row">
        <div style="flex: 2;">终点颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="background.gradientColor[1]"
              @update:modelValue="value => updateBackground({ gradientColor: [background.gradientColor[0], value] })"
            />
          </template>
          <ColorButton :color="background.gradientColor[1]" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row" v-if="background.gradientType === 'linear'">
        <div style="flex: 2;">渐变角度：</div>
        <Slider
          :min="0"
          :max="360"
          :step="15"
          :value="background.gradientRotate"
          style="flex: 3;"
          @change="value => updateBackground({ gradientRotate: value })" 
        />
      </div>
    </div>

    <div class="row"><Button style="flex: 1;" @click="applyAllSlide()">应用背景到全部</Button></div>

    <Divider />

    <div class="title">全局主题</div>
    <div class="row">
      <div style="flex: 2;">字体：</div>
      <Select
        style="flex: 3;"
        value="微软雅黑"
      >
        <SelectOption v-for="font in availableFonts" :key="font.en" :value="font.en">
          <span :style="{ fontFamily: font.en }">{{font.zh}}</span>
        </SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">字体颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            modelValue="#333"
          />
        </template>
        <ColorButton color="#333" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">背景颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            modelValue="#333"
          />
        </template>
        <ColorButton color="#333" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">主题色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            modelValue="#333"
          />
        </template>
        <ColorButton color="#333" style="flex: 3;" />
      </Popover>
    </div>

    <div class="title" style="margin-top: 20px;">预置主题：</div>
    <div class="theme-list">
      <div 
        class="theme-item" 
        v-for="(item, index) in themes" 
        :key="index"
        :style="{ backgroundColor: item.background }"
      >
        <div class="theme-item-content">
          <div class="text" :style="{ color: item.text }">Aa</div>
          <div class="color-block" :style="{ backgroundColor: item.color }"></div>
        </div>
      </div>
    </div>

    <div class="row"><Button style="flex: 1;" @click="applyAllSlide()">应用主题到全部</Button></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { Slide, SlideBackground } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from './common/ColorButton.vue'
import { getImageDataURL } from '@/utils/image'

const themes = [
  { color: '#42464b', background: '#fff', text: '#333' },
  { color: '#5d82ba', background: '#fff', text: '#333' },
  { color: '#005a6f', background: '#fff', text: '#333' },
  { color: '#232d05', background: '#fff244', text: '#333' },
  { color: '#d0614c', background: '#dfb044', text: '#333' },
  { color: '#86a1ad', background: '#dfdbd4', text: '#333' },
  { color: '#697586', background: '#d5c4a4', text: '#333' },
  { color: '#333333', background: '#7acfa6', text: '#333' },
  { color: '#42464b', background: '#415065', text: '#fff' },
  { color: '#0c5999', background: '#35a2cd', text: '#fff' },
  { color: '#c49a41', background: '#8c4357', text: '#fff' },
  { color: '#dfaa00', background: '#2e4e7d', text: '#fff' },
  { color: '#d1ad88', background: '#f99070', text: '#fff' },
  { color: '#464d52', background: '#657984', text: '#fff' },
  { color: '#ffcfb6', background: '#1e4c6f', text: '#fff' },
  { color: '#c3a043', background: '#43292a', text: '#fff' },
  { color: '#ffffff', background: '#171925', text: '#fff' },
  { color: '#df9636', background: '#5b89a0', text: '#fff' },
  { color: '#b898a4', background: '#93716b', text: '#fff' },
  { color: '#c47a11', background: '#187db1', text: '#fff' },
  { color: '#333333', background: '#759564', text: '#fff' },
  { color: '#355b5e', background: '#424b50', text: '#fff' },
  { color: '#d29090', background: '#942a32', text: '#fff' },
  { color: '#00cfdf', background: '#3b434d', text: '#fff' },
  { color: '#424246', background: '#c70042', text: '#fff' },
  { color: '#2e4155', background: '#b35d44', text: '#fff' },
  { color: '#11bfce', background: '#8f98aa', text: '#fff' },
  { color: '#333333', background: '#549688', text: '#fff' },
]

export default defineComponent({
  name: 'slide-style-panel',
  components: {
    ColorButton,
  },
  setup() {
    const store = useStore<State>()
    const slides = computed(() => store.state.slides)
    const currentSlide = computed<Slide>(() => store.getters.currentSlide)
    const availableFonts = computed(() => store.state.availableFonts)

    const background = computed(() => {
      if(!currentSlide.value.background) {
        return {
          type: 'solid',
          value: '#fff',
        } as SlideBackground
      }
      return currentSlide.value.background
    })

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateBackgroundType = (type: 'solid' | 'image' | 'gradient') => {
      if(type === 'solid') {
        const newBackground: SlideBackground = {
          ...background.value,
          type: 'solid',
          color: background.value.color || '#fff',
        }
        store.commit(MutationTypes.UPDATE_SLIDE, { background: newBackground })
      }
      else if(type === 'image') {
        const newBackground: SlideBackground = {
          ...background.value,
          type: 'image',
          image: background.value.image || '',
          imageSize: background.value.imageSize || 'cover',
        }
        store.commit(MutationTypes.UPDATE_SLIDE, { background: newBackground })
      }
      else {
        const newBackground: SlideBackground = {
          ...background.value,
          type: 'gradient',
          gradientType: background.value.gradientType || 'linear',
          gradientColor: background.value.gradientColor || ['#fff', '#fff'],
          gradientRotate: background.value.gradientRotate || 0,
        }
        store.commit(MutationTypes.UPDATE_SLIDE, { background: newBackground })
      }
      addHistorySnapshot()
    }

    const updateBackground = (props: Partial<SlideBackground>) => {
      store.commit(MutationTypes.UPDATE_SLIDE, { background: { ...background.value, ...props } })
      addHistorySnapshot()
    }

    const uploadBackgroundImage = (files: File[]) => {
      const imageFile = files[0]
      if(!imageFile) return
      getImageDataURL(imageFile).then(dataURL => updateBackground({ image: dataURL }))
    }

    const applyAllSlide = () => {
      const newSlides = slides.value.map(slide => {
        return {
          ...slide,
          background: currentSlide.value.background,
        }
      })
      store.commit(MutationTypes.SET_SLIDES, newSlides)
      addHistorySnapshot()
    }

    return {
      availableFonts,
      background,
      updateBackgroundType,
      updateBackground,
      uploadBackgroundImage,
      applyAllSlide,
      themes,
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
.title {
  margin-bottom: 10px;
}
.background-image-wrapper {
  margin-bottom: 10px;
}
.background-image {
  height: 0;
  padding-bottom: 56.25%;
  border: 1px dashed $borderColor;
  border-radius: $borderRadius;
  position: relative;
  transition: all .2s;

  &:hover {
    border-color: $themeColor;
    color: $themeColor;
  }

  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}

.theme-list {
  @include grid-layout-wrapper();
}
.theme-item {
  @include grid-layout-item(4, 22%);

  padding-bottom: 22%;
  border-radius: $borderRadius;
  position: relative;
  cursor: pointer;

  .theme-item-content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .text {
    font-size: 16px;
  }

  .color-block {
    width: 28px;
    height: 10px;
    margin-top: 5px;
  }
}
</style>