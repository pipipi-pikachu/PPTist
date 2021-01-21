<template>
  <Editor v-if="!screening" />
  <Screen v-else />

  <div class="test">
    <EditableTable />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, ActionTypes, State } from '@/store'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import EditableTable from '@/components/EditableTable.vue'

export default defineComponent({
  name: 'app',
  components: {
    Editor,
    Screen,
    EditableTable,
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
.test {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 10px;
  z-index: -1;
}
</style>