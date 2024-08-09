<template>
  <div class="element-shadow">
    <div class="row">
      <div style="width: 40%;">启用阴影：</div>
      <div class="switch-wrapper" style="width: 60%;">
        <Switch :value="hasShadow" @update:value="value => toggleShadow(value)" />
      </div>
    </div>
    <template v-if="hasShadow && shadow">
      <div class="row">
        <div style="width: 40%;">水平阴影：</div>
        <Slider 
          style="width: 60%;"
          :min="-10" 
          :max="10" 
          :step="1" 
          :value="shadow.h" 
          @update:value="value => updateShadow({ h: value as number })"
        />
      </div>
      <div class="row">
        <div style="width: 40%;">垂直阴影：</div>
        <Slider
          style="width: 60%;"
          :min="-10"
          :max="10"
          :step="1"
          :value="shadow.v"
          @update:value="value => updateShadow({ v: value as number })"
        />
      </div>
      <div class="row">
        <div style="width: 40%;">模糊距离：</div>
        <Slider
          style="width: 60%;"
          :min="1"
          :max="20"
          :step="1"
          :value="shadow.blur"
          @update:value="value => updateShadow({ blur: value as number })"
        />
      </div>
      <div class="row">
        <div style="width: 40%;">阴影颜色：</div>
        <Popover trigger="click" style="width: 60%;">
          <template #content>
            <ColorPicker
              :modelValue="shadow.color"
              @update:modelValue="value => updateShadow({ color: value })"
            />
          </template>
          <ColorButton :color="shadow.color" />
        </Popover>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElementShadow } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '@/components/ColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Switch from '@/components/Switch.vue'
import Slider from '@/components/Slider.vue'
import Popover from '@/components/Popover.vue'

const slidesStore = useSlidesStore()
const { theme } = storeToRefs(slidesStore)
const { handleElement } = storeToRefs(useMainStore())

const shadow = ref<PPTElementShadow>()
const hasShadow = ref(false)

watch(handleElement, () => {
  if (!handleElement.value) return
  shadow.value = 'shadow' in handleElement.value ? handleElement.value.shadow : undefined
  hasShadow.value = !!shadow.value
}, { deep: true, immediate: true })

const { addHistorySnapshot } = useHistorySnapshot()

const updateShadow = (shadowProps: Partial<PPTElementShadow>) => {
  if (!handleElement.value || !shadow.value) return
  const _shadow = { ...shadow.value, ...shadowProps }
  slidesStore.updateElement({ id: handleElement.value.id, props: { shadow: _shadow } })
  addHistorySnapshot()
}

const toggleShadow = (checked: boolean) => {
  if (!handleElement.value) return
  if (checked) {
    const _shadow: PPTElementShadow = theme.value.shadow
    slidesStore.updateElement({ id: handleElement.value.id, props: { shadow: _shadow } })
  }
  else {
    slidesStore.removeElementProps({ id: handleElement.value.id, propName: 'shadow' })
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