import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list'
import type { Schema } from 'prosemirror-model'
import { undo, redo } from 'prosemirror-history'
import { undoInputRule } from 'prosemirror-inputrules'
import type { Command } from 'prosemirror-state'
import {
  toggleMark,
  selectParentNode,
  joinUp,
  joinDown,
  chainCommands,
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  splitBlockKeepMarks,
} from 'prosemirror-commands'

/**
 * 构建项目富文本编辑器快捷键映射。
 *
 * @param schema - 当前编辑器 schema。
 * @returns 快捷键到 ProseMirror command 的映射表。
 * @throws 当前函数不主动抛错；缺失 schema 节点或 mark 时沿用运行时行为。
 * @remarks
 * - `Mod` 会由 prosemirror-keymap 映射为 macOS Command 或 Windows/Linux Ctrl。
 * - Enter 使用 chainCommands，按顺序尝试列表换行、代码换行、创建邻近段落等行为。
 */
export const buildKeymap = (schema: Schema) => {
  // 快捷键映射表。
  const keys: Record<string, Command> = {}
  // 小工具：写入快捷键命令。
  const bind = (key: string, cmd: Command) => keys[key] = cmd

  // Alt + 上方向：向上合并块。
  bind('Alt-ArrowUp', joinUp)
  // Alt + 下方向：向下合并块。
  bind('Alt-ArrowDown', joinDown)
  // 撤销。
  bind('Mod-z', undo)
  // 重做。
  bind('Mod-y', redo)
  // Backspace 优先撤销输入规则自动转换。
  bind('Backspace', undoInputRule)
  // Escape 选中父节点。
  bind('Escape', selectParentNode)
  // 加粗。
  bind('Mod-b', toggleMark(schema.marks.strong))
  // 斜体。
  bind('Mod-i', toggleMark(schema.marks.em))
  // 下划线。
  bind('Mod-u', toggleMark(schema.marks.underline))
  // 删除线。
  bind('Mod-d', toggleMark(schema.marks.strikethrough))
  // 行内代码。
  bind('Mod-e', toggleMark(schema.marks.code))
  // 上标。
  bind('Mod-;', toggleMark(schema.marks.superscript))
  // 下标。
  bind(`Mod-'`, toggleMark(schema.marks.subscript))
  // Enter：优先处理列表项拆分，再处理其他换行/分块行为。
  bind('Enter', chainCommands(
    // 在列表项内回车时拆分列表项。
    splitListItem(schema.nodes.list_item),
    // 代码块内换行。
    newlineInCode,
    // 在非文本块附近创建段落。
    createParagraphNear,
    // 空块提升。
    liftEmptyBlock,
    // 普通拆分块，并保留 marks。
    splitBlockKeepMarks,
  ))
  // 减少列表层级。
  bind('Mod-[', liftListItem(schema.nodes.list_item))
  // 增加列表层级。
  bind('Mod-]', sinkListItem(schema.nodes.list_item))
  // Tab 增加列表层级。
  bind('Tab', sinkListItem(schema.nodes.list_item))

  // 返回快捷键映射表。
  return keys
}
