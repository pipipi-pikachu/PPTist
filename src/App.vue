<template>
  <Screen v-if="screening" />
  <Editor v-else-if="_isPC" />
  <Mobile v-else />
</template>



<script lang="ts" setup>
import { onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSnapshotStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'
import { isPC } from './utils/common'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile/index.vue'

const _isPC = isPC()

const mainStore = useMainStore()
const snapshotStore = useSnapshotStore()
const { databaseId } = storeToRefs(mainStore)
const { screening } = storeToRefs(useScreenStore())

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => false
}

const screenStore = useScreenStore()

onMounted(async () => {
  await deleteDiscardedDB()
  snapshotStore.initSnapshotDatabase()
  mainStore.setAvailableFonts()

  // 进入演讲者模式
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  const params = new URLSearchParams(url.search)
  const viewMode = params.get('viewMode')
  if (viewMode === 'presenter') {
    screenStore.setScreening(true)
  }
  nextTick(() => {
    screenStore.changeScreeningMode(viewMode)
  })
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

<style lang="scss">
#app {
  height: 100%;
}
</style>