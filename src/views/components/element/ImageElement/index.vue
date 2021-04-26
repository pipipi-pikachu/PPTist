<template>
  <div 
    class="editable-element-image"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <ImageClipHandler
        v-if="isCliping"
        :src="elementInfo.src"
        :clipData="elementInfo.clip"
        :width="elementInfo.width"
        :height="elementInfo.height"
        :top="elementInfo.top"
        :left="elementInfo.left"
        :clipPath="clipShape.style"
        @clip="range => handleClip(range)"
      />
      <div 
        class="element-content"
        v-else
        :style="{
          filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
          transform: flipStyle,
        }"
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)" 
      >
        <ImageOutline :elementInfo="elementInfo" />

        <div class="image-content" :style="{ clipPath: clipShape.style }">
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
            @dragstart.prevent
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { ImageElementClip, PPTImageElement } from '@/types/slides'
import { ImageClipedEmitData } from '@/types/edit'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useElementFlip from '@/views/components/element/hooks/useElementFlip'
import useClipImage from './useClipImage'
import useFilter from './useFilter'

import ImageOutline from './ImageOutline/index.vue'
import ImageClipHandler from './ImageClipHandler.vue'

export default defineComponent({
  name: 'editable-element-image',
  components: {
    ImageOutline,
    ImageClipHandler,
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
    const store = useStore()
    const clipingImageElementId = computed(() => store.state.clipingImageElementId)
    const isCliping = computed(() => clipingImageElementId.value === props.elementInfo.id)

    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    const flip = computed(() => props.elementInfo.flip)
    const { flipStyle } = useElementFlip(flip)

    const clip = computed(() => props.elementInfo.clip)
    const { clipShape, imgPosition } = useClipImage(clip)

    const filters = computed(() => props.elementInfo.filters)
    const { filter } = useFilter(filters)

    const handleSelectElement = (e: MouseEvent) => {
      if (props.elementInfo.lock) return
      e.stopPropagation()
      props.selectElement(e, props.elementInfo)
    }

    const handleClip = (data: ImageClipedEmitData) => {
      store.commit(MutationTypes.SET_CLIPING_IMAGE_ELEMENT_ID, '')
      
      if (!data) return

      const { range, position } = data
      const originClip: ImageElementClip = props.elementInfo.clip || { shape: 'rect', range: [[0, 0], [100, 100]] }
      
      const _props = {
        clip: { ...originClip, range },
        left: props.elementInfo.left + position.left,
        top: props.elementInfo.top + position.top,
        width: props.elementInfo.width + position.width,
        height: props.elementInfo.height + position.height,
      }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: props.elementInfo.id, props: _props })
    }

    return {
      isCliping,
      handleClip,
      clipingImageElementId,
      shadowStyle,
      handleSelectElement,
      clipShape,
      imgPosition,
      filter,
      flipStyle,
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
.rotate-wrapper {
  width: 100%;
  height: 100%;
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
