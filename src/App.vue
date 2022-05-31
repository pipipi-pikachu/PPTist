<template>
  <Screen v-if="screening" />
  <Editor v-else-if="isPC" />
  <Mobile v-else />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSnapshotStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { isPC } from './utils/common'
import useExport from './hooks/useExport'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile.vue'

export default defineComponent({
  name: 'app',
  components: {
    Editor,
    Screen,
    Mobile,
  },
  setup() {
    const mainStore = useMainStore()
    const snapshotStore = useSnapshotStore()
    const { databaseId } = storeToRefs(mainStore)
    const { screening } = storeToRefs(useScreenStore())

    if (process.env.NODE_ENV === 'production') {
      window.onbeforeunload = () => false
    }

    onMounted(() => {
      snapshotStore.initSnapshotDatabase()
      mainStore.setAvailableFonts()

      const { importSpecificFile } = useExport()

      if ('launchQueue' in window) {
        /* eslint-disable-next-line */
        (window as any).launchQueue.setConsumer(async (launchParams: any) => {
          if (launchParams.files && launchParams.files.length) {
            const files: File[] = launchParams.files
            importSpecificFile(files, true)
          }
        })
      }
    })

    // 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
    window.addEventListener('unload', () => {
      const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
      const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

      discardedDBList.push(databaseId.value)

      const newDiscardedDB = JSON.stringify(discardedDBList)
      localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
    })

    return {
      screening,
      isPC: isPC(),
    }
  },
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>