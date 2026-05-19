import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import type { Node } from 'prosemirror-model'

/**
 * 判断节点是否为空段落。
 *
 * @param node - 待判断节点。
 * @returns 节点是空 paragraph 时返回 true。
 * @throws 当前函数不主动抛错。
 * @remarks ProseMirror 空段落 nodeSize 通常为 2，只包含开始和结束 token。
 */
const isEmptyParagraph = (node: Node) => {
  // 仅空 paragraph 显示 placeholder。
  return node.type.name === 'paragraph' && node.nodeSize === 2
}

/**
 * 创建空段落占位提示插件。
 *
 * @param placeholder - 占位提示文本。
 * @returns ProseMirror Plugin 实例。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 插件通过 Decoration 给当前空段落添加 `data-placeholder` 属性。
 * - 实际提示样式通常由 CSS 根据 `data-placeholder` 渲染。
 */
export const placeholderPlugin = (placeholder: string) => {
  // 创建 ProseMirror 插件。
  return new Plugin({
    // 插件对 EditorView 暴露的 props。
    props: {
      /**
       * 根据当前编辑状态生成 decoration。
       *
       * @param state - 当前编辑器状态。
       * @returns 当前文档的 DecorationSet；非空段落时返回 undefined。
       */
      decorations(state) {
        // 当前选区起点。
        const { $from } = state.selection
        // 只有光标所在父节点为空段落时显示占位。
        if (isEmptyParagraph($from.parent)) {
          // 创建节点级 decoration，给空段落添加 data-placeholder。
          const decoration = Decoration.node($from.before(), $from.after(), {
            'data-placeholder': placeholder,
          })
          // 基于当前文档创建 decoration 集合。
          return DecorationSet.create(state.doc, [decoration])
        }
      },
    },
  })
}
