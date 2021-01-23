<template>
  <Editor v-if="!screening" />
  <Screen v-else />

  <div class="test">
    <EditableTable 
      :data="tableCells"
      @change="data => updateTableCells(data)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, ActionTypes, State } from '@/store'
import { TableCell } from './types/slides'

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

    const tableCells = ref<TableCell[][]>([
      [
        { id: '1', colspan: 1, rowspan: 1, text: '' },
        { id: '2', colspan: 1, rowspan: 1, text: '' },
        { id: '3', colspan: 1, rowspan: 1, text: '' },
        { id: '4', colspan: 1, rowspan: 1, text: '' },
        { id: '5', colspan: 1, rowspan: 1, text: '' },
      ],
      [
        { id: '6', colspan: 1, rowspan: 1, text: '' },
        { id: '7', colspan: 1, rowspan: 1, text: '' },
        { id: '8', colspan: 1, rowspan: 1, text: '' },
        { id: '9', colspan: 1, rowspan: 1, text: '' },
        { id: '10', colspan: 1, rowspan: 1, text: '' },
      ],
      [
        { id: '11', colspan: 1, rowspan: 1, text: '' },
        { id: '12', colspan: 1, rowspan: 1, text: '' },
        { id: '13', colspan: 1, rowspan: 1, text: '' },
        { id: '14', colspan: 1, rowspan: 1, text: '' },
        { id: '15', colspan: 1, rowspan: 1, text: '' },
      ],
    ])

    const updateTableCells = (data: TableCell[][]) => {
      console.log(data)
      tableCells.value = data
    }

    onMounted(() => {
      store.commit(MutationTypes.SET_AVAILABLE_FONTS)
      store.dispatch(ActionTypes.INIT_SNAPSHOT_DATABASE)
    })

    return {
      tableCells,
      updateTableCells,
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
}
</style>