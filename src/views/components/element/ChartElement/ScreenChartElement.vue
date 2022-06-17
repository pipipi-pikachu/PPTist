<template>
  <BaseChartElement class="screen-element-chart" :elementInfo="elementInfo" />
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { PPTChartElement } from '@/types/slides'

import BaseChartElement from './BaseChartElement.vue'

defineProps({
  elementInfo: {
    type: Object as PropType<PPTChartElement>,
    required: true,
  },
})
</script>
