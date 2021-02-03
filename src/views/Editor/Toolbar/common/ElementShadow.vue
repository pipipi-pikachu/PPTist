<template>
  <div class="element-shadow">
    <div class="row">
      <div style="flex: 2;">启用阴影：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch :checked="hasShadow" @change="checked => toggleShadow(checked)" />
      </div>
    </div>
    <template v-if="hasShadow">
      <div class="row">
        <div style="flex: 2;">水平阴影：</div>
        <Slider 
          :min="0" 
          :max="10" 
          :step="1" 
          :value="shadow.h" 
          @change="value => updateShadow({ h: value })" 
          style="flex: 3;" 
        />
      </div>
      <div class="row">
        <div style="flex: 2;">垂直阴影：</div>
        <Slider
          :min="0"
          :max="10"
          :step="1"
          :value="shadow.v"
          @change="value => updateShadow({ v: value })" 
          style="flex: 3;"
        />
      </div>
      <div class="row">
        <div style="flex: 2;">模糊距离：</div>
        <Slider
          :min="1"
          :max="20"
          :step="1"
          :value="shadow.blur"
          @change="value => updateShadow({ blur: value })" 
          style="flex: 3;"
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

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTElement, PPTElementShadow } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from './ColorButton.vue'

export default defineComponent({
  name: 'element-shadow',
  components: {
    ColorButton,
  },
  setup() {
    const store = useStore()
    const handleElement = computed<PPTElement>(() => store.getters.handleElement)

    const shadow = ref<PPTElementShadow>()
    const hasShadow = ref(false)

    watch(handleElement, () => {
      if (!handleElement.value) return
      shadow.value = 'shadow' in handleElement.value ? handleElement.value.shadow : undefined
      hasShadow.value = !!shadow.value
    }, { deep: true, immediate: true })

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateShadow = (shadowProps: Partial<PPTElementShadow>) => {
      const props = { shadow: { ...shadow.value, ...shadowProps } }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    const toggleShadow = (checked: boolean) => {
      if (checked) {
        const props = { shadow: { h: 1, v: 1, blur: 2, color: '#000' } }
        store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      }
      else {
        store.commit(MutationTypes.REMOVE_ELEMENT_PROPS, { id: handleElement.value.id, propName: 'shadow' })
      }
      addHistorySnapshot()
    }

    return {
      shadow,
      hasShadow,
      toggleShadow,
      updateShadow,
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
.switch-wrapper {
  text-align: right;
}
</style>