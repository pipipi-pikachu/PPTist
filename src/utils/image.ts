/**
 * 图片尺寸信息。
 *
 * @property width - 图片在浏览器布局中的原始显示宽度。
 * @property height - 图片在浏览器布局中的原始显示高度。
 * @remarks 当前实现使用 `clientWidth/clientHeight`，不是 `naturalWidth/naturalHeight`。
 */
interface ImageSize {
  width: number
  height: number
}

/**
 * 获取图片加载后的宽高。
 *
 * @param src - 图片地址，可以是远程 URL、Data URL 或 Blob URL。
 * @returns Promise；图片加载成功后 resolve `{ width, height }`。
 * @throws 当前函数不主动抛错；图片加载失败时 Promise 会保持未决，这是既有行为。
 * @remarks
 * - 函数会临时把图片插入 document.body，用浏览器布局计算尺寸。
 * - 当前读取的是 `clientWidth/clientHeight`，受 CSS、图片默认布局和浏览器解码行为影响。
 * - `onerror` 只清理事件处理器，不 reject、不 resolve；调用方需要注意失败图片可能导致等待。
 */
export const getImageSize = (src: string): Promise<ImageSize> => {
  // 创建 Promise，让调用方以异步方式等待图片加载完成。
  return new Promise(resolve => {
    // 创建临时 img 元素，用于触发浏览器图片加载和尺寸计算。
    const img = document.createElement('img')
    // 设置图片地址，浏览器会开始加载资源。
    img.src = src
    // 将图片设为透明，避免临时元素在页面上被用户看到。
    img.style.opacity = '0'
    // 插入 body 后才能可靠读取 clientWidth/clientHeight。
    document.body.appendChild(img)

    // 图片加载成功后读取尺寸并清理临时 DOM。
    img.onload = () => {
      // 读取布局宽度；注意不是 naturalWidth，因此可能受 CSS 或默认布局影响。
      const imgWidth = img.clientWidth
      // 读取布局高度；注意不是 naturalHeight，因此可能受 CSS 或默认布局影响。
      const imgHeight = img.clientHeight
    
      // 清理事件引用，避免临时元素被闭包长期持有。
      img.onload = null
      // 清理错误事件引用，保持成功和失败路径一致释放。
      img.onerror = null

      // 从页面移除临时图片元素，避免污染 DOM。
      document.body.removeChild(img)

      // 返回读取到的尺寸信息。
      resolve({ width: imgWidth, height: imgHeight })
    }

    // 图片加载失败时只做事件清理，保持项目既有不 resolve/reject 的行为。
    img.onerror = () => {
      // 清理成功回调引用，避免失败后仍保留闭包。
      img.onload = null
      // 清理失败回调引用，避免临时对象引用残留。
      img.onerror = null
    }
  })
}

/**
 * 将图片文件读取为 Data URL。
 *
 * @param file - 用户选择或拖拽得到的图片文件对象。
 * @returns Promise；读取完成后 resolve Data URL 字符串。
 * @throws 当前函数不主动抛错；FileReader 读取失败时 Promise 会保持未决，这是既有行为。
 * @remarks
 * - Data URL 适合直接用于 `<img src>`、canvas 绘制或序列化存储。
 * - 大图片转换为 Data URL 会显著增加字符串体积，调用方需要注意内存占用。
 * - 当前没有监听 `error` 或 `abort`，失败场景不会 reject。
 */
export const getImageDataURL = (file: File): Promise<string> => {
  // 创建 Promise 封装 FileReader 的异步读取过程。
  return new Promise(resolve => {
    // 创建浏览器文件读取器，用于把 File 转成 base64 Data URL。
    const reader = new FileReader()
    // 监听读取完成事件，此时 result 中保存 Data URL。
    reader.addEventListener('load', () => {
      // 将读取结果按字符串返回；readAsDataURL 成功时 result 应为 string。
      resolve(reader.result as string)
    })
    // 启动 Data URL 读取流程，浏览器会异步完成编码。
    reader.readAsDataURL(file)
  })
}

/**
 * 判断文本是否为可解析的 SVG 代码字符串。
 *
 * @param text - 待验证文本，可能来自剪贴板、文件内容或用户输入。
 * @returns 当文本包含 SVG 标签且能被 DOMParser 解析为 svg 根节点时返回 `true`。
 * @throws 当前函数捕获解析异常，不主动向上抛错。
 * @remarks
 * - 先用正则快速判断是否包含 `<svg>...</svg>`，再用 XML 解析降低误判概率。
 * - 该函数只判断结构，不校验 SVG 安全性；不要把不可信 SVG 直接插入 DOM。
 * - 自闭合或非常规 SVG 片段可能无法被当前正则识别。
 */
export const isSVGString = (text: string): boolean => {
  // 使用宽松正则检查文本中是否存在完整 SVG 开闭标签。
  const svgRegex = /<svg[\s\S]*?>[\s\S]*?<\/svg>/i
  // 不包含完整 SVG 标签时直接返回 false，避免不必要的 DOMParser 开销。
  if (!svgRegex.test(text)) return false

  // 使用 DOMParser 验证 SVG 是否能按 XML 语义解析。
  try {
    // 创建浏览器 DOMParser 实例，避免用正则处理复杂 XML 结构。
    const parser = new DOMParser()
    // 按 SVG/XML MIME 类型解析文本，语法错误时浏览器会生成 parsererror 文档。
    const doc = parser.parseFromString(text, 'image/svg+xml')
    // 根节点为 svg 时认为是有效 SVG 字符串。
    return doc.documentElement.nodeName === 'svg'
  } 
  // DOMParser 异常时按无效 SVG 处理，保证调用方得到稳定布尔值。
  catch {
    // 返回 false 表示无法确认文本是可用 SVG。
    return false
  }
}

/**
 * 将 SVG 代码字符串转换为浏览器 File 对象。
 *
 * @param svg - SVG XML 代码字符串。
 * @returns MIME 类型为 `image/svg+xml` 的 File 对象。
 * @throws 当 Blob 或 File 构造器在当前环境不可用时，会产生运行时异常。
 * @remarks
 * - 文件名使用当前时间戳，避免同一会话内简单重复。
 * - 该函数不校验 SVG 是否安全或有效，调用方可先通过 `isSVGString()` 做格式判断。
 */
export const svg2File = (svg: string): File => {
  // 使用 Blob 包装 SVG 文本，并声明正确 MIME 类型。
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  // 将 Blob 转换为 File，便于复用项目内图片上传、拖拽或文件处理逻辑。
  return new File([blob], `${Date.now()}.svg`, { type: 'image/svg+xml' })
}
