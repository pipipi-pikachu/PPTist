<template>
  <div 
    class="editable-element-shape"
    :class="{
      'lock': elementInfo.lock,
      'format-painter': shapeFormatPainter,
    }"
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
        :style="{
          opacity: elementInfo.opacity,
          filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
          transform: flipStyle,
          color: text.defaultColor,
          fontFamily: text.defaultFontName,
        }"
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)"
        @mouseup="execFormatPainter()"
        @touchstart="$event => handleSelectElement($event)"
        @dblclick="startEdit()"
      >
        <svg 
          overflow="visible" 
          :width="elementInfo.width"
          :height="elementInfo.height"
        >
          <defs v-if="elementInfo.gradient">
            <GradientDefs
              :id="`editabel-gradient-${elementInfo.id}`" 
              :type="elementInfo.gradient.type"
              :colors="elementInfo.gradient.colors"
              :rotate="elementInfo.gradient.rotate"
            />
          </defs>
          <g 
            :transform="`scale(${elementInfo.width / elementInfo.viewBox[0]}, ${elementInfo.height / elementInfo.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`"
          >
            <path 
              class="shape-path"
              vector-effect="non-scaling-stroke" 
              stroke-linecap="butt" 
              stroke-miterlimit="8"
              :d="elementInfo.path" 
              :fill="elementInfo.gradient ? `url(#editabel-gradient-${elementInfo.id})` : elementInfo.fill"
              :stroke="outlineColor"
              :stroke-width="outlineWidth" 
              :stroke-dasharray="strokeDashArray" 
            ></path>
          </g>
        </svg>

        <div class="shape-text" :class="[text.align, { 'editable': editable || text.content }]">
          <ProsemirrorEditor
            ref="prosemirrorEditorRef"
            v-if="editable || text.content"
            :elementId="elementInfo.id"
            :defaultColor="text.defaultColor"
            :defaultFontName="text.defaultFontName"
            :editable="!elementInfo.lock"
            :value="text.content"
            @update="({ value, ignore }) => updateText(value, ignore)"
            @blur="checkEmptyText()"
            @mousedown="$event => handleSelectElement($event, false)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTShapeElement, ShapeText } from '@/types/slides'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useElementFlip from '@/views/components/element/hooks/useElementFlip'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import GradientDefs from './GradientDefs.vue'
import ProsemirrorEditor from '@/views/components/element/ProsemirrorEditor.vue'

const props = defineProps<{
  elementInfo: PPTShapeElement
  selectElement: (e: MouseEvent | TouchEvent, element: PPTShapeElement, canMove?: boolean) => void
  contextmenus: () => ContextmenuItem[] | null
}>()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElementId, shapeFormatPainter } = storeToRefs(mainStore)

const { addHistorySnapshot } = useHistorySnapshot()

const handleSelectElement = (e: MouseEvent | TouchEvent, canMove = true) => {
  if (props.elementInfo.lock) return
  e.stopPropagation()

  props.selectElement(e, props.elementInfo, canMove)
}

const execFormatPainter = () => {
  if (!shapeFormatPainter.value) return
  const { keep, ...newProps } = shapeFormatPainter.value

  slidesStore.updateElement({
    id: props.elementInfo.id, 
    props: newProps,
  })
  
  addHistorySnapshot()
  if (!keep) mainStore.setShapeFormatPainter(null)
}

const outline = computed(() => props.elementInfo.outline)
const { outlineWidth, outlineColor, strokeDashArray } = useElementOutline(outline)

const shadow = computed(() => props.elementInfo.shadow)
const { shadowStyle } = useElementShadow(shadow)

const flipH = computed(() => props.elementInfo.flipH)
const flipV = computed(() => props.elementInfo.flipV)
const { flipStyle } = useElementFlip(flipH, flipV)

const editable = ref(false)

watch(handleElementId, () => {
  if (handleElementId.value !== props.elementInfo.id) {
    if (editable.value) editable.value = false
  }
})

const text = computed<ShapeText>(() => {
  const defaultText: ShapeText = {
    content: '',
    defaultFontName: '微软雅黑',
    defaultColor: '#000',
    align: 'middle',
  }
  if (!props.elementInfo.text) return defaultText

  return props.elementInfo.text
})

const updateText = (content: string, ignore = false) => {
  const _text = { ...text.value, content }
  slidesStore.updateElement({
    id: props.elementInfo.id, 
    props: { text: _text },
  })
  
  if (!ignore) addHistorySnapshot()
}

const checkEmptyText = () => {
  if (!props.elementInfo.text) return

  const pureText = props.elementInfo.text.content.replace(/<[^>]+>/g, '')
  if (!pureText) {
    slidesStore.removeElementProps({ id: props.elementInfo.id, propName: 'text' })
    addHistorySnapshot()
  }
}

const prosemirrorEditorRef = ref<InstanceType<typeof ProsemirrorEditor>>()
const startEdit = () => {
  editable.value = true
  nextTick(() => prosemirrorEditorRef.value && prosemirrorEditorRef.value.focus())
}
</script>

<style lang="scss" scoped>
.editable-element-shape {
  position: absolute;
  pointer-events: none;

  &.lock .element-content {
    cursor: default;
  }
  &.format-painter .element-content {
    cursor: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIuNzUgMTMuNzY0VjEuNDIxYS4zLjMgMCAwMS40NDgtLjI2bDEwLjkxIDYuMTk3YS4zLjMgMCAwMS0uMTE2LjU1OWwtNC4xOTYuNDQyIDIuNTgyIDQuNDcyYS4zLjMgMCAwMS0uMTEuNDFsLTMuMTg0IDEuODM4YS4zLjMgMCAwMS0uNDEtLjExbC0yLjU4MS00LjQ3Mi0yLjgxIDMuNDU2YS4zLjMgMCAwMS0uNTMzLS4xODl6IiBmaWxsPSIjZmZmIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjYgMTQuNWw0LjUtNC41LTYtNmMtMiAyLTMgMi01LjUgMi41LjQgMy4yIDQuODMzIDYuNjY3IDcgOHptNC41ODgtNC40OTRhLjMuMyAwIDAwLjQyNCAwbC42OC0uNjhhMS41IDEuNSAwIDAwMC0yLjEyMUwzMC4zNCA1Ljg1MmwyLjAyNi0xLjU4MmExLjYyOSAxLjYyOSAwIDEwLTIuMjgtMi4yOTZsLTEuNjAzIDIuMDIxLTEuMzU3LTEuMzU2YTEuNSAxLjUgMCAwMC0yLjEyIDBsLS42ODEuNjhhLjMuMyAwIDAwMCAuNDI0bDYuMjYzIDYuMjYzeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNC41NDMgMy45NjFzLTEuMDMgMS4yMDItMi40OTQgMS44OTFjLTEuMDA2LjQ3NC0yLjE4MS41ODUtMi43MzQuNjI3LS4yLjAxNC0uMzQ0LjIwOS0uMjc3LjM5OC4yOTMuODIgMS4xMTIgMi44MDEgMi42NTggNC4zNDcgMi4xMjYgMi4xMjYgMy42NTkgMi45NjggNC4xNDIgMy4yMDIuMS4wNDguMjE1LjAzLjI5OS0uMDQxLjM4NS0uMzI2IDEuNS0xLjI3NyAyLjIxLTEuOTg2Ljg5MS0uODkgMi4xODYtMi40NDggMi4xODYtMi40NDhtLjQ4LjA1NWEuMy4zIDAgMDEtLjQyNSAwbC02LjI2My02LjI2M2EuMy4zIDAgMDEwLS40MjRsLjY4LS42OGExLjUgMS41IDAgMDEyLjEyMiAwbDEuMzU2IDEuMzU2IDEuNjA0LTIuMDIxYTEuNjI5IDEuNjI5IDAgMTEyLjI3OSAyLjI5NkwzMC4zNCA1Ljg1MmwxLjM1MyAxLjM1M2ExLjUgMS41IDAgMDEwIDIuMTIxbC0uNjguNjh6IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=) 2 5, default !important;
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

  .shape-path {
    pointer-events: all;
  }
}
.shape-text {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 10px;
  line-height: 1.2;
  word-break: break-word;
  pointer-events: none;

  &.editable {
    pointer-events: all;
  }

  &.top {
    justify-content: flex-start;
  }
  &.middle {
    justify-content: center;
  }
  &.bottom {
    justify-content: flex-end;
  }
}
</style>
