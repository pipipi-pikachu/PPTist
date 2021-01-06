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
          :min="1" 
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
          :min="1"
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
          <Button class="color-btn" style="flex: 3;">
            <div class="color-block"></div>
            <DownOutlined class="color-btn-icon" />
          </Button>
        </Popover>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { PPTElement, PPTElementShadow } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorPicker from '@/components/ColorPicker/index.vue'
import { Slider, Button, Popover, Switch } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'element-shadow',
  components: {
    ColorPicker,
    Slider,
    Button,
    Popover,
    Switch,
    DownOutlined,
  },
  setup() {
    const store = useStore<State>()
    const handleElement: Ref<PPTElement> = computed(() => store.getters.handleElement)

    const shadow = ref<PPTElementShadow>()
    const hasShadow = ref(false)

    watch(handleElement, () => {
      if(!handleElement.value) return
      shadow.value = 'shadow' in handleElement.value && handleElement.value.shadow || undefined
      hasShadow.value = !!shadow.value
    }, { deep: true, immediate: true })

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateShadow = (shadowProps: Partial<PPTElementShadow>) => {
      const props = { shadow: { ...shadow.value, ...shadowProps } }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    const toggleShadow = (checked: boolean) => {
      let props: { shadow?: PPTElementShadow } = { shadow: undefined }
      if(checked) {
        props = { shadow: { h: 1, v: 1, blur: 2, color: '#000' } }
      }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
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
.color-btn {
  display: flex;
  align-items: center;
  padding: 0 !important;
}
.color-block {
  width: 100px;
  height: 20px;
  background-color: #777;
  margin: 0 8px;
}
.color-btn-icon {
  font-size: 12px;
  margin-top: 2px;
  color: #bfbfbf;
}
.switch-wrapper {
  text-align: right;
}
</style>