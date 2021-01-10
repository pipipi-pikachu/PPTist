<template>
  <div class="shape-style-panel">
    <div class="row">
      <div style="flex: 2;">填充颜色：</div>
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
    <Divider />
    <ElementShadow />
    <Divider />
    <ElementOpacity />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, watch } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { PPTShapeElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOpacity from '../common/ElementOpacity.vue'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'
import ColorButton from '../common/ColorButton.vue'

export default defineComponent({
  name: 'shape-style-panel',
  components: {
    ElementOpacity,
    ElementOutline,
    ElementShadow,
    ColorButton,
  },
  setup() {
    const store = useStore<State>()
    const handleElement: Ref<PPTShapeElement> = computed(() => store.getters.handleElement)

    const fill = ref<string>()

    watch(handleElement, () => {
      if(!handleElement.value) return
      fill.value = handleElement.value.fill || '#000'
    }, { deep: true, immediate: true })

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateFill = (value: string) => {
      const props = { fill: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
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
</style>