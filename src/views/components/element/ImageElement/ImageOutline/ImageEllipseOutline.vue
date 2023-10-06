<template>
  <svg 
    class="image-ellipse-outline"
    v-if="outline"
    overflow="visible" 
    :width="width"
    :height="height"
  >
    <ellipse 
      vector-effect="non-scaling-stroke" 
      stroke-linecap="butt" 
      stroke-miterlimit="8"
      fill="transparent"
      :cx="width / 2" 
      :cy="height / 2"
      :rx="width / 2" 
      :ry="height / 2"
      :stroke="outlineColor"
      :stroke-width="outlineWidth" 
      :stroke-dasharray="strokeDashArray" 
    ></ellipse>
	</svg>
</template>

<script lang="ts" setup>
import { toRef } from 'vue'
import type { PPTElementOutline } from '@/types/slides'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'

const props = defineProps<{
  width: number
  height: number
  outline?: PPTElementOutline
}>()

const {
  outlineWidth,
  outlineColor,
  strokeDashArray,
} = useElementOutline(toRef(props, 'outline'))
</script>

<style lang="scss" scoped>
svg {
  overflow: visible;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
}
</style>