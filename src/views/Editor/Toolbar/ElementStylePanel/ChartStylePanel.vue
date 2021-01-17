<template>
  <div class="chart-style-panel">
    <Button class="full-width-btn" @click="chartDataEditorVisible = true">
      <IconEdit class="btn-icon" /> 编辑图表数据
    </Button>

    <div class="row">
      <div style="flex: 2;">背景填充：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" style="flex: 3;" />
      </Popover>
    </div>

    <Divider />
    <ElementOutline />

    <Modal
      v-model:visible="chartDataEditorVisible" 
      :footer="null" 
      centered
      :closable="false"
      :width="648"
      destroyOnClose
    >
      <ChartDataEditor 
        :data="handleElement.data"
        @close="chartDataEditorVisible = false"
        @save="value => updateData(value)"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { ChartData, PPTChartElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '../common/ElementOutline.vue'
import ChartDataEditor from './ChartDataEditor.vue'
import ColorButton from '../common/ColorButton.vue'

export default defineComponent({
  name: 'chart-style-panel',
  components: {
    ElementOutline,
    ChartDataEditor,
    ColorButton,
  },
  setup() {
    const store = useStore<State>()
    const handleElement: Ref<PPTChartElement> = computed(() => store.getters.handleElement)

    const chartDataEditorVisible = ref(false)

    const { addHistorySnapshot } = useHistorySnapshot()

    const fill = ref<string>()

    watch(handleElement, () => {
      if(!handleElement.value) return
      fill.value = handleElement.value.fill || '#000'
    }, { deep: true, immediate: true })

    const updateData = (data: ChartData) => {
      chartDataEditorVisible.value = false
      const props = { data }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    const updateFill = (value: string) => {
      const props = { fill: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
      chartDataEditorVisible,
      handleElement,
      updateData,
      fill,
      updateFill,
    }
  },
})
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.full-width-btn {
  width: 100%;
  margin-bottom: 10px;
}
.btn-icon {
  margin-right: 3px;
}
</style>