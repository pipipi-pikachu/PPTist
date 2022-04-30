<template>
  <BaseChartElement class="screen-element-chart" :elementInfo="elementInfo" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PPTChartElement } from '@/types/slides'

import BaseChartElement from './BaseChartElement.vue'

export default defineComponent({
  name: 'screen-element-chart',
  components: {
    BaseChartElement,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTChartElement>,
      required: true,
    },
  },
})
</script>
