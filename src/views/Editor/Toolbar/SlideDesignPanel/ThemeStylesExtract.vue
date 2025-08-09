<template>
  <div class="theme-styles-extract">
    <Tabs 
      :tabs="tabs" 
      v-model:value="activeTab" 
      :tabsStyle="{ marginBottom: '12px' }" 
      :tabStyle="{ padding: '8px 12px' }" 
    />
    <div class="content">
      <div class="config-item" v-if="themeStyles.fontNames.length">
        <div class="label">字体：</div>
        <div class="values">
          <div class="value-wrap" v-for="(item, index) in themeStyles.fontNames" :key="item">
            <div class="value" :style="{ fontFamily: item }">{{ fontMap[item] || item }}</div>
            <div class="handler">
              <div class="state" :class="{ 'active': selectedIndex.fontName === index }"><IconCheck /></div>
              <div class="config-btn" @click="selectedIndex.fontName = index">选择</div>
              <div class="config-btn" @click="updateTheme({ fontName: item }); selectedIndex.fontName = index">应用到主题</div>
            </div>
          </div>
        </div>
      </div>
      <div class="config-item" v-if="themeStyles.fontColors.length">
        <div class="label">文字颜色：</div>
        <div class="values">
          <div class="value-wrap" v-for="(item, index) in themeStyles.fontColors" :key="item">
            <div class="value" :style="{ backgroundColor: item, color: getMostReadableColor(item) }">{{ getHexColor(item) }}</div>
            <div class="handler">
              <div class="state" :class="{ 'active': selectedIndex.fontColor === index }"><IconCheck /></div>
              <div class="config-btn" @click="selectedIndex.fontColor = index">选择</div>
              <div class="config-btn" @click="updateTheme({ fontColor: item }); selectedIndex.fontColor = index">应用到主题</div>
            </div>
          </div>
        </div>
      </div>
      <div class="config-item" v-if="themeStyles.backgroundColors.length">
        <div class="label">背景颜色：</div>
        <div class="values">
          <div class="value-wrap" v-for="(item, index) in themeStyles.backgroundColors" :key="item">
            <div class="value" :style="{ backgroundColor: item, color: getMostReadableColor(item) }">{{ getHexColor(item) }}</div>
            <div class="handler">
              <div class="state" :class="{ 'active': selectedIndex.backgroundColor === index }"><IconCheck /></div>
              <div class="config-btn" @click="selectedIndex.backgroundColor = index">选择</div>
              <div class="config-btn" @click="updateTheme({ backgroundColor: item }); selectedIndex.backgroundColor = index">应用到主题</div>
            </div>
          </div>
        </div>
      </div>
      <div class="config-item" v-if="themeStyles.themeColors.length">
        <div class="label">主题色：<span class="tip">（点击色块排除不要的颜色）</span></div>
        <div class="values inline">
          <div class="value-wrap" v-for="(item, index) in themeStyles.themeColors" :key="item" @click="removeThemeColor(index)">
            <div class="value" :class="{ 'disabled': !selectedIndex.themeColors.includes(index) }" :style="{ backgroundColor: item }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="btns">
      <Button class="btn" type="primary" @click="updateAllThemes()"><IconCheck /> 将选中配置保存为主题</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import tinycolor from 'tinycolor2'
import { useSlidesStore } from '@/store'
import { FONTS } from '@/configs/font'
import useSlideTheme from '@/hooks/useSlideTheme'
import Tabs from '@/components/Tabs.vue'
import Button from '@/components/Button.vue'
import type { SlideTheme } from '@/types/slides'
import message from '@/utils/message'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const slidesStore = useSlidesStore()
const { slides, currentSlide } = storeToRefs(slidesStore)
const { getSlidesThemeStyles } = useSlideTheme()

interface TabItem {
  key: 'single' | 'all'
  label: string
}

const tabs: TabItem[] = [
  { key: 'single', label: '从当前页中提取' },
  { key: 'all', label: '从全部幻灯片提取' },
]
const activeTab = ref<'single' | 'all'>('single')

const fontMap = ref<{ [key: string]: string }>({})
onMounted(() => {
  const map: { [key: string]: string } = {}
  for (const item of FONTS) {
    map[item.value] = item.label
  }
  fontMap.value = map
})

const themeStyles = ref<ReturnType<typeof getSlidesThemeStyles>>({
  backgroundColors: [],
  themeColors: [],
  fontColors: [],
  fontNames: [],
})
const selectedIndex = ref({
  backgroundColor: 0,
  themeColors: [0],
  fontColor: 0,
  fontName: 0,
})

watch(activeTab, () => {
  if (activeTab.value === 'single') themeStyles.value = getSlidesThemeStyles(currentSlide.value)
  else themeStyles.value = getSlidesThemeStyles(slides.value)

  const themeColors = []
  for (let i = 0; i < Math.min(themeStyles.value.themeColors.length); i++) {
    themeColors.push(i)
  }

  selectedIndex.value = {
    backgroundColor: 0,
    fontColor: 0,
    fontName: 0, 
    themeColors,
  }
}, { immediate: true })

const updateTheme = (themeProps: Partial<SlideTheme>) => {
  slidesStore.setTheme(themeProps)
}

const updateAllThemes = () => {
  let themeColors = themeStyles.value.themeColors.filter((item, index) => selectedIndex.value.themeColors.includes(index))
  if (themeColors.length > 6) {
    themeColors = themeColors.slice(0, 6)
    message.warning('主题色超出数量限制，已自动选取前6个')
  }

  const backgroundColor = themeStyles.value.backgroundColors[selectedIndex.value.backgroundColor]
  const fontColor = themeStyles.value.fontColors[selectedIndex.value.fontColor]
  const fontName = themeStyles.value.fontNames[selectedIndex.value.fontName]

  const data: Partial<SlideTheme> = {}
  if (backgroundColor) data.backgroundColor = backgroundColor
  if (fontColor) data.fontColor = fontColor
  if (fontName) data.fontName = fontName
  if (themeColors.length) data.themeColors = themeColors

  slidesStore.setTheme(data)
  emit('close')
}

const removeThemeColor = (index: number) => {
  if (selectedIndex.value.themeColors.includes(index)) {
    selectedIndex.value.themeColors = selectedIndex.value.themeColors.filter(i => i !== index) 
  }
  else selectedIndex.value.themeColors.push(index)
}

const getMostReadableColor = (color: string) => {
  const colorList = ['#000', '#fff']
  return tinycolor.mostReadable(color, colorList, { includeFallbackColors: true }).toRgbString()
}
const getHexColor = (color: string) => {
  const c = tinycolor(color)
  const alpha = c.getAlpha()
  if (alpha < 1) return c.toHex8String().toUpperCase()
  return c.toHexString().toUpperCase()
}
</script>

<style lang="scss" scoped>
.theme-styles-extract {
  height: 500px;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  overflow: auto;
  padding-right: 20px;
  margin-right: -20px;
}
.config-item {
  padding: 12px 0 10px;
  border-bottom: 1px dashed #f5f5f5;
  font-size: 13px;
}
.label {
  margin-bottom: 5px;
  display: flex;
  align-items: center;

  .tip {
    font-size: 12px;
    color: #999;
  }
}
.values {
  &.inline {
    @include flex-grid-layout();

    .value-wrap {
      @include flex-grid-layout-children(10, 9%);
      margin-top: 0 !important;
      cursor: pointer;
    }
    .value {
      height: 25px;
      padding: 0;

      &.disabled {
        opacity: 0.2;
        position: relative;

        &::after {
          content: '';
          width: 24px;
          height: 2px;
          position: absolute;
          top: 11px;
          left: -1px;
          transform: rotate(-45deg);
          background-color: #000;
        }
        &::before {
          content: '';
          width: 24px;
          height: 2px;
          position: absolute;
          top: 11px;
          left: -1px;
          transform: rotate(45deg);
          background-color: #000;
        }
      }
    }
  }

  .value-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & + .value-wrap {
      margin-top: 3px;
    }
  }
  .handler {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    margin-left: 10px;

    .state {
      opacity: 0;
      font-size: 15px;

      &.active {
        opacity: 1;
      }
    }

    .config-btn {
      cursor: pointer;

      &:hover {
        color: $themeColor;
      }
    }
  }
  .value {
    width: 150px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border: 1px solid $borderColor;
    font-size: 12px;
    padding: 0 5px;
    border-radius: $borderRadius;
    @include ellipsis-oneline();
  }
}
.btns {
  margin-top: 12px;

  .btn {
    width: 100%;
  }
}
</style>
