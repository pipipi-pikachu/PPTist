<template>
  <Editor v-if="!screening" />
  <Screen v-else />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, ActionTypes, State } from '@/store'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'

export default defineComponent({
  name: 'app',
  components: {
    Editor,
    Screen,
  },
  setup() {
    const store = useStore<State>()
    const screening = computed(() => store.state.screening)

    onMounted(() => {
      store.commit(MutationTypes.SET_AVAILABLE_FONTS)
      store.dispatch(ActionTypes.INIT_SNAPSHOT_DATABASE)
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