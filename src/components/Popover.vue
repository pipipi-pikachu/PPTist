<template>
  <div class="popover" ref="triggerRef">
    <div class="popover-content" :style="contentStyle" ref="contentRef">
      <slot name="content"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { type CSSProperties, onMounted, ref, watch, computed } from 'vue'
import tippy, { type Instance, type Placement } from 'tippy.js'

import 'tippy.js/animations/scale.css'

const props = withDefaults(defineProps<{
  value: boolean
  trigger?: 'click' | 'mouseenter'
  placement?: Placement
  appendTo?: HTMLElement | 'parent'
  contentStyle?: CSSProperties
}>(), {
  trigger: 'click',
  placement: 'auto',
})

const emit = defineEmits<{
  (event: 'update:value', payload: boolean): void
}>()

const instance = ref<Instance>()
const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

const contentStyle = computed(() => {
  return props.contentStyle || {}
})

watch(() => props.value, () => {
  if (!instance.value) return
  if (props.value) instance.value.show()
  else instance.value.hide()
})

onMounted(() => {
  instance.value = tippy(triggerRef.value!, {
    content: contentRef.value!,
    allowHTML: true,
    trigger: props.trigger,
    placement: props.placement,
    interactive: true,
    appendTo: props.appendTo || document.body,
    maxWidth: 'none',
    offset: [0, 8],
    animation: 'scale',
    onShown() {
      if (!props.value) emit('update:value', true)
    },
    onHidden() {
      if (props.value) emit('update:value', false)
    },
  })
})
</script>

<style lang="scss" scoped>
.popover-content {
  background-color: #fff;
  padding: 10px;
  border: 1px solid $borderColor;
  box-shadow: $boxShadow;
  border-radius: 2px;
}
</style>