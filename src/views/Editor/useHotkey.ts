import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { KEYS } from '@/configs/hotkey'

import { message } from 'ant-design-vue'

export default () => {
  const store = useStore<State>()

  const ctrlKeyActive = computed(() => store.state.ctrlKeyState)
  const shiftKeyActive = computed(() => store.state.shiftKeyState)

  const editorAreaFocus = computed(() => store.state.editorAreaFocus)
  const thumbnailsFocus = computed(() => store.state.thumbnailsFocus)

  const copy = () => {
    message.success('copy')
  }
  const cut = () => {
    message.success('cut')
  }
  const undo = () => {
    message.success('undo')
  }
  const redo = () => {
    message.success('redo')
  }
  const selectAll = () => {
    message.success('selectAll')
  }
  const lock = () => {
    message.success('lock')
  }
  const combine = () => {
    message.success('combine')
  }
  const uncombine = () => {
    message.success('uncombine')
  }
  const remove = () => {
    message.success('remove')
  }
  const move = (key: string) => {
    message.success(`move: ${key}`)
  }
  const create = () => {
    message.success('create')
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