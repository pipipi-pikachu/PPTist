<template>
  <ul class="chart-pool">
    <li class="chart-item" v-for="(chart, index) in chartList" :key="index">
      <div class="chart-content" @click="selectChart(chart)">
        <IconChartLine size="24" v-if="chart === 'line'" />
        <IconChartHistogram size="24" v-else-if="chart === 'bar'" />
        <IconChartPie size="24" v-else-if="chart === 'pie'" />
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'chart-pool',
  emits: ['select'],
  setup(props, { emit }) {
    const chartList = ['bar', 'line', 'pie']

    const selectChart = (chart: string) => {
      emit('select', chart)
    }

    return {
      chartList,
      selectChart,
    }
  },
})
</script>

<style lang="scss" scoped>
.chart-pool {
  width: 120px;
  margin-bottom: -5px;

  @include flex-grid-layout();
}
.chart-item {
  @include flex-grid-layout-children(3, 32%);

  height: 0;
  padding-bottom: 32%;
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