<template>
  <div 
    class="editable-element-image"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
    }"
    @mousedown="$event => handleSelectElement($event)" 
  >
    <div 
      class="element-content"
      v-contextmenu="contextmenus"
      :style="{
        filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
        transform: flip,
      }"
    >
      <ImageRectOutline
        v-if="clipShape.type === 'rect'"
        :width="elementInfo.width"
        :height="elementInfo.height"
        :radius="clipShape.radius"
        :outline="elementInfo.outline"
      />
      <ImageEllipseOutline
        v-else-if="clipShape.type === 'ellipse'"
        :width="elementInfo.width"
        :height="elementInfo.height"
        :outline="elementInfo.outline"
      />
      <ImagePolygonOutline
        v-else-if="clipShape.type === 'polygon'"
        :width="elementInfo.width"
        :height="elementInfo.height"
        :outline="elementInfo.outline"
        :createPath="clipShape.createPath"
      />

      <div class="image-content" :style="{clipPath: clipShape.style}">
        <img 
          :src="elementInfo.src" 
          :draggable="false" 
          :style="{
            top: imgPosition.top,
            left: imgPosition.left,
            width: imgPosition.width,
            height: imgPosition.height,
            filter: filter,
          }" 
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { PPTImageElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { CLIPPATHS, ClipPathTypes } from '@/configs/imageClip'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'

import ImageRectOutline from './ImageRectOutline.vue'
import ImageEllipseOutline from './ImageEllipseOutline.vue'
import ImagePolygonOutline from './ImagePolygonOutline.vue'


export default defineComponent({
  name: 'editable-element-image',
  components: {
    ImageRectOutline,
    ImageEllipseOutline,
    ImagePolygonOutline,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTImageElement>,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTImageElement, canMove?: boolean) => void>,
      required: true,
    },
    contextmenus: {
      type: Function as PropType<() => ContextmenuItem[]>,
    },
  },
  setup(props) {
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    const handleSelectElement = (e: MouseEvent) => {
      if(props.elementInfo.lock) return
      e.stopPropagation()
      props.selectElement(e, props.elementInfo)
    }
    const clipShape = computed(() => {
      if(!props.elementInfo || !props.elementInfo.clip) return CLIPPATHS.rect
      const shape = props.elementInfo.clip.shape || ClipPathTypes.RECT

      return CLIPPATHS[shape]
    })

    const imgPosition = computed(() => {
      if(!props.elementInfo || !props.elementInfo.clip) {
        return {
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        }
      }

      const [start, end] = props.elementInfo.clip.range

      const widthScale = (end[0] - start[0]) / 100
      const heightScale = (end[1] - start[1]) / 100
      const left = start[0] / widthScale
      const top = start[1] / heightScale

      return {
        left: -left + '%',
        top: -top + '%',
        width: 100 / widthScale + '%',
        height: 100 / heightScale + '%',
      }
    })

    const filter = computed(() => {
      if(!props.elementInfo.filters) return ''
      let filter = ''
      for(const key of Object.keys(props.elementInfo.filters)) {
        filter += `${key}(${props.elementInfo.filters[key]}) `
      }
      return filter
    })

    const flip = computed(() => {
      if(!props.elementInfo.flip) return ''
      const { x, y } = props.elementInfo.flip
      if(x && y) return `rotateX(${x}deg) rotateY(${y}deg)`
      else if(x) return `rotateX(${x}deg)`
      else if(y) return `rotateY(${y}deg)`
      return ''
    })

    return {
      shadowStyle,
      handleSelectElement,
      clipShape,
      imgPosition,
      filter,
      flip,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-image {
  position: absolute;

  &.lock .element-content {
    cursor: default;
  }
}

.element-content {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: move;

  .image-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  img {
    position: absolute;
  }
}
</style>
