<template>
  <div class="editor">
    <EditorHeader class="layout-header" />
    <div class="layout-content">
      <Thumbnails class="layout-content-left" />
      <div class="layout-content-center">
        <CanvasTool class="center-top" />
        <Canvas class="center-body" />
      </div>
      <Toolbar class="layout-content-right" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store/state'
import { KEYCODE } from '@/configs/keyCode'

import { message } from 'ant-design-vue'

import EditorHeader from './EditorHeader/index.vue'
import Canvas from './Canvas/index.vue'
import CanvasTool from './CanvasTool/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'

export default defineComponent({
  name: 'editor',
  components: {
    EditorHeader,
    Canvas,
    CanvasTool,
    Thumbnails,
    Toolbar,
  },
  setup() {
    const ctrlKeyDown = ref(false)
    const shiftKeyDown = ref(false)

    const store = useStore<State>()
    const editorAreaFocus = computed(() => store.state.editorAreaFocus)
    const thumbnailsFocus = computed(() => store.state.thumbnailsFocus)
    const disableHotkeys = computed(() => store.state.disableHotkeys)

    const save = () => {
      message.success('save')
    }
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
    const move = (key: number) => {
      message.success(`move: ${key}`)
    }
    const create = () => {
      message.success('create')
    }

    const keydownListener = (e: KeyboardEvent) => {
      const { keyCode, ctrlKey, shiftKey } = e

      if(ctrlKey && !ctrlKeyDown.value) ctrlKeyDown.value = true
      if(shiftKey && !shiftKeyDown.value) shiftKeyDown.value = true
      
      if(!editorAreaFocus.value && !thumbnailsFocus.value) return

      e.preventDefault()
      
      if(ctrlKey && keyCode === KEYCODE.S) save()
      if(ctrlKey && keyCode === KEYCODE.C) copy()
      if(ctrlKey && keyCode === KEYCODE.X) cut()
      if(ctrlKey && keyCode === KEYCODE.Z) undo()
      if(ctrlKey && keyCode === KEYCODE.Y) redo()
      if(ctrlKey && keyCode === KEYCODE.A) selectAll()
      if(ctrlKey && keyCode === KEYCODE.L) lock()
      if(!shiftKey && ctrlKey && keyCode === KEYCODE.G) combine()
      if(shiftKey && ctrlKey && keyCode === KEYCODE.G) uncombine()
      if(keyCode === KEYCODE.DELETE) remove()
      if(keyCode === KEYCODE.UP) move(KEYCODE.UP)
      if(keyCode === KEYCODE.DOWN) move(KEYCODE.DOWN)
      if(keyCode === KEYCODE.LEFT) move(KEYCODE.LEFT)
      if(keyCode === KEYCODE.RIGHT) move(KEYCODE.RIGHT)
      if(keyCode === KEYCODE.ENTER) create()
    }
    
    const keyupListener = () => {
      if(ctrlKeyDown.value) ctrlKeyDown.value = false
      if(shiftKeyDown.value) shiftKeyDown.value = false
    }

    const pasteImageFile = (imageFile: File) => {
      console.log(imageFile)
    }

    const pasteText = (text: string) => {
      console.log(text)
    }

    const pasteListener = (e: ClipboardEvent) => {
      if(!editorAreaFocus.value && !thumbnailsFocus.value) return
      if(disableHotkeys.value) return

      if(!e.clipboardData) return

      const clipboardDataItems = e.clipboardData.items
      const clipboardDataFirstItem = clipboardDataItems[0]

      if(!clipboardDataFirstItem) return

      for(const item of clipboardDataItems) {
        if(item.kind === 'file' && item.type.indexOf('image') !== -1) {
          const imageFile = item.getAsFile()
          if(imageFile) pasteImageFile(imageFile)
          return
        }
      }

      if( clipboardDataFirstItem.kind === 'string' && clipboardDataFirstItem.type === 'text/plain' ) {
        clipboardDataFirstItem.getAsString(text => pasteText(text))
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', keydownListener)
      document.addEventListener('keyup', keyupListener)
      window.addEventListener('blur', keyupListener)
      document.addEventListener('paste', pasteListener)
    })
    onUnmounted(() => {
      document.removeEventListener('keydown', keydownListener)
      document.removeEventListener('keyup', keyupListener)
      window.removeEventListener('blur', keyupListener)
      document.removeEventListener('paste', pasteListener)
    })
  },
})
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;
}
.layout-header {
  height: 40px;
}
.layout-content {
  height: calc(100% - 40px);
  display: flex;
}
.layout-content-left {
  width: 160px;
  height: 100%;
  flex-shrink: 0;
}
.layout-content-center {
  width: calc(100% - 160px - 260px);

  .center-top {
    height: 40px;
  }
  .center-body {
    height: calc(100% - 40px);
  }
}
.layout-content-right {
  width: 260px;
  height: 100%;
}
</style>