<template>
  <div 
    class="editable-div"
    ref="editableDivRef"
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
  name: 'editable-div',
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
    const editableDivRef = ref<HTMLElement>()
    const text = ref('')
    const isFocus = ref(false)

    watch(() => props.modelValue, () => {
      if(isFocus.value) return
      text.value = props.modelValue
      if(editableDivRef.value) editableDivRef.value.innerHTML = props.modelValue
    }, { immediate: true })

    const handleInput = () => {
      if(!editableDivRef.value) return
      const text = editableDivRef.value.innerHTML
      emit('update:modelValue', text)
    }

    const handleFocus = () => {
      isFocus.value = true

      if(!editableDivRef.value) return
      editableDivRef.value.onpaste = (e: ClipboardEvent) => {
        e.preventDefault()
        if(!e.clipboardData) return

        const clipboardDataFirstItem = e.clipboardData.items[0]

        if(clipboardDataFirstItem && clipboardDataFirstItem.kind === 'string' && clipboardDataFirstItem.type === 'text/plain') {
          clipboardDataFirstItem.getAsString(text => emit('update:modelValue', text))
        }
      }
    }

    const handleBlur = () => {
      isFocus.value = false
      if(editableDivRef.value) editableDivRef.value.onpaste = null
    }

    onUnmounted(() => {
      if(editableDivRef.value) editableDivRef.value.onpaste = null
    })

    return {
      editableDivRef,
      handleFocus,
      handleInput,
      handleBlur,
      text,
    }
  },
})
</script>