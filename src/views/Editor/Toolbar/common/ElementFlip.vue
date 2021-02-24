<template>
  <div class="element-flip">
    <CheckboxButtonGroup class="row">
      <CheckboxButton 
        style="flex: 1;"
        :checked="flip.x === 180"
        @click="updateFlip({ x: flip.x === 180 ? 0 : 180, y: flip.y })"
      ><IconFlipVertically /> 垂直翻转</CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="flip.y === 180"
        @click="updateFlip({ x: flip.x, y: flip.y === 180 ? 0 : 180 })"
      ><IconFlipHorizontally /> 水平翻转</CheckboxButton>
    </CheckboxButtonGroup>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTImageElement, PPTShapeElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default defineComponent({
  name: 'element-flip',
  setup() {
    const store = useStore()
    const handleElement = computed<PPTImageElement | PPTShapeElement>(() => store.getters.handleElement)

    const flip = ref({
      x: 0,
      y: 0,
    })

    watch(handleElement, () => {
      if (!handleElement.value || !['image', 'shape'].includes(handleElement.value.type)) return

      if (handleElement.value.flip) {
        flip.value = {
          x: handleElement.value.flip.x || 0,
          y: handleElement.value.flip.y || 0,
        }
      }
      else flip.value = { x: 0, y: 0 }
    }, { deep: true, immediate: true })

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateFlip = (value: number) => {
      const props = { flip: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
      flip,
      updateFlip,
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