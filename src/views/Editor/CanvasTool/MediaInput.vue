<template>
  <div class="media-input">
    <Tabs 
      :tabs="tabs" 
      v-model:value="type" 
      :tabsStyle="{ marginBottom: '15px' }" 
    />

    <template v-if="type === 'video'">
      <Input v-model:value="videoSrc" placeholder="请输入视频地址，e.g. https://xxx.mp4"></Input>
      <div class="btns">
        <FileInput accept="video/*" @change="files => uploadVideo(files)">
          <Button>上传本地视频</Button>
        </FileInput>
        <div class="group">
          <Button @click="emit('close')" style="margin-right: 10px;">取消</Button>
          <Button type="primary" @click="insertVideo()">确认</Button>
        </div>
      </div>
    </template>

    <template v-if="type === 'audio'">
      <Input v-model:value="audioSrc" placeholder="请输入音频地址，e.g. https://xxx.mp3"></Input>
      <div class="btns">
        <FileInput accept="audio/*" @change="files => uploadAudio(files)">
          <Button>上传本地音频</Button>
        </FileInput>
        <div class="group">
          <Button @click="emit('close')" style="margin-right: 10px;">取消</Button>
          <Button type="primary" @click="insertAudio()">确认</Button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import message from '@/utils/message'
import Tabs from '@/components/Tabs.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import FileInput from '@/components/FileInput.vue'

const MIME_MAP: { [key: string]: string } = {

  // 音频类型
  'audio/aac': 'aac',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'oga',
  'audio/wav': 'wav',
  'audio/webm': 'weba',
  'audio/flac': 'flac',
  'audio/mp4': 'm4a',
  'audio/x-aiff': 'aif',
  'audio/x-ms-wma': 'wma',
  'audio/midi': 'mid',

  // 视频类型
  'video/mp4': 'mp4',
  'video/mpeg': 'mpeg',
  'video/ogg': 'ogv',
  'video/webm': 'webm',
  'video/x-msvideo': 'avi',
  'video/quicktime': 'mov',
  'video/x-ms-wmv': 'wmv',
  'video/x-flv': 'flv',
  'video/3gpp': '3gp',
  'video/3gpp2': '3g2'
}

type TypeKey = 'video' | 'audio'
interface TabItem {
  key: TypeKey
  label: string
}

const emit = defineEmits<{
  (event: 'insertVideo', payload: { src: string, ext?: string }): void
  (event: 'insertAudio', payload: { src: string, ext?: string }): void
  (event: 'close'): void
}>()

const type = ref<TypeKey>('video')

const videoSrc = ref('https://videos.pexels.com/video-files/29261597/12623866_640_360_24fps.mp4')
const audioSrc = ref('https://freesound.org/data/previews/614/614107_11861866-lq.mp3')

const tabs: TabItem[] = [
  { key: 'video', label: '视频' },
  { key: 'audio', label: '音频' },
]

const insertVideo = () => {
  if (!videoSrc.value) return message.error('请先输入正确的视频地址')
  emit('insertVideo', { src: videoSrc.value })
}

const insertAudio = () => {
  if (!audioSrc.value) return message.error('请先输入正确的音频地址')
  emit('insertAudio', { src: audioSrc.value })
}

const uploadVideo = (files: FileList) => {
  const file = files[0]
  if (!file) return
  const ext = MIME_MAP[file.type] || ''
  emit('insertVideo', { src: URL.createObjectURL(file), ext })
}

const uploadAudio = (files: FileList) => {
  const file = files[0]
  if (!file) return
  const ext = MIME_MAP[file.type] || ''
  emit('insertAudio', { src: URL.createObjectURL(file), ext })
}
</script>

<style lang="scss" scoped>
.media-input {
  width: 480px;
}
.btns {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
