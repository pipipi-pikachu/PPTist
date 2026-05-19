import Clipboard from 'clipboard'
import { decrypt } from '@/utils/crypto'

/**
 * 复制文本到系统剪贴板。
 *
 * @param text - 需要写入剪贴板的文本内容。
 * @returns Promise；复制成功时 resolve clipboard.js 的成功事件对象，失败时 reject 错误事件对象。
 * @throws 当前函数不主动抛错；DOM API 或 clipboard.js 内部异常会通过 Promise reject 或运行时异常表现。
 * @remarks
 * - 该实现使用 clipboard.js 和临时按钮触发复制，兼容部分不支持 `navigator.clipboard.writeText` 的浏览器。
 * - 浏览器可能要求复制动作由用户手势触发，自动调用时可能失败。
 * - 临时按钮会在触发点击后立即从 DOM 移除，避免污染页面结构。
 */
export const copyText = (text: string) => {
  // 返回手动创建的 Promise，让调用方可以在复制成功或失败后执行提示逻辑。
  return new Promise((resolve, reject) => {
    // 创建临时按钮作为 clipboard.js 的触发元素；按钮不会展示给用户。
    const fakeElement = document.createElement('button')
    // 初始化 clipboard.js 实例，指定复制内容、操作类型和事件容器。
    const clipboard = new Clipboard(fakeElement, {
      // 返回需要复制的文本，闭包保证内容与本次调用参数一致。
      text: () => text,
      // 明确声明执行复制操作，而不是剪切操作。
      action: () => 'copy',
      // 将剪贴板操作限定在 document.body 容器内，符合 clipboard.js 的 DOM 事件要求。
      container: document.body,
    })
    // 监听复制成功事件，确保释放 clipboard.js 绑定的事件和 DOM 引用。
    clipboard.on('success', e => {
      // 销毁实例，避免临时事件监听器泄漏。
      clipboard.destroy()
      // 将成功事件对象返回给调用方，便于调用方读取复制结果或触发 UI 提示。
      resolve(e)
    })
    // 监听复制失败事件，通常由权限、浏览器限制或非用户手势触发导致。
    clipboard.on('error', e => {
      // 即使失败也要销毁实例，避免重复调用时堆积监听器。
      clipboard.destroy()
      // 将失败事件对象交给调用方处理。
      reject(e)
    })
    // 将临时按钮插入 DOM，clipboard.js 需要真实元素来绑定触发事件。
    document.body.appendChild(fakeElement)
    // 主动触发点击，让 clipboard.js 在该元素上执行复制流程。
    fakeElement.click()
    // 复制触发后立即移除临时按钮，保持页面 DOM 干净。
    document.body.removeChild(fakeElement)
  })
}

/**
 * 从系统剪贴板读取纯文本内容。
 *
 * @returns Promise；读取成功且内容非空时 resolve 文本，剪贴板为空或浏览器不支持时 reject 错误提示。
 * @throws 当前函数不主动抛错；`navigator.clipboard.readText()` 的权限异常会通过 Promise reject 表现。
 * @remarks
 * - 现代浏览器通常要求 HTTPS 环境、页面获得焦点以及用户授权才能读取剪贴板。
 * - 该函数只读取文本，不读取图片、HTML 或其他 MIME 类型。
 * - 当读取到空字符串时按业务语义视为失败。
 */
export const readClipboard = (): Promise<string> => {
  // 用 Promise 包装剪贴板读取流程，统一成功文本和失败提示的返回方式。
  return new Promise((resolve, reject) => {
    // 先判断浏览器是否暴露异步剪贴板读取 API，避免在不支持环境中直接调用报错。
    if (navigator.clipboard?.readText) {
      // 调用浏览器原生读取方法；权限失败时原 Promise 会 reject。
      navigator.clipboard.readText().then(text => {
        // 剪贴板为空时按业务需求 reject，提醒调用方无法粘贴有效文本。
        if (!text) reject('剪贴板为空或者不包含文本')
        // 返回读取到的文本；注意前面 reject 后仍会执行到这里，这是当前既有逻辑，补注释不改变行为。
        return resolve(text)
      })
    }
    // 浏览器不支持或禁止访问异步剪贴板 API 时，提示用户使用系统快捷键粘贴。
    else reject('浏览器不支持或禁止访问剪贴板，请使用快捷键 Ctrl + V')
  })
}

/**
 * 尝试解析项目自定义加密剪贴板字符串。
 *
 * @param text - 来自剪贴板的原始字符串，可能是项目内部加密数据，也可能是普通文本。
 * @returns 当解密并 JSON 解析成功时返回解析后的数据；失败时返回原始文本。
 * @throws 当前函数捕获了解密和 JSON 解析异常，不会主动向上抛错。
 * @remarks
 * - 项目内部复制幻灯片或元素时可能会写入加密 JSON，这里用于还原结构化数据。
 * - 普通文本、外部应用复制内容或损坏密文会走兜底分支，保持原始文本可继续处理。
 */
export const pasteCustomClipboardString = (text: string) => {
  // 使用宽松变量承接解析结果，因为剪贴板可能还原为任意 JSON 类型或普通字符串。
  let clipboardData
  // 尝试按“项目加密 JSON”格式解析剪贴板内容。
  try {
    // 先解密，再解析 JSON；任一步失败都会进入 catch 并按普通文本处理。
    clipboardData = JSON.parse(decrypt(text))
  }
  // 解密失败或 JSON 解析失败时，说明内容不是项目自定义剪贴板格式。
  catch {
    // 保留原始文本，方便后续按普通文本、Excel 文本或 HTML 表格继续解析。
    clipboardData = text
  }

  // 返回结构化数据或原始文本，由上层根据类型继续分发处理。
  return clipboardData
}

/**
 * 尝试将剪贴板文本解析为 Excel 或类 TSV 表格数据。
 *
 * @param text - 剪贴板中的纯文本内容，通常来自 Excel、WPS 或表格网页复制。
 * @returns 当文本符合多列、等列数的 TSV 结构时返回二维字符串数组，否则返回 `null`。
 * @throws 当前函数不主动抛错；字符串拆分和数组操作异常会按 JavaScript 原生规则表现。
 * @remarks
 * - Excel 复制多单元格通常使用 `\t` 分隔列、`\r\n` 分隔行。
 * - 单列文本会返回 `null`，避免把普通多行文本误判为表格。
 * - 若各行列数不一致，也会返回 `null`，避免生成畸形表格。
 */
export const pasteExcelClipboardString = (text: string): string[][] | null => {
  // 按 Windows/Excel 常见换行符切分行；当前逻辑不处理单独 `\n`，保持既有行为。
  const lines: string[] = text.split('\r\n')

  // Excel 复制区域末尾常带一个空行，这里移除尾部空行避免多生成一行。
  if (lines[lines.length - 1] === '') lines.pop()

  // 记录首行列数，用于判断后续行是否保持规整表格结构；-1 表示尚未初始化。
  let colCount = -1
  // 存储解析后的二维表格数据，外层是行，内层是列。
  const data: string[][] = []
  // 遍历每一行文本；使用 for-in 保持原有索引字符串行为，不改变逻辑。
  for (const index in lines) {
    // 按制表符拆分列，这是 Excel/WPS 复制多列时的通用文本格式。
    data[index] = lines[index].split('\t')

    // 只有一列时按普通文本处理，避免误判为表格。
    if (data[index].length === 1) return null
    // 第一行用于初始化标准列数。
    if (colCount === -1) colCount = data[index].length
    // 后续行列数必须与第一行一致，否则认为不是规整表格。
    else if (colCount !== data[index].length) return null
  }
  // 所有行都通过校验时，返回二维数组供表格元素创建逻辑使用。
  return data
}

/**
 * 尝试将剪贴板 HTML 字符串解析为 table 二维数据。
 *
 * @param text - 剪贴板中的 HTML 字符串，可能包含完整 HTML 文档或局部 table 片段。
 * @returns 解析出的二维字符串数组；没有 table 时返回空数组。
 * @throws 在没有 `DOMParser` 的非浏览器环境中调用会触发引用错误。
 * @remarks
 * - 该函数只读取 `td` 和 `th` 的纯文本，不保留样式、链接、图片或嵌套结构。
 * - 当前只展开 `colspan`，没有处理 `rowspan`，复杂合并单元格可能无法完整还原。
 * - 返回空数组代表没有发现 table，不代表解析失败。
 */
export const pasteHTMLTableClipboardString = (text: string): string[][] | null => {
  // 创建 DOMParser，用浏览器 HTML 解析能力处理不完整或带容错的 HTML 片段。
  const parser = new DOMParser()
  // 按 HTML 模式解析剪贴板字符串，避免手写正则处理标签嵌套。
  const doc = parser.parseFromString(text, 'text/html')
  // 查找第一个 table 元素；当前逻辑只处理第一个表格。
  const table = doc.querySelector('table')
  // 初始化二维数组，用于收集每一行的单元格文本。
  const data: string[][] = []

  // 没有 table 时返回空数组，供上层继续尝试其他粘贴解析路径。
  if (!table) return data

  // 获取表格内所有行元素，包括 thead、tbody、tfoot 中的 tr。
  const rows = table.querySelectorAll('tr')
  // 逐行解析表格内容。
  for (const row of rows) {
    // 当前行的单元格文本数组。
    const rowData = []
    // 同时读取普通单元格 td 和表头单元格 th。
    const cells = row.querySelectorAll('td, th')
    // 逐个解析当前行中的单元格。
    for (const cell of cells) {
      // 读取单元格纯文本并去除首尾空白；空单元格按空字符串处理。
      const text = cell.textContent ? cell.textContent.trim() : ''
      // 读取 colspan，非法或缺省时按 1 处理；parseInt 会保留既有宽松转换行为。
      const colspan = parseInt(cell.getAttribute('colspan') || '1', 10)
      // 按 colspan 横向复制文本，尽量还原合并列对表格宽度的影响。
      for (let i = 0; i < colspan; i++) {
        // 将当前单元格文本放入行数据；合并列会重复写入相同文本。
        rowData.push(text)
      }
    }
    // 将当前行解析结果加入二维表格数据。
    data.push(rowData)
  }

  // 返回 HTML 表格解析结果，供上层创建或填充 PPT 表格元素。
  return data
}
