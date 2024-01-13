<template>
  <div class="checkerboard" :style="bgStyle"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: number
  white?: string
  grey?: string
}>(), {
  size: 8,
  white: '#fff',
  grey: '#e6e6e6',
})

interface CheckboardCache {
  [key: string]: string | null
}
const checkboardCache: CheckboardCache = {}

const renderCheckboard = (white: string, grey: string, size: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size * 2
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return null

  ctx.fillStyle = white
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = grey
  ctx.fillRect(0, 0, size, size)
  ctx.translate(size, size)
  ctx.fillRect(0, 0, size, size)
  return canvas.toDataURL()
}

const getCheckboard = (white: string, grey: string, size: number) => {
  const key = white + ',' + grey + ',' + size
  if (checkboardCache[key]) return checkboardCache[key]
  
  const checkboard = renderCheckboard(white, grey, size)
  checkboardCache[key] = checkboard
  return checkboard
}

const bgStyle = computed(() => {
  const checkboard = getCheckboard(props.white, props.grey, props.size)
  return { backgroundImage: `url(${checkboard})` }
})
</script>

<style lang="scss" scoped>
.checkerboard {
  background-size: contain;

  @include absolute-0();
}
</style>