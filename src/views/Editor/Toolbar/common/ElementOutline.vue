<template>
  <div class="element-outline">
    <div class="row" v-if="!fixed">
      <div style="width: 40%;">启用边框：</div>
      <div class="switch-wrapper" style="width: 60%;">
        <Switch 
          :value="hasOutline" 
          @update:value="value => toggleOutline(value)" 
        />
      </div>
    </div>
    <template v-if="hasOutline && outline">
      <div class="row">
        <div style="width: 40%;">边框样式：</div>
        <Select 
          style="width: 60%;" 
          :value="outline.style || ''" 
          @update:value="value => updateOutline({ style: value as 'dashed' | 'solid' | 'dotted' })"
          :options="[
            { label: '实线边框', value: 'solid' },
            { label: '虚线边框', value: 'dashed' },
            { label: '点线边框', value: 'dotted' },
          ]"
        />
      </div>
      <div class="row">
        <div style="width: 40%;">边框颜色：</div>
        <Popover trigger="click" style="width: 60%;">
          <template #content>
            <ColorPicker
              :modelValue="outline.color"
              @update:modelValue="value => updateOutline({ color: value })"
            />
          </template>
          <ColorButton :color="outline.color || '#000'" />
        </Popover>
      </div>
      <div class="row">
        <div style="width: 40%;">边框粗细：</div>
        <NumberInput 
          :value="outline.width || 0" 
          @update:value="value => updateOutline({ width: value })" 
          style="width: 60%;" 
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElementOutline } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '@/components/ColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Switch from '@/components/Switch.vue'
import NumberInput from '@/components/NumberInput.vue'
import Select from '@/components/Select.vue'
import Popover from '@/components/Popover.vue'

withDefaults(defineProps<{
  fixed?: boolean
}>(), {
  fixed: false,
})

const slidesStore = useSlidesStore()
const { theme } = storeToRefs(slidesStore)
const { handleElement } = storeToRefs(useMainStore())

const outline = ref<PPTElementOutline>()
const hasOutline = ref(false)

watch(handleElement, () => {
  if (!handleElement.value) return
  outline.value = 'outline' in handleElement.value ? handleElement.value.outline : undefined
  hasOutline.value = !!outline.value
}, { deep: true, immediate: true })

const { addHistorySnapshot } = useHistorySnapshot()

const updateOutline = (outlineProps: Partial<PPTElementOutline>) => {
  if (!handleElement.value) return
  const props = { outline: { ...outline.value, ...outlineProps } }
  slidesStore.updateElement({ id: handleElement.value.id, props })
  addHistorySnapshot()
}

const toggleOutline = (checked: boolean) => {
  if (!handleElement.value) return
  if (checked) {
    const _outline: PPTElementOutline = theme.value.outline
    slidesStore.updateElement({ id: handleElement.value.id, props: { outline: _outline } })
  }
  else {
    slidesStore.removeElementProps({ id: handleElement.value.id, propName: 'outline' })
  }
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.switch-wrapper {
  text-align: right;
}
</style>