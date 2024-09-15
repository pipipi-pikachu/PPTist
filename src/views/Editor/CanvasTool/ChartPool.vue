<template>
  <ul class="chart-pool">
    <li class="chart-item" v-for="(chart, index) in chartList" :key="index">
      <div class="chart-content" @click="selectChart(chart)">
        <IconChartLine size="24" v-if="chart === 'line'" />
        <IconChartHistogram size="24" v-else-if="chart === 'bar'" />
        <IconChartPie size="24" v-else-if="chart === 'pie'" />
        <IconChartHistogramOne size="24" v-else-if="chart === 'column'" />
        <IconChartLineArea size="24" v-else-if="chart === 'area'" />
        <IconChartRing size="24" v-else-if="chart === 'ring'" />
        <IconChartScatter size="24" v-else-if="chart === 'scatter'" />
        <IconRadarChart size="23" v-else-if="chart === 'radar'" />

        <div class="name">{{ CHART_TYPE_MAP[chart] }}</div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { ChartType } from '@/types/slides'
import { CHART_TYPE_MAP } from '@/configs/chart'

const emit = defineEmits<{
  (event: 'select', payload: ChartType): void
}>()

const chartList: ChartType[] = ['bar', 'column', 'line', 'area', 'scatter', 'pie', 'ring', 'radar']

const selectChart = (chart: ChartType) => {
  emit('select', chart)
}
</script>

<style lang="scss" scoped>
.chart-pool {
  width: 240px;
  margin-bottom: -5px;

  @include flex-grid-layout();
}
.chart-item {
  @include flex-grid-layout-children(4, 24%);

  height: 0;
  padding-bottom: 25%;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
}
.chart-content {
  @include absolute-0();

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;

  &:hover {
    color: $themeColor;
  }

  .name {
    margin-top: 4px;
  }
}
</style>