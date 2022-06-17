<template>
  <div class="symbol-content" v-html="svg"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { hfmath } from './hfmath'

const props = defineProps({
  latex: {
    type: String,
    required: true,
  },
})

const svg = computed(() => {
  const eq = new hfmath(props.latex)
  return eq.svg({
    SCALE_X: 10,
    SCALE_Y: 10,
  })
})
</script>
