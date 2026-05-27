import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useKeyboardStore } from '@/store'
import { ElementOrderCommands } from '@/types/edit'
import { KEYS } from '@/configs/hotkey'

import useSlideHandler from './useSlideHandler'
import useLockElement from './useLockElement'
import useDeleteElement from './useDeleteElement'
import useCombineElement from './useCombineElement'
import useCopyAndPasteElement from './useCopyAndPasteElement'
import useSelectElement from './useSelectElement'
import useMoveElement from './useMoveElement'
import useOrderElement from './useOrderElement'
import useHistorySnapshot from './useHistorySnapshot'
import useScreening from './useScreening'
import useScaleCanvas from './useScaleCanvas'

/**
 * 注册编辑器全局快捷键，并把键盘事件分发到页面、元素、画布和放映等操作。
 *
 * @returns 无显式返回值；副作用是在组件挂载时注册事件监听、卸载时移除事件监听。
 * @throws 当前组合式函数不主动抛错；具体业务操作异常沿用各 hook 内部处理方式。
 * @remarks
 * - 快捷键是否生效依赖当前焦点区域，例如编辑区、缩略图区域或全局窗口。
 * - 输入框、富文本编辑等场景会通过 `disableHotkeys` 暂停多数编辑快捷键，避免和文本输入冲突。
 * - Ctrl 和 Meta 被合并处理，以兼容 Windows/Linux 的 Ctrl 与 macOS 的 Command。
 */
export default () => {
  // 主 store 保存焦点、选区、临时创建元素、弹窗等全局 UI 状态。
  const mainStore = useMainStore()
  // 键盘 store 保存 Ctrl、Shift、Space 等按键状态，供拖动画布等其他模块复用。
  const keyboardStore = useKeyboardStore()
  // 解构快捷键处理需要读取或判断的主状态。
  const {
    // 当前选中的元素 ID 列表。
    activeElementIdList,
    // 是否禁用大部分快捷键，通常在文本编辑或输入控件聚焦时开启。
    disableHotkeys,
    // 当前操作中的元素对象。
    handleElement,
    // 当前操作中的元素 ID。
    handleElementId,
    // 编辑画布是否聚焦。
    editorAreaFocus,
    // 左侧缩略图区域是否聚焦。
    thumbnailsFocus,
    // 搜索面板是否显示。
    showSearchPanel,
  } = storeToRefs(mainStore)
  // 当前幻灯片，用于 Tab 切换元素。
  const { currentSlide } = storeToRefs(useSlidesStore())
  // 当前组合键状态。
  const { ctrlKeyState, shiftKeyState, spaceKeyState } = storeToRefs(keyboardStore)

  // 页面级操作集合。
  const {
    // 更新当前页索引。
    updateSlideIndex,
    // 复制当前页。
    copySlide,
    // 新建页面。
    createSlide,
    // 删除当前页。
    deleteSlide,
    // 剪切当前页。
    cutSlide,
    // 复制并粘贴当前页。
    copyAndPasteSlide,
    // 全选页面。
    selectAllSlide,
  } = useSlideHandler()

  // 组合/取消组合操作。
  const { combineElements, uncombineElements } = useCombineElement()
  // 删除元素操作。
  const { deleteElement } = useDeleteElement()
  // 锁定元素操作。
  const { lockElement } = useLockElement()
  // 元素复制、剪切和快速复制操作。
  const { copyElement, cutElement, quickCopyElement } = useCopyAndPasteElement()
  // 元素全选操作。
  const { selectAllElements } = useSelectElement()
  // 元素移动操作。
  const { moveElement } = useMoveElement()
  // 元素层级调整操作。
  const { orderElement } = useOrderElement()
  // 历史快照撤销/重做。
  const { redo, undo } = useHistorySnapshot()
  // 放映入口。
  const { enterScreening, enterScreeningFromStart } = useScreening()
  // 画布缩放和重置。
  const { scaleCanvas, resetCanvas } = useScaleCanvas()

  /**
   * 根据当前焦点复制元素或页面。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 选中元素优先于缩略图页面复制，符合编辑器常见快捷键语义。
   */
  const copy = () => {
    // 有选中元素时复制元素。
    if (activeElementIdList.value.length) copyElement()
    // 没有选中元素但缩略图聚焦时复制页面。
    else if (thumbnailsFocus.value) copySlide()
  }

  /**
   * 根据当前焦点剪切元素或页面。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 选中元素优先，缩略图聚焦时才剪切页面。
   */
  const cut = () => {
    // 有选中元素时剪切元素。
    if (activeElementIdList.value.length) cutElement()
    // 缩略图聚焦时剪切当前页面。
    else if (thumbnailsFocus.value) cutSlide()
  }

  /**
   * 根据当前焦点执行快速复制。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 元素快速复制通常会复制并偏移；页面快速复制会复制并插入页面。
   */
  const quickCopy = () => {
    // 有选中元素时快速复制元素。
    if (activeElementIdList.value.length) quickCopyElement()
    // 缩略图聚焦时复制并粘贴页面。
    else if (thumbnailsFocus.value) copyAndPasteSlide()
  }

  /**
   * 根据焦点区域执行全选。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 编辑区全选元素，缩略图区域全选页面，两者互不抢占。
   */
  const selectAll = () => {
    // 编辑区聚焦时全选当前页元素。
    if (editorAreaFocus.value) selectAllElements()
    // 缩略图聚焦时全选页面。
    if (thumbnailsFocus.value) selectAllSlide()
  }

  /**
   * 锁定当前选中元素。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 只有编辑区聚焦时才允许锁定元素，避免缩略图区域误触。
   */
  const lock = () => {
    // 非编辑区焦点不处理。
    if (!editorAreaFocus.value) return
    // 执行锁定操作。
    lockElement()
  }
  /**
   * 组合当前选中的多个元素。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 只有编辑区聚焦时才允许组合。
   */
  const combine = () => {
    // 非编辑区焦点不处理。
    if (!editorAreaFocus.value) return
    // 执行组合操作。
    combineElements()
  }

  /**
   * 取消当前组合元素。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 只有编辑区聚焦时才允许取消组合。
   */
  const uncombine = () => {
    // 非编辑区焦点不处理。
    if (!editorAreaFocus.value) return
    // 执行取消组合操作。
    uncombineElements()
  }

  /**
   * 根据当前焦点删除元素或页面。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 有选中元素时删除元素，否则缩略图聚焦时删除页面。
   */
  const remove = () => {
    // 有选中元素时删除元素。
    if (activeElementIdList.value.length) deleteElement()
    // 缩略图聚焦时删除当前页面。
    else if (thumbnailsFocus.value) deleteSlide()
  }

  /**
   * 处理方向键移动。
   *
   * @param key - 当前按下的方向键。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 选中元素时移动元素；未选中元素且上下键时切换页面。
   */
  const move = (key: string) => {
    // 有选中元素时移动元素。
    if (activeElementIdList.value.length) moveElement(key)
    // 没有选中元素时，上下方向键用于切换缩略图页面。
    else if (key === KEYS.UP || key === KEYS.DOWN) updateSlideIndex(key)
  }

  /**
   * 处理 PageUp/PageDown 页面切换。
   *
   * @param key - 当前按下的翻页键。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks PageUp/PageDown 会映射为上/下页切换，复用 slide handler 的方向键逻辑。
   */
  const moveSlide = (key: string) => {
    // PageUp 切换到上一页。
    if (key === KEYS.PAGEUP) updateSlideIndex(KEYS.UP)
    // PageDown 切换到下一页。
    else if (key === KEYS.PAGEDOWN) updateSlideIndex(KEYS.DOWN)
  }

  /**
   * 调整当前操作元素的层级。
   *
   * @param command - 层级调整命令，例如置顶或置底。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 没有 handleElement 时直接跳过，避免层级操作作用于空对象。
   */
  const order = (command: ElementOrderCommands) => {
    // 没有当前操作元素时不处理。
    if (!handleElement.value) return
    // 执行层级调整。
    orderElement(handleElement.value, command)
  }

  /**
   * 在缩略图区域创建新页面。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks Enter 只有在缩略图区域聚焦时才新建页面，避免和编辑区确认输入冲突。
   */
  const create = () => {
    // 非缩略图焦点不处理。
    if (!thumbnailsFocus.value) return
    // 新建页面。
    createSlide()
  }

  /**
   * 使用 Tab 在当前页元素之间轮换选中。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 没有当前选中元素时选中第一页元素。
   * - 到达最后一个元素后回到第一个元素，形成循环。
   */
  const tabActiveElement = () => {
    // 当前页没有元素时不处理。
    if (!currentSlide.value.elements.length) return
    // 当前没有操作元素时选中第一个元素。
    if (!handleElementId.value) {
      // 当前页第一个元素。
      const firstElement = currentSlide.value.elements[0]
      // 设置选区为第一个元素。
      mainStore.setActiveElementIdList([firstElement.id])
      return
    }
    // 查找当前操作元素在元素列表中的位置。
    const currentIndex = currentSlide.value.elements.findIndex(el => el.id === handleElementId.value)
    // 计算下一个索引，最后一个元素后回到第一个。
    const nextIndex = currentIndex >= currentSlide.value.elements.length - 1 ? 0 : currentIndex + 1
    // 下一个元素 ID。
    const nextElementId = currentSlide.value.elements[nextIndex].id

    // 设置选区为下一个元素。
    mainStore.setActiveElementIdList([nextElementId])
  }

  /**
   * 全局 keydown 事件监听器。
   *
   * @param e - 浏览器键盘事件。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 全局快捷键如导出、放映、搜索、缩放会先处理，不要求编辑区或缩略图聚焦。
   * - 编辑类快捷键需要编辑区或缩略图聚焦，并且未被 `disableHotkeys` 禁用。
   */
  const keydownListener = (e: KeyboardEvent) => {
    // 解构浏览器事件中的组合键状态。
    const { ctrlKey, shiftKey, altKey, metaKey } = e
    // Windows/Linux 使用 Ctrl，macOS 使用 Meta，这里统一成一个激活标记。
    const ctrlOrMetaKeyActive = ctrlKey || metaKey
    
    // 统一转大写，便于和 KEYS 常量比较。
    const key = e.key.toUpperCase()

    // 首次检测到 Ctrl/Meta 按下时同步键盘状态。
    if (ctrlOrMetaKeyActive && !ctrlKeyState.value) keyboardStore.setCtrlKeyState(true)
    // 首次检测到 Shift 按下时同步键盘状态。
    if (shiftKey && !shiftKeyState.value) keyboardStore.setShiftKeyState(true)
    // Space 用于画布相关交互，但文本输入场景禁用热键时不记录。
    if (!disableHotkeys.value && key === KEYS.SPACE) keyboardStore.setSpaceKeyState(true)

    
    // Ctrl/Command + P 打开 PDF 导出弹窗，覆盖浏览器默认打印。
    if (ctrlOrMetaKeyActive && key === KEYS.P) {
      // 阻止浏览器打印面板。
      e.preventDefault()
      // 打开导出 PDF 弹窗。
      mainStore.setDialogForExport('pdf')
      return
    }
    // Shift + F6 从当前页开始放映。
    if (shiftKey && key === KEYS.F6) {
      // 阻止浏览器默认刷新或系统行为。
      e.preventDefault()
      // 从当前页开始放映。
      enterScreening()
      // 手动释放 Shift 状态，避免进入放映后残留。
      keyboardStore.setShiftKeyState(false)
      return
    }
    // F6 从第一页开始放映。
    if (key === KEYS.F6) {
      // 阻止浏览器刷新页面。
      e.preventDefault()
      // 从第一页开始放映。
      enterScreeningFromStart()
      return
    }
    // Ctrl + F 切换项目内搜索面板，而不是浏览器搜索。
    if (ctrlKey && key === KEYS.F) {
      // 阻止浏览器搜索框。
      e.preventDefault()
      // 切换搜索面板显示状态。
      mainStore.setSearchPanelState(!showSearchPanel.value)
      return
    }
    // Ctrl + - 缩小画布。
    if (ctrlKey && key === KEYS.MINUS) {
      // 阻止浏览器页面缩放。
      e.preventDefault()
      // 缩小编辑画布。
      scaleCanvas('-')
      return
    }
    // Ctrl + = 放大画布。
    if (ctrlKey && key === KEYS.EQUAL) {
      // 阻止浏览器页面缩放。
      e.preventDefault()
      // 放大编辑画布。
      scaleCanvas('+')
      return
    }
    // Ctrl + 0 重置画布缩放。
    if (ctrlKey && key === KEYS.DIGIT_0) {
      // 阻止浏览器页面缩放重置。
      e.preventDefault()
      // 重置编辑画布缩放。
      resetCanvas()
      return
    }
    
    // 下面是编辑区/缩略图区快捷键；两个区域都未聚焦时直接跳过。
    if (!editorAreaFocus.value && !thumbnailsFocus.value) return

    // Ctrl/Command + C 复制元素或页面。
    if (ctrlOrMetaKeyActive && key === KEYS.C) {
      // 热键禁用时保留浏览器默认行为。
      if (disableHotkeys.value) return
      // 阻止默认复制。
      e.preventDefault()
      // 执行业务复制。
      copy()
    }
    // Ctrl/Command + X 剪切元素或页面。
    if (ctrlOrMetaKeyActive && key === KEYS.X) {
      // 热键禁用时不拦截。
      if (disableHotkeys.value) return
      // 阻止默认剪切。
      e.preventDefault()
      // 执行业务剪切。
      cut()
    }
    // Ctrl/Command + D 快速复制。
    if (ctrlOrMetaKeyActive && key === KEYS.D) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器收藏等默认行为。
      e.preventDefault()
      // 执行快速复制。
      quickCopy()
    }
    // Ctrl/Command + Z 撤销。
    if (ctrlOrMetaKeyActive && key === KEYS.Z) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器默认撤销。
      e.preventDefault()
      // 执行编辑器撤销。
      undo()
    }
    // Ctrl/Command + Y 重做。
    if (ctrlOrMetaKeyActive && key === KEYS.Y) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器默认重做。
      e.preventDefault()
      // 执行编辑器重做。
      redo()
    }
    // Ctrl/Command + A 全选。
    if (ctrlOrMetaKeyActive && key === KEYS.A) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器全选页面文本。
      e.preventDefault()
      // 执行业务全选。
      selectAll()
    }
    // Ctrl/Command + L 锁定元素。
    if (ctrlOrMetaKeyActive && key === KEYS.L) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器地址栏聚焦。
      e.preventDefault()
      // 锁定当前元素。
      lock()
    }
    // Ctrl/Command + G 组合元素。
    if (!shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器默认行为。
      e.preventDefault()
      // 组合元素。
      combine()
    }
    // Ctrl/Command + Shift + G 取消组合。
    if (shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器默认行为。
      e.preventDefault()
      // 取消组合。
      uncombine()
    }
    // Alt + F 置顶。
    if (altKey && key === KEYS.F) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器菜单焦点。
      e.preventDefault()
      // 元素置顶。
      order(ElementOrderCommands.TOP)
    }
    // Alt + B 置底。
    if (altKey && key === KEYS.B) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止默认行为。
      e.preventDefault()
      // 元素置底。
      order(ElementOrderCommands.BOTTOM)
    }
    // Delete/Backspace 删除元素或页面。
    if (key === KEYS.DELETE || key === KEYS.BACKSPACE) {
      // 热键禁用时不处理，避免输入场景删除内容被拦截。
      if (disableHotkeys.value) return
      // 阻止浏览器后退或删除默认行为。
      e.preventDefault()
      // 执行业务删除。
      remove()
    }
    // 上方向键。
    if (key === KEYS.UP) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止页面滚动。
      e.preventDefault()
      // 移动元素或切换页面。
      move(KEYS.UP)
    }
    // 下方向键。
    if (key === KEYS.DOWN) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止页面滚动。
      e.preventDefault()
      // 移动元素或切换页面。
      move(KEYS.DOWN)
    }
    // 左方向键。
    if (key === KEYS.LEFT) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止页面滚动。
      e.preventDefault()
      // 移动元素。
      move(KEYS.LEFT)
    }
    // 右方向键。
    if (key === KEYS.RIGHT) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止页面滚动。
      e.preventDefault()
      // 移动元素。
      move(KEYS.RIGHT)
    }
    // PageUp 上一页。
    if (key === KEYS.PAGEUP) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器滚动。
      e.preventDefault()
      // 切换上一页。
      moveSlide(KEYS.PAGEUP)
    }
    // PageDown 下一页。
    if (key === KEYS.PAGEDOWN) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器滚动。
      e.preventDefault()
      // 切换下一页。
      moveSlide(KEYS.PAGEDOWN)
    }
    // Enter 在缩略图区域新建页面。
    if (key === KEYS.ENTER) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止默认确认行为。
      e.preventDefault()
      // 新建页面。
      create()
    }
    // Tab 在元素间循环选中。
    if (key === KEYS.TAB) {
      // 热键禁用时不处理。
      if (disableHotkeys.value) return
      // 阻止浏览器焦点跳转。
      e.preventDefault()
      // 切换当前选中元素。
      tabActiveElement()
    }
    // 编辑区单键创建元素；只在无 Shift、无 Ctrl/Meta 且热键启用时生效。
    if (editorAreaFocus.value && !shiftKey && !ctrlOrMetaKeyActive && !disableHotkeys.value) {
      // T 创建文本。
      if (key === KEYS.T) {
        mainStore.setCreatingElement({ type: 'text' })
      }
      // R 创建矩形。
      else if (key === KEYS.R) {
        mainStore.setCreatingElement({ type: 'shape', data: {
          // 矩形 viewBox。
          viewBox: [200, 200],
          // 矩形路径。
          path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
        }})
      }
      // O 创建椭圆。
      else if (key === KEYS.O) {
        mainStore.setCreatingElement({ type: 'shape', data: {
          // 椭圆 viewBox。
          viewBox: [200, 200],
          // 椭圆路径。
          path: 'M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z',
        }})
      }
      // L 创建直线。
      else if (key === KEYS.L) {
        mainStore.setCreatingElement({ type: 'line', data: {
          // 默认线段路径。
          path: 'M 0 0 L 20 20',
          // 默认实线。
          style: 'solid',
          // 默认无起止箭头。
          points: ['', ''],
        }})
      }
    }
  }
  
  /**
   * 全局 keyup/blur 状态清理。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks blur 时也调用该函数，避免用户按住组合键切出窗口后状态残留。
   */
  const keyupListener = () => {
    // 释放 Ctrl/Meta 状态。
    if (ctrlKeyState.value) keyboardStore.setCtrlKeyState(false)
    // 释放 Shift 状态。
    if (shiftKeyState.value) keyboardStore.setShiftKeyState(false)
    // 释放 Space 状态。
    if (spaceKeyState.value) keyboardStore.setSpaceKeyState(false)
  }

  // 组件挂载时注册全局键盘监听。
  onMounted(() => {
    // 监听键盘按下。
    document.addEventListener('keydown', keydownListener)
    // 监听键盘释放。
    document.addEventListener('keyup', keyupListener)
    // 窗口失焦时清空组合键状态，避免状态卡住。
    window.addEventListener('blur', keyupListener)
  })
  // 组件卸载时移除全局监听，避免内存泄漏和重复触发。
  onUnmounted(() => {
    // 移除键盘按下监听。
    document.removeEventListener('keydown', keydownListener)
    // 移除键盘释放监听。
    document.removeEventListener('keyup', keyupListener)
    // 移除窗口失焦监听。
    window.removeEventListener('blur', keyupListener)
  })
}
