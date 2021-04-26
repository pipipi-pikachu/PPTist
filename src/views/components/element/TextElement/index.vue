<template>
  <div 
    class="editable-element-text" 
    ref="elementRef"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
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
        @mousedown="$event => handleSelectElement($event)"
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { MutationTypes, useStore } from '@/store'
import { EditorView } from 'prosemirror-view'
import { toggleMark, wrapIn, selectAll } from 'prosemirror-commands'
import { PPTTextElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { initProsemirrorEditor } from '@/prosemirror/'
import { getTextAttrs } from '@/prosemirror/utils'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import { alignmentCommand } from '@/prosemirror/commands/setTextAlign'
import { toggleList } from '@/prosemirror/commands/toggleList'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '@/views/components/element/ElementOutline.vue'

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
    const store = useStore()
    const { addHistorySnapshot } = useHistorySnapshot()

    const elementRef = ref<HTMLElement>()

    const isScaling = ref(false)
    const realHeightCache = ref(-1)

    const editorViewRef = ref<HTMLElement>()
    let editorView: EditorView

    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    const handleElementId = computed(() => store.state.handleElementId)

    const handleSelectElement = (e: MouseEvent, canMove = true) => {
      if (props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo, canMove)
    }

    // 监听文本元素的尺寸变化，当高度变化时，更新高度到vuex
    // 如果高度变化时正处在缩放操作中，则等待缩放操作结束后再更新
    const scaleElementStateListener = (state: boolean) => {
      isScaling.value = state

      if (!state && realHeightCache.value !== -1) {
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
      if (!elementRef.value) return

      const realHeight = contentRect.height

      if (props.elementInfo.height !== realHeight) {
        if (!isScaling.value) {
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
      if (elementRef.value) resizeObserver.observe(elementRef.value)
    })
    onUnmounted(() => {
      if (elementRef.value) resizeObserver.unobserve(elementRef.value)
    })

    // 富文本的各种交互事件监听：
    // 聚焦时取消全局快捷键事件
    // 输入文字时同步数据到vuex
    // 点击鼠标和键盘时同步富文本状态到工具栏
    const handleInput = debounce(function() {
      store.commit(MutationTypes.UPDATE_ELEMENT, {
        id: props.elementInfo.id, 
        props: { content: editorView.dom.innerHTML },
      })
      addHistorySnapshot()
    }, 300, { trailing: true })

    const handleFocus = () => {
      if (props.elementInfo.content === '请输入内容') {
        editorView.dom.innerHTML = ''
        handleInput()
      }
      store.commit(MutationTypes.SET_DISABLE_HOTKEYS_STATE, true)
    }

    const handleBlur = () => {
      store.commit(MutationTypes.SET_DISABLE_HOTKEYS_STATE, false)
    }

    const handleClick = debounce(function() {
      const attr = getTextAttrs(editorView)
      emitter.emit(EmitterEvents.UPDATE_TEXT_STATE, attr)
    }, 30, { trailing: true })

    const handleKeydown = () => {
      handleInput()
      handleClick()
    }

    // 将富文本内容同步到DOM
    const textContent = computed(() => props.elementInfo.content)
    watch(textContent, () => {
      if (!editorView) return
      if (editorView.hasFocus()) return
      editorView.dom.innerHTML = textContent.value
    })

    // 打开/关闭编辑器的编辑模式
    const editable = computed(() => !props.elementInfo.lock)
    watch(editable, () => {
      editorView.setProps({ editable: () => editable.value })
    })

    // Prosemirror编辑器的初始化和卸载
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
    
    // 执行富文本命令（可以是一个或多个）
    // 部分命令在执行前先判断当前选区是否为空，如果选区为空先进行全选操作
    const execCommand = (payload: CommandPayload | CommandPayload[]) => {
      if (handleElementId.value !== props.elementInfo.id) return

      const commands = ('command' in payload) ? [payload] : payload

      for (const item of commands) {
        if (item.command === 'fontname' && item.value) {
          const mark = editorView.state.schema.marks.fontname.create({ fontname: item.value })
          const { empty } = editorView.state.selection
          if (empty) selectAll(editorView.state, editorView.dispatch)
          const { $from, $to } = editorView.state.selection
          editorView.dispatch(editorView.state.tr.addMark($from.pos, $to.pos, mark))
        }
        else if (item.command === 'fontsize' && item.value) {
          const mark = editorView.state.schema.marks.fontsize.create({ fontsize: item.value })
          const { empty } = editorView.state.selection
          if (empty) selectAll(editorView.state, editorView.dispatch)
          const { $from, $to } = editorView.state.selection
          editorView.dispatch(editorView.state.tr.addMark($from.pos, $to.pos, mark))
        }
        else if (item.command === 'color' && item.value) {
          const mark = editorView.state.schema.marks.forecolor.create({ color: item.value })
          const { empty } = editorView.state.selection
          if (empty) selectAll(editorView.state, editorView.dispatch)
          const { $from, $to } = editorView.state.selection
          editorView.dispatch(editorView.state.tr.addMark($from.pos, $to.pos, mark))
        }
        else if (item.command === 'backcolor' && item.value) {
          const mark = editorView.state.schema.marks.backcolor.create({ backcolor: item.value })
          const { empty } = editorView.state.selection
          if (empty) selectAll(editorView.state, editorView.dispatch)
          const { $from, $to } = editorView.state.selection
          editorView.dispatch(editorView.state.tr.addMark($from.pos, $to.pos, mark))
        }
        else if (item.command === 'bold') {
          const { empty } = editorView.state.selection
          if (empty) selectAll(editorView.state, editorView.dispatch)
          toggleMark(editorView.state.schema.marks.strong)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'em') {
          const { empty } = editorView.state.selection
          if (empty) selectAll(editorView.state, editorView.dispatch)
          toggleMark(editorView.state.schema.marks.em)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'underline') {
          const { empty } = editorView.state.selection
          if (empty) selectAll(editorView.state, editorView.dispatch)
          toggleMark(editorView.state.schema.marks.underline)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'strikethrough') {
          const { empty } = editorView.state.selection
          if (empty) selectAll(editorView.state, editorView.dispatch)
          toggleMark(editorView.state.schema.marks.strikethrough)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'subscript') {
          toggleMark(editorView.state.schema.marks.subscript)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'superscript') {
          toggleMark(editorView.state.schema.marks.superscript)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'blockquote') {
          wrapIn(editorView.state.schema.nodes.blockquote)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'code') {
          toggleMark(editorView.state.schema.marks.code)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'align' && item.value) {
          alignmentCommand(editorView, item.value)
        }
        else if (item.command === 'bulletList') {
          const { bullet_list: bulletList, list_item: listItem } = editorView.state.schema.nodes
          toggleList(bulletList, listItem)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'orderedList') {
          const { ordered_list: orderedList, list_item: listItem } = editorView.state.schema.nodes
          toggleList(orderedList, listItem)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'clear') {
          const { empty } = editorView.state.selection
          if (empty) selectAll(editorView.state, editorView.dispatch)
          const { $from, $to } = editorView.state.selection
          editorView.dispatch(editorView.state.tr.removeMark($from.pos, $to.pos))
        }
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

  &.lock .element-content {
    cursor: default;
  }
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  position: relative;
  padding: 10px;
  line-height: 1.5;
  word-break: break-word;
  cursor: move;

  .text {
    position: relative;
    cursor: text;
  }
}
</style>
