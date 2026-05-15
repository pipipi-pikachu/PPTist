<template>
  <div class="toolbar-content">
    <button class="toolbar-btn" @click="openDataEditor()">
      <i-icon-park-outline:edit class="icon" />
      <span>编辑数据</span>
    </button>
    <Popover trigger="click">
      <template #content>
        <div class="chart-type-list">
          <PopoverMenuItem
            center
            v-for="item in chartList"
            :key="item"
            @click="changeChartType(item)"
          >{{ CHART_TYPE_MAP[item] }}</PopoverMenuItem>
        </div>
      </template>
      <button class="toolbar-btn">
        <i-icon-park-outline:chart-histogram class="icon" />
        <span>类型</span>
      </button>
    </Popover>
  </div>
</template>

<script lang="ts" setup>
import { type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore, useMainStore } from '@/store'
import type { ChartType, PPTChartElement } from '@/types/slides'
import { CHART_TYPE_MAP } from '@/configs/chart'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'

defineProps<{
  elementInfo: PPTChartElement
}>()

const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(useMainStore())

const handleChartElement = handleElement as Ref<PPTChartElement>

const chartList: ChartType[] = ['bar', 'column', 'line', 'area', 'scatter', 'pie', 'ring', 'radar']

const { addHistorySnapshot } = useHistorySnapshot()

const openDataEditor = () => {
  emitter.emit(EmitterEvents.OPEN_CHART_DATA_EDITOR)
}

const changeChartType = (type: ChartType) => {
  if (!handleChartElement.value || handleChartElement.value.chartType === type) return
  slidesStore.updateElement({ id: handleElementId.value, props: { chartType: type } })
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.toolbar-content {
  width: max-content;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  gap: 4px;
}
.toolbar-btn {
  min-width: 30px;
  height: 30px;
  flex-shrink: 0;
  padding: 0 5px;
  border: 0;
  color: $textColor;
  background-color: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  border-radius: $borderRadius;
  cursor: pointer;

  &:hover {
    background-color: $lightGray;
  }

  .icon {
    flex-shrink: 0;
    font-size: 16px;
  }
  span {
    flex-shrink: 0;
    font-size: 12px;
    margin-left: 5px;
  }
}
.chart-type-list {
  width: 120px;
}
</style>
