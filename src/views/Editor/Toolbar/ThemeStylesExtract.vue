<template>
  <div class="theme-styles-extract">
    <Tabs 
      :tabs="tabs" 
      v-model:value="activeTab" 
      :tabsStyle="{ marginBottom: '12px' }" 
      :tabStyle="{ padding: '8px 12px' }" 
    />
    <div class="content">
      <div class="config-item">
        <div class="label">字体：</div>
        <div class="values">
          <div class="value-wrap" v-for="(item, index) in themeStyles.fontNames" :key="item">
            <div class="value" :style="{ fontFamily: item }">{{ fontMap[item] || item }}</div>
            <div class="handler">
              <div class="state" :class="{ 'active': selectedIndex.fontName === index }">√</div>
              <div class="config-btn" @click="selectedIndex.fontName = index">选择</div>
              <div class="config-btn" @click="updateTheme({ fontName: item }); selectedIndex.fontName = index">配置到主题</div>
            </div>
          </div>
        </div>
      </div>
      <div class="config-item">
        <div class="label">文字颜色：</div>
        <div class="values">
          <div class="value-wrap" v-for="(item, index) in themeStyles.fontColors" :key="item">
            <div class="value" :style="{ backgroundColor: item }"></div>
            <div class="handler">
              <div class="state" :class="{ 'active': selectedIndex.fontColor === index }">√</div>
              <div class="config-btn" @click="selectedIndex.fontColor = index">选择</div>
              <div class="config-btn" @click="updateTheme({ fontColor: item }); selectedIndex.fontColor = index">配置到主题</div>
            </div>
          </div>
        </div>
      </div>
      <div class="config-item">
        <div class="label">背景颜色：</div>
        <div class="values">
          <div class="value-wrap" v-for="(item, index) in themeStyles.backgroundColors" :key="item">
            <div class="value" :style="{ backgroundColor: item }"></div>
            <div class="handler">
              <div class="state" :class="{ 'active': selectedIndex.backgroundColor === index }">√</div>
              <div class="config-btn" @click="selectedIndex.backgroundColor = index">选择</div>
              <div class="config-btn" @click="updateTheme({ backgroundColor: item }); selectedIndex.backgroundColor = index">配置到主题</div>
            </div>
          </div>
        </div>
      </div>
      <div class="config-item">
        <div class="label">主题色：</div>
        <div class="values">
          <div class="value-wrap" v-for="(item, index) in themeStyles.themeColors" :key="item">
            <div class="value" :style="{ backgroundColor: item }"></div>
            <div class="handler">
              <div class="state" :class="{ 'active': selectedIndex.themeColor === index }">√</div>
              <div class="config-btn" @click="selectedIndex.themeColor = index">选择</div>
              <div class="config-btn" @click="updateTheme({ themeColor: item }); selectedIndex.themeColor = index">配置到主题</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="btns">
      <Button class="btn" type="primary" @click="updateAllThemes()">将选中配置保存为主题</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { SYS_FONTS, WEB_FONTS } from '@/configs/font'
import useSlideTheme from '@/hooks/useSlideTheme'
import Tabs from '@/components/Tabs.vue'
import Button from '@/components/Button.vue'
import type { SlideTheme } from '@/types/slides'

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
  for (const item of SYS_FONTS) {
    map[item.value] = item.label
  }
  for (const item of WEB_FONTS) {
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
  themeColor: 0,
  fontColor: 0,
  fontName: 0,
})

watch(activeTab, () => {
  if (activeTab.value === 'single') themeStyles.value = getSlidesThemeStyles(currentSlide.value)
  else themeStyles.value = getSlidesThemeStyles(slides.value)
})
onMounted(() => {
  themeStyles.value = getSlidesThemeStyles(currentSlide.value)
})

const updateTheme = (themeProps: Partial<SlideTheme>) => {
  slidesStore.setTheme(themeProps)
}

const updateAllThemes = () => {
  slidesStore.setTheme({
    backgroundColor: themeStyles.value.backgroundColors[selectedIndex.value.backgroundColor],
    themeColor: themeStyles.value.themeColors[selectedIndex.value.themeColor],
    fontColor: themeStyles.value.fontColors[selectedIndex.value.fontColor],
    fontName: themeStyles.value.fontNames[selectedIndex.value.fontName],
  })
  emit('close')
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
  margin-bottom: 5px
}
.values {
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
    height: 24px;
    border: 1px solid $borderColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding: 5px;
    border-radius: $borderRadius;
  }
}
.btns {
  margin-top: 12px;

  .btn {
    width: 100%;
  }
}
</style>
