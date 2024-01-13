<template>
  <marker 
    :id="`${id}-${type}-${position}`" 
    markerUnits="userSpaceOnUse" 
    orient="auto" 
    :markerWidth="size * 3" 
    :markerHeight="size * 3" 
    :refX="size * 1.5" 
    :refY="size * 1.5"
  >
		<path 
      :d="path" 
      :fill="color"
      :transform="`scale(${size * 0.3}, ${size * 0.3}) rotate(${rotate}, 5, 5)`"
    ></path>
	</marker>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  id: string
  position: 'start' | 'end'
  type: 'dot' | 'arrow'
  baseSize: number
  color?: string
}>()

const pathMap = {
  dot: 'm0 5a5 5 0 1 0 10 0a5 5 0 1 0 -10 0z',
  arrow: 'M0,0 L10,5 0,10 Z',
}
const rotateMap: { [key: string]: number } = {
  'arrow-start': 180,
  'arrow-end': 0,
}

const path = computed(() => pathMap[props.type])
const rotate = computed(() => rotateMap[`${props.type}-${props.position}`] || 0)
const size = computed(() => props.baseSize < 2 ? 2 : props.baseSize)
</script>