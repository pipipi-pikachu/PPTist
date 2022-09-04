<template>
  <div class="link-dialog">
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ 'active': type === tab.key }" 
        v-for="tab in tabs" 
        :key="tab.key"
        @click="type = tab.key"
      >{{tab.label}}</div>
    </div>

    <Input 
      class="input"
      v-if="type === 'web'" 
      v-model:value="address" 
      placeholder="请输入网页链接地址"
    />

    <Select 
      class="input"
      v-if="type === 'slide'"
      v-model:value="slideId"
    >
      <SelectOption 
        v-for="(slide, index) in slides" 
        :key="slide.id" 
        :value="slide.id" 
        :disabled="currentSlide.id === slide.id"
      >幻灯片 {{index + 1}}</SelectOption>
    </Select>

    <div class="preview" v-if="type === 'slide' && selectedSlide">
      <div>预览：</div>
      <ThumbnailSlide class="thumbnail" :slide="selectedSlide" :size="490" />
    </div>

    <div class="btns">
      <Button @click="emit('close')" style="margin-right: 10px;">取消</Button>
      <Button type="primary" @click="save()">确认</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElementLink } from '@/types/slides'
import useLink from '@/hooks/useLink'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

type TypeKey = 'web' | 'slide'
interface TabItem {
  key: TypeKey
  label: string
}

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { handleElement } = storeToRefs(useMainStore())
const { slides, currentSlide } = storeToRefs(useSlidesStore())

const type = ref<TypeKey>('web')
const address = ref('')
const slideId = ref('')

slideId.value = slides.value.find(item => item.id !== currentSlide.value.id)?.id || ''

const selectedSlide = computed(() => {
  if (!slideId.value) return null

  return slides.value.find(item => item.id === slideId.value) || null
})

const tabs: TabItem[] = [
  { key: 'web', label: '网页链接' },
  { key: 'slide', label: '幻灯片页面' },
]

const { setLink } = useLink()

onMounted(() => {
  if (handleElement.value?.link) {
    if (handleElement.value.link.type === 'web') address.value = handleElement.value.link.target
    else if (handleElement.value.link.type === 'slide') slideId.value = handleElement.value.link.target

    type.value = handleElement.value.link.type
  }
})

const save = () => {
  const link: PPTElementLink = {
    type: type.value,
    target: type.value === 'web' ? address.value : slideId.value,
  }
  if (handleElement.value) {
    const success = setLink(handleElement.value, link)
    if (success) emit('close')
    else address.value = ''
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid $borderColor;
  margin-bottom: 20px;
}
.tab {
  padding: 0 10px 8px;
  border-bottom: 2px solid transparent;
  cursor: pointer;

  &.active {
    border-bottom: 2px solid $themeColor;
  }
}
.input {
  width: 100%;
  height: 32px;
}
.preview {
  margin-top: 12px;
}
.thumbnail {
  outline: 1px solid rgba($color: $themeColor, $alpha: .15);
  margin-top: 5px;
}
.btns {
  margin-top: 20px;
  text-align: right;
}
</style>