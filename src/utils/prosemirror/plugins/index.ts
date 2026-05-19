import { keymap } from 'prosemirror-keymap'
import type { Schema } from 'prosemirror-model'
import { history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'

import { buildKeymap } from './keymap'
import { buildInputRules } from './inputrules'
import { placeholderPlugin } from './placeholder'

/**
 * 编辑器插件构建选项。
 */
export interface PluginOptions {
  /** 空段落占位提示文本。 */
  placeholder?: string
}

/**
 * 构建 ProseMirror 编辑器插件列表。
 *
 * @param schema - 当前编辑器 schema。
 * @param options - 插件构建选项。
 * @returns ProseMirror 插件数组。
 * @throws 当前函数不主动抛错；插件构建异常沿用 ProseMirror 行为。
 * @remarks
 * - 插件顺序会影响快捷键和输入规则处理优先级。
 * - 项目自定义 keymap 放在 baseKeymap 之前，确保自定义快捷键优先处理。
 */
export const buildPlugins = (schema: Schema, options?: PluginOptions) => {
  // 读取占位提示文本。
  const placeholder = options?.placeholder

  // 基础插件列表。
  const plugins = [
    // Markdown-like 输入规则，例如列表、引用、链接等。
    buildInputRules(schema),
    // 项目自定义快捷键。
    keymap(buildKeymap(schema)),
    // ProseMirror 默认快捷键兜底。
    keymap(baseKeymap),
    // 拖拽时显示插入光标。
    dropCursor(),
    // 允许在块级节点之间出现 gap cursor。
    gapCursor(),
    // 编辑历史记录，支持 undo/redo。
    history(),
  ]

  // 有 placeholder 配置时追加占位插件。
  if (placeholder) plugins.push(placeholderPlugin(placeholder))

  // 返回插件列表。
  return plugins
}
