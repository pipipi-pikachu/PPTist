<template>
  <div class="chart-style-panel">
    <Button class="full-width-btn" @click="chartDataEditorVisible = true">
      <IconEdit class="btn-icon" /> 编辑图表数据
    </Button>

    <Divider />

    <template v-if="handleChartElement.chartType === 'line'">
      <div class="row">
        <Checkbox 
          @change="e => updateOptions({ showArea: e.target.checked })"
          :checked="showArea" 
          style="flex: 1;"
        >面积图样式</Checkbox>
        <Checkbox 
          @change="e => updateOptions({ showLine: !e.target.checked })"
          :checked="!showLine" 
          style="flex: 1;"
        >散点图样式</Checkbox>
      </div>
      <div class="row">
        <Checkbox 
          @change="e => updateOptions({ lineSmooth: e.target.checked })" 
          :checked="lineSmooth"
        >使用平滑曲线</Checkbox>
      </div>
    </template>
    <div class="row" v-if="handleChartElement.chartType === 'bar'">
      <Checkbox 
        @change="e => updateOptions({ horizontalBars: e.target.checked })" 
        :checked="horizontalBars"
      >条形图样式</Checkbox>
      <Checkbox 
        @change="e => updateOptions({ stackBars: e.target.checked })" 
        :checked="stackBars"
      >堆叠样式</Checkbox>
    </div>
    <div class="row" v-if="handleChartElement.chartType === 'pie'">
      <Checkbox 
        @change="e => updateOptions({ donut: e.target.checked })" 
        :checked="donut"
      >环形图样式</Checkbox>
    </div>

    <Divider />

    <div class="row">
      <div style="flex: 2;">图例：</div>
      <Select style="flex: 3;" :value="legend" @change="value => updateLegend(value as '' | 'top' | 'bottom')">
        <SelectOption value="">不显示</SelectOption>
        <SelectOption value="top">显示在上方</SelectOption>
        <SelectOption value="bottom">显示在下方</SelectOption>
      </Select>
    </div>

    <Divider />

    <div class="row">
      <div style="flex: 2;">背景填充：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">网格颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="gridColor"
            @update:modelValue="value => updateGridColor(value)"
          />
        </template>
        <ColorButton :color="gridColor" style="flex: 3;" />
      </Popover>
    </div>

    <Divider />

    <div class="row" v-for="(color, index) in themeColor" :key="index">
      <div style="flex: 2;">{{index === 0 ? '主题配色：' : ''}}</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="color"
            @update:modelValue="value => updateTheme(value, index)"
          />
        </template>
        <div class="color-btn-wrap" style="flex: 3;">
          <ColorButton :color="color" style="width: 100%;" />
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="删除">
            <div class="delete-color-btn" @click.stop="deleteThemeColor(index)" v-if="index !== 0"><IconCloseSmall /></div>
          </Tooltip>
        </div>
      </Popover>
    </div>
    <ButtonGroup class="row">
      <Popover trigger="click" v-model:visible="presetThemesVisible">
        <template #content>
          <div class="preset-themes">
            <div class="preset-theme" v-for="(item, index) in presetChartThemes" :key="index">
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
        <Button class="no-padding" style="flex: 2;">推荐主题</Button>
      </Popover>
      <Button 
        class="no-padding" 
        :disabled="themeColor.length >= 10" 
        style="flex: 3;" 
        @click="addThemeColor()"
      >
        <IconPlus class="btn-icon" /> 添加主题色
      </Button>
    </ButtonGroup>

    <Divider />

    <ElementOutline />

    <Modal
      v-model:visible="chartDataEditorVisible" 
      :footer="null" 
      centered
      :closable="false"
      :width="648"
      destroyOnClose
    >
      <ChartDataEditor 
        :data="handleChartElement.data"
        @close="chartDataEditorVisible = false"
        @save="value => updateData(value)"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, Ref, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { ChartData, ChartOptions, PPTChartElement } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '../../common/ElementOutline.vue'
import ColorButton from '../../common/ColorButton.vue'
import ChartDataEditor from './ChartDataEditor.vue'

const presetChartThemes = [
  ['#d87c7c', '#919e8b', '#d7ab82', '#6e7074', '#61a0a8', '#efa18d'],
  ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78'],
  ['#516b91', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0', '#cbb0e3'],
  ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4'],
  ['#4ea397', '#22c3aa', '#7bd9a5', '#d0648a', '#f58db2', '#f2b3c9'],
  ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8'],
  ['#fc97af', '#87f7cf', '#f7f494', '#72ccff', '#f7c5a0', '#d4a4eb'],
  ['#c1232b', '#27727b', '#fcce10', '#e87c25', '#b5c334', '#fe8463'],
  ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
  ['#e01f54', '#001852', '#f5e8c8', '#b8d2c7', '#c6b38e', '#a4d8c2'],
  ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8'],
  ['#8a7ca8', '#e098c7', '#8fd3e8', '#71669e', '#cc70af', '#7cb4cc'],
]

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

const themeColor = ref<string[]>([])
const gridColor = ref('')
const legend = ref('')

const lineSmooth = ref(true)
const showLine = ref(true)
const showArea = ref(false)
const horizontalBars = ref(false)
const donut = ref(false)
const stackBars = ref(false)

watch(handleElement, () => {
  if (!handleElement.value || handleElement.value.type !== 'chart') return
  fill.value = handleElement.value.fill || '#fff'

  if (handleElement.value.options) {
    const {
      lineSmooth: _lineSmooth,
      showLine: _showLine,
      showArea: _showArea,
      horizontalBars: _horizontalBars,
      donut: _donut,
      stackBars: _stackBars,
    } = handleElement.value.options

    if (_lineSmooth !== undefined) lineSmooth.value = _lineSmooth as boolean
    if (_showLine !== undefined) showLine.value = _showLine
    if (_showArea !== undefined) showArea.value = _showArea
    if (_horizontalBars !== undefined) horizontalBars.value = _horizontalBars
    if (_donut !== undefined) donut.value = _donut
    if (_stackBars !== undefined) stackBars.value = _stackBars
  }

  themeColor.value = handleElement.value.themeColor
  gridColor.value = handleElement.value.gridColor || '#333'
  legend.value = handleElement.value.legend || ''
}, { deep: true, immediate: true })

const updateElement = (props: Partial<PPTChartElement>) => {
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

// 设置图表数据
const updateData = (data: ChartData) => {
  chartDataEditorVisible.value = false
  updateElement({ data })
}

// 设置填充色
const updateFill = (value: string) => {
  updateElement({ fill: value })
}

// 设置其他选项：柱状图转条形图、折线图转面积图、折线图转散点图、饼图转环形图、折线图开关平滑曲线
const updateOptions = (optionProps: ChartOptions) => {
  const _handleElement = handleElement.value as PPTChartElement

  const newOptions = { ..._handleElement.options, ...optionProps }
  updateElement({ options: newOptions })
}

// 设置主题色
const updateTheme = (color: string, index: number) => {
  const props = {
    themeColor: themeColor.value.map((c, i) => i === index ? color : c),
  }
  updateElement(props)
}

// 添加主题色
const addThemeColor = () => {
  const props = {
    themeColor: [...themeColor.value, theme.value.themeColor],
  }
  updateElement(props)
}

// 使用预置主题配色
const applyPresetTheme = (colors: string[], index: number) => {
  const themeColor = colors.slice(0, index + 1)
  updateElement({ themeColor })
  presetThemesVisible.value = false
}

// 删除主题色
const deleteThemeColor = (index: number) => {
  const props = {
    themeColor: themeColor.value.filter((c, i) => i !== index),
  }
  updateElement(props)
}

// 设置网格颜色
const updateGridColor = (gridColor: string) => {
  updateElement({ gridColor })
}

// 设置图例位置/不显示
const updateLegend = (legend: '' | 'top' | 'bottom') => {
  updateElement({ legend })
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