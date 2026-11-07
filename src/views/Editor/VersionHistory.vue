<template>
  <div class="version-history">
    <Button type="primary" @click="save()">保存当前版本</Button>
    <p>每分钟自动保存，最多保留 30 个版本；浏览器总存储上限 50 MB。</p>
    <div v-if="store.error" role="alert">
      <p>{{ store.error }}</p>
      <Button @click="retry()">重试</Button>
    </div>
    <p v-if="!store.versions.length && !store.error">暂无版本</p>
    <article v-for="version in store.versions" :key="version.id">
      <button class="preview" @click="selected = version; page = 0" :aria-label="`预览 ${formatTime(version.createdAt)}`">
        <ThumbnailSlide
          v-if="version.presentation.slides[0]"
          :slide="version.presentation.slides[0]"
          :size="260"
          :viewportSize="version.presentation.viewportSize"
          :viewportRatio="version.presentation.viewportRatio"
          :theme="version.presentation.theme"
        />
      </button>
      <div>{{ formatTime(version.createdAt) }}</div>
      <p>{{ version.presentation.slides.length }} 页 · {{ labels[version.reason] }}</p>
      <Button :disabled="store.restoring" @click="restore(version)">恢复此版本</Button>
    </article>
    <Modal :visible="!!selected" :width="720" closeButton @closed="selected = undefined">
      <div v-if="selected" class="preview-dialog">
        <h3>{{ selected.presentation.title }}</h3>
        <ThumbnailSlide
          :slide="selected.presentation.slides[page]"
          :size="660"
          :viewportSize="selected.presentation.viewportSize"
          :viewportRatio="selected.presentation.viewportRatio"
          :theme="selected.presentation.theme"
        />
        <div class="navigation">
          <Button :disabled="page === 0" @click="page--">上一页</Button>
          <span>{{ page + 1 }} / {{ selected.presentation.slides.length }}</span>
          <Button :disabled="page >= selected.presentation.slides.length - 1" @click="page++">下一页</Button>
          <Button type="primary" :disabled="store.restoring" @click="restore(selected)">恢复此版本</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVersionsStore } from '@/store/versions'
import type { PresentationVersion } from '@/types/version'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import message from '@/utils/message'

const store = useVersionsStore()
const selected = ref<PresentationVersion>()
const page = ref(0)
const labels = { automatic: '自动保存', manual: '手动保存', 'before-change': '修改前', restore: '恢复' }
const formatTime = (time: number) => new Date(time).toLocaleString()
const save = async () => {
  try {
    await store.save(); message.success('版本已保存')
  }
  catch {
    message.error('版本保存失败，请重试')
  }
}
const retry = async () => {
  try {
    await store.refresh()
  }
  catch {
    message.error('无法读取版本历史，请检查浏览器存储权限')
  }
}
const restore = async (version: PresentationVersion) => {
  try {
    await store.restore(version)
    selected.value = undefined
    message.success('版本已恢复，可撤销此操作')
  }
  catch {
    message.error('恢复未完成，请检查版本历史中的错误后重试')
  }
}
</script>

<style scoped lang="scss">
.version-history {
  padding-bottom: 20px;
  font-size: 13px;
  p { line-height: 1.6; }
  article { padding: 16px 0; border-bottom: 1px solid $borderColor; }
  .preview { padding: 0; border: 1px solid $borderColor; cursor: pointer; margin-bottom: 8px; }
  [role='alert'] { color: #c33; }
}
.preview-dialog { padding: 15px; }
.navigation { display: flex; align-items: center; gap: 12px; margin-top: 16px; }
</style>
