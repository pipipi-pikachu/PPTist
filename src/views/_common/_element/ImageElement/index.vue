<template>
  <div 
    class="editable-element image"
    :class="{ 'lock': elementInfo.isLock }"
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
      :imgUrl="elementInfo.imgUrl"
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

      <div class="img-wrapper" :style="{clipPath: clipShape.style}">
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
        class="el-border-line" 
        v-for="line in borderLines" 
        :key="line.type" 
        :type="line.type" 
        :style="line.style" 
      />
      <template v-if="!elementInfo.isLock && (isActiveGroupElement || !isMultiSelect)">
        <ResizablePoint 
          class="el-resizable-point" 
          v-for="point in resizablePoints"
          :key="point.type"
          :type="point.type"
          :style="point.style"
          @mousedown.stop="scaleElement($event, elementInfo, point.direction)"
        />
        <RotateHandler
          class="el-rotate-handle" 
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
import { ElementScaleHandler } from '@/types/edit'
import useCommonOperate from '@/views/_common/_element/useCommonOperate'

import { CLIPPATHS, ClipPathTypes } from '@/configs/imageClip'

import RotateHandler from '@/views/_common/_operate/RotateHandler.vue'
import ResizablePoint from '@/views/_common/_operate/ResizablePoint.vue'
import BorderLine from '@/views/_common/_operate/BorderLine.vue'
import AnimationIndex from '@/views/_common/_operate/AnimationIndex.vue'

import ImageClip, { ClipedEmitData } from './ImageClipHandler.vue'
import ImageRectBorder from './ImageRectBorder.vue'
import ImageEllipseBorder from './ImageEllipseBorder.vue'
import ImagePolygonBorder from './ImagePolygonBorder.vue'

export default defineComponent({
  name: 'editable-element-image',
  components: {
    RotateHandler,
    ResizablePoint,
    BorderLine,
    AnimationIndex,
    ImageClip,
    ImageRectBorder,
    ImageEllipseBorder,
    ImagePolygonBorder,
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
      type: Function as PropType<(e: MouseEvent, element: PPTImageElement, command: ElementScaleHandler) => void>,
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

    const { resizablePoints, borderLines } = useCommonOperate(scaleWidth, scaleHeight)

    const isCliping = computed(() => clipingImageElId.value === props.elementInfo.elId)

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

    const handleSelectElement = (e: MouseEvent) => {
      if(isCliping.value || props.elementInfo.isLock) return
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
      resizablePoints,
      borderLines,
      filter,
      flip,
      handleSelectElement,
      clip,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element {
  position: absolute;

  &.lock .el-border-line {
    border-color: #888;
  }

  &:hover .el-border-line {
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

.operate {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  user-select: none;

  &.active {
    .el-border-line,
    .el-resizable-point,
    .el-rotate-handle {
      display: block;
    }
  }

  &.multi-select:not(.selected) .el-border-line {
    border-color: rgba($color: $themeColor, $alpha: .3);
  }

  .el-border-line,
  .el-resizable-point,
  .el-rotate-handle {
    display: none;
  }
}
</style>
