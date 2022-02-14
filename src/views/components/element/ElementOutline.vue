<template>
  <svg 
    class="element-outline"
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
      :d="`M0,0 L${width},0 L${width},${height} L0,${height} Z`" 
      :stroke="outlineColor"
      :stroke-width="outlineWidth" 
      :stroke-dasharray="outlineStyle === 'dashed' ? '10 6' : '0 0'" 
    ></path>
	</svg>
</template>

<script lang="ts">
import { PropType, defineComponent, toRef } from 'vue'
import { PPTElementOutline } from '@/types/slides'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'

export default defineComponent({
  name: 'element-outline',
  props: {
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
  },
  setup(props) {
    const {
      outlineWidth,
      outlineStyle,
      outlineColor,
    } = useElementOutline(toRef(props, 'outline'))

    return {
      outlineWidth,
      outlineStyle,
      outlineColor,
    }
  },
})
</script>

<style lang="scss" scoped>
svg {
  overflow: visible;
  position: absolute;
  top: 0;
  left: 0;
}
</style>