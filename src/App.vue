<template>
  <Editor v-if="!screening" />
  <Screen v-else />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSnapshotStore } from '@/store'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'

export default defineComponent({
  name: 'app',
  components: {
    Editor,
    Screen,
  },
  setup() {
    const mainStore = useMainStore()
    const snapshotStore = useSnapshotStore()
    const { screening } = storeToRefs(useScreenStore())

    if (process.env.NODE_ENV === 'production') {
      window.onbeforeunload = () => false
    }

    onMounted(() => {
      snapshotStore.initSnapshotDatabase()
      mainStore.setAvailableFonts()
    })

    return {
      screening,
    }
  },
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>