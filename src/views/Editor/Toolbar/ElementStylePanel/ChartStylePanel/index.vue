<template>
  <div class="chart-style-panel">
    <Button class="full-width-btn" @click="chartDataEditorVisible = true">
      <IconEdit /> 编辑图表
    </Button>

    <Divider />

    <template v-if="['bar', 'column', 'area', 'line'].includes(handleChartElement.chartType)">
      <div class="row">
        <Checkbox 
          @update:value="value => updateOptions({ stack: value })" 
          :value="stack"
          style="flex: 2;"
        >堆叠样式</Checkbox>
        <Checkbox 
          v-if="handleChartElement.chartType === 'line'"
          @update:value="value => updateOptions({ lineSmooth: value })" 
          :value="lineSmooth"
          style="flex: 3;"
        >使用平滑曲线</Checkbox>
      </div>
  
      <Divider />
    </template>

    <div class="row">
      <div style="width: 40%;">背景填充：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateElement({ fill: value })"
          />
        </template>
        <ColorButton :color="fill" />
      </Popover>
    </div>
    <div class="row">
      <div style="width: 40%;">坐标与文字：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="textColor"
            @update:modelValue="value => updateElement({ textColor: value })"
          />
        </template>
        <ColorButton :color="textColor" />
      </Popover>
    </div>
    <div class="row">
      <div style="width: 40%;">网格颜色：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="lineColor"
            @update:modelValue="value => updateElement({ lineColor: value })"
          />
        </template>
        <ColorButton :color="lineColor" />
      </Popover>
    </div>

    <div class="row">
      <div style="width: 40%;">主题配色：</div>
      <Popover trigger="click" v-model:value="themesVisible" style="width: 60%;">
        <template #content>
          <div class="themes">
            <div class="label">预置图表主题：</div>
            <div class="preset-themes">
              <div class="preset-theme" v-for="(item, index) in CHART_PRESET_THEMES" :key="index" @click="setThemeColors(item)">
                <div 
                  class="preset-theme-color"
                  v-for="color in item" 
                  :key="color" 
                  :style="{ backgroundColor: color }" 
                ></div>
              </div>
            </div>
            <div class="label">幻灯片主题：</div>
            <div class="preset-themes" :style="{ marginBottom: '-10px' }">
              <div class="preset-theme" @click="setThemeColors(theme.themeColors)">
                <div 
                  class="preset-theme-color"
                  v-for="color in theme.themeColors" 
                  :key="color" 
                  :style="{ backgroundColor: color }" 
                ></div>
              </div>
            </div>
            <Divider :margin="10" />
            <Button class="full-width-btn" @click="themesVisible = false; themeColorsSettingVisible = true">自定义配色</Button>
          </div>
        </template>
        <ColorListButton :colors="themeColors" />
      </Popover>
    </div>

    <Divider />

    <ElementOutline />

    <Modal
      v-model:visible="chartDataEditorVisible" 
      :width="640"
    >
      <ChartDataEditor 
        :type="handleChartElement.chartType"
        :data="handleChartElement.data"
        @close="chartDataEditorVisible = false"
        @save="value => updateData(value)"
      />
    </Modal>

    <Modal
      v-model:visible="themeColorsSettingVisible" 
      :width="310"
      @closed="themeColorsSettingVisible = false"
    >
      <ThemeColorsSetting :colors="themeColors" @update="colors => setThemeColors(colors)" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { ChartData, ChartOptions, ChartType, PPTChartElement } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import { CHART_PRESET_THEMES } from '@/configs/chart'

import ElementOutline from '../../common/ElementOutline.vue'
import ChartDataEditor from './ChartDataEditor.vue'
import ThemeColorsSetting from './ThemeColorsSetting.vue'
import ColorButton from '@/components/ColorButton.vue'
import ColorListButton from '@/components/ColorListButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Modal from '@/components/Modal.vue'
import Divider from '@/components/Divider.vue'
import Checkbox from '@/components/Checkbox.vue'
import Button from '@/components/Button.vue'
import Popover from '@/components/Popover.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(mainStore)
const { theme } = storeToRefs(slidesStore)

const handleChartElement = handleElement as Ref<PPTChartElement>

const chartDataEditorVisible = ref(false)
const themesVisible = ref(false)
const themeColorsSettingVisible = ref(false)

const { addHistorySnapshot } = useHistorySnapshot()

const fill = ref<string>('#000')

const themeColors = ref<string[]>([])
const textColor = ref('')
const lineColor = ref('')
const lineSmooth = ref(false)
const stack = ref(false)

watch(handleElement, () => {
  if (!handleElement.value || handleElement.value.type !== 'chart') return
  fill.value = handleElement.value.fill || '#fff'

  lineSmooth.value = false
  stack.value = false

  if (handleElement.value.options) {
    const {
      lineSmooth: _lineSmooth,
      stack: _stack,
    } = handleElement.value.options

    if (_lineSmooth !== undefined) lineSmooth.value = _lineSmooth
    if (_stack !== undefined) stack.value = _stack
  }

  themeColors.value = handleElement.value.themeColors
  textColor.value = handleElement.value.textColor || '#333'
  lineColor.value = handleElement.value.lineColor || '#e8ecf4'
}, { deep: true, immediate: true })

const updateElement = (props: Partial<PPTChartElement>) => {
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

// 设置图表数据
const updateData = (payload: {
  data: ChartData
  type: ChartType
}) => {
  chartDataEditorVisible.value = false
  updateElement({ data: payload.data, chartType: payload.type })
}

// 设置扩展选项
const updateOptions = (optionProps: ChartOptions) => {
  const _handleElement = handleElement.value as PPTChartElement

  const newOptions = { ..._handleElement.options, ...optionProps }
  updateElement({ options: newOptions })
}

// 使用预置主题配色
const setThemeColors = (colors: string[]) => {
  updateElement({ themeColors: colors })
  themesVisible.value = false
  themeColorsSettingVisible.value = false
}

const openDataEditor = () => chartDataEditorVisible.value = true

emitter.on(EmitterEvents.OPEN_CHART_DATA_EDITOR, openDataEditor)
onUnmounted(() => {
  emitter.off(EmitterEvents.OPEN_CHART_DATA_EDITOR, openDataEditor)
})
</script>

<style lang="scss" scoped>
.chart-style-panel {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.full-width-btn {
  width: 100%;
}
.label {
  font-size: 12px;
  margin-bottom: 4px;
}
.preset-themes {
  width: 250px;
  display: flex;

  @include flex-grid-layout();
}
.preset-theme {
  display: flex;
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 2px;
  border-radius: $borderRadius;
  @include flex-grid-layout-children(2, 48%);

  &:hover {
    border-color: $themeColor;
    transition: border-color $transitionDelayFast;
  }
}
.preset-theme-color {
  height: 20px;
  flex: 1;
}
</style>