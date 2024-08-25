<template>
  <div class="link-dialog">
    <Tabs 
      :tabs="tabs" 
      v-model:value="type"
      :tabsStyle="{ marginBottom: '20px' }" 
    />

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
      :options="slideOptions"
    />

    <div class="preview" v-if="type === 'slide' && selectedSlide">
      <div>预览：</div>
      <ThumbnailSlide class="thumbnail" :slide="selectedSlide" :size="500" />
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
import type { ElementLinkType, PPTElementLink } from '@/types/slides'
import useLink from '@/hooks/useLink'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import Tabs from '@/components/Tabs.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Select from '@/components/Select.vue'

interface TabItem {
  key: ElementLinkType
  label: string
}

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { handleElement } = storeToRefs(useMainStore())
const { slides, currentSlide } = storeToRefs(useSlidesStore())

const type = ref<ElementLinkType>('web')
const address = ref('')
const slideId = ref('')

const slideOptions = computed(() => {
  return slides.value.map((item, index) => ({
    label: `幻灯片 ${index + 1}`,
    value: item.id,
    disabled: currentSlide.value.id === item.id,
  }))
})

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
.link-dialog {
  font-size: 13px;
  line-height: 1.675;
}
.input {
  width: 100%;
  height: 32px;
}
.preview {
  margin-top: 12px;
}
.thumbnail {
  border: 1px solid rgba($color: $themeColor, $alpha: .15);
  margin-top: 5px;
  border-radius: $borderRadius;
}
.btns {
  margin-top: 20px;
  text-align: right;
}
</style>