<template>
  <div 
    class="editable-element-text" 
    ref="elementRef"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
    }"
    @mousedown="$event => handleSelectElement($event)"
  >
    <div 
      class="element-content"
      :style="{
        backgroundColor: elementInfo.fill,
        opacity: elementInfo.opacity,
        textShadow: shadowStyle,
        lineHeight: elementInfo.lineHeight,
        letterSpacing: (elementInfo.wordSpace || 0) + 'px',
      }"
      v-contextmenu="contextmenus"
    >
      <ElementOutline
        :width="elementInfo.width"
        :height="elementInfo.height"
        :outline="elementInfo.outline"
      />
      <div 
        class="text"
        ref="editorViewRef"
        @mousedown="$event => handleSelectElement($event, false)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { EditorView } from 'prosemirror-view'
import { PPTTextElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { initProsemirrorEditor } from '@/prosemirror/'
import { getTextAttrs } from '@/prosemirror/utils'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '@/views/components/element/ElementOutline.vue'
import { toggleMark, wrapIn } from 'prosemirror-commands'
import { alignmentCommand } from '@/prosemirror/commands/setTextAlign'
import { toggleList } from '@/prosemirror/commands/toggleList'

interface CommandPayload {
  command: string;
  value?: string;
}

export default defineComponent({
  name: 'editable-element-text',
  components: {
    ElementOutline,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTTextElement>,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTTextElement, canMove?: boolean) => void>,
      required: true,
    },
    contextmenus: {
      type: Function as PropType<() => ContextmenuItem[]>,
    },
  },
  setup(props) {
    const store = useStore<State>()
    const { addHistorySnapshot } = useHistorySnapshot()

    const elementRef = ref<HTMLElement>()

    const isScaling = ref(false)
    const realHeightCache = ref(-1)

    const scaleElementStateListener = (state: boolean) => {
      isScaling.value = state

      if(!state && realHeightCache.value !== -1) {
        store.commit(MutationTypes.UPDATE_ELEMENT, {
          id: props.elementInfo.id,
          props: { height: realHeightCache.value },
        })
        realHeightCache.value = -1
      }
    }

    emitter.on(EmitterEvents.SCALE_ELEMENT_STATE, state => scaleElementStateListener(state))
    onUnmounted(() => {
      emitter.off(EmitterEvents.SCALE_ELEMENT_STATE, state => scaleElementStateListener(state))
    })

    const updateTextElementHeight = (entries: ResizeObserverEntry[]) => {
      const contentRect = entries[0].contentRect
      if(!elementRef.value) return

      const realHeight = contentRect.height

      if(props.elementInfo.height !== realHeight) {
        if(!isScaling.value) {
          store.commit(MutationTypes.UPDATE_ELEMENT, {
            id: props.elementInfo.id,
            props: { height: realHeight },
          })
        }
        else realHeightCache.value = realHeight
      }
    }
    const resizeObserver = new ResizeObserver(updateTextElementHeight)

    onMounted(() => {
      if(elementRef.value) resizeObserver.observe(elementRef.value)
    })
    onUnmounted(() => {
      if(elementRef.value) resizeObserver.unobserve(elementRef.value)
    })
    
    const editorViewRef = ref<HTMLElement>()
    let editorView: EditorView

    const handleFocus = () => {
      store.commit(MutationTypes.SET_DISABLE_HOTKEYS_STATE, true)
    }
    const handleBlur = () => {
      store.commit(MutationTypes.SET_DISABLE_HOTKEYS_STATE, false)
    }
    const handleInput = debounce(function() {
      store.commit(MutationTypes.UPDATE_ELEMENT, {
        id: props.elementInfo.id, 
        props: { content: editorView.dom.innerHTML },
      })
      addHistorySnapshot()
    }, 300, { trailing: true })

    const handleClick = debounce(function() {
      const attr = getTextAttrs(editorView)
      emitter.emit(EmitterEvents.UPDATE_TEXT_STATE, attr)
    }, 30, { trailing: true })

    const handleKeydown = () => {
      handleInput()
      handleClick()
    }

    const textContent = computed(() => props.elementInfo.content)
    watch(textContent, () => {
      if(!editorView) return
      if(editorView.hasFocus()) return
      editorView.dom.innerHTML = textContent.value
    })

    const editable = computed(() => !props.elementInfo.lock)
    watch(editable, () => {
      editorView.setProps({ editable: () => editable.value })
    })

    onMounted(() => {
      editorView = initProsemirrorEditor((editorViewRef.value as Element), textContent.value, {
        handleDOMEvents: {
          focus: handleFocus,
          blur: handleBlur,
          keydown: handleKeydown,
          click: handleClick,
        },
        editable: () => editable.value,
      })
    })
    onUnmounted(() => {
      editorView && editorView.destroy()
    })

    const handleSelectElement = (e: MouseEvent, canMove = true) => {
      if(props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo, canMove)
    }
    
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    const handleElementId = computed(() => store.state.handleElementId)
    
    const execCommand = (payload: CommandPayload) => {
      if(handleElementId.value !== props.elementInfo.id) return

      if(payload.command === 'fontname' && payload.value) {
        const mark = editorView.state.schema.marks.fontname.create({ fontname: payload.value })
        const { $from, $to } = editorView.state.selection
        editorView.dispatch(editorView.state.tr.addMark($from.pos, $to.pos, mark))
      }
      else if(payload.command === 'fontsize' && payload.value) {
        const mark = editorView.state.schema.marks.fontsize.create({ fontsize: payload.value })
        const { $from, $to } = editorView.state.selection
        editorView.dispatch(editorView.state.tr.addMark($from.pos, $to.pos, mark))
      }
      else if(payload.command === 'color' && payload.value) {
        const mark = editorView.state.schema.marks.forecolor.create({ color: payload.value })
        const { $from, $to } = editorView.state.selection
        editorView.dispatch(editorView.state.tr.addMark($from.pos, $to.pos, mark))
      }
      else if(payload.command === 'backcolor' && payload.value) {
        const mark = editorView.state.schema.marks.backcolor.create({ backcolor: payload.value })
        const { $from, $to } = editorView.state.selection
        editorView.dispatch(editorView.state.tr.addMark($from.pos, $to.pos, mark))
      }
      else if(payload.command === 'bold') {
        toggleMark(editorView.state.schema.marks.strong)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'em') {
        toggleMark(editorView.state.schema.marks.em)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'underline') {
        toggleMark(editorView.state.schema.marks.underline)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'strikethrough') {
        toggleMark(editorView.state.schema.marks.strikethrough)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'subscript') {
        toggleMark(editorView.state.schema.marks.subscript)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'superscript') {
        toggleMark(editorView.state.schema.marks.superscript)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'blockquote') {
        wrapIn(editorView.state.schema.nodes.blockquote)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'code') {
        toggleMark(editorView.state.schema.marks.code)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'align' && payload.value) {
        alignmentCommand(editorView, payload.value)
      }
      else if(payload.command === 'bulletList') {
        const { bullet_list: bulletList, list_item: listItem } = editorView.state.schema.nodes
        toggleList(bulletList, listItem)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'orderedList') {
        const { ordered_list: orderedList, list_item: listItem } = editorView.state.schema.nodes
        toggleList(orderedList, listItem)(editorView.state, editorView.dispatch)
      }
      else if(payload.command === 'clear') {
        if(editorView.state.selection.empty) return false
        const { $from, $to } = editorView.state.selection
        editorView.dispatch(editorView.state.tr.removeMark($from.pos, $to.pos))
      }
      editorView.focus()
      handleInput()
      handleClick()
    }

    emitter.on(EmitterEvents.EXEC_TEXT_COMMAND, payload => execCommand(payload))
    onUnmounted(() => {
      emitter.off(EmitterEvents.EXEC_TEXT_COMMAND, payload => execCommand(payload))
    })

    return {
      elementRef,
      editorViewRef,
      handleSelectElement,
      shadowStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-text {
  position: absolute;
  cursor: move;

  &.lock .element-content {
    cursor: default;
  }
}

.element-content {
  position: relative;
  padding: 10px;
  line-height: 1.5;
  word-break: break-word;

  .text {
    position: relative;
    cursor: text;
  }
}
</style>
