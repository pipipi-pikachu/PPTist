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
import { toggleMark, wrapIn } from 'prosemirror-commands'
import { initProsemirrorEditor, createDocument } from '@/utils/prosemirror'
import { findNodesWithSameMark, getTextAttrs, autoSelectAll, addMark, markActive, getFontsize } from '@/utils/prosemirror/utils'
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
    const execCommand = ({ target, action }: RichTextCommand) => {
      if (!target && handleElementId.value !== props.elementId) return
      if (target && target !== props.elementId) return

      const actions = ('command' in action) ? [action] : action

      for (const item of actions) {
        if (item.command === 'fontname' && item.value) {
          const mark = editorView.state.schema.marks.fontname.create({ fontname: item.value })
          autoSelectAll(editorView)
          addMark(editorView, mark)
        }
        else if (item.command === 'fontsize' && item.value) {
          const mark = editorView.state.schema.marks.fontsize.create({ fontsize: item.value })
          autoSelectAll(editorView)
          addMark(editorView, mark)
        }
        else if (item.command === 'fontsize-add') {
          const step = item.value ? +item.value : 2
          autoSelectAll(editorView)
          const fontsize = getFontsize(editorView) + step + 'px'
          const mark = editorView.state.schema.marks.fontsize.create({ fontsize })
          addMark(editorView, mark)
        }
        else if (item.command === 'fontsize-reduce') {
          const step = item.value ? +item.value : 2
          autoSelectAll(editorView)
          let fontsize = getFontsize(editorView) - step
          if (fontsize < 12) fontsize = 12
          const mark = editorView.state.schema.marks.fontsize.create({ fontsize: fontsize + 'px' })
          addMark(editorView, mark)
        }
        else if (item.command === 'color' && item.value) {
          const mark = editorView.state.schema.marks.forecolor.create({ color: item.value })
          autoSelectAll(editorView)
          addMark(editorView, mark)
        }
        else if (item.command === 'backcolor' && item.value) {
          const mark = editorView.state.schema.marks.backcolor.create({ backcolor: item.value })
          autoSelectAll(editorView)
          addMark(editorView, mark)
        }
        else if (item.command === 'bold') {
          autoSelectAll(editorView)
          toggleMark(editorView.state.schema.marks.strong)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'em') {
          autoSelectAll(editorView)
          toggleMark(editorView.state.schema.marks.em)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'underline') {
          autoSelectAll(editorView)
          toggleMark(editorView.state.schema.marks.underline)(editorView.state, editorView.dispatch)
        }
        else if (item.command === 'strikethrough') {
          autoSelectAll(editorView)
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
          autoSelectAll(editorView)
          const { $from, $to } = editorView.state.selection
          editorView.dispatch(editorView.state.tr.removeMark($from.pos, $to.pos))
        }
        else if (item.command === 'link') {
          const markType = editorView.state.schema.marks.link
          const { from, to } = editorView.state.selection
          const result = findNodesWithSameMark(editorView.state.doc, from, to, markType)
          if (result) {
            if (item.value) {
              const mark = editorView.state.schema.marks.link.create({ href: item.value, title: item.value })
              addMark(editorView, mark, { from: result.from.pos, to: result.to.pos + 1 })
            }
            else editorView.dispatch(editorView.state.tr.removeMark(result.from.pos, result.to.pos + 1, markType))
          }
          else if (markActive(editorView.state, markType)) {
            if (item.value) {
              const mark = editorView.state.schema.marks.link.create({ href: item.value, title: item.value })
              addMark(editorView, mark)
            }
            else toggleMark(markType)(editorView.state, editorView.dispatch)
          }
          else if (item.value) {
            autoSelectAll(editorView)
            toggleMark(markType, { href: item.value, title: item.value })(editorView.state, editorView.dispatch)
          }
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
