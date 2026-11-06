<template>
  <n-modal
    :show="show"
    :mask-closable="false"
    transform-origin="center"
    aria-labelledby="new-key-title"
    @update:show="v => { if (!v) $emit('close') }"
  >
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-head">
        <div>
          <h2 class="modal-title" id="new-key-title">新 Key 已创建</h2>
          <p class="modal-sub">标签 {{ keyLabel }}</p>
        </div>
        <button class="modal-close" type="button" aria-label="关闭" @click="$emit('close')">
          <IconClose />
        </button>
      </div>

      <div class="modal-body">
        <div class="once-banner">
          <IconWarn class="once-icon" />
          <div>
            <strong>仅此一次</strong>
            <p>完整密钥只会显示这一次。请立即复制到密码管理器；关闭后无法再次查看完整内容。</p>
          </div>
        </div>

        <div class="key-box">
          <div class="key-box-label">API Key</div>
          <div class="key-value">{{ apiKey }}</div>
        </div>

        <div class="modal-actions">
          <n-button secondary @click="$emit('close')">关闭</n-button>
          <n-button type="primary" @click="copy">
            <template #icon><IconCopy /></template>
            {{ copied ? '已复制' : '复制密钥' }}
          </n-button>
        </div>
        <div class="modal-meta">泄露时请立即吊销后重发；服务端只保存其散列值</div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { NButton, NModal, useMessage } from 'naive-ui'

import { IconClose, IconCopy, IconWarn } from '../icons'

const props = defineProps<{ show: boolean, apiKey: string, keyLabel: string }>()
defineEmits<{ 'close': [] }>()

const message = useMessage()
const copied = ref(false)

watch(() => props.show, v => {
  if (v) copied.value = false
})

async function copy() {
  try {
    await navigator.clipboard.writeText(props.apiKey)
  }
  catch {
    // 非安全上下文（如 http 局域网）退回 execCommand
    const el = document.createElement('textarea')
    el.value = props.apiKey
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    el.remove()
  }
  copied.value = true
  message.success('已复制到剪贴板')
}
</script>

<style scoped>
.modal-card {
  width: 480px;
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

.once-banner {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 13px;
  background: var(--adm-orange-soft);
  border: 1px solid #F3D2B8;
  border-radius: 10px;
  margin-bottom: 14px;
}
.once-icon { width: 18px; height: 18px; color: var(--adm-orange); flex-shrink: 0; margin-top: 1px; }
.once-banner strong { display: block; font-size: 13px; color: var(--adm-orange); margin-bottom: 2px; }
.once-banner p { margin: 0; font-size: 12.5px; color: #8A5430; line-height: 1.45; }

.key-box {
  border: 1px solid var(--adm-line-strong);
  background: #FAFBFC;
  border-radius: 12px;
  padding: 14px;
}
.key-box-label { font-size: 12px; color: var(--adm-ink-3); font-weight: 500; margin-bottom: 8px; }
.key-value {
  font-family: var(--adm-mono);
  font-size: 13.5px;
  color: var(--adm-ink);
  word-break: break-all;
  line-height: 1.55;
  background: #fff;
  border: 1px dashed #E0A36A;
  border-radius: 8px;
  padding: 12px;
  user-select: all;
}
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.modal-meta { margin-top: 12px; font-size: 12px; color: var(--adm-ink-4); }
</style>
