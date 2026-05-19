import { EditorState } from 'prosemirror-state'
import { type DirectEditorProps, EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { buildPlugins, type PluginOptions } from './plugins/index'
import { schemaNodes, schemaMarks } from './schema/index'

// 富文本编辑器统一使用的 ProseMirror schema。
const schema = new Schema({
  // 节点定义，例如 paragraph、list、blockquote 等。
  nodes: schemaNodes,
  // 标记定义，例如 bold、italic、color、link 等。
  marks: schemaMarks,
})

/**
 * 根据 HTML 内容创建 ProseMirror 文档节点。
 *
 * @param content - 编辑器富文本 HTML 字符串。
 * @returns ProseMirror document 节点。
 * @throws 当前函数不主动抛错；DOMParser 或 schema 解析失败时沿用 ProseMirror/浏览器行为。
 * @remarks
 * - 传入内容会包裹一层 div，保证即使是多个顶层节点也能被 DOMParser 解析。
 * - 该函数是初始化编辑器和替换编辑器内容的基础入口。
 */
export const createDocument = (content: string) => {
  // 包裹一层容器，避免多个顶层 HTML 片段无法直接作为单一 DOM 根节点解析。
  const htmlString = `<div>${content}</div>`
  // 使用浏览器 DOMParser 将 HTML 字符串转为 DOM。
  const parser = new window.DOMParser()
  // 取 body 下的第一层容器元素。
  const element = parser.parseFromString(htmlString, 'text/html').body.firstElementChild
  // 使用当前 schema 将 DOM 解析成 ProseMirror 文档节点。
  return DOMParser.fromSchema(schema).parse(element as Element)
}

/**
 * 初始化 ProseMirror 编辑器视图。
 *
 * @param dom - 编辑器挂载 DOM。
 * @param content - 初始富文本 HTML 内容。
 * @param props - 透传给 EditorView 的配置，state 由本函数统一创建。
 * @param pluginOptions - 插件构建选项，例如 placeholder 等。
 * @returns ProseMirror EditorView 实例。
 * @throws 当前函数不主动抛错；编辑器创建失败时沿用 ProseMirror 行为。
 * @remarks
 * - 该函数集中创建 EditorState，保证所有富文本编辑器使用同一套 schema 和插件。
 * - 调用方仍可通过 props 注入 dispatchTransaction、handleDOMEvents 等行为。
 */
export const initProsemirrorEditor = (
  dom: Element,
  content: string,
  props: Omit<DirectEditorProps, 'state'>,
  pluginOptions?: PluginOptions,
) => {
  // 创建并返回编辑器视图。
  return new EditorView(dom, {
    // 统一创建编辑器状态。
    state: EditorState.create({
      // 初始文档。
      doc: createDocument(content),
      // 根据 schema 和选项构建插件列表。
      plugins: buildPlugins(schema, pluginOptions),
    }),
    // 合并调用方传入的 EditorView 配置。
    ...props,
  })
}
