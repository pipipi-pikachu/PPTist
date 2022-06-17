<template>
  <ul class="chart-pool">
    <li class="chart-item" v-for="(chart, index) in chartList" :key="index">
      <div class="chart-content" @click="selectChart(chart)">
        <IconChartLine size="24" v-if="chart === 'line'" />
        <IconChartHistogram size="24" v-else-if="chart === 'bar'" />
        <IconChartPie size="24" v-else-if="chart === 'pie'" />
        <IconChartHistogramOne size="24" v-else-if="chart === 'horizontalBar'" />
        <IconChartLineArea size="24" v-else-if="chart === 'area'" />
        <IconChartRing size="24" v-else-if="chart === 'ring'" />
        <IconChartScatter size="24" v-else-if="chart === 'scatter'" />
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { PresetChartType } from '@/types/slides'

const emit = defineEmits<{
  (event: 'select', payload: PresetChartType): void
}>()

const chartList: PresetChartType[] = ['bar', 'horizontalBar', 'line', 'area', 'scatter', 'pie', 'ring']

const selectChart = (chart: PresetChartType) => {
  emit('select', chart)
}
</script>

<style lang="scss" scoped>
.chart-pool {
  width: 200px;
  margin-bottom: -5px;

  @include flex-grid-layout();
}
.chart-item {
  @include flex-grid-layout-children(5, 19%);

  height: 0;
  padding-bottom: 19%;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
}
.chart-content {
  @include absolute-0();

  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;

  &:hover {
    color: $themeColor;
  }
}
</style>