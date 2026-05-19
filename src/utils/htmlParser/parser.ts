import type { Token, HTMLNode, TagToken, NormalElement, TagEndToken, AttributeToken, TextToken } from './types'
import { closingTags, closingTagAncestorBreakers, voidTags } from './tags'

/**
 * 解析栈中的一项。
 *
 * @remarks
 * - root 节点的 tagName 为 null。
 * - children 保存当前标签下已经解析出的子节点。
 */
interface StackItem {
  /** 当前栈项对应的标签名；根节点为 null。 */
  tagName: string | null
  /** 当前标签已解析出的子节点。 */
  children: HTMLNode[]
}

/**
 * parser 运行状态。
 */
interface State {
  /** 解析栈，用于维护当前节点层级。 */
  stack: StackItem[]
  /** 当前读取 token 的位置。 */
  cursor: number
  /** lexer 输出的 token 列表。 */
  tokens: Token[]
}

/**
 * 将 token 列表解析为原始 HTMLNode 树。
 *
 * @param tokens - lexer 输出的 token 列表。
 * @returns 原始 HTMLNode 节点数组。
 * @throws 当前函数不主动抛错；异常 token 顺序会按现有容错逻辑尽量解析。
 * @remarks
 * - 使用栈维护标签嵌套关系。
 * - 会处理 void 标签、自闭合标签和部分 HTML 自动闭合规则。
 */
export const parser = (tokens: Token[]) => {
  // 创建根节点，根节点本身不输出，只承载顶层 children。
  const root: StackItem = { tagName: null, children: [] }
  // 初始化 parser 状态。
  const state: State = { tokens, cursor: 0, stack: [root] }
  // 执行递归解析。
  parse(state)
  // 返回根节点下的所有顶层节点。
  return root.children
}

/**
 * 判断自动闭合标签是否已经遇到终止祖先。
 *
 * @param tagName - 当前准备解析的标签名。
 * @param stack - 当前解析栈。
 * @returns 已遇到终止祖先时返回 true，否则返回 false。
 * @throws 当前函数不主动抛错。
 * @remarks 例如 li 的终止祖先是 ul/ol/menu，遇到这些祖先后不再继续回溯自动闭合。
 */
export const hasTerminalParent = (tagName: string, stack: StackItem[]) => {
  // 读取当前标签对应的终止祖先列表。
  const tagParents = closingTagAncestorBreakers[tagName]
  // 当前标签存在终止祖先规则时才需要检查。
  if (tagParents) {
    // 从栈顶向根节点回溯。
    let currentIndex = stack.length - 1
    // 持续检查当前栈项。
    while (currentIndex >= 0) {
      // 当前栈项标签名。
      const parentTagName = stack[currentIndex].tagName
      // 回溯到同名标签时停止，说明还没遇到外层终止祖先。
      if (parentTagName === tagName) break
      // 遇到终止祖先时返回 true。
      if (parentTagName && tagParents.includes(parentTagName)) return true
      // 继续向上回溯。
      currentIndex--
    }
  }
  // 没有规则或未遇到终止祖先。
  return false
}

/**
 * 将解析栈回退到指定长度。
 *
 * @param stack - 当前解析栈。
 * @param newLength - 需要保留的栈长度。
 * @returns 无显式返回值；会原地截断 stack。
 * @throws 当前函数不主动抛错。
 * @remarks 用于闭合标签或自动闭合标签场景，结束当前嵌套层级。
 */
export const rewindStack = (stack: StackItem[], newLength: number) => {
  // 原地截断栈。
  stack.splice(newLength)
}

/**
 * 从当前 cursor 开始解析 token，并把节点追加到当前栈顶 children。
 *
 * @param state - parser 运行状态。
 * @returns 无显式返回值；解析进度通过 `state.cursor` 写回。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 遇到开始标签会创建元素节点，并在有子节点时递归解析。
 * - 遇到匹配的结束标签会回退栈并返回上一层。
 */
export const parse = (state: State) => {
  // 当前栈、token 列表。
  const { stack, tokens } = state
  // 复制 cursor 到局部变量，循环结束后再写回 state。
  let { cursor } = state
  // 当前层级的 children 指针。
  let nodes = stack[stack.length - 1].children
  // token 总数。
  const len = tokens.length
  
  // 持续读取 token，直到列表末尾或当前层级结束。
  while (cursor < len) {
    // 当前 token。
    const token = tokens[cursor]
    // 非标签开始 token 会被视为文本或注释节点直接追加。
    if (token.type !== 'tag-start') {
      // 追加文本/注释 token；当前类型结构兼容 HTMLNode 的文本/注释节点。
      nodes.push(token as TextToken)
      // 前进到下一个 token。
      cursor++
      continue
    }

    // 标签开始后紧跟 tag token。
    const tagToken = tokens[++cursor] as TagToken
    // 跳过 tag token。
    cursor++
    // 标签名统一小写，用于规则匹配。
    const tagName = tagToken.content.toLowerCase()
    // 结束标签处理。
    if (token.close) {
      // 从栈尾开始查找同名开始标签。
      let index = stack.length
      // 是否需要回退栈。
      let shouldRewind = false
      // 向上查找匹配标签。
      while (--index > -1) {
        // 找到匹配的开始标签。
        if (stack[index].tagName === tagName) {
          shouldRewind = true
          break
        }
      }
      // 跳过结束标签中剩余的 tag-end token。
      while (cursor < len) {
        if (tokens[cursor].type !== 'tag-end') break
        cursor++
      }
      // 找到匹配开始标签时回退栈并结束当前递归层。
      if (shouldRewind) {
        rewindStack(stack, index)
        break
      } 
      // 没找到匹配标签时忽略该结束标签，继续解析后续 token。
      else continue
    }

    // 当前标签是否属于可自动闭合标签。
    const isClosingTag = closingTags.includes(tagName)
    // 默认对可自动闭合标签启用回退检查。
    let shouldRewindToAutoClose = isClosingTag
    // 如果存在终止祖先，则不应跨过终止祖先自动闭合。
    if (shouldRewindToAutoClose) {
      shouldRewindToAutoClose = !hasTerminalParent(tagName, stack)
    }

    // 处理类似连续 p/li/tr/td 的自动闭合。
    if (shouldRewindToAutoClose) {
      // 从栈顶向上查找同名标签。
      let currentIndex = stack.length - 1
      // 不回退根节点。
      while (currentIndex > 0) {
        // 找到同名标签时回退到该标签层级。
        if (tagName === stack[currentIndex].tagName) {
          rewindStack(stack, currentIndex)
          // 回退后当前 nodes 应指向上一层 children。
          const previousIndex = currentIndex - 1
          nodes = stack[previousIndex].children
          break
        }
        // 继续向上查找。
        currentIndex = currentIndex - 1
      }
    }

    // 当前标签属性字符串列表。
    const attributes = []
    // 当前标签结束 token。
    let tagEndToken: TagEndToken | undefined
    // 收集属性，直到遇到 tag-end。
    while (cursor < len) {
      // 当前 token。
      const _token = tokens[cursor]
      // 遇到 tag-end 时停止收集属性。
      if (_token.type === 'tag-end') {
        tagEndToken = _token
        break
      }
      // 属性 token 的 content 保存原始属性字符串。
      attributes.push((_token as AttributeToken).content)
      // 前进到下一个 token。
      cursor++
    }

    // 标签没有结束 token 时停止解析，避免无限循环。
    if (!tagEndToken) break

    // 跳过 tag-end。
    cursor++
    // 当前元素的子节点数组。
    const children: HTMLNode[] = []
    // 构造原始元素节点。
    const elementNode: NormalElement = {
      // 节点类型。
      type: 'element',
      // 保留原始标签名内容。
      tagName: tagToken.content,
      // 原始属性字符串数组。
      attributes,
      // 子节点数组。
      children,
    }
    // 追加到当前层级。
    nodes.push(elementNode)

    // 自闭合标签和 void 标签没有子节点。
    const hasChildren = !(tagEndToken.close || voidTags.includes(tagName))
    // 有子节点的普通元素进入下一层递归解析。
    if (hasChildren) {
      // 把当前元素压入栈。
      stack.push({tagName, children})
      // 子解析状态从当前 cursor 继续。
      const innerState = { tokens, cursor, stack }
      // 递归解析子节点，直到遇到对应结束标签。
      parse(innerState)
      // 同步子解析后的 cursor。
      cursor = innerState.cursor
    }
  }
  // 写回当前解析进度。
  state.cursor = cursor
}
