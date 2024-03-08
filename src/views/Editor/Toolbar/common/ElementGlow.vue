<template>
  <div class="element-glow">
    <div class="row" v-if="!fixed">
      <div style="width: 40%;">文字发光：</div>
      <div class="switch-wrapper" style="width: 60%;">
        <Switch 
          :value="hasGlow" 
          @update:value="value => toggleGlow(value)" 
        />
      </div>
    </div>
    <template v-if="hasGlow && glow">
      <div class="row">
        <div style="width: 40%;">发光颜色：</div>
        <Popover trigger="click" style="width: 60%;">
          <template #content>
            <ColorPicker
              :modelValue="glow.color"
              @update:modelValue="value => updateGlow({ color: value })"
            />
          </template>
          <ColorButton :color="glow.color || '#000'" />
        </Popover>
      </div>
      <div class="row">
        <div style="width: 40%;">发光大小：</div>
        <NumberInput 
          :value="glow.size || 0" 
          @update:value="value => updateGlow({ size: value })" 
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
import type { PPTElementGlow } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from './ColorButton.vue'
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

const glow = ref<PPTElementGlow>()
const hasGlow = ref(false)

watch(handleElement, () => {
  if (!handleElement.value) return
  glow.value = 'glow' in handleElement.value ? handleElement.value.glow : undefined
  hasGlow.value = !!glow.value
}, { deep: true, immediate: true })

const { addHistorySnapshot } = useHistorySnapshot()

const updateGlow = (glowProps: Partial<PPTElementGlow>) => {
  if (!handleElement.value) return
  const props = { glow: { ...glow.value, ...glowProps } }
  slidesStore.updateElement({ id: handleElement.value.id, props })
  addHistorySnapshot()
}

const toggleGlow = (checked: boolean) => {
  if (!handleElement.value) return
  if (checked) {
    const _glow: PPTElementGlow = theme.value.glow
    slidesStore.updateElement({ id: handleElement.value.id, props: { glow: _glow } })
  }
  else {
    slidesStore.removeElementProps({ id: handleElement.value.id, propName: 'glow' })
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