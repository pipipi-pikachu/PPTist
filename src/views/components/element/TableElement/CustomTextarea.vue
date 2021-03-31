<template>
  <div 
    class="custom-textarea"
    ref="textareaRef"
    :contenteditable="contenteditable"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="$event => handleInput($event)"
    v-html="text"
  ></div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref, watch } from 'vue'

export default defineComponent({
  name: 'custom-textarea',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    contenteditable: {
      type: [Boolean, String],
      default: false,
    },
  },
  setup(props, { emit }) {
    const textareaRef = ref<HTMLElement>()
    const text = ref('')
    const isFocus = ref(false)

    // 自定义v-modal，同步数据
    // 当文本框聚焦时，不执行数据同步
    watch(() => props.modelValue, () => {
      if (isFocus.value) return
      text.value = props.modelValue
      if (textareaRef.value) textareaRef.value.innerHTML = props.modelValue
    }, { immediate: true })

    const handleInput = () => {
      if (!textareaRef.value) return
      const text = textareaRef.value.innerHTML
      emit('update:modelValue', text)
    }

    // 聚焦时更新焦点标记，并监听粘贴事件
    const handleFocus = () => {
      isFocus.value = true

      if (!textareaRef.value) return
      textareaRef.value.onpaste = (e: ClipboardEvent) => {
        e.preventDefault()
        if (!e.clipboardData) return

        const clipboardDataFirstItem = e.clipboardData.items[0]

        if (clipboardDataFirstItem && clipboardDataFirstItem.kind === 'string' && clipboardDataFirstItem.type === 'text/plain') {
          clipboardDataFirstItem.getAsString(text => emit('update:modelValue', text))
        }
      }
    }

    // 失焦时更新焦点标记，清除粘贴事件监听
    const handleBlur = () => {
      isFocus.value = false
      if (textareaRef.value) textareaRef.value.onpaste = null
    }

    // 清除粘贴事件监听
    onUnmounted(() => {
      if (textareaRef.value) textareaRef.value.onpaste = null
    })

    return {
      textareaRef,
      handleFocus,
      handleInput,
      handleBlur,
      text,
    }
  },
})
</script>

<style lang="scss" scoped>
.custom-textarea {
  border: 0;
  outline: 0;
}
</style>