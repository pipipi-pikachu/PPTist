<template>
  <div class="remark">
    <div 
      class="resize-handler"
      @mousedown="$event => resize($event)"
    >
      <div class="drag-handler">
        <Drag size="14"/>
      </div>
    </div>
    <Editor
      :value="remark"
      ref="editorRef"
      @update="value => handleInput(value)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'

import Editor from './Editor.vue'
import { Drag } from '@icon-park/vue-next'

const props = defineProps<{
  height: number
}>()

const emit = defineEmits<{
  (event: 'update:height', payload: number): void
}>()

const slidesStore = useSlidesStore()
const { currentSlide } = storeToRefs(slidesStore)

const editorRef = ref<InstanceType<typeof Editor>>()
watch(() => currentSlide.value.id, () => {
  nextTick(() => {
    editorRef.value!.updateTextContent()
  })
}, {
  immediate: true,
})

const remark = computed(() => currentSlide.value?.remark || '')

const handleInput = (content: string) => {
  slidesStore.updateSlide({ remark: content })
}

const resize = (e: MouseEvent) => {
  let isMouseDown = true
  const startPageY = e.pageY
  const originHeight = props.height

  document.onmousemove = e => {
    if (!isMouseDown) return

    const currentPageY = e.pageY

    const moveY = currentPageY - startPageY
    let newHeight = -moveY + originHeight

    if (newHeight < 40) newHeight = 40
    if (newHeight > 360) newHeight = 360

    emit('update:height', newHeight)
  }

  document.onmouseup = () => {
    isMouseDown = false
    document.onmousemove = null
    document.onmouseup = null
  }
}
</script>

<style lang="scss" scoped>
.remark {
  position: relative;
  border-top: 1px solid $borderColor;
}
.resize-handler {
  height: 7px;
  position: absolute;
  left: 0;
  right: 0;
  cursor: n-resize;
  z-index: 2;

  &:hover {
    .drag-handler {
      opacity: 1;
    }
  }

  .drag-handler {
    position: absolute;
    display: flex;
    background-color:rgba(240, 243, 243, 1) ;
    height: 28px;
    width: 14px;
    align-items: center;
    justify-content: center;
    border-radius: 4px 0 0 4px;
    bottom:1px;
    left: 50%;
    transform-origin: center center;
    transform: rotate(90deg)translateY(10px);
    opacity: 0;
    transition: opacity 0.2s ease;

  }
}
</style>