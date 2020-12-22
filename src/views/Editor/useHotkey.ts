import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { KEYS } from '@/configs/hotkey'
import { message } from 'ant-design-vue'

import useSlideHandler from '@/hooks/useSlideHandler'
import useLockElement from '@/hooks/useLockElement'
import useDeleteElement from '@/hooks/useDeleteElement'
import useCombineElement from '@/hooks/useCombineElement'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'
import useSelectAllElement from '@/hooks/useSelectAllElement'
import useMoveElement from '@/hooks/useMoveElement'

export default () => {
  const store = useStore<State>()

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

  const copy = () => {
    if(disableHotkeys.value) return
    if(thumbnailsFocus.value) copySlide()
    else if(activeElementIdList.value.length) copyElement()
  }

  const cut = () => {
    if(disableHotkeys.value) return
    if(thumbnailsFocus.value) cutSlide()
    else if(activeElementIdList.value.length) cutElement()
  }

  const undo = () => {
    message.success('undo')
  }

  const redo = () => {
    message.success('redo')
  }

  const selectAll = () => {
    if(!editorAreaFocus.value && disableHotkeys.value) return
    selectAllElement()
  }

  const lock = () => {
    if(!editorAreaFocus.value && disableHotkeys.value) return
    lockElement()
  }
  const combine = () => {
    if(!editorAreaFocus.value && disableHotkeys.value) return
    combineElements()
  }

  const uncombine = () => {
    if(!editorAreaFocus.value && disableHotkeys.value) return
    uncombineElements()
  }

  const remove = () => {
    if(disableHotkeys.value) return
    if(thumbnailsFocus.value) deleteSlide()
    else if(activeElementIdList.value.length) deleteElement()
  }

  const move = (key: string) => {
    if(disableHotkeys.value) return
    if(thumbnailsFocus.value && (key === KEYS.UP || key === KEYS.DOWN)) {
      updateSlideIndex(key)
    }
    else if(activeElementIdList.value.length) moveElement(key)
  }

  const create = () => {
    if(!thumbnailsFocus.value || disableHotkeys.value) return
    createSlide()
  }

  const keydownListener = (e: KeyboardEvent) => {
    const { ctrlKey, shiftKey } = e
    const key = e.key.toUpperCase()

    if(ctrlKey && !ctrlKeyActive.value) store.commit(MutationTypes.SET_CTRL_KEY_STATE, true)
    if(shiftKey && !shiftKeyActive.value) store.commit(MutationTypes.SET_SHIFT_KEY_STATE, true)
    
    if(!editorAreaFocus.value && !thumbnailsFocus.value) return      

    if(ctrlKey && key === KEYS.C) {
      e.preventDefault()
      copy()
    }
    if(ctrlKey && key === KEYS.X) {
      e.preventDefault()
      cut()
    }
    if(ctrlKey && key === KEYS.Z) {
      e.preventDefault()
      undo()
    }
    if(ctrlKey && key === KEYS.Y) {
      e.preventDefault()
      redo()
    }
    if(ctrlKey && key === KEYS.A) {
      e.preventDefault()
      selectAll()
    }
    if(ctrlKey && key === KEYS.L) {
      e.preventDefault()
      lock()
    }
    if(!shiftKey && ctrlKey && key === KEYS.G) {
      e.preventDefault()
      combine()
    }
    if(shiftKey && ctrlKey && key === KEYS.G) {
      e.preventDefault()
      uncombine()
    }
    if(key === KEYS.DELETE) {
      e.preventDefault()
      remove()
    }
    if(key === KEYS.UP) {
      e.preventDefault()
      move(KEYS.UP)
    }
    if(key === KEYS.DOWN) {
      e.preventDefault()
      move(KEYS.DOWN)
    }
    if(key === KEYS.LEFT) {
      e.preventDefault()
      move(KEYS.LEFT)
    }
    if(key === KEYS.RIGHT) {
      e.preventDefault()
      move(KEYS.RIGHT)
    }
    if(key === KEYS.ENTER) {
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