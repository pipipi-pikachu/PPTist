<template>
  <svg 
    class="image-polygon-outline" 
    v-if="outline"
    overflow="visible" 
    :width="width"
    :height="height"
  >
    <path 
      vector-effect="non-scaling-stroke" 
      stroke-linecap="butt" 
      stroke-miterlimit="8"
      fill="transparent"
      :d="createPath(width, height)"
      :stroke="outlineColor"
      :stroke-width="outlineWidth" 
      :stroke-dasharray="outlineStyle === 'dashed' ? '10 6' : '0 0'" 
    ></path>
	</svg>
</template>

<script lang="ts" setup>
import { PropType, toRef } from 'vue'
import { PPTElementOutline } from '@/types/slides'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'

const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  outline: {
    type: Object as PropType<PPTElementOutline>
  },
  createPath: {
    type: Function,
    required: true,
  },
})

const {
  outlineWidth,
  outlineStyle,
  outlineColor,
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