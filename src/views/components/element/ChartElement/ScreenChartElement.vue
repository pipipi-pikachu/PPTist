<template>
  <BaseChartElement class="screen-element-chart" :elementInfo="elementInfo" />
</template>

<script lang="ts" setup>
import type { PPTChartElement } from '@/types/slides'

import BaseChartElement from './BaseChartElement.vue'

defineProps<{
  elementInfo: PPTChartElement
}>()
</script>
