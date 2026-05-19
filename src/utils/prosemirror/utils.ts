import type { Node, NodeType, ResolvedPos, Mark, MarkType, Schema } from 'prosemirror-model'
import type { EditorState, Selection } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { selectAll } from 'prosemirror-commands'

/**
 * 判断节点是否为列表节点。
 *
 * @param node - 需要判断的 ProseMirror 节点。
 * @param schema - 当前编辑器 schema。
 * @returns 是无序列表或有序列表时返回 true，否则返回 false。
 * @throws 当前函数不主动抛错。
 */
export const isList = (node: Node, schema: Schema) => {
  // 同时兼容 bullet_list 和 ordered_list。
  return (
    node.type === schema.nodes.bullet_list ||
    node.type === schema.nodes.ordered_list
  )
}

/**
 * 当当前选区为空时自动全选编辑器内容。
 *
 * @param view - ProseMirror 编辑器视图。
 * @returns 无显式返回值。
 * @throws 当前函数不主动抛错。
 * @remarks 常用于“点击工具栏命令但没有选中文本”时，让命令作用于全文。
 */
export const autoSelectAll = (view: EditorView) => {
  // 当前 selection 是否为空光标。
  const { empty } = view.state.selection
  // 空选区时执行 ProseMirror 内置全选命令。
  if (empty) selectAll(view.state, view.dispatch)
}

/**
 * 给指定选区或当前选区添加 mark。
 *
 * @param editorView - ProseMirror 编辑器视图。
 * @param mark - 需要添加的 mark。
 * @param selection - 可选显式选区；不传则使用当前编辑器选区。
 * @returns 无显式返回值。
 * @throws 当前函数不主动抛错。
 */
export const addMark = (editorView: EditorView, mark: Mark, selection?: { from: number; to: number; }) => {
  // 调用方传入选区时使用该范围。
  if (selection) {
    // 创建 addMark transaction 并派发。
    editorView.dispatch(editorView.state.tr.addMark(selection.from, selection.to, mark))
  }
  // 未传选区时使用当前 selection 范围。
  else {
    // 当前选区起止位置。
    const { $from, $to } = editorView.state.selection
    // 对当前选区添加 mark。
    editorView.dispatch(editorView.state.tr.addMark($from.pos, $to.pos, mark))
  }
}

/**
 * 查找指定范围内连续拥有同一个 mark 实例的节点区间。
 *
 * @param doc - ProseMirror 文档节点。
 * @param from - 起始位置。
 * @param to - 结束位置。
 * @param markType - 需要查找的 mark 类型。
 * @returns 连续 mark 区间信息；范围内任一节点缺失该 mark 时返回 null。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 该函数不仅检查 from-to，还会向左右扩展到同一个 mark 实例的完整范围。
 * - `mark !== firstMark` 用于保证是同一 mark 实例，而不是同类型但不同属性的 mark。
 */
export const findNodesWithSameMark = (doc: Node, from: number, to: number, markType: MarkType) => {
  // 当前扫描位置。
  let ii = from
  // mark 类型匹配器。
  const finder = (mark: Mark) => mark.type === markType
  // 范围内第一个匹配到的 mark 实例。
  let firstMark = null
  // 区间起始节点。
  let fromNode = null
  // 区间结束节点。
  let toNode = null

  // 先验证 from-to 范围内每个位置都拥有同一个 mark。
  while (ii <= to) {
    // 读取当前位置节点。
    const node = doc.nodeAt(ii)
    // 节点不存在或没有 marks 时失败。
    if (!node || !node.marks) return null

    // 查找当前节点上指定类型的 mark。
    const mark = node.marks.find(finder)
    // 当前节点缺少该 mark 时失败。
    if (!mark) return null

    // 已记录 firstMark 后，后续必须是同一个 mark 实例。
    if (firstMark && mark !== firstMark) return null

    // 记录起始节点。
    fromNode = fromNode || node
    // 记录第一个 mark。
    firstMark = firstMark || mark
    // 更新结束节点。
    toNode = node
    // 扫描下一个位置。
    ii++
  }

  // 连续 mark 区间的起始位置。
  let fromPos = from
  // 连续 mark 区间的结束位置。
  let toPos = to

  // 左侧边界检查下限。
  let jj = 0
  // 从 from 左侧开始扩展。
  ii = from - 1
  // 向左寻找同一个 mark 实例。
  while (ii > jj) {
    // 读取当前位置节点。
    const node = doc.nodeAt(ii)
    // 查找同类型 mark。
    const mark = node && node.marks.find(finder)
    // 没有 mark 或 mark 实例不同则停止扩展。
    if (!mark || mark !== firstMark) break
    // 更新左边界。
    fromPos = ii
    // 更新起始节点。
    fromNode = node
    // 继续向左。
    ii--
  }

  // 从 to 右侧开始扩展。
  ii = to + 1
  // 右侧边界上限。
  jj = doc.nodeSize - 2
  // 向右寻找同一个 mark 实例。
  while (ii < jj) {
    // 读取当前位置节点。
    const node = doc.nodeAt(ii)
    // 查找同类型 mark。
    const mark = node && node.marks.find(finder)
    // 没有 mark 或 mark 实例不同则停止扩展。
    if (!mark || mark !== firstMark) break
    // 更新右边界。
    toPos = ii
    // 更新结束节点。
    toNode = node
    // 继续向右。
    ii++
  }

  // 返回完整连续 mark 区间。
  return {
    // 匹配到的 mark 实例。
    mark: firstMark,
    // 起始节点和位置。
    from: {
      node: fromNode,
      pos: fromPos,
    },
    // 结束节点和位置。
    to: {
      node: toNode,
      pos: toPos,
    },
  }
}

/**
 * 判断节点类型是否匹配。
 *
 * @param nodeType - 目标节点类型。
 * @param node - 待判断节点。
 * @returns 节点类型匹配时返回 true。
 * @throws 当前函数不主动抛错。
 */
const equalNodeType = (nodeType: NodeType, node: Node) => {
  // 兼容数组形式和单一 NodeType；虽然当前类型声明是 NodeType，这里保留原有运行时兼容逻辑。
  return Array.isArray(nodeType) && nodeType.indexOf(node.type) > -1 || node.type === nodeType
}

/**
 * 从指定位置向上查找最近的父节点。
 *
 * @param $pos - ProseMirror resolved position。
 * @param predicate - 父节点匹配条件。
 * @returns 匹配到的父节点信息；未找到时返回 undefined。
 * @throws 当前函数不主动抛错。
 */
const findParentNodeClosestToPos = ($pos: ResolvedPos, predicate: (node: Node) => boolean) => {
  // 从当前位置深度向上回溯。
  for (let i = $pos.depth; i > 0; i--) {
    // 当前深度的父节点。
    const node = $pos.node(i)
    // 满足条件时返回节点和位置信息。
    if (predicate(node)) {
      return {
        // 父节点开始前的位置。
        pos: i > 0 ? $pos.before(i) : 0,
        // 父节点内容开始位置。
        start: $pos.start(i),
        // 父节点深度。
        depth: i,
        // 父节点本身。
        node,
      }
    }
  }
}

/**
 * 生成基于 selection 查找父节点的函数。
 *
 * @param predicate - 父节点匹配条件。
 * @returns 接收 Selection 并返回父节点信息的函数。
 * @throws 当前函数不主动抛错。
 */
export const findParentNode = (predicate: (node: Node) => boolean) => {
  // 从 selection.$from 开始向上查找。
  return (_ref: Selection) => findParentNodeClosestToPos(_ref.$from, predicate)
}

/**
 * 生成查找指定类型父节点的函数。
 *
 * @param nodeType - 需要匹配的节点类型。
 * @returns 接收 Selection 并返回父节点信息的函数。
 * @throws 当前函数不主动抛错。
 */
export const findParentNodeOfType = (nodeType: NodeType) => {
  // 返回 selection 查询函数。
  return (selection: Selection) => {
    // 复用通用父节点查找函数。
    return findParentNode((node: Node) => {
      // 判断节点类型是否匹配。
      return equalNodeType(nodeType, node)
    })(selection)
  }
}

/**
 * 判断当前选区是否位于指定父节点类型内。
 *
 * @param nodeType - schema.nodes 中的节点类型名称。
 * @param state - 当前编辑器状态。
 * @returns 当前选区位于该父节点类型内时返回 true。
 * @throws 当前函数不主动抛错；nodeType 不存在时沿用后续调用行为。
 */
export const isActiveOfParentNodeType = (nodeType: string, state: EditorState) => {
  // 从 schema 中读取节点类型。
  const node = state.schema.nodes[nodeType]
  // 判断当前 selection 是否存在该类型父节点。
  return !!findParentNodeOfType(node)(state.selection)
}

/**
 * 获取节点子树中的最后一个文本节点。
 *
 * @param node - 待查找节点。
 * @returns 最后一个文本节点；不存在时返回 null。
 * @throws 当前函数不主动抛错。
 * @remarks 用于光标位于元素边界时回退到最近文本节点读取 marks。
 */
export const getLastTextNode = (node: Node | null): Node | null => {
  // 空节点直接返回 null。
  if (!node) return null
  // 当前节点本身是文本节点时返回。
  if (node.type.name === 'text') return node
  // 没有子节点时返回 null。
  if (!node.lastChild) return null

  // 递归查找最后一个子节点中的文本节点。
  return getLastTextNode(node.lastChild)
}

/**
 * 获取当前光标附近文本节点的 mark 列表。
 *
 * @param view - ProseMirror 编辑器视图。
 * @returns 当前光标处或前一个文本节点上的 marks。
 * @throws 当前函数不主动抛错。
 * @remarks 该函数服务于工具栏状态读取，例如当前是否加粗、字号是多少。
 */
export const getMarkAttrs = (view: EditorView) => {
  // 当前 selection 和文档。
  const { selection, doc } = view.state
  // 当前光标起点。
  const { from } = selection

  // 优先读取 from 位置节点，读不到时尝试 from - 1。
  let node = doc.nodeAt(from) || doc.nodeAt(from - 1)
  // 回退到最后一个文本节点。
  node = getLastTextNode(node)

  // 返回节点 marks；没有文本节点时返回空数组。
  return node?.marks || []
}

/**
 * 从 mark 列表中读取指定属性。
 *
 * @param marks - mark 列表。
 * @param markType - mark 类型名称。
 * @param attr - 属性名。
 * @returns 属性值；找不到时返回 null。
 * @throws 当前函数不主动抛错。
 */
export const getAttrValue = (marks: readonly Mark[], markType: string, attr: string): string | null => {
  // 遍历当前 marks。
  for (const mark of marks) {
    // 类型和属性都匹配时返回属性值。
    if (mark.type.name === markType && mark.attrs[attr]) return mark.attrs[attr]
  }
  // 未找到属性。
  return null
}

/**
 * 判断 mark 列表中是否存在指定类型 mark。
 *
 * @param marks - mark 列表。
 * @param markType - mark 类型名称。
 * @returns 存在该 mark 时返回 true。
 * @throws 当前函数不主动抛错。
 */
export const isActiveMark = (marks: readonly Mark[], markType: string) => {
  // 遍历 marks。
  for (const mark of marks) {
    // 找到对应 mark 类型。
    if (mark.type.name === markType) return true
  }
  // 未找到。
  return false
}

/**
 * 判断当前 selection 是否激活指定 mark 类型。
 *
 * @param state - 当前编辑器状态。
 * @param type - 需要判断的 mark 类型。
 * @returns mark 激活时返回 true。
 * @throws 当前函数不主动抛错。
 * @remarks 空选区优先检查 storedMarks，再检查光标所在位置 marks；非空选区检查范围内是否包含 mark。
 */
export const markActive = (state: EditorState, type: MarkType) => {
  // 解构 selection 范围和是否为空。
  const { from, $from, to, empty } = state.selection
  // 空选区检查 storedMarks 或当前位置 marks。
  if (empty) return type.isInSet(state.storedMarks || $from.marks())
  // 非空选区检查范围内是否有该 mark。
  return state.doc.rangeHasMark(from, to, type)
}

/**
 * 在当前选区内查找第一个拥有指定属性的节点。
 *
 * @param view - ProseMirror 编辑器视图。
 * @param attr - 需要读取的节点属性名。
 * @returns 第一个找到的属性值；未找到时返回空字符串。
 * @throws 当前函数不主动抛错。
 */
export const getAttrValueInSelection = (view: EditorView, attr: string) => {
  // 当前 selection 和文档。
  const { selection, doc } = view.state
  // selection 起止位置。
  const { from, to } = selection

  // 是否继续遍历。
  let keepChecking = true
  // 找到的属性值。
  let value = ''
  // 遍历选区内所有节点。
  doc.nodesBetween(from, to, node => {
    // 找到属性后记录并停止继续遍历。
    if (keepChecking && node.attrs[attr]) {
      keepChecking = false
      value = node.attrs[attr]
    }
    // 返回 false 可停止继续深入/遍历。
    return keepChecking
  })
  // 返回属性值。
  return value
}

// 支持的段落水平对齐值。
type Align = 'left' | 'right' | 'center'

/**
 * 工具栏读取富文本状态时使用的默认属性。
 */
interface DefaultAttrs {
  /** 文字颜色。 */
  color: string
  /** 背景色。 */
  backcolor: string
  /** 字号。 */
  fontsize: string
  /** 字体名。 */
  fontname: string
  /** 段落对齐方式。 */
  align: Align
}
// 富文本默认属性。
const _defaultAttrs: DefaultAttrs = {
  // 默认文字颜色。
  color: '#000000',
  // 默认背景色为空。
  backcolor: '',
  // 默认字号。
  fontsize: '16px',
  // 默认字体为空，交给上层主题或浏览器字体处理。
  fontname: '',
  // 默认左对齐。
  align: 'left',
}
/**
 * 获取当前选区的富文本工具栏状态。
 *
 * @param view - ProseMirror 编辑器视图。
 * @param attrs - 可选默认属性覆盖值。
 * @returns 当前选区的 marks、颜色、字号、字体、链接、对齐和块级状态。
 * @throws 当前函数不主动抛错。
 * @remarks 该函数是工具栏按钮高亮和属性面板展示的集中数据源。
 */
export const getTextAttrs = (view: EditorView, attrs: Partial<DefaultAttrs> = {}) => {
  // 合并默认属性和调用方覆盖属性。
  const defaultAttrs: DefaultAttrs = { ..._defaultAttrs, ...attrs }

  // 获取当前光标附近 marks。
  const marks = getMarkAttrs(view)

  // 当前是否加粗。
  const isBold = isActiveMark(marks, 'strong')
  // 当前是否斜体。
  const isEm = isActiveMark(marks, 'em')
  // 当前是否下划线。
  const isUnderline = isActiveMark(marks, 'underline')
  // 当前是否删除线。
  const isStrikethrough = isActiveMark(marks, 'strikethrough')
  // 当前是否上标。
  const isSuperscript = isActiveMark(marks, 'superscript')
  // 当前是否下标。
  const isSubscript = isActiveMark(marks, 'subscript')
  // 当前是否代码样式。
  const isCode = isActiveMark(marks, 'code')
  // 当前文字颜色。
  const color = getAttrValue(marks, 'forecolor', 'color') || defaultAttrs.color
  // 当前背景色。
  const backcolor = getAttrValue(marks, 'backcolor', 'backcolor') || defaultAttrs.backcolor
  // 当前字号。
  const fontsize = getAttrValue(marks, 'fontsize', 'fontsize') || defaultAttrs.fontsize
  // 当前字体。
  const fontname = getAttrValue(marks, 'fontname', 'fontname') || defaultAttrs.fontname
  // 当前链接。
  const link = getAttrValue(marks, 'link', 'href') || ''
  // 当前段落对齐方式。
  const align = (getAttrValueInSelection(view, 'align') || defaultAttrs.align) as Align
  // 当前是否位于无序列表。
  const isBulletList = isActiveOfParentNodeType('bullet_list', view.state)
  // 当前是否位于有序列表。
  const isOrderedList = isActiveOfParentNodeType('ordered_list', view.state)
  // 当前是否位于引用块。
  const isBlockquote = isActiveOfParentNodeType('blockquote', view.state)

  // 返回工具栏状态对象。
  return {
    bold: isBold,
    em: isEm,
    underline: isUnderline,
    strikethrough: isStrikethrough,
    superscript: isSuperscript,
    subscript: isSubscript,
    code: isCode,
    color: color,
    backcolor: backcolor,
    fontsize: fontsize,
    fontname: fontname,
    link: link,
    align: align,
    bulletList: isBulletList,
    orderedList: isOrderedList,
    blockquote: isBlockquote,
  }
}

// 富文本工具栏状态类型。
export type TextAttrs = ReturnType<typeof getTextAttrs>

/**
 * 获取当前光标附近的字号数字。
 *
 * @param view - ProseMirror 编辑器视图。
 * @returns 当前字号数字；缺失时返回默认字号 16。
 * @throws 当前函数不主动抛错。
 */
export const getFontsize = (view: EditorView) => {
  // 获取当前 marks。
  const marks = getMarkAttrs(view)
  // 读取 fontsize mark 属性。
  const fontsize = getAttrValue(marks, 'fontsize', 'fontsize') || _defaultAttrs.fontsize
  // 去掉 px 并转为数字。
  return parseInt(fontsize)
}

// 富文本工具栏的默认状态。
export const defaultRichTextAttrs: TextAttrs = {
  // 默认不加粗。
  bold: false,
  // 默认不斜体。
  em: false,
  // 默认无下划线。
  underline: false,
  // 默认无删除线。
  strikethrough: false,
  // 默认非上标。
  superscript: false,
  // 默认非下标。
  subscript: false,
  // 默认非代码样式。
  code: false,
  // 默认文字颜色。
  color: '#000000',
  // 默认背景色。
  backcolor: '',
  // 默认字号。
  fontsize: '16px',
  // 默认字体。
  fontname: '',
  // 默认无链接。
  link: '',
  // 默认左对齐。
  align: 'left',
  // 默认不在无序列表。
  bulletList: false,
  // 默认不在有序列表。
  orderedList: false,
  // 默认不在引用块。
  blockquote: false,
}
