<template>
  <div class="table-cell-editor" ref="editorRef"></div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, watch, useTemplateRef } from 'vue'
import { EditorState, TextSelection, type Command } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { baseKeymap, splitBlockKeepMarks, toggleMark } from 'prosemirror-commands'
import { closeHistory, history, undo, redo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import type { TableCellStyle } from '@/types/slides'
import { pasteCustomClipboardString, pasteExcelClipboardString, pasteHTMLTableClipboardString } from '@/utils/clipboard'
import { tableSchema, parseTableText, serializeTableText, replaceTableText, getTableTextAttrs, setTableTextAttrs, type TableTextAttrs } from '@/utils/prosemirror/table'

const props = defineProps<{
  value: string
  cellStyle?: TableCellStyle
  cachedState?: EditorState
}>()

const emit = defineEmits<{
  (event: 'update', payload: { value: string; ignore: boolean }): void
  (event: 'updateState', payload: { state: EditorState; value: string }): void
  (event: 'changeTextAttrs', payload: TableTextAttrs): void
  (event: 'insertExcelData', payload: string[][]): void
}>()

const editorRef = useTemplateRef<HTMLElement>('editorRef')
let editorView: EditorView | null = null
let editorValue = ''

const syncEditorState = (docChanged = true) => {
  if (!editorView) return
  if (docChanged) editorValue = serializeTableText(editorView.state.doc)
  emit('updateState', { state: editorView.state, value: editorValue })
}

const syncTextAttrs = () => {
  if (editorView) emit('changeTextAttrs', getTableTextAttrs(editorView.state, props.cellStyle))
}

const applyTextAttrs = (attrs: Partial<TableTextAttrs>) => {
  if (!editorView || editorView.composing) return null
  const wholeCell = editorView.state.selection.empty
  const tr = setTableTextAttrs(editorView.state, attrs)
  editorView.updateState(editorView.state.apply(tr))
  syncEditorState(tr.docChanged)
  editorView.focus()
  syncTextAttrs()
  return { text: editorValue, empty: !editorView.state.doc.textContent, wholeCell }
}

const replaceText = (value: string) => {
  if (!editorView) return value
  editorView.updateState(editorView.state.apply(replaceTableText(editorView.state, value)))
  editorView.updateState(editorView.state.apply(closeHistory(editorView.state.tr)))
  syncEditorState()
  syncTextAttrs()
  return editorValue
}

const focus = (coords?: { left: number; top: number }) => {
  if (!editorView) return
  if (coords) {
    const position = editorView.posAtCoords(coords)
    if (position) {
      const { state } = editorView
      const tr = state.tr.setSelection(TextSelection.near(state.doc.resolve(position.pos)))
      // 定位事务会清空 storedMarks，空单元格仍需保留预设的后续输入格式。
      if (!state.doc.textContent && state.storedMarks) tr.setStoredMarks(state.storedMarks)
      editorView.dispatch(tr)
    }
  }
  editorView.focus()
}

const isAtBoundary = (position: 'start' | 'end') => {
  if (!editorView) return false
  const { selection, doc } = editorView.state
  return selection.empty && selection.from === (position === 'start' ? 1 : doc.content.size - 1)
}
defineExpose({ focus, applyTextAttrs, replaceText, syncTextAttrs, isAtBoundary })

// 内部撤销只同步内容，不再生成项目快照；空历史也不向全局撤销回退。
const undoText: Command = (state, dispatch) => {
  undo(state, tr => dispatch?.(tr.setMeta('tableTextHistory', true)))
  return true
}
const redoText: Command = (state, dispatch) => {
  redo(state, tr => dispatch?.(tr.setMeta('tableTextHistory', true)))
  return true
}

const createState = () => {
  let state = EditorState.create({
    doc: parseTableText(props.value),
    plugins: [
      keymap({
        'Mod-b': toggleMark(tableSchema.marks.strong),
        'Mod-i': toggleMark(tableSchema.marks.em),
        'Mod-u': toggleMark(tableSchema.marks.underline),
        'Mod-d': toggleMark(tableSchema.marks.strikethrough),
        'Enter': splitBlockKeepMarks,
        'Shift-Enter': (state, dispatch) => {
          dispatch?.(state.tr.replaceSelectionWith(tableSchema.nodes.hard_break.create()).scrollIntoView())
          return true
        },
        'Mod-z': undoText,
        'Mod-y': redoText,
        'Mod-Shift-z': redoText,
      }),
      keymap(baseKeymap),
      history(),
    ],
  })
  if (!state.doc.textContent) state = state.apply(setTableTextAttrs(state, props.cellStyle || {}))
  return state
}

watch([() => props.value, () => props.cachedState], ([value, cachedState]) => {
  if (!editorView) return
  if (cachedState) {
    if (cachedState !== editorView.state) {
      editorView.updateState(cachedState)
      syncEditorState()
      syncTextAttrs()
    }
    if (value === editorValue || parseTableText(value).eq(editorView.state.doc)) return
  }
  // 外部替换内容或全局回滚后，旧历史不再适用于当前单元格。
  editorView.updateState(createState())
  syncEditorState()
  syncTextAttrs()
})

onMounted(() => {
  let state = props.cachedState
  if (!state || (props.value !== serializeTableText(state.doc) && !state.doc.eq(parseTableText(props.value)))) {
    state = createState()
  }
  editorView = new EditorView(editorRef.value as HTMLElement, {
    state,
    dispatchTransaction(tr) {
      if (!editorView) return
      editorView.updateState(editorView.state.apply(tr))
      syncEditorState(tr.docChanged)
      if (tr.docChanged) {
        emit('update', {
          value: editorValue,
          ignore: !!tr.getMeta('tableTextHistory'),
        })
      }
      syncTextAttrs()
    },
    handleDOMEvents: {
      beforeinput: (view, event) => {
        const { inputType } = event as InputEvent
        if (inputType !== 'historyUndo' && inputType !== 'historyRedo') return false
        event.preventDefault()
        return (inputType === 'historyUndo' ? undoText : redoText)(view.state, view.dispatch, view)
      },
      focus: () => {
        syncTextAttrs()
        return false
      },
    },
    handlePaste(view, event) {
      const clipboard = event.clipboardData
      if (!clipboard) return false
      const text = clipboard.getData('text/plain')
      if (text && typeof pasteCustomClipboardString(text) === 'object') return true
      const html = clipboard.getData('text/html')
      const table = html ? pasteHTMLTableClipboardString(html) : null
      const data = table?.length ? table : pasteExcelClipboardString(text)
      if (data?.length && data[0].length) {
        emit('insertExcelData', data)
        return true
      }
      return false
    },
  })
  syncEditorState()
  editorView.focus()
  syncTextAttrs()
})

onBeforeUnmount(() => {
  editorView?.destroy()
  editorView = null
})
</script>

<style lang="scss" scoped>
.table-cell-editor {
  :deep(.ProseMirror) {
    font: inherit;
    line-height: inherit;
    text-align: inherit;
    white-space: pre-wrap;
    min-width: 0;

    p {
      margin: 0;
    }
  }
}
</style>
