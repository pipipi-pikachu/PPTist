<template>
  <div class="pptist-screen">
    <BaseView :changeViewMode="changeViewMode" v-if="viewMode === 'base'" />
    <PresenterView :changeViewMode="changeViewMode" v-else-if="viewMode === 'presenter'" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { KEYS } from '@/configs/hotkey'
import useScreening from '@/hooks/useScreening'

import BaseView from './BaseView.vue'
import PresenterView from './PresenterView.vue'


import { useSlidesStore } from '@/store/slides'

const viewMode = ref<'base' | 'presenter'>('base')

const changeViewMode = (mode: 'base' | 'presenter') => {
  viewMode.value = mode
}

const router = useRouter()
const slidesStore = useSlidesStore()

const { exitScreening } = useScreening()

// 快捷键退出放映
const keydownListener = (e: KeyboardEvent) => {
  const key = e.key.toUpperCase()
  if (key === KEYS.ESC) exitScreening()
}
onBeforeMount(() => {
  const pptId = router.currentRoute.value.query.id
  const pptData = GlobalPPTs.find((item: any) => item.id == pptId)
  if (pptId) {
    slidesStore.setSlidesData(pptData)
  }
  console.log(pptData)
})
onMounted(() => document.addEventListener('keydown', keydownListener))
onUnmounted(() => document.removeEventListener('keydown', keydownListener))
</script>

<style lang="scss" scoped>
.pptist-screen {
  width: 100%;
  height: 100%;
}
</style>