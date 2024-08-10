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
    <stop v-for="(item, index) in colors" :key="index" :offset="`${item.pos}%`" :stop-color="item.color" />
  </linearGradient>

  <radialGradient :id="id" v-else>
    <stop v-for="(item, index) in colors" :key="index" :offset="`${item.pos}%`" :stop-color="item.color" />
  </radialGradient>
</template>

<script lang="ts" setup>
import type { GradientColor, GradientType } from '@/types/slides'

withDefaults(defineProps<{
  id: string
  type: GradientType
  colors: GradientColor[]
  rotate?: number
}>(), {
  rotate: 0,
})
</script>