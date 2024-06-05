<template>
  <router-view />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSnapshotStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'


const mainStore = useMainStore()
const snapshotStore = useSnapshotStore()
const { databaseId } = storeToRefs(mainStore)


if (import.meta.env.MODE !== 'development') {
window.onbeforeunload = () => false
}

onMounted(async () => {
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

<style lang="scss">
#app {
height: 100%;
}
</style>