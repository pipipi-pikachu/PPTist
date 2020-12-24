<template>
  <div 
    class="editable-element-text" 
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
    }"
    @mousedown="handleSelectElement($event, false)" 
  >
    <div class="element-content"
      :style="{
        backgroundColor: elementInfo.fill,
        opacity: elementInfo.opacity,
        textShadow: shadowStyle,
      }"
      v-contextmenu="contextmenus"
    >
      <ElementOutline
        :width="elementInfo.width"
        :height="elementInfo.height"
        :outline="elementInfo.outline"
      />
      <div class="text"
        v-html="elementInfo.content" 
        :contenteditable="isActive && !elementInfo.lock"
      ></div>
    </div>

    <div 
      class="operate" 
      :class="{
        'active': isActive,
        'multi-select': isMultiSelect && isActive,
        'selected': isHandleEl
      }" 
      :style="{ transform: `scale(${1 / canvasScale})` }"
      v-contextmenu="contextmenus"
    >
      <BorderLine 
        class="operate-border-line"
        v-for="line in borderLines" 
        :key="line.type" 
        :type="line.type" 
        :style="line.style"
        :isWide="true"
        @mousedown="handleSelectElement($event)"
      />
      <template v-if="!elementInfo.lock && (isActiveGroupElement || !isMultiSelect)">
        <ResizablePoint class="operate-resizable-point" 
          v-for="point in resizablePoints"
          :key="point.type"
          :type="point.type"
          :style="point.style"
          @mousedown.stop="scaleElement($event, elementInfo, point.direction)"
        />
        <RotateHandler
          class="operate-rotate-handle" 
          :style="{ left: scaleWidth / 2 + 'px' }"
          @mousedown.stop="rotateElement(elementInfo)"
        />
      </template>

      <AnimationIndex v-if="animationIndex !== -1" :animationIndex="animationIndex" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { PPTTextElement } from '@/types/slides'
import { ElementScaleHandler } from '@/types/edit'
import useCommonOperate from '@/views/_common/_element/hooks/useCommonOperate'

import ElementOutline from '@/views/_common/_element/ElementOutline.vue'
import RotateHandler from '@/views/_common/_operate/RotateHandler.vue'
import ResizablePoint from '@/views/_common/_operate/ResizablePoint.vue'
import BorderLine from '@/views/_common/_operate/BorderLine.vue'
import AnimationIndex from '@/views/_common/_operate/AnimationIndex.vue'

import useElementShadow from '@/views/_common/_element/hooks/useElementShadow'

export default defineComponent({
  name: 'editable-element-text',
  components: {
    ElementOutline,
    RotateHandler,
    ResizablePoint,
    BorderLine,
    AnimationIndex,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTTextElement>,
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
      type: Function as PropType<(e: MouseEvent, element: PPTTextElement, canMove?: boolean) => void>,
      required: true,
    },
    rotateElement: {
      type: Function as PropType<(element: PPTTextElement) => void>,
      required: true,
    },
    scaleElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTTextElement, command: ElementScaleHandler) => void>,
      required: true,
    },
    contextmenus: {
      type: Function,
    },
  },
  setup(props) {
    const scaleWidth = computed(() => props.elementInfo.width * props.canvasScale)
    const scaleHeight = computed(() => props.elementInfo.height * props.canvasScale)

    const { resizablePoints, borderLines } = useCommonOperate(scaleWidth, scaleHeight)

    const handleSelectElement = (e: MouseEvent, canMove = true) => {
      if(props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo, canMove)
    }
    
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    return {
      scaleWidth,
      resizablePoints,
      borderLines,
      handleSelectElement,
      shadowStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-text {
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
  position: relative;
  padding: 10px;
  line-height: 1.5;

  .text {
    position: relative;
    cursor: text;
  }
}

::v-deep(.text) {
  word-break: break-word;
  font-family: '微软雅黑';
  outline: 0;

  ::selection {
    background-color: rgba(27, 110, 232, 0.3);
    color: inherit;
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
    .operate-resizable-point,
    .operate-rotate-handle {
      display: block;
    }
  }

  &.multi-select:not(.selected) .operate-border-line {
    border-color: rgba($color: $themeColor, $alpha: .3);
  }

  .operate-border-line,
  .operate-resizable-point,
  .operate-rotate-handle {
    display: none;
  }
}
</style>
