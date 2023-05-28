<template>
  <div class="media-input">
    <div class="tabs">
      <div
        class="tab"
        :class="{ 'active': type === tab.key }"
        v-for="tab in tabs"
        :key="tab.key"
        @click="type = tab.key"
      >{{t(tab.label)}}</div>
    </div>

    <template v-if="type === 'video'">
      <Input v-model:value="videoSrc" :placeholder="t('mediaInput.videoPlaceholder')"></Input>
      <div class="btns">
        <Button @click="emit('close')" style="margin-right: 10px;">{{t('common.cancel')}}</Button>
        <Button type="primary" @click="insertVideo()">{{t('common.confirm')}}</Button>
      </div>
    </template>

    <template v-if="type === 'audio'">
      <Input v-model:value="audioSrc" :placeholder="t('mediaInput.audioPlaceholder')"></Input>
      <div class="btns">
        <Button @click="emit('close')" style="margin-right: 10px;">{{t('common.cancel')}}</Button>
        <Button type="primary" @click="insertAudio()">{{t('common.confirm')}}</Button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Button,
  Input,
  message,
} from 'ant-design-vue'
import usei18n from '@/hooks/usei18n'

type TypeKey = 'video' | 'audio'
interface TabItem {
  key: TypeKey
  label: string
}

const {t} = usei18n()
const emit = defineEmits<{
  (event: 'insertVideo', payload: string): void
  (event: 'insertAudio', payload: string): void
  (event: 'close'): void
}>()

const type = ref<TypeKey>('video')

const videoSrc = ref('https://mazwai.com/videvo_files/video/free/2019-01/small_watermarked/181004_04_Dolphins-Whale_06_preview.webm')
const audioSrc = ref('https://freesound.org/data/previews/614/614107_11861866-lq.mp3')

const tabs: TabItem[] = [
  { key: 'video', label: 'mediaInput.video' },
  { key: 'audio', label: 'mediaInput.audio' },
]

const insertVideo = () => {
  if (!videoSrc.value) return message.error(t('mediaInput.videoError'))
  emit('insertVideo', videoSrc.value)
}

const insertAudio = () => {
  if (!audioSrc.value) return message.error(t('mediaInput.audioError'))
  emit('insertAudio', audioSrc.value)
}
</script>

<style lang="scss" scoped>
.media-input {
  width: 480px;
}
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
.btns {
  margin-top: 10px;
  text-align: right;
}
</style>
