<template>
  <div 
    class="editable-element-text" 
    ref="elementRef"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
    }"
    @mousedown="$event => handleSelectElement($event)"
  >
    <div 
      class="element-content"
      :style="{
        backgroundColor: elementInfo.fill,
        opacity: elementInfo.opacity,
        textShadow: shadowStyle,
      }"
      v-contextmenu="contextmenus"
    >
      <ElementOutline
        :width="elementInfo.width"
        :height="elementInfo.height"
        :outline="elementInfo.outline"
      />
      <div 
        class="text"
        ref="editorViewRef"
        @mousedown="$event => handleSelectElement($event, false)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { EditorView } from 'prosemirror-view'
import { PPTTextElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { initProsemirrorEditor, createDocument } from '@/prosemirror/'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '@/views/components/element/ElementOutline.vue'

export default defineComponent({
  name: 'editable-element-text',
  components: {
    ElementOutline,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTTextElement>,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTTextElement, canMove?: boolean) => void>,
      required: true,
    },
    contextmenus: {
      type: Function as PropType<() => ContextmenuItem[]>,
    },
  },
  setup(props) {
    const store = useStore<State>()
    const { addHistorySnapshot } = useHistorySnapshot()

    const elementRef = ref<HTMLElement | null>(null)

    const debounceUpdateTextElementHeight = debounce(function(realHeight) {
      store.commit(MutationTypes.UPDATE_ELEMENT, {
        id: props.elementInfo.id,
        props: { height: realHeight },
      })
    }, 500, { trailing: true })

    const updateTextElementHeight = () => {
      if(!elementRef.value) return

      const realHeight = elementRef.value.clientHeight
      if(props.elementInfo.height !== realHeight) {
        debounceUpdateTextElementHeight(realHeight)
      }
    }
    const resizeObserver = new ResizeObserver(updateTextElementHeight)

    onMounted(() => {
      if(elementRef.value) resizeObserver.observe(elementRef.value)
    })
    onUnmounted(() => {
      if(elementRef.value) resizeObserver.unobserve(elementRef.value)
    })
    
    const editorViewRef = ref<Element | null>(null)
    let editorView: EditorView

    const handleFocus = () => {
      store.commit(MutationTypes.SET_DISABLE_HOTKEYS_STATE, true)
    }
    const handleBlur = () => {
      store.commit(MutationTypes.SET_DISABLE_HOTKEYS_STATE, false)
    }
    const handleInput = debounce(function() {
      store.commit(MutationTypes.UPDATE_ELEMENT, {
        id: props.elementInfo.id, 
        props: { content: editorView.dom.innerHTML },
      })
      addHistorySnapshot()
    }, 500, { trailing: true })

    const textContent = computed(() => props.elementInfo.content)
    watch(textContent, () => {
      if(!editorView) return
      if(editorView.hasFocus()) return
      editorView.dom.innerHTML = textContent.value
    })

    onMounted(() => {
      editorView = initProsemirrorEditor((editorViewRef.value as Element), textContent.value, {
        handleDOMEvents: {
          focus: handleFocus,
          blur: handleBlur,
          keydown: handleInput,
        },
      })
    })
    onUnmounted(() => {
      editorView && editorView.destroy()
    })

    const handleSelectElement = (e: MouseEvent, canMove = true) => {
      if(props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo, canMove)
    }
    
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    return {
      elementRef,
      editorViewRef,
      handleSelectElement,
      shadowStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-text {
  position: absolute;
  cursor: move;

  &.lock .element-content {
    cursor: default;
  }
}

.element-content {
  position: relative;
  padding: 10px;
  line-height: 1.5;

  .text {
    position: relative;
    cursor: text;
  }
}
</style>
