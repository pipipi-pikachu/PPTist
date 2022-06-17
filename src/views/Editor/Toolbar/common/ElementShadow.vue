<template>
  <div class="element-shadow">
    <div class="row">
      <div style="flex: 2;">启用阴影：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch :checked="hasShadow" @change="checked => toggleShadow(checked as boolean)" />
      </div>
    </div>
    <template v-if="hasShadow && shadow">
      <div class="row">
        <div style="flex: 2;">水平阴影：</div>
        <Slider 
          class="slider"
          :min="-10" 
          :max="10" 
          :step="1" 
          :value="shadow.h" 
          @change="value => updateShadow({ h: value as number })"
        />
      </div>
      <div class="row">
        <div style="flex: 2;">垂直阴影：</div>
        <Slider
          class="slider"
          :min="-10"
          :max="10"
          :step="1"
          :value="shadow.v"
          @change="value => updateShadow({ v: value as number })"
        />
      </div>
      <div class="row">
        <div style="flex: 2;">模糊距离：</div>
        <Slider
          class="slider"
          :min="1"
          :max="20"
          :step="1"
          :value="shadow.blur"
          @change="value => updateShadow({ blur: value as number })"
        />
      </div>
      <div class="row">
        <div style="flex: 2;">阴影颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="shadow.color"
              @update:modelValue="value => updateShadow({ color: value })"
            />
          </template>
          <ColorButton :color="shadow.color" style="flex: 3;" />
        </Popover>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElementShadow } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from './ColorButton.vue'

const slidesStore = useSlidesStore()
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
    const _shadow: PPTElementShadow = { h: 1, v: 1, blur: 2, color: '#000' }
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
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.switch-wrapper {
  text-align: right;
}
.slider {
  flex: 3;
}
</style>