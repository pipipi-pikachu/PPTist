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

    const handleBlur = () => {
      isFocus.value = false
      if (textareaRef.value) textareaRef.value.onpaste = null
    }

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