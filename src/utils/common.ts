import { padStart } from 'lodash'

/**
 * 将数字转换为字符串，并在左侧补零到指定长度。
 *
 * @param digit - 需要格式化的数字，例如页码、序号、时间片段等。
 * @param len - 目标字符串长度；当数字本身长度大于等于该值时，保持原数字字符串不截断。
 * @returns 左侧补零后的字符串。
 * @throws 当前函数本身不主动抛错；若 lodash `padStart` 在异常运行环境中失败，则异常会向上透传。
 * @remarks
 * - 负数会先转换为包含负号的字符串，补零结果可能形如 `0-1`，调用方需要自行规避不符合业务预期的输入。
 * - 小数会保留小数点和小数位，函数不会做取整处理。
 */
export const fillDigit = (digit: number, len: number) => {
  // 将数字与空字符串拼接，按原逻辑快速转换为字符串，保留小数点、负号等字符。
  // 使用 lodash `padStart` 从左侧补 `0`，直到字符串达到调用方指定长度。
  return padStart('' + digit, len, '0')
}

/**
 * 判断当前浏览器环境是否更接近桌面端设备。
 *
 * @returns 当 userAgent 未匹配常见移动端标识时返回 `true`，否则返回 `false`。
 * @throws 在没有 `navigator` 的非浏览器环境中调用会触发引用错误。
 * @remarks
 * - 该判断依赖 userAgent，不能百分百覆盖平板桌面模式、浏览器伪装或新设备标识。
 * - 该函数适合用于 UI 分支和交互体验选择，不适合作为安全或权限判断依据。
 */
export const isPC = () => {
  // 读取浏览器 userAgent，并匹配常见移动设备关键字。
  // `match()` 命中移动端标识时返回匹配结果，取反后表示“未命中移动端”，即按桌面端处理。
  return !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Mobile|BlackBerry|Symbian|Windows Phone)/i)
}

/**
 * 判断字符串是否为项目当前允许的 HTTP/HTTPS URL 格式。
 *
 * @param url - 待校验的 URL 字符串。
 * @returns 当字符串符合简单 HTTP/HTTPS URL 正则时返回 `true`，否则返回 `false`。
 * @throws 当前函数不主动抛错；非法字符串只会返回 `false`。
 * @remarks
 * - 该正则是轻量校验，不覆盖所有 RFC URL 语法，例如端口、哈希、用户名密码、IPv6 等复杂场景。
 * - 该函数只判断格式，不检查资源是否真实存在，也不发起网络请求。
 */
export const isValidURL = (url: string) => {
  // 使用项目既有正则限制协议必须为 http 或 https，并要求存在类似域名的主机部分。
  // `test()` 返回布尔值，适合表单校验或链接输入的快速判断。
  return /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i.test(url)
}

/**
 * 将 HTML 字符串解析为 DOM，并提取其中的纯文本内容。
 *
 * @param html - 待转换的 HTML 字符串，可以包含标签、实体字符和普通文本。
 * @returns DOM `body.textContent` 提取出的纯文本；当解析结果为空时返回空字符串。
 * @throws 在没有 `DOMParser` 的非浏览器环境中调用会触发引用错误。
 * @remarks
 * - DOMParser 会按浏览器规则容错解析不完整 HTML，因此返回结果可能与严格 XML 解析不同。
 * - 函数只提取文本，不保留换行布局、样式、图片替代文本或交互属性。
 * - 传入不可信 HTML 时，此处只解析不挂载到页面，通常不会执行脚本；但调用方仍应避免把原始 HTML 直接插入 DOM。
 */
export const htmlToText = (html: string) => {
  // 创建 DOMParser 并按 `text/html` 模式解析字符串，让浏览器负责处理标签闭合和实体解码。
  const doc = new DOMParser().parseFromString(html, 'text/html')
  // 优先返回 body 的文本内容；当 body 或文本为空时按原逻辑兜底为空字符串。
  return doc.body.textContent || ''
}

/**
 * 使用误差阈值比较两个浮点数是否近似相等。
 *
 * @param a - 第一个待比较数字。
 * @param b - 第二个待比较数字。
 * @param epsilon - 可接受的最大绝对误差，默认值为 `1e-10`。
 * @returns 当两个数字的绝对差小于 `epsilon` 时返回 `true`，否则返回 `false`。
 * @throws 当前函数不主动抛错；若传入 `NaN`，比较结果会按 JavaScript 数学规则返回 `false`。
 * @remarks
 * - 该函数使用绝对误差，适合画布坐标、缩放比例等中小数值比较。
 * - 对极大数或需要相对误差的场景，调用方应根据业务自行选择更合适的比较策略。
 */
export const isFloatEqual = (a: number, b: number, epsilon = 1e-10) => {
  // 计算两个数字的绝对差，避免比较方向影响结果。
  // 当差值小于阈值时认为两者在当前业务精度下等价。
  return Math.abs(a - b) < epsilon
}
