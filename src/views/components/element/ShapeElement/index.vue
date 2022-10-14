<template>
  <div 
    class="editable-element-shape"
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
        :style="{
          opacity: elementInfo.opacity,
          filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
          transform: flipStyle,
          color: text.defaultColor,
          fontFamily: text.defaultFontName,
        }"
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)"
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
              :color1="elementInfo.gradient.color[0]"
              :color2="elementInfo.gradient.color[1]"
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
              :stroke-dasharray="outlineStyle === 'dashed' ? '10 6' : '0 0'" 
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
            @update="value => updateText(value)"
            @blur="checkEmptyText()"
            @mousedown="$event => handleSelectElement($event, false)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, PropType, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTShapeElement, ShapeText } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useElementFlip from '@/views/components/element/hooks/useElementFlip'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import GradientDefs from './GradientDefs.vue'
import ProsemirrorEditor from '@/views/components/element/ProsemirrorEditor.vue'

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTShapeElement>,
    required: true,
  },
  selectElement: {
    type: Function as PropType<(e: MouseEvent | TouchEvent, element: PPTShapeElement, canMove?: boolean) => void>,
    required: true,
  },
  contextmenus: {
    type: Function as PropType<() => ContextmenuItem[] | null>,
  },
})

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElementId } = storeToRefs(mainStore)

const { addHistorySnapshot } = useHistorySnapshot()

const handleSelectElement = (e: MouseEvent | TouchEvent, canMove = true) => {
  if (props.elementInfo.lock) return
  e.stopPropagation()

  props.selectElement(e, props.elementInfo, canMove)
}

const outline = computed(() => props.elementInfo.outline)
const { outlineWidth, outlineStyle, outlineColor } = useElementOutline(outline)

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

const updateText = (content: string) => {
  const _text = { ...text.value, content }
  slidesStore.updateElement({
    id: props.elementInfo.id, 
    props: { text: _text },
  })
  
  addHistorySnapshot()
}

const checkEmptyText = () => {
  if (!props.elementInfo.text) return

  const pureText = props.elementInfo.text.content.replaceAll(/<[^>]+>/g, '')
  if (!pureText) {
    slidesStore.removeElementProps({ id: props.elementInfo.id, propName: 'text' })
    addHistorySnapshot()
  }
}

const prosemirrorEditorRef = ref<typeof ProsemirrorEditor>()
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
