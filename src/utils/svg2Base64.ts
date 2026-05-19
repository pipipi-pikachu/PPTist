// SVG 转 base64 图片，参考：https://github.com/scriptex/svg64

// base64 编码字符表，末尾 `=` 用作不足 3 字节时的填充字符。
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
// SVG Data URL 前缀，拼接编码结果后可直接用于图片 src。
const PREFIX = 'data:image/svg+xml;base64,'

/**
 * 将 JavaScript 字符串手动转换为 UTF-8 字节字符串。
 *
 * @param string - 待编码的原始字符串。
 * @returns UTF-8 字节序列对应的字符串表示。
 * @throws 当前函数不主动抛错；异常输入会按 JavaScript 字符串规则处理。
 * @remarks
 * - 浏览器原生 `btoa()` 只能可靠处理 Latin1 字符，因此这里先做 UTF-8 编码。
 * - 当前实现处理 BMP 范围内字符，复杂代理对字符保持历史逻辑，不额外重构。
 * - 换行符会先从 Windows 风格 `\r\n` 归一化为 `\n`。
 */
const utf8Encode = (string: string) => {
  // 统一换行符，避免不同平台换行导致 base64 输出不一致。
  string = string.replace(/\r\n/g, '\n')
  // 累积 UTF-8 字节字符串。
  let utftext = ''

  // 逐个读取 UTF-16 码元，并按 UTF-8 编码规则写入目标字符串。
  for (let n = 0; n < string.length; n++) {
    // 获取当前位置字符的 UTF-16 码元值。
    const c = string.charCodeAt(n)

    // 0xxxxxxx：ASCII 范围字符使用单字节表示。
    if (c < 128) {
      // 直接写入原始码元。
      utftext += String.fromCharCode(c)
    }
    // 110xxxxx 10xxxxxx：128 到 2047 的字符使用双字节表示。
    else if (c > 127 && c < 2048) {
      // 写入双字节 UTF-8 的高 5 位部分，并加上 110 前缀。
      utftext += String.fromCharCode((c >> 6) | 192)
      // 写入低 6 位部分，并加上 10 前缀。
      utftext += String.fromCharCode((c & 63) | 128)
    }
    // 1110xxxx 10xxxxxx 10xxxxxx：其余 BMP 字符使用三字节表示。
    else {
      // 写入三字节 UTF-8 的高 4 位部分，并加上 1110 前缀。
      utftext += String.fromCharCode((c >> 12) | 224)
      // 写入中间 6 位部分，并加上 10 前缀。
      utftext += String.fromCharCode(((c >> 6) & 63) | 128)
      // 写入低 6 位部分，并加上 10 前缀。
      utftext += String.fromCharCode((c & 63) | 128)
    }
  }

  // 返回手动构造的 UTF-8 字节字符串，供 base64 编码函数消费。
  return utftext
}

/**
 * 将字符串编码为 base64。
 *
 * @param input - 待编码字符串；函数内部会先转换为 UTF-8 字节字符串。
 * @returns base64 编码结果，不包含 Data URL 前缀。
 * @throws 当前函数不主动抛错；异常输入会按 JavaScript 字符串规则处理。
 * @remarks
 * - 每 3 个字节会被拆分为 4 个 6bit 索引，对应 base64 字符表。
 * - 输入长度不足 3 的尾部会使用 `=` 填充。
 * - 保留手写实现可以避免 `btoa()` 对非 Latin1 字符的限制。
 */
const encode = (input: string) => {
  // 累积 base64 输出字符串。
  let output = ''
  // chr1/2/3 保存每组三个字节，enc1/2/3/4 保存拆分后的四个 base64 索引。
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4
  // 当前读取位置索引。
  let i = 0
  // 先转换为 UTF-8 字节字符串，保证中文等非 ASCII 内容可以正确编码。
  input = utf8Encode(input)
  // 按每 3 字节一组循环处理输入。
  while (i < input.length) {
    // 读取第 1 个字节并推进索引。
    chr1 = input.charCodeAt(i++)
    // 读取第 2 个字节；尾部不足时会得到 NaN。
    chr2 = input.charCodeAt(i++)
    // 读取第 3 个字节；尾部不足时会得到 NaN。
    chr3 = input.charCodeAt(i++)
    // 第 1 个 base64 索引取第 1 字节高 6 位。
    enc1 = chr1 >> 2
    // 第 2 个索引由第 1 字节低 2 位和第 2 字节高 4 位组成。
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    // 第 3 个索引由第 2 字节低 4 位和第 3 字节高 2 位组成。
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    // 第 4 个索引取第 3 字节低 6 位。
    enc4 = chr3 & 63
    // 如果缺少第 2 字节，则第 3、4 位都应使用 `=` 填充。
    if (isNaN(chr2)) enc3 = enc4 = 64
    // 如果只缺少第 3 字节，则第 4 位使用 `=` 填充。
    else if (isNaN(chr3)) enc4 = 64
    // 根据索引查表拼接 4 个 base64 字符。
    output = output + characters.charAt(enc1) + characters.charAt(enc2) + characters.charAt(enc3) + characters.charAt(enc4)
  }
  // 返回纯 base64 字符串。
  return output
}

/**
 * 将 SVG DOM 元素序列化为 base64 Data URL。
 *
 * @param element - 待转换的 SVG 元素或包含 SVG 内容的 DOM 元素。
 * @returns 形如 `data:image/svg+xml;base64,...` 的图片 Data URL。
 * @throws 当 XMLSerializer 不可用或元素无法序列化时，异常会向上抛出。
 * @remarks
 * - 该函数序列化的是当前 DOM 状态，动态属性和内联内容会被写入结果。
 * - 外部 CSS、外链图片或字体不一定会被完整内联，调用方需要根据使用场景确认可用性。
 */
export const svg2Base64 = (element: Element) => {
  // 创建 XMLSerializer，用标准 DOM API 将元素转换为 XML 字符串。
  const XMLS = new XMLSerializer()
  // 序列化传入元素；若传入的是 svg 元素，则得到完整 SVG XML。
  const svg = XMLS.serializeToString(element)

  // 拼接 SVG Data URL 前缀和 base64 编码结果，供 img/canvas 等直接使用。
  return PREFIX + encode(svg)
}
