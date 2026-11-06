<template>
  <n-modal
    :show="show"
    :mask-closable="!loading"
    :close-on-esc="!loading"
    transform-origin="center"
    aria-labelledby="create-key-title"
    @update:show="v => $emit('update:show', v)"
  >
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-head">
        <div>
          <h2 class="modal-title" id="create-key-title">创建新 Key</h2>
          <p class="modal-sub">用户 {{ userName }} · 建议每个 Agent 一把 Key</p>
        </div>
        <button class="modal-close" type="button" aria-label="关闭" @click="close">
          <IconClose />
        </button>
      </div>

      <div class="modal-body">
        <div class="alert" role="alert" v-if="errorMsg">{{ errorMsg }}</div>
        <div class="field">
          <label for="ck-label">标签</label>
          <n-input
            id="ck-label"
            v-model:value="label"
            placeholder="例如 Grok Bot、Hermes（可选）"
            :disabled="loading"
            :input-props="{ autocomplete: 'off', maxlength: '100' }"
            autofocus
            @keydown.enter="submit"
          />
          <div class="field-hint">标签用于区分这把 Key 发给哪个 Agent</div>
        </div>

        <div class="modal-actions">
          <n-button secondary :disabled="loading" @click="close">取消</n-button>
          <n-button type="primary" :loading="loading" @click="submit">创建 Key</n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { NButton, NInput, NModal } from 'naive-ui'

import { ApiError } from '../api'
import { IconClose } from '../icons'
import { useAdminStore } from '../store'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{
  'update:show': [show: boolean]
  'created': [payload: { key?: string, label: string | null }]
}>()

const store = useAdminStore()
const userName = computed(() => store.selectedUser?.name ?? '')

const label = ref('')
const loading = ref(false)
const errorMsg = ref('')

watch(() => props.show, v => {
  if (v) {
    label.value = ''
    errorMsg.value = ''
  }
})

function close() {
  if (loading.value) return
  emit('update:show', false)
}

async function submit() {
  if (loading.value) return
  loading.value = true
  errorMsg.value = ''
  const trimmed = label.value.trim()
  try {
    const res = await store.createKey(trimmed || null)
    emit('update:show', false)
    emit('created', { key: res.key, label: trimmed || null })
  }
  catch (err) {
    errorMsg.value = err instanceof ApiError ? err.message : '创建失败，请稍后重试'
  }
  finally {
    loading.value = false
  }
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
.modal-title { margin: 0; font-size: 18px; font-weight: 700; }
.modal-sub { margin: 4px 0 0; font-size: 13px; color: var(--adm-ink-3); }
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
.alert {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--adm-red-soft);
  border: 1px solid #F0C9D1;
  color: var(--adm-red);
  font-size: 12.5px;
}
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.field label { font-size: 12.5px; color: var(--adm-ink-2); font-weight: 600; }
.field-hint { font-size: 11.5px; color: var(--adm-ink-4); }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
</style>
