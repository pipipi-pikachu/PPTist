import { startsWith, endsWith } from 'lodash'
import type { Token } from './types'
import { childlessTags } from './tags'

/**
 * lexer 运行状态。
 */
interface State {
  /** 待分词的完整 HTML 字符串。 */
  str: string
  /** 当前扫描位置。 */
  position: number
  /** 已生成的 token 列表。 */
  tokens: Token[]
}

/**
 * 将扫描位置跳转到指定下标。
 *
 * @param state - lexer 运行状态。
 * @param end - 目标下标。
 * @returns 无显式返回值；会修改 state.position。
 * @throws 当前函数不主动抛错。
 * @remarks 内部通过相对移动实现，保持位置移动逻辑集中。
 */
const jumpPosition = (state: State, end: number) => {
  // 计算需要移动的字符长度。
  const len = end - state.position
  // 按长度移动位置。
  movePositopn(state, len)
}

/**
 * 按指定长度移动扫描位置。
 *
 * @param state - lexer 运行状态。
 * @param len - 需要向后移动的字符数。
 * @returns 无显式返回值；会修改 state.position。
 * @throws 当前函数不主动抛错。
 */
const movePositopn = (state: State, len: number) => {
  // 将当前位置向后移动 len。
  state.position = state.position + len
}

/**
 * 查找当前文本片段的结束位置。
 *
 * @param str - 完整 HTML 字符串。
 * @param index - 开始查找的位置。
 * @returns 下一个合法标签起始 `<` 的位置；找不到时返回 -1。
 * @throws 当前函数不主动抛错。
 * @remarks 只有 `<` 后跟 `/`、`!` 或字母数字时才认为它是标签开始，其他 `<` 当普通文本处理。
 */
const findTextEnd = (str: string, index: number) => {
  // 固定为 false，循环依赖内部 return 结束。
  const isEnd = false
  // 持续向后查找潜在标签开始。
  while (!isEnd) {
    // 查找下一个 `<`。
    const textEnd = str.indexOf('<', index)
    // 没有 `<` 时说明后续都是文本。
    if (textEnd === -1) {
      return textEnd
    }
    // 读取 `<` 后的字符。
    const char = str.charAt(textEnd + 1)
    // `<` 后接闭合、注释/doctype 或标签名字符时视为标签开始。
    if (char === '/' || char === '!' || /[A-Za-z0-9]/.test(char)) {
      return textEnd
    }
    // 否则该 `<` 属于文本内容，继续向后查找。
    index = textEnd + 1
  }
  // 理论兜底，当前循环正常情况下不会到达。
  return -1
}

/**
 * 从当前位置读取文本 token。
 *
 * @param state - lexer 运行状态。
 * @returns 无显式返回值；读取到文本时会追加 text token。
 * @throws 当前函数不主动抛错。
 * @remarks 如果当前位置就是标签开始，则不移动位置也不追加 token。
 */
const lexText = (state: State) => {
  // 完整 HTML 字符串。
  const { str } = state
  // 查找文本结束位置。
  let textEnd = findTextEnd(str, state.position)
  // 当前位置已经是标签开始时不处理文本。
  if (textEnd === state.position) return
  // 没找到后续标签时，文本一直延伸到字符串末尾。
  if (textEnd === -1) {
    textEnd = str.length
  }

  // 截取文本内容。
  const content = str.slice(state.position, textEnd)
  // 移动扫描位置到文本结束处。
  jumpPosition(state, textEnd)

  // 追加文本 token。
  state.tokens.push({
    type: 'text', 
    content, 
  })
}

/**
 * 从当前位置读取 HTML 注释 token。
 *
 * @param state - lexer 运行状态。
 * @returns 无显式返回值；会追加 comment token。
 * @throws 当前函数不主动抛错。
 * @remarks 调用前要求当前位置处于 `<!--` 的 `<` 位置；未闭合注释会一直读取到字符串末尾。
 */
const lexComment = (state: State) => {
  // 完整 HTML 字符串。
  const { str } = state

  // 跳过 `<!--`。
  movePositopn(state, 4)
  // 查找注释内容结束位置。
  let contentEnd = str.indexOf('-->', state.position)
  // 注释整体结束位置。
  let commentEnd = contentEnd + 3
  // 没找到结束标记时，按整个剩余字符串作为注释内容。
  if (contentEnd === -1) {
    contentEnd = commentEnd = str.length
  }

  // 截取注释内容。
  const content = str.slice(state.position, contentEnd)
  // 跳转到注释结束位置。
  jumpPosition(state, commentEnd)

  // 追加注释 token。
  state.tokens.push({
    type: 'comment',
    content,
  })
}

/**
 * 从当前位置读取标签名 token。
 *
 * @param state - lexer 运行状态。
 * @returns 读取到的标签名。
 * @throws 当前函数不主动抛错。
 * @remarks 会跳过开头的空白、斜杠和 `>`，直到遇到实际标签名字符。
 */
const lexTagName = (state: State) => {
  // 完整 HTML 字符串。
  const { str } = state
  // 字符串长度。
  const len = str.length
  // 标签名起点候选。
  let start = state.position

  // 跳过标签名前的空白、斜杠和结束符。
  while (start < len) {
    // 当前字符。
    const char = str.charAt(start)
    // 标签名字符不能是空白、斜杠或 `>`。
    const isTagChar = !(/\s/.test(char) || char === '/' || char === '>')
    // 找到标签名首字符。
    if (isTagChar) break
    // 继续向后查找。
    start++
  }

  // 标签名结束位置候选。
  let end = start + 1
  // 持续读取标签名字符。
  while (end < len) {
    // 当前字符。
    const char = str.charAt(end)
    // 标签名字符不能是空白、斜杠或 `>`。
    const isTagChar = !(/\s/.test(char) || char === '/' || char === '>')
    // 遇到非标签名字符时结束。
    if (!isTagChar) break
    // 继续向后读取。
    end++
  }

  // 移动扫描位置到标签名结束。
  jumpPosition(state, end)
  // 截取标签名。
  const tagName = str.slice(start, end)
  // 追加 tag token。
  state.tokens.push({
    type: 'tag',
    content: tagName
  })
  // 返回标签名，便于 childless 标签处理。
  return tagName
}

/**
 * 从当前位置读取标签属性 token。
 *
 * @param state - lexer 运行状态。
 * @returns 无显式返回值；会向 state.tokens 追加 attribute token。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 属性扫描会保留引号内空白，避免把 `style="a: b"` 之类属性拆坏。
 * - 后半段会修复 `key = value` 被空白拆成多个 word 的情况。
 */
const lexTagAttributes = (state: State) => {
  // 完整 HTML 字符串和 token 列表。
  const { str, tokens } = state
  // 属性扫描游标。
  let cursor = state.position
  // 当前处于哪个引号内；null 表示不在引号内。
  let quote = null
  // 当前属性片段的起始位置。
  let wordBegin = cursor
  // 初步拆出的属性片段。
  const words = []
  // 字符串长度。
  const len = str.length
  // 扫描到标签结束或字符串结束。
  while (cursor < len) {
    // 当前字符。
    const char = str.charAt(cursor)
    // 在引号内时，只关心是否遇到匹配引号。
    if (quote) {
      // 当前字符是否结束引号。
      const isQuoteEnd = char === quote
      // 遇到匹配引号后离开引号状态。
      if (isQuoteEnd) quote = null
      // 引号内继续向后扫描。
      cursor++
      continue
    }

    // `/` 或 `>` 表示属性区域结束。
    const isTagEnd = char === '/' || char === '>'
    // 标签结束时保存当前属性片段并退出。
    if (isTagEnd) {
      // 当前片段非空时加入 words。
      if (cursor !== wordBegin) words.push(str.slice(wordBegin, cursor))
      break
    }

    // 空白表示属性片段分隔。
    const isWordEnd = /\s/.test(char)
    // 遇到空白时结束当前 word。
    if (isWordEnd) {
      // 当前片段非空时加入 words。
      if (cursor !== wordBegin) words.push(str.slice(wordBegin, cursor))
      // 下一个 word 从空白后开始。
      wordBegin = cursor + 1
      // 前进游标。
      cursor++
      continue
    }

    // 检测引号开始。
    const isQuoteStart = char === '\'' || char === '"'
    // 进入引号状态。
    if (isQuoteStart) {
      quote = char
      cursor++
      continue
    }

    // 普通字符继续扫描。
    cursor++
  }
  // 移动主扫描位置到属性扫描结束处。
  jumpPosition(state, cursor)

  // 属性 token 类型。
  const type = 'attribute'
  // 将属性片段合并为合理的 key/value 字符串。
  for (let i = 0; i < words.length; i++) {
    // 当前属性片段。
    const word = words[i]

    // 当前片段不含等号，可能是布尔属性，也可能是 `key = value` 的 key。
    const isNotPair = word.indexOf('=') === -1
    // 尝试合并被空白拆开的等号和值。
    if (isNotPair) {
      // 下一个片段。
      const secondWord = words[i + 1]
      // 下一个片段以等号开头时，说明当前 word 是 key。
      if (secondWord && startsWith(secondWord, '=')) {
        // 形如 `key =value`，直接拼接。
        if (secondWord.length > 1) {
          // 合并 key 和 =value。
          const newWord = word + secondWord
          // 输出属性 token。
          tokens.push({ type, content: newWord })
          // 跳过已消费的 secondWord。
          i += 1
          continue
        }
        // 形如 `key = value`，需要再取第三个片段。
        const thirdWord = words[i + 2]
        // 先跳过等号片段。
        i += 1
        // 存在 value 时合并成 key=value。
        if (thirdWord) {
          // 合并完整属性。
          const newWord = word + '=' + thirdWord
          // 输出属性 token。
          tokens.push({ type, content: newWord })
          // 跳过 value 片段。
          i += 1
          continue
        }
      }
    }
    // 当前片段以等号结尾，可能是 `key= value`。
    if (endsWith(word, '=')) {
      // 下一个片段。
      const secondWord = words[i + 1]
      // 下一个片段不含等号时可作为 value 合并。
      if (secondWord && secondWord.indexOf('=') === -1) {
        // 合并 key= 和 value。
        const newWord = word + secondWord
        // 输出属性 token。
        tokens.push({ type, content: newWord })
        // 跳过已消费的 value。
        i += 1
        continue
      }

      // 没有可合并 value 时去掉尾部等号，按布尔属性处理。
      const newWord = word.slice(0, -1)
      // 输出属性 token。
      tokens.push({ type, content: newWord })
      continue
    }

    // 普通属性片段直接输出。
    tokens.push({ type, content: word })
  }
}

/**
 * 跳过 style/script/template 等无子节点标签的内部内容。
 *
 * @param tagName - 当前已读取的开始标签名。
 * @param state - lexer 运行状态。
 * @returns 无显式返回值；会把内部内容作为 text token，并读取匹配结束标签。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 这些标签内部可能包含 `<` 字符，不能按普通 HTML 标签继续分词。
 * - 只有遇到同名结束标签时才停止跳过。
 */
const lexSkipTag = (tagName: string, state: State) => {
  // 完整 HTML 字符串和 token 列表。
  const { str, tokens } = state
  // 小写标签名用于匹配结束标签。
  const safeTagName = tagName.toLowerCase()
  // 字符串长度。
  const len = str.length
  // 搜索结束标签的游标。
  let index = state.position
  
  // 向后查找匹配的结束标签。
  while (index < len) {
    // 查找下一个结束标签起始。
    const nextTag = str.indexOf('</', index)
    // 没有结束标签时，把剩余内容按文本读取。
    if (nextTag === -1) {
      lexText(state)
      break
    }

    // 创建临时状态，用于尝试解析当前位置的结束标签。
    const tagState = {
      str,
      position: state.position,
      tokens: [],
    }
    // 临时状态跳到候选结束标签位置。
    jumpPosition(tagState, nextTag)
    // 读取候选标签。
    const name = lexTag(tagState)
    // 不是同名结束标签时继续向后找。
    if (safeTagName !== name.toLowerCase()) {
      index = tagState.position
      continue
    }

    // 同名结束标签前存在内部文本时，先输出文本 token。
    if (nextTag !== state.position) {
      // 内部文本开始位置。
      const textStart = state.position
      // 主状态跳到结束标签前。
      jumpPosition(state, nextTag)
      // 把内部内容作为纯文本 token。
      tokens.push({
        type: 'text',
        content: str.slice(textStart, nextTag),
      })
    }

    // 追加临时状态解析出的结束标签 token。
    tokens.push(...tagState.tokens)
    // 主状态跳过结束标签。
    jumpPosition(state, tagState.position)
    break
  }
}

/**
 * 从当前位置读取完整标签 token 序列。
 *
 * @param state - lexer 运行状态。
 * @returns 读取到的标签名。
 * @throws 当前函数不主动抛错。
 * @remarks 输出顺序为 tag-start、tag、attribute*、tag-end。
 */
const lexTag = (state: State) => {
  // 完整 HTML 字符串。
  const { str } = state
  // `<` 后第二个字符。
  const secondChar = str.charAt(state.position + 1)
  // 是否为结束标签。
  const tagStartClose = secondChar === '/'
  // 跳过 `<` 或 `</`。
  movePositopn(state, tagStartClose ? 2 : 1)
  // 追加标签开始 token。
  state.tokens.push({
    type: 'tag-start',
    close: tagStartClose,
  })

  // 读取标签名。
  const tagName = lexTagName(state)
  // 读取标签属性。
  lexTagAttributes(state)

  // 标签结束位置的第一个字符。
  const firstChar = str.charAt(state.position)
  // 是否为自闭合标签结束。
  const tagEndClose = firstChar === '/'
  // 跳过 `>` 或 `/>`。
  movePositopn(state, tagEndClose ? 2 : 1)
  // 追加标签结束 token。
  state.tokens.push({
    type: 'tag-end',
    close: tagEndClose,
  })
  // 返回标签名供调用方判断。
  return tagName
}

/**
 * 执行完整分词流程。
 *
 * @param state - lexer 运行状态。
 * @returns 无显式返回值；分词结果写入 state.tokens。
 * @throws 当前函数不主动抛错。
 * @remarks 每轮优先读取文本；如果当前位置无法读取文本，则按注释或标签处理。
 */
const lex = (state: State) => {
  // 完整 HTML 字符串。
  const str = state.str
  // 字符串长度。
  const len = str.length

  // 扫描到字符串末尾为止。
  while (state.position < len) {
    // 记录本轮开始位置，用于判断 lexText 是否消费了字符。
    const start = state.position
    // 优先读取普通文本。
    lexText(state)

    // 如果位置没有变化，说明当前位置是注释或标签。
    if (state.position === start) {
      // 判断是否为注释开始。
      const isComment = startsWith(str, '!--', start + 1)
      // 注释走注释分词。
      if (isComment) lexComment(state)
      // 普通标签分词。
      else {
        // 读取完整标签。
        const tagName = lexTag(state)
        // 标签名小写化用于规则匹配。
        const safeTag = tagName.toLowerCase()
        // style/script/template 这类标签内部按纯文本跳过。
        if (childlessTags.includes(safeTag)) lexSkipTag(tagName, state)
      }
    }
  }
}

/**
 * 将 HTML 字符串拆分为 token 列表。
 *
 * @param str - 待分词的 HTML 字符串。
 * @returns token 列表。
 * @throws 当前函数不主动抛错。
 * @remarks lexer 只负责线性分词，不构建节点树；节点树由 parser 处理。
 */
export const lexer = (str: string): Token[] => {
  // 初始化 lexer 状态。
  const state = {
    // 原始 HTML 字符串。
    str,
    // 从起始位置开始扫描。
    position: 0,
    // 输出 token 列表。
    tokens: [],
  }
  // 执行分词。
  lex(state)
  // 返回 token 列表。
  return state.tokens
}
