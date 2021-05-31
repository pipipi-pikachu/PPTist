<template>
  <div class="chart-style-panel">
    <Button class="full-width-btn" @click="chartDataEditorVisible = true">
      <IconEdit class="btn-icon" /> 编辑图表数据
    </Button>

    <Divider />

    <template v-if="handleElement.chartType === 'line'">
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
    <div class="row" v-if="handleElement.chartType === 'bar'">
      <Checkbox 
        @change="e => updateOptions({ horizontalBars: e.target.checked })" 
        :checked="horizontalBars"
      >条形图样式</Checkbox>
    </div>
    <div class="row" v-if="handleElement.chartType === 'pie'">
      <Checkbox 
        @change="e => updateOptions({ donut: e.target.checked })" 
        :checked="donut"
      >环形图样式</Checkbox>
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
      <div style="flex: 2;">主题配色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="themeColor"
            @update:modelValue="value => updateTheme(value)"
          />
        </template>
        <ColorButton :color="themeColor" style="flex: 3;" />
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
        :data="handleElement.data"
        @close="chartDataEditorVisible = false"
        @save="value => updateData(value)"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { IBarChartOptions, ILineChartOptions, IPieChartOptions } from 'chartist'
import { MutationTypes, useStore } from '@/store'
import { ChartData, PPTChartElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '../../common/ElementOutline.vue'
import ColorButton from '../../common/ColorButton.vue'
import ChartDataEditor from './ChartDataEditor.vue'

export default defineComponent({
  name: 'chart-style-panel',
  components: {
    ElementOutline,
    ChartDataEditor,
    ColorButton,
  },
  setup() {
    const store = useStore()
    const handleElement = computed<PPTChartElement>(() => store.getters.handleElement)

    const chartDataEditorVisible = ref(false)

    const { addHistorySnapshot } = useHistorySnapshot()

    const fill = ref<string>()

    const themeColor = ref<string>('')
    const gridColor = ref('')

    const lineSmooth = ref(true)
    const showLine = ref(true)
    const showArea = ref(false)
    const horizontalBars = ref(false)
    const donut = ref(false)

    watch(handleElement, () => {
      if (!handleElement.value || handleElement.value.type !== 'chart') return
      fill.value = handleElement.value.fill || '#000'

      if (handleElement.value.options) {
        const {
          lineSmooth: _lineSmooth,
          showLine: _showLine,
          showArea: _showArea,
          horizontalBars: _horizontalBars,
          donut: _donut,
        } = handleElement.value.options

        if (_lineSmooth !== undefined) lineSmooth.value = _lineSmooth as boolean
        if (_showLine !== undefined) showLine.value = _showLine
        if (_showArea !== undefined) showArea.value = _showArea
        if (_horizontalBars !== undefined) horizontalBars.value = _horizontalBars
        if (_donut !== undefined) donut.value = _donut
      }

      themeColor.value = handleElement.value.themeColor
      gridColor.value = handleElement.value.gridColor || 'rgba(0, 0, 0, 0.4)'
    }, { deep: true, immediate: true })

    // 设置图表数据
    const updateData = (data: ChartData) => {
      chartDataEditorVisible.value = false
      const props = { data }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    // 设置填充色
    const updateFill = (value: string) => {
      const props = { fill: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    // 设置其他选项：柱状图转条形图、折线图转面积图、折线图转散点图、饼图转环形图、折线图开关平滑曲线
    const updateOptions = (optionProps: ILineChartOptions & IBarChartOptions & IPieChartOptions) => {
      const options = handleElement.value.options || {}
      const newOptions = { ...options, ...optionProps }
      const props = { options: newOptions }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    // 设置主题色
    const updateTheme = (themeColor: string) => {
      const props = { themeColor }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    // 设置网格颜色
    const updateGridColor = (gridColor: string) => {
      const props = { gridColor }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
      chartDataEditorVisible,
      handleElement,
      updateData,
      fill,
      updateFill,
      lineSmooth,
      showLine,
      showArea,
      horizontalBars,
      donut,
      updateOptions,
      themeColor,
      gridColor,
      updateTheme,
      updateGridColor,
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
.full-width-btn {
  width: 100%;
}
.btn-icon {
  margin-right: 3px;
}
</style>