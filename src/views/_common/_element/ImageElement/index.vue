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
    @mousedown="handleSelectElement($event)" 
  >
    <ImageClip
      v-if="isCliping"
      :src="elementInfo.src"
      :clipData="elementInfo.clip"
      :canvasScale="canvasScale"
      :width="elementInfo.width"
      :height="elementInfo.height"
      :top="elementInfo.top"
      :left="elementInfo.left"
      :clipPath="clipShape.style"
      @clip="range => clip(range)"
    />

    <div 
      class="element-content"
      v-if="!isCliping"
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

    <div 
      class="operate"
      :class="{
        'active': isActive,
        'multi-select': isMultiSelect && isActive,
        'selected': isHandleEl,
      }" 
      :style="{ transform: `scale(${1 / canvasScale})` }"
      v-if="!isCliping"
    >
      <BorderLine 
        class="operate-border-line" 
        v-for="line in borderLines" 
        :key="line.type" 
        :type="line.type" 
        :style="line.style" 
      />
      <template v-if="!elementInfo.lock && (isActiveGroupElement || !isMultiSelect)">
        <ResizeHandler 
          class="operate-resize-handler" 
          v-for="point in resizeHandlers"
          :key="point.direction"
          :type="point.direction"
          :style="point.style"
          @mousedown.stop="scaleElement($event, elementInfo, point.direction)"
        />
        <RotateHandler
          class="operate-rotate-handler" 
          :style="{left: scaleWidth / 2 + 'px'}"
          @mousedown.stop="rotateElement(elementInfo)"
        />
      </template>

      <AnimationIndex v-if="animationIndex !== -1" :animationIndex="animationIndex" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue'

import { PPTImageElement } from '@/types/slides'
import { OperateResizeHandler } from '@/types/edit'
import useCommonOperate from '@/views/_common/_element/hooks/useCommonOperate'

import { CLIPPATHS, ClipPathTypes } from '@/configs/imageClip'

import RotateHandler from '@/views/_common/_operate/RotateHandler.vue'
import ResizeHandler from '@/views/_common/_operate/ResizeHandler.vue'
import BorderLine from '@/views/_common/_operate/BorderLine.vue'
import AnimationIndex from '@/views/_common/_operate/AnimationIndex.vue'

import ImageClip, { ClipedEmitData } from './ImageClipHandler.vue'
import ImageRectOutline from './ImageRectOutline.vue'
import ImageEllipseOutline from './ImageEllipseOutline.vue'
import ImagePolygonOutline from './ImagePolygonOutline.vue'

import useElementShadow from '@/views/_common/_element/hooks/useElementShadow'

export default defineComponent({
  name: 'editable-element-image',
  components: {
    RotateHandler,
    ResizeHandler,
    BorderLine,
    AnimationIndex,
    ImageClip,
    ImageRectOutline,
    ImageEllipseOutline,
    ImagePolygonOutline,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTImageElement>,
      required: true,
    },
    canvasScale: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isHandleEl: {
      type: Boolean,
      required: true,
    },
    isActiveGroupElement: {
      type: Boolean,
      required: true,
    },
    isMultiSelect: {
      type: Boolean,
      required: true,
    },
    animationIndex: {
      type: Number,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTImageElement, canMove?: boolean) => void>,
      required: true,
    },
    rotateElement: {
      type: Function as PropType<(element: PPTImageElement) => void>,
      required: true,
    },
    scaleElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTImageElement, command: OperateResizeHandler) => void>,
      required: true,
    },
    contextmenus: {
      type: Function,
    },
  },
  setup(props) {
    const clipingImageElId = ref('')

    const scaleWidth = computed(() => props.elementInfo.width * props.canvasScale)
    const scaleHeight = computed(() => props.elementInfo.height * props.canvasScale)

    const { resizeHandlers, borderLines } = useCommonOperate(scaleWidth, scaleHeight)

    const isCliping = computed(() => clipingImageElId.value === props.elementInfo.id)

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

    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    const handleSelectElement = (e: MouseEvent) => {
      if(isCliping.value || props.elementInfo.lock) return
      e.stopPropagation()
      props.selectElement(e, props.elementInfo)
    }

    const clip = (data: ClipedEmitData) => {
      clipingImageElId.value = ''
      
      if(!data) return

      const { range, position } = data
      const originClip = props.elementInfo.clip || {}
      
      const _props = {
        clip: { ...originClip, range },
        left: props.elementInfo.left + position.left,
        top: props.elementInfo.top + position.top,
        width: props.elementInfo.width + position.width,
        height: props.elementInfo.height + position.height,
      }
      console.log(_props)
    }

    return {
      scaleWidth,
      isCliping,
      imgPosition,
      clipShape,
      resizeHandlers,
      borderLines,
      filter,
      flip,
      shadowStyle,
      handleSelectElement,
      clip,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-image {
  position: absolute;

  &.lock .operate-border-line {
    border-color: #888;
  }

  &:hover .operate-border-line {
    display: block;
  }

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

.operate {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  user-select: none;

  &.active {
    .operate-border-line,
    .operate-resize-handler,
    .operate-rotate-handler {
      display: block;
    }
  }

  &.multi-select:not(.selected) .operate-border-line {
    border-color: rgba($color: $themeColor, $alpha: .3);
  }

  .operate-border-line,
  .operate-resize-handler,
  .operate-rotate-handler {
    display: none;
  }
}
</style>
