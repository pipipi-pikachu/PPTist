/**
 * 解析到的原始 HTML 属性。
 *
 * @remarks
 * - `key` 是属性名。
 * - `value` 为 null 表示布尔属性或没有显式赋值的属性。
 */
export interface ElementAttribute {
  /** 属性名。 */
  key: string
  /** 属性值；没有显式赋值时为 null。 */
  value: string | null
}

/**
 * parser 阶段生成的注释节点。
 */
export interface CommentElement {
  /** 节点类型。 */
  type: 'comment'
  /** 注释内容，不包含 `<!--` 和 `-->`。 */
  content: string
}

/**
 * parser 阶段生成的文本节点。
 */
export interface TextElement {
  /** 节点类型。 */
  type: 'text'
  /** 文本内容。 */
  content: string
}

/**
 * parser 阶段生成的普通元素节点。
 *
 * @remarks 此阶段 attributes 仍是字符串数组，后续会由 format 转为结构化属性。
 */
export interface NormalElement {
  /** 节点类型。 */
  type: 'element'
  /** 标签名。 */
  tagName: string
  /** 子节点。 */
  children: HTMLNode[]
  /** 原始属性字符串数组。 */
  attributes: string[]
}

/** parser 阶段的 HTML 节点联合类型。 */
export type HTMLNode = CommentElement | TextElement | NormalElement

/**
 * format 阶段生成的结构化元素 AST。
 */
export interface ElementAST {
  /** 节点类型。 */
  type: 'element'
  /** 小写化后的标签名。 */
  tagName: string
  /** 子 AST 节点。 */
  children: AST[]
  /** 结构化属性列表。 */
  attributes: ElementAttribute[]
}

/**
 * format 阶段生成的注释或文本 AST。
 */
export interface CommentOrTextAST {
  /** 节点类型。 */
  type: 'comment' | 'text'
  /** 文本或注释内容。 */
  content: string
}

/** 对外暴露的 HTML AST 联合类型。 */
export type AST = CommentOrTextAST | ElementAST

/**
 * 词法阶段的标签起始 token，例如 `<` 或 `</`。
 */
export interface TagStartToken {
  /** token 类型。 */
  type: 'tag-start'
  /** 是否为闭合标签起始，例如 `</`。 */
  close: boolean
}

/**
 * 词法阶段的标签结束 token，例如 `>` 或 `/>`。
 */
export interface TagEndToken {
  /** token 类型。 */
  type: 'tag-end'
  /** 是否为自闭合标签结束，例如 `/>`。 */
  close: boolean
}

/**
 * 词法阶段的标签名 token。
 */
export interface TagToken {
  /** token 类型。 */
  type: 'tag'
  /** 标签名内容。 */
  content: string
}

/**
 * 词法阶段的文本 token。
 */
export interface TextToken {
  /** token 类型。 */
  type: 'text'
  /** 文本内容。 */
  content: string
}

/**
 * 词法阶段的注释 token。
 */
export interface CommentToken {
  /** token 类型。 */
  type: 'comment'
  /** 注释内容。 */
  content: string
}

/**
 * 词法阶段的属性 token。
 */
export interface AttributeToken {
  /** token 类型。 */
  type: 'attribute'
  /** 原始属性字符串。 */
  content: string
}

/** lexer 输出的 token 联合类型。 */
export type Token = TagStartToken | TagEndToken | TagToken | TextToken | CommentToken | AttributeToken
