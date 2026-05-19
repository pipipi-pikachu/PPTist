/**
 * 打印页面尺寸配置。
 *
 * @property width - 打印内容宽度，单位为像素。
 * @property height - 打印内容高度，单位为像素。
 * @property margin - 打印页边距，单位为像素。
 * @remarks 实际打印尺寸还会受到浏览器打印设置、系统缩放和打印机驱动影响。
 */
interface PageSize {
  width: number
  height: number
  margin: number
}

/**
 * 创建隐藏 iframe，作为隔离打印文档的容器。
 *
 * @returns 已插入 document.body 的 iframe 元素。
 * @throws 在没有 document 或 body 的非浏览器环境中调用会触发运行时异常。
 * @remarks
 * - iframe 用于把待打印内容和当前应用页面隔离开，避免直接打印整个编辑器 UI。
 * - 元素尺寸设为 0 并定位到页面角落，尽量不影响当前页面布局。
 */
const createIframe = () => {
  // 创建 iframe 元素，后续会向其 document 写入专用打印 HTML。
  const iframe = document.createElement('iframe')
  // 宽度设为 0，避免 iframe 占用可见空间。
  iframe.style.width = '0'
  // 高度设为 0，避免 iframe 影响页面滚动高度。
  iframe.style.height = '0'
  // 绝对定位，让 iframe 脱离普通文档流。
  iframe.style.position = 'absolute'
  // 靠右放置，减少与页面主要内容重叠的机会。
  iframe.style.right = '0'
  // 靠顶部放置，保持定位规则明确。
  iframe.style.top = '0'
  // 去掉边框，避免部分浏览器仍渲染 iframe 边线。
  iframe.style.border = '0'

  // 将 iframe 插入页面，只有挂载后 contentDocument/contentWindow 才能稳定使用。
  document.body.appendChild(iframe)

  // 返回创建好的 iframe，供打印流程继续写入内容。
  return iframe
}

/**
 * 向打印 iframe 的文档写入完整 HTML 内容和打印样式。
 *
 * @param doc - iframe 的 document 对象。
 * @param printNode - 需要打印的源 DOM 节点，函数会复制其 innerHTML。
 * @param size - 打印页面尺寸和边距配置。
 * @returns 无显式返回值。
 * @throws 读取跨域样式表 cssRules 时可能触发安全异常；`doc.write()` 失败也会向上抛错。
 * @remarks
 * - 该函数复制当前页面可访问样式表中的 CSS 规则，尽量保证打印内容样式一致。
 * - 仅复制 `innerHTML`，不会复制源节点上的事件监听、Vue 实例状态或外层节点属性。
 * - `@page` 高度乘以 1.005 是既有微调，用于缓解部分浏览器打印分页误差。
 */
const writeContent = (doc: Document, printNode: HTMLElement, size: PageSize) => {
  // 写入标准 HTML5 doctype，避免 iframe 进入怪异模式影响布局。
  const docType = '<!DOCTYPE html>'

  // 累积当前页面样式，后续注入 iframe 头部。
  let style = ''
  // 获取当前文档样式表集合；可能包含内联样式、同源 CSS 和跨域 CSS。
  const styleSheets = document.styleSheets
  // 存在样式表时逐个读取规则。
  if (styleSheets) {
    // 遍历 StyleSheetList 中的每个样式表。
    for (const styleSheet of styleSheets) {
      // 无法读取规则时跳过；注意跨域样式表访问 cssRules 可能在读取时抛异常。
      if (!styleSheet.cssRules) continue

      // 将样式表中的每条 CSS 规则转成文本并拼接。
      for (const rule of styleSheet.cssRules) {
        // cssText 是浏览器序列化后的规则文本，可直接写入 style 标签。
        style += rule.cssText
      }
    }
  }

  // 解构打印尺寸配置，便于写入 @page 样式。
  const { width, height, margin } = size
  // 构造 iframe 文档 head，包含复制来的页面样式和打印专用页面尺寸。
  const head = `
    <head>
      <style type="text/css">
        ${style} 
        html, body {
          height: auto;
          overflow: auto;
        }
        @media print {
          @page {
            size: ${width + 2 * margin}px ${(height + 2 * margin) * 1.005}px;
            margin: ${margin}px;
          }
        }
      </style>
    </head>
  `
  // 构造 iframe 文档 body，只复制待打印节点的内部结构。
  const body = '<body>' + printNode.innerHTML + '</body>'

  // 打开 iframe 文档写入流，准备覆盖当前内容。
  doc.open()
  // 写入完整 HTML 文档，包括 doctype、head 和 body。
  doc.write(`
    ${docType}
    <html>
      ${head}
      ${body}
    </html>
  `)
  // 关闭写入流，让浏览器开始解析和加载 iframe 内容。
  doc.close()
}

/**
 * 打印指定 DOM 节点内容。
 *
 * @param printNode - 需要打印的 DOM 节点。
 * @param size - 打印页面尺寸配置。
 * @returns 无显式返回值。
 * @throws iframe 创建、文档写入、浏览器打印 API 调用异常会向上抛出。
 * @remarks
 * - 函数会创建隐藏 iframe，把节点内容和样式写入后调用 iframe 的 `print()`。
 * - 打印结束后监听 `afterprint` 清理 iframe，避免临时 DOM 残留。
 * - 如果浏览器未能提供 iframe 文档或窗口，函数会静默返回。
 */
export const print = (printNode: HTMLElement, size: PageSize) => {
  // 创建用于打印的隐藏 iframe。
  const iframe = createIframe()
  // 读取 iframe 的窗口对象，用于 focus、print 和 afterprint 监听。
  const iframeContentWindow = iframe.contentWindow

  // iframe 文档或窗口不可用时无法打印，按既有逻辑直接退出。
  if (!iframe.contentDocument || !iframeContentWindow) return
  // 将待打印内容和样式写入 iframe 文档。
  writeContent(iframe.contentDocument, printNode, size)

  // iframe 加载完成后触发浏览器打印。
  const handleLoadIframe = () => {
    // 让 iframe 获得焦点，部分浏览器要求当前窗口聚焦后才能可靠打印。
    iframeContentWindow.focus()
    // 调用浏览器打印对话框或系统打印流程。
    iframeContentWindow.print()
  }

  // 打印结束后清理事件监听和临时 iframe。
  const handleAfterprint = () => {
    // 移除 iframe load 监听，避免后续重复触发。
    iframe.removeEventListener('load', handleLoadIframe)
    // 移除 afterprint 监听，释放闭包引用。
    iframeContentWindow.removeEventListener('afterprint', handleAfterprint)
    // 从页面移除临时 iframe，恢复 DOM 干净状态。
    document.body.removeChild(iframe)
  }

  // 等待 iframe 加载完成后再打印，确保写入的 HTML 和样式已被浏览器解析。
  iframe.addEventListener('load', handleLoadIframe)
  // 监听打印完成事件，用于清理临时资源。
  iframeContentWindow.addEventListener('afterprint', handleAfterprint)
}
