<template>
  <div class="popover" :class="{ 'center': center }" ref="triggerRef">
    <div class="popover-content" :style="contentStyle" ref="contentRef">
      <slot name="content" v-if="contentVisible"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { type CSSProperties, onMounted, onUnmounted, ref, watch, computed } from 'vue'
import tippy, { type Instance, type Placement } from 'tippy.js'

import 'tippy.js/animations/scale.css'

const props = withDefaults(defineProps<{
  value?: boolean
  trigger?: 'click' | 'mouseenter' | 'manual'
  placement?: Placement
  appendTo?: HTMLElement | 'parent'
  contentStyle?: CSSProperties
  center?: boolean
  offset?: number
}>(), {
  value: false,
  trigger: 'click',
  placement: 'bottom',
  center: false,
  offset: 8,
})

const emit = defineEmits<{
  (event: 'update:value', payload: boolean): void
}>()

const instance = ref<Instance>()
const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const contentVisible = ref(false)

const contentStyle = computed(() => {
  return props.contentStyle || {}
})

watch(() => props.value, () => {
  if (!instance.value) return
  if (props.value) instance.value.show()
  else instance.value.hide()
})

onUnmounted(() => {
  if (instance.value) instance.value.destroy()
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
    offset: [0, props.offset],
    duration: 200,
    animation: 'scale',
    theme: 'popover',
    onShow() {
      contentVisible.value = true
    },
    onShown() {
      if (!props.value) emit('update:value', true)
    },
    onHidden() {
      if (props.value) emit('update:value', false)
      contentVisible.value = false
    },
  })
})
</script>

<style lang="scss" scoped>
.popover.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.popover-content {
  background-color: #fff;
  padding: 10px;
  border: 1px solid $borderColor;
  box-shadow: $boxShadow;
  border-radius: $borderRadius;
  font-size: 13px;
}
</style>

<style lang="scss">
.tippy-box[data-theme~='popover'] {
  border: 0;
  outline: 0;
}
</style>