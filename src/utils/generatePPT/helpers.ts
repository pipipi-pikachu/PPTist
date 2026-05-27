import { DEFAULT_PPT_TITLE } from './constants'

/**
 * 判断当前值是否为非空普通字符串。
 *
 * @param value - 需要判断的任意输入值。
 * @returns 输入值是去除首尾空白后仍有内容的字符串时返回 true。
 */
export const isNonEmptyString = (value: unknown): value is string => {
  /**
   * valueType 用于保存 typeof 的判断结果。
   *
   * 这样写的原因：
   * - typeof value 会被多次使用时，局部常量能让判断语义更清楚。
   * - 对 null、数组、对象等非字符串值全部返回 false，避免后续 trim() 调用抛错。
   */
  const valueType = typeof value

  /**
   * 字符串判断分支：
   * - 必须先确认是 string，再调用 trim()。
   * - 空白字符串在业务上等价于缺失值，因此也返回 false。
   */
  if (valueType === 'string') return value.trim().length > 0

  /**
   * 非字符串兜底分支：
   * - number / boolean / object 都不视为有效文本。
   * - 这里不做 String(value) 强转，避免把 undefined 变成可见的 "undefined" 文本。
   */
  return false
}

/**
 * 把任意文本转成适合展示的纯文本。
 *
 * @param value - 可能来自 AI、父项目或后端的任意字段值。
 * @param fallback - 文本为空时使用的兜底值。
 * @returns 清理后的文本。
 */
export const toDisplayText = (value: unknown, fallback = ''): string => {
  /**
   * rawText 保存原始值的字符串表达。
   *
   * 边界说明：
   * - null / undefined 使用兜底值，避免页面出现 "null" 或 "undefined"。
   * - 数字等可读值允许转换为字符串，方便 AI 输出序号或年份。
   */
  const rawText = value === null || value === undefined ? fallback : String(value)

  /**
   * normalizedText 用于压缩多余空白。
   *
   * 设计说明：
   * - AI 可能输出换行、制表符或多段空格。
   * - PPT 文本框空间有限，压缩空白可以降低溢出概率。
   */
  const normalizedText = rawText.replace(/\s+/g, ' ').trim()

  /**
   * 空文本兜底分支：
   * - 如果原始值和清理后值都为空，返回 fallback。
   * - fallback 也可能是空字符串，表示调用方允许该位置不展示内容。
   */
  return normalizedText || fallback
}

/**
 * 保证文件名拥有 .pptx 后缀。
 *
 * @param title - 父项目传入的标题或文件名。
 * @returns 带 .pptx 后缀的文件名。
 */
export const normalizePptxFileName = (title: unknown): string => {
  /**
   * baseName 是去掉首尾空白后的文件基础名。
   *
   * 容错说明：
   * - title 不是非空字符串时使用默认标题。
   * - 这里暂不删除所有特殊字符，只替换 Windows / URL 常见危险字符，尽量保留用户原文。
   */
  const baseName = isNonEmptyString(title) ? title.trim() : DEFAULT_PPT_TITLE

  /**
   * safeName 用于避免文件名中出现明显不适合上传或下载保存的字符。
   *
   * 潜在坑点：
   * - Windows 不允许 \ / : * ? " < > | 出现在文件名中。
   * - 替换为空格后再 trim，避免中文标题之间被无意义下划线污染。
   */
  const safeName = baseName.replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim() || DEFAULT_PPT_TITLE

  /**
   * 后缀判断分支：
   * - 使用不区分大小写的正则，兼容用户传入 .PPTX。
   * - 已有后缀时原样返回，避免生成 "xxx.pptx.pptx"。
   */
  if (/\.pptx$/i.test(safeName)) return safeName

  /**
   * 默认补齐分支：
   * - 只有没有 .pptx 后缀时才追加。
   * - 返回值会直接作为 File.name 和后端上传文件名。
   */
  return `${safeName}.pptx`
}

/**
 * 把颜色值转换为 pptxgenjs 常用的六位十六进制颜色。
 *
 * @param value - 可能带 #、可能为空的颜色值。
 * @param fallback - 无效颜色时使用的兜底颜色。
 * @returns 不带 # 的六位十六进制颜色。
 */
export const normalizeHexColor = (value: unknown, fallback: string): string => {
  /**
   * rawColor 保存颜色的字符串形式。
   *
   * 边界说明：
   * - 非字符串颜色直接走 fallback。
   * - 支持 #RRGGBB 和 RRGGBB 两种常见写法。
   */
  const rawColor = isNonEmptyString(value) ? value.trim().replace(/^#/, '') : ''

  /**
   * 六位色值分支：
   * - pptxgenjs 接收不带 # 的 RGB 十六进制。
   * - 这里统一转成大写，便于日志和调试比对。
   */
  if (/^[0-9a-fA-F]{6}$/.test(rawColor)) return rawColor.toUpperCase()

  /**
   * 三位缩写色值分支：
   * - CSS 允许 #ABC 缩写，但 pptxgenjs 更适合使用 AABBCC。
   * - 每位重复一次即可展开为六位颜色。
   */
  if (/^[0-9a-fA-F]{3}$/.test(rawColor)) {
    return rawColor
      .split('')
      .map(char => `${char}${char}`)
      .join('')
      .toUpperCase()
  }

  /**
   * 无效颜色兜底分支：
   * - fallback 由调用方传入，必须是模块内可信默认值。
   * - 即使父项目传入 rgba() / 颜色名，也不会把不可识别值交给 pptxgenjs。
   */
  return fallback.replace(/^#/, '').toUpperCase()
}

/**
 * 从图片池条目中提取可给 pptxgenjs 使用的图片地址。
 *
 * @param item - 图片池单个条目。
 * @returns 第一个可用图片地址；没有时返回空字符串。
 */
export const getImageSource = (item: unknown): string => {
  /**
   * 对象类型保护：
   * - 图片池来自父项目，字段形态不可完全信任。
   * - 只有非 null 对象才尝试读取候选字段。
   */
  if (!item || typeof item !== 'object') return ''

  /**
   * imageRecord 保存宽松对象视图。
   *
   * 说明：
   * - 当前函数只读字段，不修改对象。
   * - 使用 Record 避免在本目录外引入额外业务类型。
   */
  const imageRecord = item as Record<string, unknown>

  /**
   * candidateKeys 是按兼容优先级排列的字段名。
   *
   * 设计说明：
   * - src 是前端图片最常见字段，优先读取。
   * - url / fileUrl / path 兼容上传接口或父项目文件对象。
   */
  const candidateKeys = ['src', 'url', 'fileUrl', 'path']

  /**
   * 遍历候选字段，取第一个非空字符串。
   *
   * 边界说明：
   * - 遇到空字符串继续尝试下一个字段。
   * - 不校验 URL 可达性，避免生成阶段阻塞；pptxgenjs 处理失败时整页仍有文字内容。
   */
  for (const key of candidateKeys) {
    const value = imageRecord[key]
    if (isNonEmptyString(value)) return value.trim()
  }

  /**
   * 没有可用图片地址时返回空字符串。
   *
   * 调用方会据此跳过图片绘制，避免把 undefined 传给 pptxgenjs。
   */
  return ''
}
