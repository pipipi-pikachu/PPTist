<template>
  <Screen v-if="screening" />
  <Editor v-else-if="isPC" />
  <Mobile v-else />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSnapshotStore } from '@/store'
import { isPC } from './utils/common'

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