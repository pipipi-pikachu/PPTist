import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { copyText, readClipboard } from '@/utils/clipboard'
import { encrypt } from '@/utils/crypto'
import message from '@/utils/message'
import usePasteTextClipboardData from '@/hooks/usePasteTextClipboardData'
import useDeleteElement from './useDeleteElement'

/**
 * 提供元素复制、剪切、粘贴和快速复制能力。
 *
 * @returns 包含复制、剪切、粘贴和快速复制方法的对象。
 * @throws 当前 composable 不主动抛错；剪贴板权限、加密、删除或粘贴流程异常会通过 Promise 或运行时错误表现。
 * @remarks
 * - 复制时会把选中元素序列化为 `{ type: 'elements', data }` 并加密写入剪贴板。
 * - 粘贴时会读取剪贴板文本，再交给 `usePasteTextClipboardData()` 统一解析。
 * - 剪切是复制后立即删除当前选中元素。
 */
export default () => {
  // 获取主状态 store，用于读取选中元素和恢复编辑区焦点。
  const mainStore = useMainStore()
  // 读取当前选中元素 ID 和元素实体列表。
  const { activeElementIdList, activeElementList } = storeToRefs(mainStore)

  // 获取文本剪贴板粘贴解析方法，负责识别项目数据、普通文本、表格等。
  const { pasteTextClipboardData } = usePasteTextClipboardData()
  // 获取删除元素方法，用于剪切。
  const { deleteElement } = useDeleteElement()

  /**
   * 将选中元素数据加密后复制到剪贴板。
   *
   * @returns 无显式返回值。
   * @throws 加密或 clipboard.js 初始化失败时可能产生运行时异常；复制失败会由 `copyText()` Promise reject。
   * @remarks 没有选中元素时直接返回，不写入剪贴板。
   */
  const copyElement = () => {
    // 没有选中元素时无需复制。
    if (!activeElementIdList.value.length) return

    // 构造项目内部剪贴板数据，并加密为字符串。
    const text = encrypt(JSON.stringify({
      // 标识剪贴板内容类型为元素列表。
      type: 'elements',
      // 保存当前选中元素数据。
      data: activeElementList.value,
    }))

    // 写入系统剪贴板。
    copyText(text).then(() => {
      // 复制完成后把焦点还给编辑区，方便继续使用快捷键。
      mainStore.setEditorareaFocus(true)
    })
  }

  /**
   * 将选中元素复制后删除，实现剪切。
   *
   * @returns 无显式返回值。
   * @throws 复制或删除流程中的异常会按对应函数行为表现。
   * @remarks 当前实现不会等待复制 Promise 完成后再删除，保持既有行为。
   */
  const cutElement = () => {
    // 先把选中元素写入剪贴板。
    copyElement()
    // 再删除当前选中元素。
    deleteElement()
  }

  /**
   * 从剪贴板读取文本并尝试粘贴。
   *
   * @returns 无显式返回值。
   * @throws 读取剪贴板失败会进入 catch 并显示 warning，不主动向上抛错。
   * @remarks 粘贴内容不一定是元素，也可能被解析为普通文本、Excel 表格或 HTML 表格。
   */
  const pasteElement = () => {
    // 读取系统剪贴板中的纯文本。
    readClipboard().then(text => {
      // 将剪贴板文本交给统一解析逻辑处理。
      pasteTextClipboardData(text)
    // 读取失败时用全局消息提示用户原因。
    }).catch(err => message.warning(err))
  }

  /**
   * 将选中元素复制后立刻粘贴。
   *
   * @returns 无显式返回值。
   * @throws 复制或粘贴流程异常会按对应函数行为表现。
   * @remarks 当前实现不会等待复制完成再读取剪贴板，保持既有行为。
   */
  const quickCopyElement = () => {
    // 先复制当前选中元素。
    copyElement()
    // 再尝试从剪贴板粘贴，通常用于快速复制并偏移元素。
    pasteElement()
  }

  // 返回剪贴板相关元素操作方法。
  return {
    copyElement,
    cutElement,
    pasteElement,
    quickCopyElement,
  }
}
