/**
 * 判断指定字体是否能被当前系统或浏览器字体环境实际渲染。
 *
 * @param font - 待检测的字体名称，例如 `Arial`、`Microsoft YaHei` 或自定义字体名。
 * @returns 当字体看起来可用时返回 `true`，否则返回 `false`。
 * @throws 在没有 `document` 或 canvas API 的非浏览器环境中调用可能触发运行时异常。
 * @remarks
 * - 检测原理是用目标字体和 Arial 后备字体分别绘制字符，再比较像素数据是否不同。
 * - 如果目标字体与 Arial 在测试字符上的像素表现完全一致，可能被误判为不可用。
 * - 该方法适合前端字体选择体验判断，不适合作为严格字体授权或文件存在性验证。
 */
export const isSystemFont = (font: string) => {
  // 非字符串输入无法作为 CSS font-family 使用，直接判定为不可用。
  if (typeof font !== 'string') return false
  // 使用 Arial 作为基准后备字体，因为它在多数桌面系统中稳定存在。
  const arial = 'Arial'
  // Arial 自身直接视为系统字体，避免后续像素比较与自身比较导致 false。
  if (font.toLowerCase() === arial.toLowerCase()) return true
  // 测试字符；选择简单字母可降低复杂字形和浏览器排版差异带来的噪声。
  const a = 'a'
  // 绘制字号，较大字号可以放大字体差异，提升像素比较的可区分度。
  const size = 100
  // canvas 宽度，保证测试字符有足够绘制空间。
  const width = 100
  // canvas 高度，保证测试字符有足够绘制空间。
  const height = 100

  // 创建离屏 canvas，用于绘制测试字符并读取像素数据。
  const canvas = document.createElement('canvas')
  // 获取 2D 绘图上下文；部分受限环境可能返回 null。
  const ctx = canvas.getContext('2d')
  // 无法获取上下文时无法检测字体，按不可用处理。
  if (!ctx) return false

  // 设置 canvas 绘制尺寸，避免默认 300x150 尺寸影响比较范围。
  canvas.width = width
  // 设置 canvas 绘制高度，与宽度一起形成固定采样区域。
  canvas.height = height
  // 文本水平居中，降低字体度量差异导致字符被裁切的概率。
  ctx.textAlign = 'center'
  // 填充颜色固定为黑色，使非透明像素更容易比较。
  ctx.fillStyle = 'black'
  // 文本垂直居中，保证不同字体绘制在同一采样区域附近。
  ctx.textBaseline = 'middle'

  /**
   * 获取指定字体绘制测试字符后的非透明像素数组。
   *
   * @param _font - 本次要测试的 CSS 字体名称。
   * @returns 过滤掉 0 值后的像素通道数组，用于后续字符串比较。
   * @throws 当 `getImageData()` 因 canvas 安全限制或环境异常失败时，异常会向上抛出。
   * @remarks
   * - 字体栈写作 `${_font}, Arial`，如果目标字体不可用，浏览器会回退到 Arial。
   * - 当前实现直接比较过滤后的像素通道序列，保持原逻辑简单直观。
   */
  const getDotArray = (_font: string) => {
    // 清空上一轮绘制内容，避免像素数据混入前一次字体结果。
    ctx.clearRect(0, 0, width, height)
    // 设置字体栈；目标字体不可用时会回退到 Arial。
    ctx.font = `${size}px ${_font}, ${arial}`
    // 在画布中心绘制测试字符，生成可比较的像素分布。
    ctx.fillText(a, width / 2, height / 2)
    // 读取整个画布的 RGBA 像素数据。
    const imageData = ctx.getImageData(0, 0, width, height).data
    // 转成普通数组并过滤透明背景中的 0 值，缩小比较范围。
    return [].slice.call(imageData).filter(item => item !== 0)
  }

  // 如果目标字体绘制结果与 Arial 后备字体不同，说明浏览器实际使用了目标字体。
  return getDotArray(arial).join('') !== getDotArray(font).join('')
}
