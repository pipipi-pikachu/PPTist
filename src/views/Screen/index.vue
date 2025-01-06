<template>
  <div class="pptist-screen">
    <BaseView :changeViewMode="changeViewMode" v-if="screeningMode === 'base'" />
    <PresenterView :changeViewMode="changeViewMode" v-else-if="screeningMode === 'presenter'" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { KEYS } from '@/configs/hotkey'
import useScreening from '@/hooks/useScreening'

import BaseView from './BaseView.vue'
import PresenterView from './PresenterView.vue'
import { useScreenStore } from '@/store'
import { storeToRefs } from 'pinia'

const screenStore = useScreenStore()
const { screeningMode } = storeToRefs(screenStore)

const changeViewMode = (mode: 'base' | 'presenter') => {
  screenStore.changeScreeningMode(mode)
}

const { exitScreening } = useScreening()

// 快捷键退出放映
const keydownListener = (e: KeyboardEvent) => {
  const key = e.key.toUpperCase()
  if (key === KEYS.ESC) exitScreening()
}

onMounted(() => document.addEventListener('keydown', keydownListener))
onUnmounted(() => document.removeEventListener('keydown', keydownListener))
</script>

<style lang="scss" scoped>
.pptist-screen {
  width: 100%;
  height: 100%;
}
</style>