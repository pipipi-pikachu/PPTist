<template>
  <div class="remark">
    <textarea
      :value="remark"
      placeholder="点击输入演讲者备注"
      @input="$event => handleInput($event)"
    ></textarea>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { Slide } from '@/types/slides'

export default defineComponent({
  name: 'remark',
  setup() {
    const store = useStore()
    const currentSlide = computed<Slide>(() => store.getters.currentSlide)
    const remark = computed(() => currentSlide.value?.remark || '')

    const handleInput = (e: InputEvent) => {
      const value = (e.target as HTMLTextAreaElement).value
      store.commit(MutationTypes.UPDATE_SLIDE, { remark: value })
    }

    return {
      remark,
      handleInput,
    }
  },
})
</script>

<style lang="scss" scoped>
.remark {
  position: relative;
  border-top: 1px solid $borderColor;
  background-color: $lightGray;

  textarea {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-y: auto;
    resize: none;
    border: 0;
    outline: 0;
    padding: 8px;
    font-size: 12px;
    background-color: transparent;
  }
}
</style>