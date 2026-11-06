<template>
  <aside class="panel adm-card" aria-label="用户详情">
    <div class="state-box" v-if="!user">
      <n-empty description="未选择用户" size="small">
        <template #extra>在左侧列表选择一个用户查看详情</template>
      </n-empty>
    </div>

    <template v-else>
      <div class="detail-head">
        <div class="detail-user">
          <div class="adm-avatar avatar" :style="{ background: avatarColor(user.name) }">
            {{ avatarLetter(user.name) }}
          </div>
          <div>
            <div class="detail-name">{{ user.name }}</div>
            <div class="detail-note">{{ user.note || '无备注' }} · {{ user.docs }} 文档</div>
          </div>
        </div>
        <n-button
          size="small"
          secondary
          :disabled="!quotaDirty"
          :loading="savingQuota"
          @click="saveQuota"
        >
          保存配额
        </n-button>
      </div>

      <div class="detail-body">
        <div>
          <div class="section-label">用户状态</div>
          <div class="status-row">
            <div>
              <div class="status-title">当前状态</div>
              <div class="status-sub">MCP 限流：每 Key 60 次/分钟</div>
            </div>
            <span class="adm-pill" :class="user.status === 'active' ? 'adm-pill--ok' : 'adm-pill--off'">
              <span class="adm-pill-dot"></span>{{ user.status === 'active' ? '活跃' : '已停用' }}
            </span>
          </div>
        </div>

        <div>
          <div class="section-label">配额<span class="section-hint">（留空 = 继承全局默认）</span></div>
          <div class="quota-grid">
            <div class="field">
              <label :for="`quota-docs`">文档上限</label>
              <n-input-number
                id="quota-docs"
                v-model:value="quotaForm.docs"
                :min="0"
                :max="1000000"
                :precision="0"
                :show-button="false"
                placeholder="默认 100"
                clearable
              >
                <template #suffix>份</template>
              </n-input-number>
            </div>
            <div class="field">
              <label for="quota-docmb">单份大小</label>
              <n-input-number
                id="quota-docmb"
                v-model:value="quotaForm.docMb"
                :min="0"
                :max="10240"
                :precision="0"
                :show-button="false"
                placeholder="默认 10"
                clearable
              >
                <template #suffix>MB</template>
              </n-input-number>
            </div>
            <div class="field">
              <label for="quota-exports">每日导出</label>
              <n-input-number
                id="quota-exports"
                v-model:value="quotaForm.exportsPerDay"
                :min="0"
                :max="1000000"
                :precision="0"
                :show-button="false"
                placeholder="默认 200"
                clearable
              >
                <template #suffix>次</template>
              </n-input-number>
            </div>
          </div>
        </div>

        <div class="keys-section">
          <div class="keys-head">
            <div class="section-label" style="margin:0">访问密钥</div>
            <n-button
              size="small"
              secondary
              :disabled="user.status !== 'active'"
              :title="user.status !== 'active' ? '用户已停用，请先恢复' : ''"
              @click="$emit('create-key')"
            >
              <template #icon><IconPlus /></template>
              创建新 Key
            </n-button>
          </div>
          <div class="state-box small" v-if="store.keysLoading">
            <n-spin size="small" />
          </div>
          <div class="state-box small" v-else-if="!store.keys.length">
            <span class="muted">暂无 Key，点击「创建新 Key」为 Agent 发放凭证</span>
          </div>
          <table class="key-table" v-else>
            <thead>
              <tr>
                <th>标签</th>
                <th>状态</th>
                <th>创建 / 最近</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="key in store.keys" :key="key.id">
                <td>
                  <div class="key-label">{{ key.label || '未命名' }}</div>
                  <div class="adm-mono key-prefix">{{ key.prefix }}…</div>
                </td>
                <td>
                  <span class="adm-pill" :class="key.revokedAt === null ? 'adm-pill--ok' : 'adm-pill--revoked'">
                    <span class="adm-pill-dot"></span>{{ key.revokedAt === null ? '有效' : '已吊销' }}
                  </span>
                </td>
                <td>
                  <div class="key-date">{{ formatDate(key.createdAt) }}</div>
                  <div class="key-date">{{ relativeTime(key.lastUsedAt) }}</div>
                </td>
                <td>
                  <n-button
                    v-if="key.revokedAt === null"
                    text
                    type="error"
                    size="small"
                    @click="$emit('revoke-key', key)"
                  >
                    吊销
                  </n-button>
                  <span class="muted small-text" v-else>—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="danger-zone">
        <div class="danger-title">危险操作</div>
        <p class="danger-desc" v-if="user.status === 'active'">
          停用此用户会使该用户全部 Key 与文档链接立即失效，Agent 调用与网页端链接都会被拒绝。
        </p>
        <p class="danger-desc" v-else>
          恢复后，未被单独吊销的 Key 与文档链接将重新生效。
        </p>
        <n-button
          size="small"
          :type="user.status === 'active' ? 'error' : 'primary'"
          :secondary="user.status === 'active'"
          @click="$emit('toggle-status', user)"
        >
          {{ user.status === 'active' ? '停用此用户' : '恢复此用户' }}
        </n-button>
      </div>
    </template>
  </aside>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { NButton, NEmpty, NInputNumber, NSpin, useMessage } from 'naive-ui'

import { ApiError } from '../api'
import { avatarColor, avatarLetter, formatDate, relativeTime } from '../format'
import { IconPlus } from '../icons'
import { useAdminStore } from '../store'
import type { AdminKey, AdminUser } from '../types'

defineEmits<{
  'create-key': []
  'revoke-key': [key: AdminKey]
  'toggle-status': [user: AdminUser]
}>()

const store = useAdminStore()
const message = useMessage()
const user = computed(() => store.selectedUser)

// 配额表单：null = 继承默认；与 quotaCustom 对齐判断是否脏
const quotaForm = reactive<{ docs: number | null, docMb: number | null, exportsPerDay: number | null }>({
  docs: null,
  docMb: null,
  exportsPerDay: null,
})

watch(user, u => {
  quotaForm.docs = u?.quotaCustom.docs ?? u?.quota.docs ?? null
  quotaForm.docMb = u?.quotaCustom.docMb ?? u?.quota.docMb ?? null
  quotaForm.exportsPerDay = u?.quotaCustom.exportsPerDay ?? u?.quota.exportsPerDay ?? null
  // 展示生效值而不是原始 null，管理员能直接看到当前实际配额；
  // 清空输入框即可回到继承默认
}, { immediate: true })

const quotaDirty = computed(() => {
  if (!user.value) return false
  const cur = user.value.quotaCustom
  const eff = user.value.quota
  return quotaForm.docs !== (cur.docs ?? eff.docs)
    || quotaForm.docMb !== (cur.docMb ?? eff.docMb)
    || quotaForm.exportsPerDay !== (cur.exportsPerDay ?? eff.exportsPerDay)
})

const savingQuota = ref(false)
async function saveQuota() {
  if (!user.value || !quotaDirty.value || savingQuota.value) return
  savingQuota.value = true
  try {
    await store.saveQuota(user.value.id, { ...quotaForm })
    message.success('配额已更新')
  }
  catch (err) {
    message.error(err instanceof ApiError ? err.message : '配额保存失败')
  }
  finally {
    savingQuota.value = false
  }
}
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
.state-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 16px;
  color: var(--adm-ink-3);
}
.state-box.small { padding: 20px 12px; font-size: 12.5px; }

.detail-head {
  padding: 12px 16px 11px;
  border-bottom: 1px solid var(--adm-line);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.detail-user { display: flex; align-items: center; gap: 12px; min-width: 0; }
.avatar { width: 42px; height: 42px; font-size: 15px; border-radius: 12px; }
.detail-name { font-size: 17px; font-weight: 700; }
.detail-note { font-size: 12.5px; color: var(--adm-ink-3); margin-top: 2px; }

.detail-body {
  padding: 12px 16px 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow: auto;
}
.section-label {
  font-size: 12px;
  font-weight: 650;
  color: var(--adm-ink-3);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.section-hint {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  color: var(--adm-ink-4);
}
.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--adm-surface-muted);
  border-radius: 10px;
}
.status-title { font-size: 13px; color: var(--adm-ink-2); }
.status-sub { font-size: 11.5px; color: var(--adm-ink-4); margin-top: 2px; }

.quota-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.field label { font-size: 12px; color: var(--adm-ink-3); font-weight: 500; }
.field :deep(.n-input-number) { width: 100%; }
.field :deep(.n-input__suffix) { font-size: 12px; color: var(--adm-ink-4); margin-right: 4px; }

.keys-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.key-table { width: 100%; border-collapse: collapse; }
.key-table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--adm-ink-3);
  padding: 6px 8px;
  border-bottom: 1px solid var(--adm-line);
  background: #FAFBFC;
}
.key-table td {
  padding: 8px;
  font-size: 12.5px;
  border-bottom: 1px solid var(--adm-line);
  vertical-align: middle;
}
.key-table tr:last-child td { border-bottom: none; }
.key-label { font-weight: 650; color: var(--adm-ink); }
.key-prefix { margin-top: 4px; display: inline-block; }
.key-date { color: var(--adm-ink-3); font-size: 12px; white-space: nowrap; }
.muted { color: var(--adm-ink-3); }
.small-text { font-size: 12px; }

.danger-zone {
  border-top: 1px dashed #F0C9D1;
  background: linear-gradient(180deg, #fff, #FFF8F9);
  padding: 10px 16px 12px;
}
.danger-title { font-size: 12.5px; font-weight: 700; color: var(--adm-red); }
.danger-desc { margin: 3px 0 8px; font-size: 11.5px; color: var(--adm-ink-3); line-height: 1.4; }

@media (max-width: 560px) {
  .quota-grid { grid-template-columns: 1fr; }
}
</style>
