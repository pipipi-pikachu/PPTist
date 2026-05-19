import { storeToRefs } from 'pinia'
import { useKeyboardStore } from '@/store'
import { pasteCustomClipboardString } from '@/utils/clipboard'
import { parseText2Paragraphs } from '@/utils/textParser'
import { getImageDataURL, isSVGString, svg2File } from '@/utils/image'
import { isValidURL } from '@/utils/common'
import useCreateElement from '@/hooks/useCreateElement'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'

/**
 * 文本剪贴板解析选项。
 *
 * @property onlySlide - 是否只允许处理页面数据。
 * @property onlyElements - 是否只允许处理元素数据。
 * @remarks 两个选项通常用于限定特定粘贴入口的行为，避免文本或错误类型被误处理。
 */
interface PasteTextClipboardDataOptions {
  onlySlide?: boolean
  onlyElements?: boolean
}

/**
 * 判断文本是否为当前项目允许直接插入的图片 URL。
 *
 * @param url - 待判断的 URL 文本。
 * @returns 当 URL 属于白名单图片域名并带有允许的图片扩展名时返回 `true`。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 这里刻意只允许 pexels.com 和 pptist.cn 图片地址，避免把任意外链图片直接插入画布。
 * - 调整白名单时必须确认来源合法、可靠、可控且无访问限制。
 * 
 * ！！！注意，你需要判断允许哪些来源的图片地址被匹配，然后自行编写正则表达式
 * ！！！必须确保图片来源都是合法、可靠、可控、无访问限制的
 */
const isValidImgURL = (url: string) => {
  // 匹配 pexels 域名及其子域下的常见图片资源。
  const pexels = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*pexels\.com\/[^\s]+\.(?:jpg|jpeg|png|svg|webp)(?:\?.*)?$/i.test(url)
  // 匹配 pptist.cn 域名及其子域下的常见图片资源。
  const pptist = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*pptist\.cn\/[^\s]+\.(?:jpg|jpeg|png|svg|webp)(?:\?.*)?$/i.test(url)
  // 只要命中任一白名单来源，就认为可作为图片插入。
  return pexels || pptist
}

/**
 * 提供剪贴板文本内容解析与粘贴分发能力。
 *
 * @returns 包含 `pasteTextClipboardData` 的方法对象。
 * @throws 当前 composable 不主动抛错；图片读取、元素创建或页面添加异常会按对应函数行为表现。
 * @remarks
 * - 会优先尝试解析项目内部加密剪贴板数据。
 * - 项目数据可能是元素或页面，普通文本会进一步尝试识别图片 URL、普通 URL、SVG 字符串。
 * - 按住 Shift 时会强制把文本作为普通文本粘贴，不做 URL/SVG 特殊识别。
 */
export default () => {
  // 读取 Shift 键状态，用于决定是否强制按普通文本粘贴。
  const { shiftKeyState } = storeToRefs(useKeyboardStore())

  // 获取创建文本和图片元素的方法。
  const { createTextElement, createImageElement } = useCreateElement()
  // 获取从外部数据添加元素或页面的方法。
  const { addElementsFromData, addSlidesFromData } = useAddSlidesOrElements()

  /**
   * 粘贴普通文本：创建为新的文本元素。
   *
   * @param text - 已经转换好的文本 HTML 内容。
   * @returns 无显式返回值。
   * @throws 创建文本元素异常会按 `createTextElement()` 的行为表现。
   * @remarks 默认创建一个位于画布左上角、宽 600 高 50 的文本框。
   */
  const createTextElementFromClipboard = (text: string) => {
    // 创建默认尺寸文本元素，用于承载剪贴板文本内容。
    createTextElement({
      left: 0,
      top: 0,
      width: 600,
      height: 50,
    }, { content: text })
  }

  /**
   * 解析剪贴板文本内容，并根据解析结果选择合适的粘贴方式。
   *
   * @param text - 剪贴板纯文本内容。
   * @param options - 粘贴限制选项；`onlySlide` 仅处理页面，`onlyElements` 仅处理元素。
   * @returns 无显式返回值。
   * @throws 解析或创建过程中异常会按下游函数行为表现。
   * @remarks
   * - 项目内部复制的元素/页面会被加密成 JSON 字符串，这里会先尝试解密还原。
   * - 普通文本在非限制模式下才会创建文本、图片或链接元素。
   * - SVG 字符串会先转 File，再转 Data URL，最后以图片元素插入。
   */
  const pasteTextClipboardData = (text: string, options?: PasteTextClipboardDataOptions) => {
    // 是否限制只处理页面粘贴。
    const onlySlide = options?.onlySlide || false
    // 是否限制只处理元素粘贴。
    const onlyElements = options?.onlyElements || false

    // 尝试把剪贴板文本解析为项目自定义加密数据；失败时返回原始文本。
    const clipboardData = pasteCustomClipboardString(text)

    // 元素或页面
    if (typeof clipboardData === 'object') {
      // 读取项目内部剪贴板数据类型和数据本体。
      const { type, data } = clipboardData

      // 元素数据且未被 onlySlide 限制时，按元素列表添加到当前页。
      if (type === 'elements' && !onlySlide) addElementsFromData(data)
      // 页面数据且未被 onlyElements 限制时，按页面列表添加到演示文稿。
      else if (type === 'slides' && !onlyElements) addSlidesFromData(data)
    }

    // 普通文本
    else if (!onlyElements && !onlySlide) {
      // 普通文字
      if (shiftKeyState.value) {
        // 按住 Shift 时强制按普通文本处理，不识别链接或 SVG。
        const string = parseText2Paragraphs(clipboardData)
        // 创建文本元素承载转换后的段落 HTML。
        createTextElementFromClipboard(string)
      }
      else {
        // 尝试检查是否为图片地址链接
        if (isValidImgURL(clipboardData)) {
          // 白名单图片 URL 直接作为图片元素插入。
          createImageElement(clipboardData)
        }
        // 尝试检查是否为超链接
        else if (isValidURL(clipboardData)) {
          // 普通 URL 创建为带链接的文本元素。
          createTextElementFromClipboard(`<a href="${clipboardData}" title="${clipboardData}" target="_blank">${clipboardData}</a>`)
        }
        // 尝试检查是否为SVG代码
        else if (isSVGString(clipboardData)) {
          // SVG 字符串先包装成 File，复用图片 Data URL 读取流程。
          const file = svg2File(clipboardData)
          // 读取 SVG 文件 Data URL 后创建图片元素。
          getImageDataURL(file).then(dataURL => createImageElement(dataURL))
        }
        // 普通文字
        else {
          // 将普通文本按换行转换为段落 HTML。
          const string = parseText2Paragraphs(clipboardData)
          // 创建文本元素承载普通文本。
          createTextElementFromClipboard(string)
        }
      }
    }
  }

  // 返回文本粘贴解析入口。
  return {
    pasteTextClipboardData,
  }
}
