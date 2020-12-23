<template>
  <div 
    class="base-element image"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
    }"
  >
    <div 
      class="element-content"
      :style="{
        filter: elementInfo.shadow ? `drop-shadow(${elementInfo.shadow})` : '',
        transform: flip,
      }"
    >
      <ImageRectBorder
        v-if="clipShape.type === 'rect'"
        :width="elementInfo.width"
        :height="elementInfo.height"
        :radius="clipShape.radius"
        :borderColor="elementInfo.borderColor"
        :borderWidth="elementInfo.borderWidth"
        :borderStyle="elementInfo.borderStyle"
      />
      <ImageEllipseBorder
        v-else-if="clipShape.type === 'ellipse'"
        :width="elementInfo.width"
        :height="elementInfo.height"
        :borderColor="elementInfo.borderColor"
        :borderWidth="elementInfo.borderWidth"
        :borderStyle="elementInfo.borderStyle"
      />
      <ImagePolygonBorder
        v-else-if="clipShape.type === 'polygon'"
        :width="elementInfo.width"
        :height="elementInfo.height"
        :createPath="clipShape.createPath"
        :borderColor="elementInfo.borderColor"
        :borderWidth="elementInfo.borderWidth"
        :borderStyle="elementInfo.borderStyle"
      />

      <div class="img-wrapper" :style="{ clipPath: clipShape.style }">
        <img 
          :src="elementInfo.imgUrl" 
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
import { CLIPPATHS, ClipPathTypes } from '@/configs/imageClip'

import ImageRectBorder from './ImageRectBorder.vue'
import ImageEllipseBorder from './ImageEllipseBorder.vue'
import ImagePolygonBorder from './ImagePolygonBorder.vue'

export default defineComponent({
  name: 'base-element-image',
  components: {
    ImageRectBorder,
    ImageEllipseBorder,
    ImagePolygonBorder,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTImageElement>,
      required: true,
    },
  },
  setup(props) {
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

    const clipShape = computed(() => {
      if(!props.elementInfo || !props.elementInfo.clip) return CLIPPATHS.rect
      const shape = props.elementInfo.clip.shape || ClipPathTypes.RECT

      return CLIPPATHS[shape]
    })

    const filter = computed(() => {
      if(!props.elementInfo.filter) return ''
      let filter = ''
      for(const key of Object.keys(props.elementInfo.filter)) {
        filter += `${key}(${props.elementInfo.filter[key]}) `
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
      imgPosition,
      clipShape,
      filter,
      flip,
    }
  },
})
</script>

<style lang="scss" scoped>
.base-element {
  position: absolute;
}

.element-content {
  width: 100%;
  height: 100%;
  position: relative;

  .img-wrapper {
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
