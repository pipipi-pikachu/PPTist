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

export default () => {
  const mainStore = useMainStore()
  const keyboardStore = useKeyboardStore()
  const {
    activeElementIdList,
    disableHotkeys,
    handleElement,
    handleElementId,
    editorAreaFocus,
    thumbnailsFocus,
    showSearchPanel,
  } = storeToRefs(mainStore)
  const { currentSlide } = storeToRefs(useSlidesStore())
  const { ctrlKeyState, shiftKeyState, spaceKeyState } = storeToRefs(keyboardStore)

  const {
    updateSlideIndex,
    copySlide,
    createSlide,
    deleteSlide,
    cutSlide,
    copyAndPasteSlide,
    selectAllSlide,
  } = useSlideHandler()

  const { combineElements, uncombineElements } = useCombineElement()
  const { deleteElement } = useDeleteElement()
  const { lockElement } = useLockElement()
  const { copyElement, cutElement, quickCopyElement } = useCopyAndPasteElement()
  const { selectAllElements } = useSelectElement()
  const { moveElement } = useMoveElement()
  const { orderElement } = useOrderElement()
  const { redo, undo } = useHistorySnapshot()
  const { enterScreening, enterScreeningFromStart } = useScreening()
  const { scaleCanvas, resetCanvas } = useScaleCanvas()

  const copy = () => {
    if (activeElementIdList.value.length) copyElement()
    else if (thumbnailsFocus.value) copySlide()
  }

  const cut = () => {
    if (activeElementIdList.value.length) cutElement()
    else if (thumbnailsFocus.value) cutSlide()
  }

  const quickCopy = () => {
    if (activeElementIdList.value.length) quickCopyElement()
    else if (thumbnailsFocus.value) copyAndPasteSlide()
  }

  const selectAll = () => {
    if (editorAreaFocus.value) selectAllElements()
    if (thumbnailsFocus.value) selectAllSlide()
  }

  const lock = () => {
    if (!editorAreaFocus.value) return
    lockElement()
  }
  const combine = () => {
    if (!editorAreaFocus.value) return
    combineElements()
  }

  const uncombine = () => {
    if (!editorAreaFocus.value) return
    uncombineElements()
  }

  const remove = () => {
    if (activeElementIdList.value.length) deleteElement()
    else if (thumbnailsFocus.value) deleteSlide()
  }

  const move = (key: string) => {
    if (activeElementIdList.value.length) moveElement(key)
    else if (key === KEYS.UP || key === KEYS.DOWN) updateSlideIndex(key)
  }

  const moveSlide = (key: string) => {
    if (key === KEYS.PAGEUP) updateSlideIndex(KEYS.UP)
    else if (key === KEYS.PAGEDOWN) updateSlideIndex(KEYS.DOWN)
  }

  const order = (command: ElementOrderCommands) => {
    if (!handleElement.value) return
    orderElement(handleElement.value, command)
  }

  const create = () => {
    if (!thumbnailsFocus.value) return
    createSlide()
  }

  const tabActiveElement = () => {
    if (!currentSlide.value.elements.length) return
    if (!handleElementId.value) {
      const firstElement = currentSlide.value.elements[0]
      mainStore.setActiveElementIdList([firstElement.id])
      return
    }
    const currentIndex = currentSlide.value.elements.findIndex(el => el.id === handleElementId.value)
    const nextIndex = currentIndex >= currentSlide.value.elements.length - 1 ? 0 : currentIndex + 1
    const nextElementId = currentSlide.value.elements[nextIndex].id

    mainStore.setActiveElementIdList([nextElementId])
  }

  const keydownListener = (e: KeyboardEvent) => {
    const { ctrlKey, shiftKey, altKey, metaKey } = e
    const ctrlOrMetaKeyActive = ctrlKey || metaKey
    
    const key = e.key.toUpperCase()

    if (ctrlOrMetaKeyActive && !ctrlKeyState.value) keyboardStore.setCtrlKeyState(true)
    if (shiftKey && !shiftKeyState.value) keyboardStore.setShiftKeyState(true)
    if (!disableHotkeys.value && key === KEYS.SPACE) keyboardStore.setSpaceKeyState(true)

    
    if (ctrlOrMetaKeyActive && key === KEYS.P) {
      e.preventDefault()
      mainStore.setDialogForExport('pdf')
      return
    }
    if (shiftKey && key === KEYS.F5) {
      e.preventDefault()
      enterScreening()
      keyboardStore.setShiftKeyState(false)
      return
    }
    if (key === KEYS.F5) {
      e.preventDefault()
      enterScreeningFromStart()
      return
    }
    if (ctrlKey && key === KEYS.F) {
      e.preventDefault()
      mainStore.setSearchPanelState(!showSearchPanel.value)
      return
    }
    
    if (!editorAreaFocus.value && !thumbnailsFocus.value) return      

    if (ctrlOrMetaKeyActive && key === KEYS.C) {
      if (disableHotkeys.value) return
      e.preventDefault()
      copy()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.X) {
      if (disableHotkeys.value) return
      e.preventDefault()
      cut()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.D) {
      if (disableHotkeys.value) return
      e.preventDefault()
      quickCopy()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.Z) {
      if (disableHotkeys.value) return
      e.preventDefault()
      undo()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.Y) {
      if (disableHotkeys.value) return
      e.preventDefault()
      redo()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.A) {
      if (disableHotkeys.value) return
      e.preventDefault()
      selectAll()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.L) {
      if (disableHotkeys.value) return
      e.preventDefault()
      lock()
    }
    if (!shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      if (disableHotkeys.value) return
      e.preventDefault()
      combine()
    }
    if (shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      if (disableHotkeys.value) return
      e.preventDefault()
      uncombine()
    }
    if (altKey && key === KEYS.F) {
      if (disableHotkeys.value) return
      e.preventDefault()
      order(ElementOrderCommands.TOP)
    }
    if (altKey && key === KEYS.B) {
      if (disableHotkeys.value) return
      e.preventDefault()
      order(ElementOrderCommands.BOTTOM)
    }
    if (key === KEYS.DELETE || key === KEYS.BACKSPACE) {
      if (disableHotkeys.value) return
      e.preventDefault()
      remove()
    }
    if (key === KEYS.UP) {
      if (disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.UP)
    }
    if (key === KEYS.DOWN) {
      if (disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.DOWN)
    }
    if (key === KEYS.LEFT) {
      if (disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.LEFT)
    }
    if (key === KEYS.RIGHT) {
      if (disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.RIGHT)
    }
    if (key === KEYS.PAGEUP) {
      if (disableHotkeys.value) return
      e.preventDefault()
      moveSlide(KEYS.PAGEUP)
    }
    if (key === KEYS.PAGEDOWN) {
      if (disableHotkeys.value) return
      e.preventDefault()
      moveSlide(KEYS.PAGEDOWN)
    }
    if (key === KEYS.ENTER) {
      if (disableHotkeys.value) return
      e.preventDefault()
      create()
    }
    if (key === KEYS.MINUS) {
      if (disableHotkeys.value) return
      e.preventDefault()
      scaleCanvas('-')
    }
    if (key === KEYS.EQUAL) {
      if (disableHotkeys.value) return
      e.preventDefault()
      scaleCanvas('+')
    }
    if (key === KEYS.DIGIT_0) {
      if (disableHotkeys.value) return
      e.preventDefault()
      resetCanvas()
    }
    if (key === KEYS.TAB) {
      if (disableHotkeys.value) return
      e.preventDefault()
      tabActiveElement()
    }
    if (editorAreaFocus.value && !shiftKey && !ctrlOrMetaKeyActive && !disableHotkeys.value) {
      if (key === KEYS.T) {
        mainStore.setCreatingElement({ type: 'text' })
      }
      else if (key === KEYS.R) {
        mainStore.setCreatingElement({ type: 'shape', data: {
          viewBox: [200, 200],
          path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
        }})
      }
      else if (key === KEYS.O) {
        mainStore.setCreatingElement({ type: 'shape', data: {
          viewBox: [200, 200],
          path: 'M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z',
        }})
      }
      else if (key === KEYS.L) {
        mainStore.setCreatingElement({ type: 'line', data: {
          path: 'M 0 0 L 20 20',
          style: 'solid',
          points: ['', ''],
        }})
      }
    }
  }
  
  const keyupListener = () => {
    if (ctrlKeyState.value) keyboardStore.setCtrlKeyState(false)
    if (shiftKeyState.value) keyboardStore.setShiftKeyState(false)
    if (spaceKeyState.value) keyboardStore.setSpaceKeyState(false)
  }

  onMounted(() => {
    document.addEventListener('keydown', keydownListener)
    document.addEventListener('keyup', keyupListener)
    window.addEventListener('blur', keyupListener)
  })
  onUnmounted(() => {
    document.removeEventListener('keydown', keydownListener)
    document.removeEventListener('keyup', keyupListener)
    window.removeEventListener('blur', keyupListener)
  })
}