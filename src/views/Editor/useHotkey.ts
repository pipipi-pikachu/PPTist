import { computed, onMounted, onUnmounted } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { KEYS } from '@/configs/hotkey'

import useSlideHandler from '@/hooks/useSlideHandler'
import useLockElement from '@/hooks/useLockElement'
import useDeleteElement from '@/hooks/useDeleteElement'
import useCombineElement from '@/hooks/useCombineElement'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'
import useSelectAllElement from '@/hooks/useSelectAllElement'
import useMoveElement from '@/hooks/useMoveElement'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useScreening from '@/hooks/useScreening'

export default () => {
  const store = useStore()

  const ctrlKeyActive = computed(() => store.state.ctrlKeyState)
  const shiftKeyActive = computed(() => store.state.shiftKeyState)
  const disableHotkeys = computed(() => store.state.disableHotkeys)
  const activeElementIdList = computed(() => store.state.activeElementIdList)

  const editorAreaFocus = computed(() => store.state.editorAreaFocus)
  const thumbnailsFocus = computed(() => store.state.thumbnailsFocus)

  const {
    updateSlideIndex,
    copySlide,
    createSlide,
    deleteSlide,
    cutSlide,
  } = useSlideHandler()

  const { combineElements, uncombineElements } = useCombineElement()
  const { deleteElement } = useDeleteElement()
  const { lockElement } = useLockElement()
  const { copyElement, cutElement } = useCopyAndPasteElement()
  const { selectAllElement } = useSelectAllElement()
  const { moveElement } = useMoveElement()
  const { redo, undo } = useHistorySnapshot()
  const { enterScreening } = useScreening()

  const copy = () => {
    if(activeElementIdList.value.length) copyElement()
    else if(thumbnailsFocus.value) copySlide()
  }

  const cut = () => {
    if(disableHotkeys.value) return
    if(activeElementIdList.value.length) cutElement()
    else if(thumbnailsFocus.value) cutSlide()
  }

  const selectAll = () => {
    if(!editorAreaFocus.value) return
    selectAllElement()
  }

  const lock = () => {
    if(!editorAreaFocus.value) return
    lockElement()
  }
  const combine = () => {
    if(!editorAreaFocus.value) return
    combineElements()
  }

  const uncombine = () => {
    if(!editorAreaFocus.value) return
    uncombineElements()
  }

  const remove = () => {
    if(activeElementIdList.value.length) deleteElement()
    else if(thumbnailsFocus.value) deleteSlide()
  }

  const move = (key: string) => {
    if(activeElementIdList.value.length) moveElement(key)
    else if(key === KEYS.UP || key === KEYS.DOWN) updateSlideIndex(key)
  }

  const create = () => {
    if(!thumbnailsFocus.value) return
    createSlide()
  }

  const keydownListener = (e: KeyboardEvent) => {
    const { ctrlKey, shiftKey, metaKey } = e

    const key = e.key.toUpperCase()

    if(ctrlKey && !ctrlKeyActive.value) store.commit(MutationTypes.SET_CTRL_KEY_STATE, true)
    if(shiftKey && !shiftKeyActive.value) store.commit(MutationTypes.SET_SHIFT_KEY_STATE, true)

    if(ctrlKey && key === KEYS.F) {
      e.preventDefault()
      enterScreening()
      store.commit(MutationTypes.SET_CTRL_KEY_STATE, false)
    }
    
    if(!editorAreaFocus.value && !thumbnailsFocus.value) return      

    if((ctrlKey || metaKey) && key === KEYS.C) {
      if(disableHotkeys.value) return
      e.preventDefault()
      copy()
    }
    if(ctrlKey && key === KEYS.X) {
      if(disableHotkeys.value) return
      e.preventDefault()
      cut()
    }
    if(ctrlKey && key === KEYS.Z) {
      if(disableHotkeys.value) return
      e.preventDefault()
      undo()
    }
    if(ctrlKey && key === KEYS.Y) {
      if(disableHotkeys.value) return
      e.preventDefault()
      redo()
    }
    if(ctrlKey && key === KEYS.A) {
      if(disableHotkeys.value) return
      e.preventDefault()
      selectAll()
    }
    if(ctrlKey && key === KEYS.L) {
      if(disableHotkeys.value) return
      e.preventDefault()
      lock()
    }
    if(!shiftKey && ctrlKey && key === KEYS.G) {
      if(disableHotkeys.value) return
      e.preventDefault()
      combine()
    }
    if(shiftKey && ctrlKey && key === KEYS.G) {
      if(disableHotkeys.value) return
      e.preventDefault()
      uncombine()
    }
    if(key === KEYS.DELETE) {
      if(disableHotkeys.value) return
      e.preventDefault()
      remove()
    }
    if(key === KEYS.UP) {
      if(disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.UP)
    }
    if(key === KEYS.DOWN) {
      if(disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.DOWN)
    }
    if(key === KEYS.LEFT) {
      if(disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.LEFT)
    }
    if(key === KEYS.RIGHT) {
      if(disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.RIGHT)
    }
    if(key === KEYS.ENTER) {
      if(disableHotkeys.value) return
      e.preventDefault()
      create()
    }
  }
  
  const keyupListener = () => {
    if(ctrlKeyActive.value) store.commit(MutationTypes.SET_CTRL_KEY_STATE, false)
    if(shiftKeyActive.value) store.commit(MutationTypes.SET_SHIFT_KEY_STATE, false)
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