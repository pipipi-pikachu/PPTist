<template>
  <div class="slide-design-panel">
    <div class="title">背景填充</div>
    <div class="row">
      <Select 
        style="flex: 10;" 
        :value="background.type" 
        @change="value => updateBackgroundType(value as 'gradient' | 'image' | 'solid')"
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
        :value="background.imageSize || 'cover'" 
        @change="value => updateBackground({ imageSize: value as 'repeat' | 'cover' | 'contain' })"
        v-else-if="background.type === 'image'"
      >
        <SelectOption value="contain">缩放</SelectOption>
        <SelectOption value="repeat">拼贴</SelectOption>
        <SelectOption value="cover">缩放铺满</SelectOption>
      </Select>

      <Select 
        style="flex: 10;" 
        :value="background.gradientType" 
        @change="value => updateBackground({ gradientType: value as 'linear' | 'radial' })"
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
              :modelValue="background.gradientColor![0]"
              @update:modelValue="value => updateBackground({ gradientColor: [value, background.gradientColor![1]] })"
            />
          </template>
          <ColorButton :color="background.gradientColor![0]" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row">
        <div style="flex: 2;">终点颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="background.gradientColor![1]"
              @update:modelValue="value => updateBackground({ gradientColor: [background.gradientColor![0], value] })"
            />
          </template>
          <ColorButton :color="background.gradientColor![1]" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row" v-if="background.gradientType === 'linear'">
        <div style="flex: 2;">渐变角度：</div>
        <Slider
          class="slider"
          :min="0"
          :max="360"
          :step="15"
          :value="background.gradientRotate"
          @change="value => updateBackground({ gradientRotate: value as number })" 
        />
      </div>
    </div>

    <div class="row"><Button style="flex: 1;" @click="applyBackgroundAllSlide()">应用背景到全部</Button></div>

    <Divider />

    <div class="row">
      <div style="flex: 2;">画布尺寸：</div>
      <Select style="flex: 3;" :value="viewportRatio" @change="value => updateViewportRatio(value as number)">
        <SelectOption :value="0.5625">宽屏 16 : 9</SelectOption>
        <SelectOption :value="0.625">宽屏 16 ：10</SelectOption>
        <SelectOption :value="0.75">标准 4 ：3</SelectOption>
        <SelectOption :value="0.70710678">A3 / A4</SelectOption>
      </Select>
    </div>

    <Divider />

    <div class="title">全局主题</div>
    <div class="row">
      <div style="flex: 2;">字体：</div>
      <Select
        style="flex: 3;"
        :value="theme.fontName"
        @change="value => updateTheme({ fontName: value as string })"
      >
        <SelectOptGroup label="系统字体">
          <SelectOption v-for="font in availableFonts" :key="font.value" :value="font.value">
            <span :style="{ fontFamily: font.value }">{{font.label}}</span>
          </SelectOption>
        </SelectOptGroup>
        <SelectOptGroup label="在线字体">
          <SelectOption v-for="font in WEB_FONTS" :key="font.value" :value="font.value">
            <span>{{font.label}}</span>
          </SelectOption>
        </SelectOptGroup>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">字体颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="theme.fontColor"
            @update:modelValue="value => updateTheme({ fontColor: value })"
          />
        </template>
        <ColorButton :color="theme.fontColor" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">背景颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="theme.backgroundColor"
            @update:modelValue="value => updateTheme({ backgroundColor: value })"
          />
        </template>
        <ColorButton :color="theme.backgroundColor" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">主题色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="theme.themeColor"
            @update:modelValue="value => updateTheme({ themeColor: value })"
          />
        </template>
        <ColorButton :color="theme.themeColor" style="flex: 3;" />
      </Popover>
    </div>

    <div class="row"><Button style="flex: 1;" @click="applyThemeToAllSlides()">应用主题到全部</Button></div>

    <Divider />

    <div class="title">预置主题</div>
    <div class="theme-list">
      <div 
        class="theme-item" 
        v-for="(item, index) in PRESET_THEMES" 
        :key="index"
        :style="{
          backgroundColor: item.background,
          fontFamily: item.fontname,
        }"
      >
        <div class="theme-item-content">
          <div class="text" :style="{ color: item.fontColor }">文字 Aa</div>
          <div class="colors">
            <div class="color-block" v-for="(color, index) in item.colors" :key="index" :style="{ backgroundColor: color}"></div>
          </div>

          <div class="btns">
            <div class="btn" @click="applyPresetThemeToSingleSlide(item)">应用</div>
            <div class="btn" @click="applyPresetThemeToAllSlides(item)">应用全局</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { SlideBackground, SlideTheme } from '@/types/slides'
import { PRESET_THEMES } from '@/configs/theme'
import { WEB_FONTS } from '@/configs/font'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useSlideTheme from '@/hooks/useSlideTheme'

import ColorButton from './common/ColorButton.vue'
import { getImageDataURL } from '@/utils/image'

const slidesStore = useSlidesStore()
const { availableFonts } = storeToRefs(useMainStore())
const { slides, currentSlide, viewportRatio, theme } = storeToRefs(slidesStore)

const background = computed(() => {
  if (!currentSlide.value.background) {
    return {
      type: 'solid',
      value: '#fff',
    } as SlideBackground
  }
  return currentSlide.value.background
})

const { addHistorySnapshot } = useHistorySnapshot()
const {
  applyPresetThemeToSingleSlide,
  applyPresetThemeToAllSlides,
  applyThemeToAllSlides,
} = useSlideTheme()

// 设置背景模式：纯色、图片、渐变色
const updateBackgroundType = (type: 'solid' | 'image' | 'gradient') => {
  if (type === 'solid') {
    const newBackground: SlideBackground = {
      ...background.value,
      type: 'solid',
      color: background.value.color || '#fff',
    }
    slidesStore.updateSlide({ background: newBackground })
  }
  else if (type === 'image') {
    const newBackground: SlideBackground = {
      ...background.value,
      type: 'image',
      image: background.value.image || '',
      imageSize: background.value.imageSize || 'cover',
    }
    slidesStore.updateSlide({ background: newBackground })
  }
  else {
    const newBackground: SlideBackground = {
      ...background.value,
      type: 'gradient',
      gradientType: background.value.gradientType || 'linear',
      gradientColor: background.value.gradientColor || ['#fff', '#fff'],
      gradientRotate: background.value.gradientRotate || 0,
    }
    slidesStore.updateSlide({ background: newBackground })
  }
  addHistorySnapshot()
}

// 设置背景图片
const updateBackground = (props: Partial<SlideBackground>) => {
  slidesStore.updateSlide({ background: { ...background.value, ...props } })
  addHistorySnapshot()
}

// 上传背景图片
const uploadBackgroundImage = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => updateBackground({ image: dataURL }))
}

// 应用当前页背景到全部页面
const applyBackgroundAllSlide = () => {
  const newSlides = slides.value.map(slide => {
    return {
      ...slide,
      background: currentSlide.value.background,
    }
  })
  slidesStore.setSlides(newSlides)
  addHistorySnapshot()
}

// 设置主题
const updateTheme = (themeProps: Partial<SlideTheme>) => {
  slidesStore.setTheme(themeProps)
}

// 设置画布尺寸（宽高比例）
const updateViewportRatio = (value: number) => {
  slidesStore.setViewportRatio(value)
}
</script>

<style lang="scss" scoped>
.slide-design-panel {
  user-select: none;
}
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
  transition: all $transitionDelay;

  &:hover {
    border-color: $themeColor;
    color: $themeColor;
  }

  .content {
    @include absolute-0();

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
  @include flex-grid-layout();
}
.theme-item {
  @include flex-grid-layout-children(2, 48%);

  padding-bottom: 30%;
  border-radius: $borderRadius;
  position: relative;
  cursor: pointer;

  .theme-item-content {
    @include absolute-0();

    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px;
    border: 1px solid $borderColor;
  }

  .text {
    font-size: 16px;
  }
  .colors {
    display: flex;
  }
  .color-block {
    margin-top: 8px;
    width: 12px;
    height: 12px;
    margin-right: 2px;
  }

  &:hover .btns {
    display: flex;
  }

  .btns {
    @include absolute-0();

    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: none;
    background-color: rgba($color: #000, $alpha: .25);
  }
  .btn {
    width: 72px;
    padding: 5px 0;
    text-align: center;
    background-color: $themeColor;
    color: #fff;
    font-size: 12px;
    border-radius: $borderRadius;

    &:hover {
      background-color: #c42f19;
    }

    & + .btn {
      margin-top: 5px;
    }
  }
}
.slider {
  flex: 3;
}
</style>