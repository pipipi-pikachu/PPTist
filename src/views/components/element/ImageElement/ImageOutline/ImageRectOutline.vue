<template>
  <svg 
    class="image-rect-outline" 
    v-if="outline"
    overflow="visible" 
    :width="width"
    :height="height"
  >
    <rect 
      vector-effect="non-scaling-stroke" 
      stroke-linecap="butt" 
      stroke-miterlimit="8"
      fill="transparent"
      :rx="radius" 
      :ry="radius"
      :width="width"
      :height="height"
      :stroke="outlineColor"
      :stroke-width="outlineWidth" 
      :stroke-dasharray="strokeDashArray" 
    ></rect>
	</svg>
</template>

<script lang="ts" setup>
import { toRef } from 'vue'
import type { PPTElementOutline } from '@/types/slides'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'

const props = withDefaults(defineProps<{
  width: number
  height: number
  outline?: PPTElementOutline
  radius?: string
}>(), {
  radius: '0',
})

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