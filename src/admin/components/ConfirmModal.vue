<template>
  <n-modal
    :show="show"
    :mask-closable="!loading"
    :close-on-esc="!loading"
    transform-origin="center"
    aria-labelledby="confirm-title"
    @update:show="v => $emit('update:show', v)"
  >
    <div class="modal-card" role="alertdialog" aria-modal="true" aria-describedby="confirm-desc">
      <div class="modal-head">
        <div class="head-row">
          <div class="warn-badge"><IconWarn /></div>
          <h2 class="modal-title" id="confirm-title">{{ title }}</h2>
        </div>
        <button class="modal-close" type="button" aria-label="关闭" @click="close">
          <IconClose />
        </button>
      </div>

      <div class="modal-body" id="confirm-desc">
        <p class="line" v-for="(line, i) in lines" :key="i">{{ line }}</p>

        <div class="modal-actions">
          <n-button secondary :disabled="loading" @click="close">取消</n-button>
          <n-button type="error" :loading="loading" @click="$emit('confirm')">{{ confirmText }}</n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { NButton, NModal } from 'naive-ui'

import { IconClose, IconWarn } from '../icons'

const props = defineProps<{
  show: boolean
  title: string
  lines: string[]
  confirmText: string
  loading: boolean
}>()
const emit = defineEmits<{
  'update:show': [show: boolean]
  'confirm': []
}>()

function close() {
  if (props.loading) return
  emit('update:show', false)
}
</script>

<style scoped>
.modal-card {
  width: 440px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 16px;
  box-shadow: var(--adm-shadow-lg);
  overflow: hidden;
}
.modal-head {
  padding: 20px 22px 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.head-row { display: flex; align-items: center; gap: 10px; min-width: 0; }
.warn-badge {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--adm-red-soft);
  color: var(--adm-red);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.warn-badge svg { width: 17px; height: 17px; }
.modal-title { margin: 0; font-size: 17px; font-weight: 700; }
.modal-close {
  width: 30px;
  height: 30px;
  border: none;
  background: var(--adm-surface-muted);
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: var(--adm-ink-3);
  cursor: pointer;
  flex-shrink: 0;
}
.modal-close:hover { color: var(--adm-ink); }
.modal-close svg { width: 14px; height: 14px; }
.modal-body { padding: 4px 22px 20px; }
.line { margin: 0 0 8px; font-size: 13px; color: var(--adm-ink-2); line-height: 1.55; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
</style>
