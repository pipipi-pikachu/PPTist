<template>
  <div 
    class="editable-element text" 
    :class="{ 'lock': elementInfo.isLock }"
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
        textShadow: elementInfo.shadow,
        lineHeight: elementInfo.lineHeight,
        letterSpacing: (elementInfo.letterSpacing || 0) + 'px',
      }"
      v-contextmenu="contextmenus"
    >
      <ElementBorder
        :width="elementInfo.width"
        :height="elementInfo.height"
        :borderColor="elementInfo.borderColor"
        :borderWidth="elementInfo.borderWidth"
        :borderStyle="elementInfo.borderStyle"
      />
      <div class="text-content"
        v-html="elementInfo.content" 
        :contenteditable="isActive && !elementInfo.isLock"
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
        class="el-border-line"
        v-for="line in borderLines" 
        :key="line.type" 
        :type="line.type" 
        :style="line.style"
        :isWide="true"
        @mousedown="handleSelectElement($event)"
      />
      <template v-if="!elementInfo.isLock && (isActiveGroupElement || !isMultiSelect)">
        <ResizablePoint class="el-resizable-point" 
          v-for="point in resizablePoints"
          :key="point.type"
          :type="point.type"
          :style="point.style"
          @mousedown.stop="scaleElement($event, elementInfo, point.direction)"
        />
        <RotateHandler
          class="el-rotate-handle" 
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
import useCommonOperate from '@/views/_common/_element/useCommonOperate'

import ElementBorder from '@/views/_common/_element/ElementBorder.vue'
import RotateHandler from '@/views/_common/_operate/RotateHandler.vue'
import ResizablePoint from '@/views/_common/_operate/ResizablePoint.vue'
import BorderLine from '@/views/_common/_operate/BorderLine.vue'
import AnimationIndex from '@/views/_common/_operate/AnimationIndex.vue'

export default defineComponent({
  name: 'editable-element-text',
  components: {
    ElementBorder,
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
      if(props.elementInfo.isLock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo, canMove)
    }

    return {
      scaleWidth,
      resizablePoints,
      borderLines,
      handleSelectElement,
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
  position: relative;
  padding: 10px;

  .text-content {
    position: relative;
    cursor: text;
  }
}

::v-deep(.text-content) {
  word-break: break-word;
  font-family: '微软雅黑';
  outline: 0;

  ::selection {
    background-color: rgba(27, 110, 232, 0.3);
    color: inherit;
  }

  ul {
    list-style-type: disc;
    padding-inline-start: 30px;
    li {
      list-style-type: disc;
    }
  }

  ol {
    list-style-type: decimal;
    padding-inline-start: 30px;
    li {
      list-style-type: decimal;
    }
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
