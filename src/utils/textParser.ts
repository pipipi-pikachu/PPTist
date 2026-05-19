/**
 * 将普通文本转换为带段落结构的 HTML 字符串。
 *
 * @param text - 待转换的普通文本，可能包含 `\n`、`\r` 或连续换行。
 * @returns 由多个 `<div>` 段落拼接而成的 HTML 字符串。
 * @throws 当前函数不主动抛错；字符串替换和拆分异常会按 JavaScript 原生规则表现。
 * @remarks
 * - 连续换行会先被统一替换为单个 `<br>`，因此多个空行不会生成多个空段落。
 * - 空段落会被跳过，返回结果中只包含非空文本段。
 * - 该函数不做 HTML 转义，若传入文本包含标签字符，后续作为 HTML 使用时会按标签解析。
 */
export const parseText2Paragraphs = (text: string) => {
  // 将任意连续的换行符组合替换成统一的 `<br>` 标记，便于后续按段拆分。
  const htmlText = text.replace(/[\n\r]+/g, '<br>')
  // 按 `<br>` 分割成段落数组；连续换行已被压缩，所以空段落会较少出现。
  const paragraphs = htmlText.split('<br>')
  // 累积最终 HTML 字符串，保持原函数返回简单字符串的行为。
  let string = ''
  // 逐段处理文本内容。
  for (const paragraph of paragraphs) {
    // 跳过空字符串段落，避免生成空的 div 影响富文本编辑器段落结构。
    if (paragraph) string += `<div>${paragraph}</div>`
  }
  // 返回拼接好的段落 HTML，供文本元素或粘贴逻辑使用。
  return string
}
