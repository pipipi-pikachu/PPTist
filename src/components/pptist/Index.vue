<style lang="scss">
@import '@icon-park/vue-next/styles/index.css';
@import 'prosemirror-view/style/prosemirror.css';
@import 'animate.css';
@import './styles/prosemirror.scss';
@import './styles/global.scss';
@import './styles/font.scss';
</style>

<template>
  <Screen v-if="screening" />
  <Editor v-else-if="_isPC" />
  <Mobile v-else />
</template>

<script lang="ts" setup>
import { onMounted, defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSnapshotStore } from './store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from './configs/storage'
import { deleteDiscardedDB } from './utils/database'
import { isPC } from './utils/common'

import Editor from './Editor/index.vue'
import Screen from './Screen/index.vue'
import Mobile from './Mobile/index.vue'

const _isPC = isPC()

const mainStore = useMainStore()
const snapshotStore = useSnapshotStore()
const { databaseId } = storeToRefs(mainStore)
const { screening } = storeToRefs(useScreenStore())

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => false
}

// 编辑器配置
type Options = {
  showEditorHeader: boolean,
  exportFileTypes: string[],
  fileMenuItems: string[],
}
const props = withDefaults(defineProps<{
  options: Options
}>(), {
  options: () => ({
    showEditorHeader: true,
    exportFileTypes: [],
    fileMenuItems: []
  })
})

onMounted(async () => {
  mainStore.setShowEditorHeader(props.options.showEditorHeader)
  if (props.options.exportFileTypes.length > 0) {
    mainStore.setExportFileTypes(props.options.exportFileTypes)
  }
  if (props.options.fileMenuItems.length > 0) {
    mainStore.setFileMenuItems(props.options.fileMenuItems)
  }
  await deleteDiscardedDB()
  snapshotStore.initSnapshotDatabase()
  mainStore.setAvailableFonts()
})

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('unload', () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

  discardedDBList.push(databaseId.value)

  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
})
</script>

