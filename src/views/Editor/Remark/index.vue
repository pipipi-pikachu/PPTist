<template>
  <div class="remark">
    <div class="resize-handler"></div>
    <!-- <Editor
      :value="remark"
      ref="editorRef"
      @update="value => handleInput(value)"
    /> -->
    <div class="attribution-block">
      <LicensePopup 
        originalProjectName="PPTist"
        githubRepositoryLink="https://github.com/ninode97/PPTist"
        copyrightNotices="AGPL-3.0 License | Copyright © 2020-PRESENT pipipi-pikachu"
      />
        &nbsp;&nbsp;
        <a class="github-link" v-tooltip="'Copyright © 2020-PRESENT pipipi-pikachu'" href="https://github.com/ninode97/PPTist" target="_blank">
          <div class="menu-item"><IconGithub fill="#111" class="icon" /></div>
        </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import LicensePopup from './License.vue'

import Editor from './Editor.vue'

const props = defineProps<{
  height: number
}>()

const emit = defineEmits<{
  (event: 'update:height', payload: number): void
}>()

const slidesStore = useSlidesStore()
const { currentSlide } = storeToRefs(slidesStore)

const editorRef = ref<InstanceType<typeof Editor>>()
// watch(() => currentSlide.value.id, () => {
//   nextTick(() => {
//     editorRef.value!.updateTextContent()
//   })
// }, {
//   immediate: true,
// })

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
  background: $lightGray;
  // border-top: 1px solid $borderColor;
}
.resize-handler {
  height: 7px;
  position: absolute;
  top: -3px;
  left: 0;
  right: 0;
  cursor: n-resize;
  z-index: 2;
}
.attribution-block {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  align-items: center;
  height: 100%;

  .license-link {
    font-size: 12px;
    color: gray;
    &:hover {
      text-decoration: underline;
    }
  }

  .github-link {
  
    top: 0.5%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid gainsboro;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    &:hover {
    opacity: 0.5;
  }
  }
}
</style>