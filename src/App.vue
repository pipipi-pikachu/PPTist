<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, ActionTypes, State } from '@/store'

export default defineComponent({
  name: 'app',
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