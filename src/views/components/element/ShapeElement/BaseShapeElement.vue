<template>
  <div class="base-element-shape"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
    }"
  >
    <div 
      class="element-content"
      :style="{
        opacity: elementInfo.opacity,
        filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
      }"
    >
      <SvgWrapper 
        overflow="visible" 
        :width="elementInfo.width"
        :height="elementInfo.height"
      >
        <g 
          :transform="`scale(${elementInfo.width / elementInfo.viewBox}, ${elementInfo.height / elementInfo.viewBox}) translate(0,0) matrix(1,0,0,1,0,0)`"
        >
          <path 
            vector-effect="non-scaling-stroke" 
            stroke-linecap="butt" 
            stroke-miterlimit="8"
            stroke-linejoin="" 
            :d="elementInfo.path" 
            :fill="elementInfo.fill"
            :stroke="outlineColor"
            :stroke-width="outlineWidth" 
            :stroke-dasharray="outlineStyle === 'dashed' ? '10 5' : '0 0'" 
          ></path>
        </g>
			</SvgWrapper>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTShapeElement } from '@/types/slides'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'

export default defineComponent({
  name: 'base-element-shape',
  props: {
    elementInfo: {
      type: Object as PropType<PPTShapeElement>,
      required: true,
    },
  },
  setup(props) {
    const outline = computed(() => props.elementInfo.outline)
    const { outlineWidth, outlineStyle, outlineColor } = useElementOutline(outline)
    
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    return {
      shadowStyle,
      outlineWidth,
      outlineStyle,
      outlineColor,
    }
  },
})
</script>

<style lang="scss" scoped>
.base-element-shape {
  position: absolute;
}

.element-content {
  width: 100%;
  height: 100%;
  position: relative;

  svg {
    transform-origin: 0 0;
    overflow: visible;
  }
}
</style>
