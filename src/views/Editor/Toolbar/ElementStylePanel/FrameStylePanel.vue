<template>
  <div class="frame-style-panel">
    <div class="row">
      <div>网页链接：</div>
      <Input v-model:value="url" placeholder="请输入网页链接" />
      <Button @click="updateURL()">确定</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

const slidesStore = useSlidesStore()
const { handleElementId } = storeToRefs(useMainStore())

const { addHistorySnapshot } = useHistorySnapshot()

const url = ref('')

const updateURL = () => {
  if (!handleElementId.value) return
  slidesStore.updateElement({ id: handleElementId.value, props: { url: url.value } })
  addHistorySnapshot()
}
</script>