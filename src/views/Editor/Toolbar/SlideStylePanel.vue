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

    <div class="row"><Button style="flex: 1;" @click="applyBackgroundAllSlide()">应用背景到全部</Button></div>

    <Divider />

    <div class="title">全局主题</div>
    <div class="row">
      <div style="flex: 2;">字体：</div>
      <Select
        style="flex: 3;"
        :value="theme.fontName"
        @change="value => updateTheme({ fontName: value })"
      >
        <SelectOptGroup label="系统字体">
          <SelectOption v-for="font in availableFonts" :key="font.en" :value="font.en">
            <span :style="{ fontFamily: font.en }">{{font.zh}}</span>
          </SelectOption>
        </SelectOptGroup>
        <SelectOptGroup label="在线字体">
          <SelectOption v-for="font in webFonts" :key="font.name" :value="font.name">
            <span>{{font.name}}</span>
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

    <div class="title" style="margin-top: 20px;">应用预置主题：</div>
    <div class="theme-list">
      <div 
        class="theme-item" 
        v-for="(item, index) in themes" 
        :key="index"
        :style="{ backgroundColor: item.background }"
        @click="updateTheme({
          fontColor: item.text,
          backgroundColor: item.background,
          themeColor: item.color,
        })"
      >
        <div class="theme-item-content">
          <div class="text" :style="{ color: item.text }">Aa</div>
          <div class="color-block" :style="{ backgroundColor: item.color }"></div>
        </div>
      </div>
    </div>

    <div class="row"><Button style="flex: 1;" @click="applyThemeAllSlide()">应用主题到全部</Button></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { Slide, SlideBackground, SlideTheme } from '@/types/slides'
import { PRESET_THEMES } from '@/configs/theme'
import { WEB_FONTS } from '@/configs/font'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from './common/ColorButton.vue'
import { getImageDataURL } from '@/utils/image'

const themes = PRESET_THEMES
const webFonts = WEB_FONTS

export default defineComponent({
  name: 'slide-style-panel',
  components: {
    ColorButton,
  },
  setup() {
    const store = useStore()
    const slides = computed(() => store.state.slides)
    const theme = computed(() => store.state.theme)
    const currentSlide = computed<Slide>(() => store.getters.currentSlide)
    const availableFonts = computed(() => store.state.availableFonts)

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

    const updateBackgroundType = (type: 'solid' | 'image' | 'gradient') => {
      if (type === 'solid') {
        const newBackground: SlideBackground = {
          ...background.value,
          type: 'solid',
          color: background.value.color || '#fff',
        }
        store.commit(MutationTypes.UPDATE_SLIDE, { background: newBackground })
      }
      else if (type === 'image') {
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
      if (!imageFile) return
      getImageDataURL(imageFile).then(dataURL => updateBackground({ image: dataURL }))
    }

    const applyBackgroundAllSlide = () => {
      const newSlides = slides.value.map(slide => {
        return {
          ...slide,
          background: currentSlide.value.background,
        }
      })
      store.commit(MutationTypes.SET_SLIDES, newSlides)
      addHistorySnapshot()
    }

    const updateTheme = (themeProps: Partial<SlideTheme>) => {
      store.commit(MutationTypes.SET_THEME, themeProps)
    }

    const applyThemeAllSlide = () => {
      const newSlides: Slide[] = JSON.parse(JSON.stringify(slides.value))
      const { themeColor, backgroundColor, fontColor } = theme.value

      for (const slide of newSlides) {
        if (!slide.background || slide.background.type !== 'image') {
          slide.background = {
            ...slide.background,
            type: 'solid',
            color: backgroundColor
          }
        }

        const elements = slide.elements
        for (const el of elements) {
          if (el.type === 'shape') el.fill = themeColor
          else if (el.type === 'line') el.color = themeColor
          else if (el.type === 'text') {
            if (el.fill) el.fill = themeColor
          }
          else if (el.type === 'table') {
            if (el.theme) el.theme.color = themeColor
          }
          else if (el.type === 'chart') {
            el.themeColor = themeColor
            el.gridColor = fontColor
          }
        }
      }
      store.commit(MutationTypes.SET_SLIDES, newSlides)
      addHistorySnapshot()
    }

    return {
      availableFonts,
      background,
      updateBackgroundType,
      updateBackground,
      uploadBackgroundImage,
      applyBackgroundAllSlide,
      themes,
      theme,
      webFonts,
      updateTheme,
      applyThemeAllSlide,
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
    transition: box-shadow .2s;

    &:hover {
      box-shadow: 0 0 4px #888;
    }
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