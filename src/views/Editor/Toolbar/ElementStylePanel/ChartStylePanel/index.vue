<template>
  <div class="chart-style-panel">
    <Button class="full-width-btn" @click="chartDataEditorVisible = true">
      <IconEdit class="btn-icon" /> 编辑图表
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
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" />
      </Popover>
    </div>
    <div class="row">
      <div style="width: 40%;">文字颜色：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="textColor"
            @update:modelValue="value => updateTextColor(value)"
          />
        </template>
        <ColorButton :color="textColor" />
      </Popover>
    </div>

    <Divider />

    <div class="row" v-for="(color, index) in themeColors" :key="index">
      <div style="width: 40%;">{{index === 0 ? '主题配色：' : ''}}</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="color"
            @update:modelValue="value => updateTheme(value, index)"
          />
        </template>
        <div class="color-btn-wrap" style="width: 100%;">
          <ColorButton :color="color" />
          <div class="delete-color-btn" v-tooltip="'删除'" @click.stop="deleteThemeColor(index)" v-if="index !== 0"><IconCloseSmall /></div>
        </div>
      </Popover>
    </div>
    <ButtonGroup class="row" passive>
      <Popover trigger="click" v-model:open="presetThemesVisible" style="width: 40%;">
        <template #content>
          <div class="preset-themes">
            <div class="preset-theme" v-for="(item, index) in CHART_PRESET_THEMES" :key="index">
              <div 
                class="preset-theme-color" 
                :class="{ 'select': presetThemeColorHoverIndex[0] === index && itemIndex <= presetThemeColorHoverIndex[1] }"
                v-for="(color, itemIndex) in item" 
                :key="color" 
                :style="{ backgroundColor: color }" 
                @click="applyPresetTheme(item, itemIndex)"
                @mouseenter="presetThemeColorHoverIndex = [index, itemIndex]"
                @mouseleave="presetThemeColorHoverIndex = [-1, -1]"
              ></div>
            </div>
          </div>
        </template>
        <Button first style="width: 100%;">推荐主题</Button>
      </Popover>
      <Button
        last
        :disabled="themeColors.length >= 10" 
        style="width: 60%;" 
        @click="addThemeColor()"
      >
        <IconPlus class="btn-icon" /> 添加主题色
      </Button>
    </ButtonGroup>

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
import ColorButton from '@/components/ColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Modal from '@/components/Modal.vue'
import Divider from '@/components/Divider.vue'
import Checkbox from '@/components/Checkbox.vue'
import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Popover from '@/components/Popover.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(mainStore)
const { theme } = storeToRefs(slidesStore)

const handleChartElement = handleElement as Ref<PPTChartElement>

const chartDataEditorVisible = ref(false)
const presetThemesVisible = ref(false)
const presetThemeColorHoverIndex = ref<[number, number]>([-1, -1])

const { addHistorySnapshot } = useHistorySnapshot()

const fill = ref<string>('#000')

const themeColors = ref<string[]>([])
const textColor = ref('')
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

// 设置填充色
const updateFill = (value: string) => {
  updateElement({ fill: value })
}

// 设置扩展选项
const updateOptions = (optionProps: ChartOptions) => {
  const _handleElement = handleElement.value as PPTChartElement

  const newOptions = { ..._handleElement.options, ...optionProps }
  updateElement({ options: newOptions })
}

// 设置主题色
const updateTheme = (color: string, index: number) => {
  const props = {
    themeColors: themeColors.value.map((c, i) => i === index ? color : c),
  }
  updateElement(props)
}

// 添加主题色
const addThemeColor = () => {
  const props = {
    themeColors: [...themeColors.value, theme.value.themeColor],
  }
  updateElement(props)
}

// 使用预置主题配色
const applyPresetTheme = (colors: string[], index: number) => {
  const themeColors = colors.slice(0, index + 1)
  updateElement({ themeColors })
  presetThemesVisible.value = false
}

// 删除主题色
const deleteThemeColor = (index: number) => {
  const props = {
    themeColors: themeColors.value.filter((c, i) => i !== index),
  }
  updateElement(props)
}

// 设置文字颜色
const updateTextColor = (textColor: string) => {
  updateElement({ textColor })
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
.btn-icon {
  margin-right: 3px;
}
.color-btn-wrap {
  position: relative;
}
.delete-color-btn {
  position: absolute;
  width: 30px;
  right: 2px;
  top: 2px;
  bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  cursor: pointer;
}
.preset-themes {
  width: 250px;
  display: flex;
  margin-bottom: -10px;

  @include flex-grid-layout();
}
.preset-theme {
  display: flex;
  cursor: pointer;

  @include flex-grid-layout-children(2, 48%);
}
.preset-theme-color {
  width: 20px;
  height: 20px;

  &.select {
    transform: scale(1.2);
    transition: transform $transitionDelayFast;
  }
}
</style>