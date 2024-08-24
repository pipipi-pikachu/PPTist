<template>
  <div 
    class="prosemirror-editor" 
    :class="{ 'format-painter': textFormatPainter }"
    ref="editorViewRef"
    @mousedown="$event => emit('mousedown', $event)"
  ></div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import type { EditorView } from 'prosemirror-view'
import { toggleMark, wrapIn, lift } from 'prosemirror-commands'
import { initProsemirrorEditor, createDocument } from '@/utils/prosemirror'
import { isActiveOfParentNodeType, findNodesWithSameMark, getTextAttrs, autoSelectAll, addMark, markActive, getFontsize } from '@/utils/prosemirror/utils'
import emitter, { EmitterEvents, type RichTextAction, type RichTextCommand } from '@/utils/emitter'
import { alignmentCommand } from '@/utils/prosemirror/commands/setTextAlign'
import { indentCommand, textIndentCommand } from '@/utils/prosemirror/commands/setTextIndent'
import { toggleList } from '@/utils/prosemirror/commands/toggleList'
import { setListStyle } from '@/utils/prosemirror/commands/setListStyle'
import type { TextFormatPainterKeys } from '@/types/edit'
import { KEYS } from '@/configs/hotkey'

const props = withDefaults(defineProps<{
  elementId: string
  defaultColor: string
  defaultFontName: string
  value: string
  editable?: boolean
  autoFocus?: boolean
}>(), {
  editable: false,
  autoFocus: false,
})

const emit = defineEmits<{
  (event: 'update', payload: { value: string; ignore: boolean }): void
  (event: 'focus'): void
  (event: 'blur'): void
  (event: 'mousedown', payload: MouseEvent): void
}>()

const mainStore = useMainStore()
const { handleElementId, textFormatPainter, richTextAttrs } = storeToRefs(mainStore)

const editorViewRef = ref<HTMLElement>()
let editorView: EditorView

// 富文本的各种交互事件监听：
// 聚焦时取消全局快捷键事件
// 输入文字时同步数据到vuex
// 点击鼠标和键盘时同步富文本状态到工具栏
const handleInput = debounce(function(isHanldeHistory = false) {
  if (props.value.replace(/ style=\"\"/g, '') === editorView.dom.innerHTML.replace(/ style=\"\"/g, '')) return
  emit('update', {
    value: editorView.dom.innerHTML,
    ignore: isHanldeHistory,
  })
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

const handleKeydown = (editorView: EditorView, e: KeyboardEvent) => {
  const { ctrlKey, shiftKey, metaKey } = e
  const ctrlActive = ctrlKey || shiftKey || metaKey
  const key = e.key.toUpperCase()
  
  const isHanldeHistory = ctrlActive && (key === KEYS.Z || key === KEYS.Y)

  handleInput(isHanldeHistory)
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

// 暴露 focus 方法
const focus = () => editorView.focus()
defineExpose({ focus })

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
      setListStyle(editorView, { key: 'fontsize', value: item.value })
    }
    else if (item.command === 'fontsize-add') {
      const step = item.value ? +item.value : 2
      autoSelectAll(editorView)
      const fontsize = getFontsize(editorView) + step + 'px'
      const mark = editorView.state.schema.marks.fontsize.create({ fontsize })
      addMark(editorView, mark)
      setListStyle(editorView, { key: 'fontsize', value: fontsize })
    }
    else if (item.command === 'fontsize-reduce') {
      const step = item.value ? +item.value : 2
      autoSelectAll(editorView)
      let fontsize = getFontsize(editorView) - step
      if (fontsize < 12) fontsize = 12
      const mark = editorView.state.schema.marks.fontsize.create({ fontsize: fontsize + 'px' })
      addMark(editorView, mark)
      setListStyle(editorView, { key: 'fontsize', value: fontsize + 'px' })
    }
    else if (item.command === 'color' && item.value) {
      const mark = editorView.state.schema.marks.forecolor.create({ color: item.value })
      autoSelectAll(editorView)
      addMark(editorView, mark)
      setListStyle(editorView, { key: 'color', value: item.value })
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
      const isBlockquote = isActiveOfParentNodeType('blockquote', editorView.state)
      if (isBlockquote) lift(editorView.state, editorView.dispatch)
      else wrapIn(editorView.state.schema.nodes.blockquote)(editorView.state, editorView.dispatch)
    }
    else if (item.command === 'code') {
      toggleMark(editorView.state.schema.marks.code)(editorView.state, editorView.dispatch)
    }
    else if (item.command === 'align' && item.value) {
      alignmentCommand(editorView, item.value)
    }
    else if (item.command === 'indent' && item.value) {
      indentCommand(editorView, +item.value)
    }
    else if (item.command === 'textIndent' && item.value) {
      textIndentCommand(editorView, +item.value)
    }
    else if (item.command === 'bulletList') {
      const listStyleType = item.value || ''
      const { bullet_list: bulletList, list_item: listItem } = editorView.state.schema.nodes
      const textStyle = {
        color: richTextAttrs.value.color,
        fontsize: richTextAttrs.value.fontsize
      }
      toggleList(bulletList, listItem, listStyleType, textStyle)(editorView.state, editorView.dispatch)
    }
    else if (item.command === 'orderedList') {
      const listStyleType = item.value || ''
      const { ordered_list: orderedList, list_item: listItem } = editorView.state.schema.nodes
      const textStyle = {
        color: richTextAttrs.value.color,
        fontsize: richTextAttrs.value.fontsize
      }
      toggleList(orderedList, listItem, listStyleType, textStyle)(editorView.state, editorView.dispatch)
    }
    else if (item.command === 'clear') {
      autoSelectAll(editorView)
      const { $from, $to } = editorView.state.selection
      editorView.dispatch(editorView.state.tr.removeMark($from.pos, $to.pos))
      setListStyle(editorView, [
        { key: 'fontsize', value: '' },
        { key: 'color', value: '' },
      ])
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

// 鼠标抬起时，执行格式刷命令
const handleMouseup = () => {
  if (!textFormatPainter.value) return
  const { keep, ...newProps } = textFormatPainter.value

  const actions: RichTextAction[] = [{ command: 'clear' }]
  for (const key of Object.keys(newProps) as TextFormatPainterKeys[]) {
    const command = key
    const value = textFormatPainter.value[key]
    if (value === true) actions.push({ command })
    else if (value) actions.push({ command, value })
  }
  execCommand({ action: actions })
  if (!keep) mainStore.setTextFormatPainter(null)
}

// Prosemirror编辑器的初始化和卸载
onMounted(() => {
  editorView = initProsemirrorEditor((editorViewRef.value as Element), textContent.value, {
    handleDOMEvents: {
      focus: handleFocus,
      blur: handleBlur,
      keydown: handleKeydown,
      click: handleClick,
      mouseup: handleMouseup,
    },
    editable: () => props.editable,
  })
  if (props.autoFocus) editorView.focus()
})
onUnmounted(() => {
  editorView && editorView.destroy()
})

const syncAttrsToStore = () => {
  if (handleElementId.value !== props.elementId) return
  handleClick()
}

emitter.on(EmitterEvents.RICH_TEXT_COMMAND, execCommand)
emitter.on(EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE, syncAttrsToStore)
onUnmounted(() => {
  emitter.off(EmitterEvents.RICH_TEXT_COMMAND, execCommand)
  emitter.off(EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE, syncAttrsToStore)
})
</script>

<style lang="scss" scoped>
.prosemirror-editor {
  cursor: text;

  &.format-painter {
    cursor: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTcuMzUuMDEybC0uMDY2Ljk5OGE1LjI3MSA1LjI3MSAwIDAwLTEuMTg0LjA2IDMuOCAzLjggMCAwMC0uOTMzLjQ3MmMtLjQ0LjM1Ni0uNzgzLjgxMS0uOTk4IDEuMzI0bC4wMTgtLjAzNnY1LjEyaDEuMDR2Ljk4aC0xLjA0bC0uMDAyIDQuMTVjLjE4Ny40MjYuNDYuODEuNzkxIDEuMTE3bC4xNzUuMTUyYy4yOTMuMjA4LjYxNS4zNzMuODkuNDcyLjQxLjA4Mi44My4xMTIgMS4yNDkuMDlsLjA1Ny45OTlhNi4wNjMgNi4wNjMgMCAwMS0xLjU4OC0uMTI5IDQuODM2IDQuODM2IDAgMDEtMS4yNS0uNjQ3IDQuNDYzIDQuNDYzIDAgMDEtLjgzOC0uODgzYy0uMjI0LjMzMi0uNS42NDItLjgyNC45MjdhNC4xMSA0LjExIDAgMDEtMS4zMDUuNjMzQTYuMTI2IDYuMTI2IDAgMDEwIDE1LjkwOWwuMDY4LS45OTdjLjQyNC4wMjYuODUtLjAwMSAxLjIxNy0uMDcuMzM2LS4wOTkuNjUxLS4yNTQuODk0LS40My40My0uMzguNzY1LS44NDcuOTgyLTEuMzY4bC0uMDA1LjAxNFY4LjkzSDIuMTE1di0uOThoMS4wNFYyLjg2MmEzLjc3IDMuNzcgMCAwMC0uNzc0LTEuMTY3bC0uMTY1LS4xNTZhMy4wNjQgMy4wNjQgMCAwMC0uODgtLjQ0OEE1LjA2MiA1LjA2MiAwIDAwLjA2NyAxLjAxTDAgLjAxMmE2LjE0IDYuMTQgMCAwMTEuNTkyLjExYy40NTMuMTM1Ljg3Ny4zNDUgMS4yOS42NS4zLjI2NS41NjUuNTY0Ljc4Ny44OS4yMzMtLjMzMS41Mi0uNjM0Ljg1My0uOTA0YTQuODM1IDQuODM1IDAgMDExLjMtLjY0OEE2LjE1NSA2LjE1NSAwIDAxNy4zNS4wMTJ6IiBmaWxsPSIjMEQwRDBEIi8+PHBhdGggZD0iTTE3LjM1IDE0LjVsNC41LTQuNS02LTZjLTIgMi0zIDItNS41IDIuNS40IDMuMiA0LjgzMyA2LjY2NyA3IDh6bTQuNTg4LTQuNDkzYS4zLjMgMCAwMC40MjQgMGwuNjgtLjY4YTEuNSAxLjUgMCAwMDAtMi4xMjJMMjEuNjkgNS44NTNsMi4wMjUtMS41ODNhMS42MjkgMS42MjkgMCAxMC0yLjI3OS0yLjI5NmwtMS42MDMgMi4wMjItMS4zNTctMS4zNTdhMS41IDEuNSAwIDAwLTIuMTIxIDBsLS42OC42OGEuMy4zIDAgMDAwIC40MjVsNi4yNjMgNi4yNjN6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE1Ljg5MiAzLjk2MnMtMS4wMyAxLjIwMi0yLjQ5NCAxLjg5Yy0xLjAwNi40NzQtMi4xOC41ODYtMi43MzQuNjI3LS4yLjAxNS0uMzQ0LjIxLS4yNzYuMzk5LjI5Mi44MiAxLjExMiAyLjggMi42NTggNC4zNDYgMi4xMjYgMi4xMjcgMy42NTggMi45NjggNC4xNDIgMy4yMDMuMS4wNDguMjE0LjAzLjI5OC0uMDQyLjM4Ni0uMzI1IDEuNS0xLjI3NyAyLjIxLTEuOTg2Ljg5Mi0uODg5IDIuMTg3LTIuNDQ3IDIuMTg3LTIuNDQ3bS40NzkuMDU1YS4zLjMgMCAwMS0uNDI0IDBsLTYuMjY0LTYuMjYzYS4zLjMgMCAwMTAtLjQyNWwuNjgtLjY4YTEuNSAxLjUgMCAwMTIuMTIyIDBsMS4zNTcgMS4zNTcgMS42MDMtMi4wMjJhMS42MjkgMS42MjkgMCAxMTIuMjggMi4yOTZMMjEuNjkgNS44NTNsMS4zNTIgMS4zNTJhMS41IDEuNSAwIDAxMCAyLjEyMmwtLjY4LjY4eiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+) 2 5, default !important;
  }
}
</style>
