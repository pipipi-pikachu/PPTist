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
      stroke-linejoin
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

<script lang="ts">
import { PropType, defineComponent, toRef } from 'vue'
import { PPTElementOutline } from '@/types/slides'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'

export default defineComponent({
  name: 'image-ellipse-outline',
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
  z-index: 2;
  top: 0;
  left: 0;
}
</style>