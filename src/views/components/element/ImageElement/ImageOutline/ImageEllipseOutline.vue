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
      :stroke-dasharray="outlineStyle === 'dashed' ? '10 6' : '0 0'" 
    ></ellipse>
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