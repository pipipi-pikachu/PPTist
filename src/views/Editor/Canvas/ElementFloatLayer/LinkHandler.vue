<template>
  <div class="link-handler" :style="handlerStyle">
    <a class="link" v-if="elementInfo.link?.type === 'web'" :href="elementInfo.link.target" target="_blank">{{elementInfo.link.target}}</a>
    <a class="link" v-else-if="elementInfo.link" @click="turnTarget(elementInfo.link.target)">幻灯片页面 {{elementInfo.link.target}}</a>
    <div class="btns">
      <div class="btn" @click="openLinkDialog()">更换</div>
      <Divider type="vertical" />
      <div class="btn" @click="removeLink(elementInfo)">移除</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import useLink from '@/hooks/useLink'
import Divider from '@/components/Divider.vue'

defineProps<{
  elementInfo: PPTElement
  handlerStyle: Record<string, string>
  openLinkDialog: () => void
}>()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { slides } = storeToRefs(slidesStore)
const { removeLink } = useLink()

const turnTarget = (slideId: string) => {
  const targetIndex = slides.value.findIndex(item => item.id === slideId)
  if (targetIndex !== -1) {
    mainStore.setActiveElementIdList([])
    slidesStore.updateSlideIndex(targetIndex)
  }
}
</script>

<style lang="scss" scoped>
.link-handler {
  height: 30px;
  position: absolute;
  font-size: 12px;
  padding: 0 10px;
  background-color: #fff;
  box-shadow: $boxShadow;
  display: flex;
  align-items: center;
  color: $themeColor;
  border-radius: $borderRadius;
}
.link {
  max-width: 300px;
  margin-right: 20px;
  word-break: keep-all;
  white-space: nowrap;
  cursor: pointer;

  @include ellipsis-oneline();
}
.btns {
  display: flex;
  align-items: center;

  .btn {
    word-break: keep-all;
    cursor: pointer;
  }
}
</style>
