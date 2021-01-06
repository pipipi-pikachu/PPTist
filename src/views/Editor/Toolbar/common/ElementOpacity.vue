<template>
  <div class="element-opacity">
    <div class="row">
      <div style="flex: 2;">不透明度：</div>
      <Slider :min="0" :max="1" :step="0.1" :value="opacity" style="flex: 3;" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { PPTElement } from '@/types/slides'

import { Slider } from 'ant-design-vue'

export default defineComponent({
  name: 'element-opacity',
  components: {
    Slider,
  },
  setup() {
    const store = useStore<State>()
    const handleElement: Ref<PPTElement> = computed(() => store.getters.handleElement)

    const opacity = ref<number>()

    watch(handleElement, () => {
      if(!handleElement.value) return
      opacity.value = 'opacity' in handleElement.value && handleElement.value.opacity || 1
    }, { deep: true, immediate: true })

    return {
      opacity,
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