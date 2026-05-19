/**
 * 不能解析子节点内容的标签。
 *
 * @remarks style/script/template 内部内容不按普通 HTML 子树继续解析，避免脚本或模板内容干扰节点结构。
 */
export const childlessTags = ['style', 'script', 'template']

/**
 * 遇到同类标签时可自动闭合前一个标签的标签列表。
 *
 * @remarks 例如连续的 `<p>`、`<li>`、`<tr>` 在 HTML 中常省略闭合标签，parser 会依赖该表做容错。
 */
export const closingTags = ['html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option', 'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup']

/**
 * 自动闭合标签的祖先边界。
 *
 * @remarks
 * - key 是可能被自动闭合的标签名。
 * - value 是允许其存在的祖先标签；解析器遇到这些祖先时会停止继续回溯。
 */
export const closingTagAncestorBreakers: Record<string, string[]> = {
  // li 的自动闭合边界是列表容器。
  li: ['ul', 'ol', 'menu'],
  // dt 的自动闭合边界是 dl。
  dt: ['dl'],
  // dd 的自动闭合边界是 dl。
  dd: ['dl'],
  // tbody 的自动闭合边界是 table。
  tbody: ['table'],
  // thead 的自动闭合边界是 table。
  thead: ['table'],
  // tfoot 的自动闭合边界是 table。
  tfoot: ['table'],
  // tr 的自动闭合边界是 table。
  tr: ['table'],
  // td 的自动闭合边界是 table。
  td: ['table'],
}

/**
 * HTML void 标签列表。
 *
 * @remarks void 标签没有结束标签，序列化时应输出 `<tag>` 而不是 `<tag></tag>`。
 */
export const voidTags = ['!doctype', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
