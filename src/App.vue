<template>
  <ExportRuntime v-if="isExportMode" />
  <div class="invalid-link" v-else-if="loadFailed">链接无效或已失效</div>
  <template v-else-if="slides.length">
    <Screen v-if="screening" />
    <Viewer v-else-if="isViewMode" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin tip="数据初始化中，请稍等 ..." v-else  loading :mask="false" />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useScreenStore, useMainStore, useSnapshotStore, useSlidesStore, useDocumentStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'
import { isPC } from '@/utils/common'
import useDocumentSync from '@/hooks/useDocumentSync'
import api from '@/services'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile/index.vue'
import Viewer from './views/Viewer/index.vue'
import ExportRuntime from './views/ExportRuntime/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

const _isPC = isPC()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const snapshotStore = useSnapshotStore()
const screenStore = useScreenStore()
const documentStore = useDocumentStore()
const { databaseId } = storeToRefs(mainStore)
const { slides } = storeToRefs(slidesStore)
const { screening } = storeToRefs(screenStore)
const { role } = storeToRefs(documentStore)

const urlParams = new URLSearchParams(window.location.search)
const mode = urlParams.get('mode')
const docId = urlParams.get('doc')
const tokenMatch = window.location.hash.match(/^#t=(.*)$/)

const isAudienceMode = mode === 'audience'
const isExportMode = mode === 'export'
const isViewMode = computed(() => mode === 'view' || role.value === 'view')

const loadFailed = ref(false)

const docSync = useDocumentSync()

// 有 doc 时把文档令牌存进 document store，并用 replaceState 去掉地址栏 hash，避免分享截图泄露令牌
if (docId) {
  documentStore.setCredentials(docId, tokenMatch?.[1] || '')
  if (tokenMatch) window.history.replaceState(null, '', window.location.pathname + window.location.search)
}

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = e => {
    if (docSync.hasUnsavedChanges()) {
      e.preventDefault()
      return false
    }
  }
}

onMounted(async () => {
  if (isAudienceMode) {
    slidesStore.setSlides([{
      id: nanoid(10),
      elements: [],
    }])
    screenStore.setScreening(true)
  }
  else if (isExportMode) {
    // 无头导出页：由 ExportRuntime 自挂 window.__PPTIST_EXPORT__，等待服务端 load()
  }
  else if (docId) {
    try {
      await docSync.init()
    }
    catch {
      loadFailed.value = true
      return
    }
    await deleteDiscardedDB()
    snapshotStore.initSnapshotDatabase()
  }
  else {
    const slides = await api.getMockData('slides')
    slidesStore.setSlides(slides)

    await deleteDiscardedDB()
    snapshotStore.initSnapshotDatabase()
  }
})

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('beforeunload', () => {
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
.invalid-link {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #999;
}
</style>
