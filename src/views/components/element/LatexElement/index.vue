<template>
  <div 
    class="editable-element-latex"
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
      <div 
        class="element-content" 
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)"
        @touchstart="$event => handleSelectElement($event)"
        @dblclick="openLatexEditor()"
      >
        <svg 
          overflow="visible" 
          :width="elementInfo.width"
          :height="elementInfo.height"
          :stroke="elementInfo.color" 
          :stroke-width="elementInfo.strokeWidth" 
          fill="none" 
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <g 
            :transform="`scale(${elementInfo.width / elementInfo.viewBox[0]}, ${elementInfo.height / elementInfo.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`"
          >
            <path :d="elementInfo.path"></path>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PPTLatexElement } from '@/types/slides'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import emitter, { EmitterEvents } from '@/utils/emitter'

const props = defineProps<{
  elementInfo: PPTLatexElement
  selectElement: (e: MouseEvent | TouchEvent, element: PPTLatexElement, canMove?: boolean) => void
  contextmenus: () => ContextmenuItem[] | null
}>()

const handleSelectElement = (e: MouseEvent | TouchEvent) => {
  if (props.elementInfo.lock) return
  e.stopPropagation()

  props.selectElement(e, props.elementInfo)
}

const openLatexEditor = () => {
  emitter.emit(EmitterEvents.OPEN_LATEX_EDITOR)
}
</script>

<style lang="scss" scoped>
.editable-element-latex {
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

  svg {
    transform-origin: 0 0;
    overflow: visible;
  }
}
</style>
