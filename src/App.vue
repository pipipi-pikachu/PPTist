<template>
  <Editor />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, ActionTypes, State } from '@/store'

import Editor from './views/Editor/index.vue'

export default defineComponent({
  name: 'app',
  components: {
    Editor,
  },
  setup() {
    const store = useStore<State>()

    onMounted(() => {
      store.commit(MutationTypes.SET_AVAILABLE_FONTS)
      store.dispatch(ActionTypes.INIT_SNAPSHOT_DATABASE)
    })
  },
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>