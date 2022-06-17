<template>
  <linearGradient 
    v-if="type === 'linear'"
    :id="id" 
    x1="0%" 
    y1="0%" 
    x2="100%" 
    y2="0%" 
    :gradientTransform="`rotate(${rotate},0.5,0.5)`"
  >
    <stop offset="0%" :stop-color="color1" />
    <stop offset="100%" :stop-color="color2" />
  </linearGradient>

  <radialGradient :id="id" v-else>
    <stop offset="0%" :stop-color="color1" />
    <stop offset="100%" :stop-color="color2" />
  </radialGradient>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<'linear' | 'radial'>,
  },
  color1: {
    type: String,
    required: true,
  },
  color2: {
    type: String,
    required: true,
  },
  rotate: {
    type: Number,
    default: 0,
  },
})
</script>