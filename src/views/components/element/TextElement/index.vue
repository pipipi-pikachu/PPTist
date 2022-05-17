<template>
  <div 
    class="editable-element-text" 
    ref="elementRef"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div 
        class="element-content"
        :style="{
          backgroundColor: elementInfo.fill,
          opacity: elementInfo.opacity,
          textShadow: shadowStyle,
          lineHeight: elementInfo.lineHeight,
          letterSpacing: (elementInfo.wordSpace || 0) + 'px',
          color: elementInfo.defaultColor,
          fontFamily: elementInfo.defaultFontName,
        }"
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)"
      >
        <ElementOutline
          :width="elementInfo.width"
          :height="elementInfo.height"
          :outline="elementInfo.outline"
        />
        <ProsemirrorEditor
          class="text"
          :elementId="elementInfo.id"
          :defaultColor="elementInfo.defaultColor"
          :defaultFontName="elementInfo.defaultFontName"
          :editable="!elementInfo.lock"
          :value="elementInfo.content"
          @update="value => updateContent(value)"
          @blur="checkEmptyText()"
          @mousedown="$event => handleSelectElement($event, false)"
        />

        <!-- 当字号过大且行高较小时，会出现文字高度溢出的情况，导致拖拽区域无法被选中，因此添加了以下节点避免该情况 -->
        <div class="drag-handler top"></div>
        <div class="drag-handler bottom"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTTextElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '@/views/components/element/ElementOutline.vue'
import ProsemirrorEditor from '@/views/components/element/ProsemirrorEditor.vue'

export default defineComponent({
  name: 'editable-element-text',
  components: {
    ElementOutline,
    ProsemirrorEditor,
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
    const mainStore = useMainStore()
    const slidesStore = useSlidesStore()
    const { handleElementId, isScaling } = storeToRefs(mainStore)
    
    const { addHistorySnapshot } = useHistorySnapshot()

    const elementRef = ref<HTMLElement>()

    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    const handleSelectElement = (e: MouseEvent, canMove = true) => {
      if (props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo, canMove)
    }

    // 监听文本元素的尺寸变化，当高度变化时，更新高度到vuex
    // 如果高度变化时正处在缩放操作中，则等待缩放操作结束后再更新
    const realHeightCache = ref(-1)

    watch(isScaling, () => {
      if (handleElementId.value !== props.elementInfo.id) return

      if (!isScaling.value && realHeightCache.value !== -1) {
        slidesStore.updateElement({
          id: props.elementInfo.id,
          props: { height: realHeightCache.value },
        })
        realHeightCache.value = -1
      }
    })

    const updateTextElementHeight = (entries: ResizeObserverEntry[]) => {
      const contentRect = entries[0].contentRect
      if (!elementRef.value) return

      const realHeight = contentRect.height

      if (props.elementInfo.height !== realHeight) {
        if (!isScaling.value) {
          slidesStore.updateElement({
            id: props.elementInfo.id,
            props: { height: realHeight },
          })
        }
        else realHeightCache.value = realHeight
      }
    }
    const resizeObserver = new ResizeObserver(updateTextElementHeight)

    onMounted(() => {
      if (elementRef.value) resizeObserver.observe(elementRef.value)
    })
    onUnmounted(() => {
      if (elementRef.value) resizeObserver.unobserve(elementRef.value)
    })

    const updateContent = (content: string) => {
      slidesStore.updateElement({
        id: props.elementInfo.id,
        props: { content },
      })
      
      addHistorySnapshot()
    }

    const checkEmptyText = () => {
      const pureText = props.elementInfo.content.replaceAll(/<[^>]+>/g, '')
      if (!pureText) slidesStore.deleteElement(props.elementInfo.id)
    }

    return {
      elementRef,
      shadowStyle,
      updateContent,
      handleSelectElement,
      checkEmptyText,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-text {
  position: absolute;

  &.lock .element-content {
    cursor: default;
  }
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  position: relative;
  padding: 10px;
  line-height: 1.5;
  word-break: break-word;
  cursor: move;

  .text {
    position: relative;
  }

  ::v-deep(a) {
    cursor: text;
  }
}
.drag-handler {
  height: 10px;
  position: absolute;
  left: 0;
  right: 0;

  &.top {
    top: 0;
  }
  &.bottom {
    bottom: 0;
  }
}
</style>
