<template>
  <div 
    class="prosemirror-editor" 
    ref="editorViewRef"
  ></div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { EditorView } from 'prosemirror-view'
import { toggleMark, wrapIn, selectAll } from 'prosemirror-commands'
import { initProsemirrorEditor, createDocument } from '@/utils/prosemirror'
import { getTextAttrs } from '@/utils/prosemirror/utils'
import emitter, { EmitterEvents, RichTextCommand } from '@/utils/emitter'
import { alignmentCommand } from '@/utils/prosemirror/commands/setTextAlign'
import { toggleList } from '@/utils/prosemirror/commands/toggleList'

export default defineComponent({
  name: 'prosemirror-editor',
  emits: ['update', 'focus', 'blur'],
  props: {
    elementId: {
      type: String,
      required: true,
    },
    defaultColor: {
      type: String,
      required: true,
    },
    defaultFontName: {
      type: String,
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const mainStore = useMainStore()
    const { handleElementId } = storeToRefs(mainStore)

    const editorViewRef = ref<HTMLElement>()
    let editorView: EditorView

    // 富文本的各种交互事件监听：
    // 聚焦时取消全局快捷键事件
    // 输入文字时同步数据到vuex
    // 点击鼠标和键盘时同步富文本状态到工具栏
    const handleInput = debounce(function() {
      emit('update', editorView.dom.innerHTML)
    }, 300, { trailing: true })

    const handleFocus = () => {
      if (props.value === '请输入内容') {
        setTimeout(() => {
          selectAll(editorView.state, editorView.dispatch)
        }, 0)
      }
      mainStore.setDisableHotkeysState(true)
      emit('focus')
    }

    const handleBlur = () => {
      mainStore.setDisableHotkeysState(false)
      emit('blur')
    }

    const handleClick = debounce(function() {
      const attrs = getTextAttrs(editorView, {
        color: props.defaultColor,
        fontname: props.defaultFontName,
      })
      mainStore.setRichtextAttrs(attrs)
    }, 30, { trailing: true })

    const handleKeydown = () => {
      handleInput()
      handleClick()
    }

    // 将富文本内容同步到DOM
    const textContent = computed(() => props.value)
    watch(textContent, () => {
      if (!editorView) return
      if (editorView.hasFocus()) return

      const { doc, tr } = editorView.state
      editorView.dispatch(tr.replaceRangeWith(0, doc.content.size, createDocument(textContent.value)))
    })

    // 打开/关闭编辑器的编辑模式
    watch(() => props.editable, () => {
      editorView.setProps({ editable: () => props.editable })
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
        editable: () => props.editable,
      })
      if (props.autoFocus) editorView.focus()
    })
    onUnmounted(() => {
      editorView && editorView.destroy()
    })
    
    // 执行富文本命令（可以是一个或多个）
    // 部分命令在执行前先判断当前选区是否为空，如果选区为空先进行全选操作
    const execCommand = (payload: RichTextCommand | RichTextCommand[]) => {
      if (handleElementId.value !== props.elementId) return

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
        else if (item.command === 'insert' && item.value) {
          editorView.dispatch(editorView.state.tr.insertText(item.value))
        }
      }

      editorView.focus()
      handleInput()
      handleClick()
    }

    emitter.on(EmitterEvents.RICH_TEXT_COMMAND, execCommand)
    onUnmounted(() => {
      emitter.off(EmitterEvents.RICH_TEXT_COMMAND, execCommand)
    })

    return {
      editorViewRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.prosemirror-editor {
  cursor: text;
}
</style>
