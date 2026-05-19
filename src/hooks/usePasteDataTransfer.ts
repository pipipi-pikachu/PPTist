import { MIME_MAP } from '@/configs/mime'
import { getImageDataURL } from '@/utils/image'
import useCreateElement from './useCreateElement'
import useImport from './useImport'

/**
 * 提供 DataTransfer 文件内容解析与粘贴分发能力。
 *
 * @returns 包含 `pasteDataTransfer` 的方法对象。
 * @throws 当前 composable 不主动抛错；文件读取、对象 URL 创建、导入或元素创建异常会按对应函数行为表现。
 * @remarks
 * - 优先处理图片、视频、音频等媒体文件。
 * - 如果第一个文件是 PPTX 或 PPTist 专用文件，则进入导入流程。
 * - 返回值会告诉调用方本次是否已经处理了文件，以及第一个 DataTransferItem 供文本粘贴继续判断。
 */
export default () => {
  // 获取媒体元素创建方法。
  const { createImageElement, createVideoElement, createAudioElement } = useCreateElement()
  // 获取专用文件和 PPTX 文件导入方法。
  const { importSpecificFile, importPPTXFile } = useImport()

  /**
   * 解析粘贴事件中的 DataTransfer 数据。
   *
   * @param dataTransfer - 浏览器 ClipboardEvent 或拖拽事件中的 DataTransfer 对象。
   * @returns `isFile` 表示是否已经按文件处理，`dataTransferFirstItem` 是第一个数据项。
   * @throws 文件读取、URL 创建或导入流程异常会按下游函数行为表现。
   * @remarks
   * - DataTransfer 中可能同时包含文件和文本，文件优先级更高。
   * - 图片文件会转成 Data URL 插入；音视频使用 Blob URL 插入。
   * - 未识别的文件会继续尝试按扩展名判断是否为 `.pptist`。
   */
  const pasteDataTransfer = (dataTransfer: DataTransfer) => {
    // 获取剪贴板或拖拽数据项列表。
    const dataItems = dataTransfer.items
    // 缓存第一个数据项，供调用方在文件未处理时继续判断文本。
    const dataTransferFirstItem = dataItems[0]

    // 检查事件对象中是否存在有效文件，存在则插入对应数据，否则可继续检查是否存在文字
    // 标记本次是否已经按文件完成处理。
    let isFile = false

    // 遍历全部数据项，优先处理媒体文件。
    for (const item of dataItems) {
      // 只处理 kind 为 file 的数据项。
      if (item.kind === 'file') {
        // 图片文件直接读取为 Data URL 并创建图片元素。
        if (item.type.indexOf('image') !== -1) {
          // 从 DataTransferItem 中提取 File 对象。
          const imageFile = item.getAsFile()
          // File 存在时读取图片内容。
          if (imageFile) {
            // 图片读取完成后插入为图片元素。
            getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
            // 标记本次粘贴已处理文件。
            isFile = true
          }
        }
        // 视频文件使用 Blob URL 创建视频元素。
        else if (item.type.indexOf('video') !== -1) {
          // 从 DataTransferItem 中提取 File 对象。
          const videoFile = item.getAsFile()
          // File 存在时创建视频元素。
          if (videoFile) {
            // 为视频文件创建临时 Blob URL，供 video 标签播放。
            const videoURL = URL.createObjectURL(videoFile)
            // 根据 MIME 类型映射扩展名，未知类型兜底为空字符串。
            const ext = MIME_MAP[videoFile.type] || ''
            // 插入视频元素。
            createVideoElement(videoURL, ext)
            // 标记本次粘贴已处理文件。
            isFile = true
          }
        }
        // 音频文件使用 Blob URL 创建音频元素。
        else if (item.type.indexOf('audio') !== -1) {
          // 从 DataTransferItem 中提取 File 对象。
          const audioFile = item.getAsFile()
          // File 存在时创建音频元素。
          if (audioFile) {
            // 为音频文件创建临时 Blob URL，供 audio 标签播放。
            const audioURL = URL.createObjectURL(audioFile)
            // 根据 MIME 类型映射扩展名，未知类型兜底为空字符串。
            const ext = MIME_MAP[audioFile.type] || ''
            // 插入音频元素。
            createAudioElement(audioURL, ext)
            // 标记本次粘贴已处理文件。
            isFile = true
          }
        }
      }
    }

    // 若没有媒体文件被处理，但第一个数据项是文件，则尝试识别演示文稿文件。
    if (!isFile && dataTransferFirstItem && dataTransferFirstItem.kind === 'file') {
      // PPTX 文件按 Office Open XML MIME 类型识别并走 PPTX 导入流程。
      if (!isFile && dataTransferFirstItem.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        // 提取 PPTX 文件对象。
        const pptxFile = dataTransferFirstItem.getAsFile()
        // File 存在时导入 PPTX。
        if (pptxFile) {
          // importPPTXFile 接收 FileList 或 File 数组，这里传入单文件数组。
          importPPTXFile([pptxFile])
          // 标记本次粘贴已处理文件。
          isFile = true
        }
      }
      // 其他未知文件尝试按文件扩展名识别。
      else if (!isFile) {
        // 提取未知文件对象。
        const unknownFile = dataTransferFirstItem.getAsFile()

        // 只有存在文件名时才能按扩展名判断。
        if (unknownFile && unknownFile.name) {
          // 读取文件扩展名，缺失时兜底为空字符串。
          const ext = unknownFile.name.split('.').pop() || ''

          // PPTist 专用文件走项目自定义导入流程。
          if (ext === 'pptist') {
            // importSpecificFile 接收 FileList 或 File 数组，这里传入单文件数组。
            importSpecificFile([unknownFile])
            // 标记本次粘贴已处理文件。
            isFile = true
          }
        }
      }
    }

    // 返回处理结果和第一个数据项，让调用方决定是否继续处理文本。
    return { isFile, dataTransferFirstItem }
  }

  // 返回 DataTransfer 粘贴解析入口。
  return {
    pasteDataTransfer,
  }
}
