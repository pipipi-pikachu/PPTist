<template>
  <div class="admin-app">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true"><IconBrand /></div>
        <div class="brand-text">
          <div class="brand-name">PPTist</div>
          <div class="brand-sub">Admin</div>
        </div>
      </div>

      <nav class="nav" aria-label="管理台导航">
        <button class="nav-item active" type="button" aria-current="page">
          <IconUsers />
          <span class="nav-label">用户与 Key</span>
        </button>
      </nav>

      <div class="security-box">
        <div class="security-top">
          <IconShield />
          管理员会话已保护
        </div>
        <p class="security-desc">
          会话 Cookie 仅服务端校验，写操作受 CSRF 令牌保护；
          会话至 {{ expiresText }} 自动过期。
        </p>
        <n-button class="logout-btn" size="small" secondary block @click="onLogout" :loading="loggingOut">
          <template #icon><IconLogout /></template>
          登出
        </n-button>
      </div>
    </aside>

    <main class="main">
      <div class="topbar">
        <div class="breadcrumb">
          <span>管理后台</span>
          <span class="sep">/</span>
          <strong>用户与访问权限</strong>
        </div>
        <div class="topbar-right">
          <div class="env-pill" :title="`当前实例：${host}`">
            <span class="env-dot"></span>
            {{ host }}
          </div>
        </div>
      </div>

      <div class="content">
        <div class="content-inner">
          <div class="page-head">
            <div>
              <h1 class="page-title">用户与访问权限</h1>
              <p class="page-sub">管理 Agent 密钥、文档配额和使用状态</p>
            </div>
            <n-button type="primary" @click="createUserOpen = true">
              <template #icon><IconPlus /></template>
              新建用户
            </n-button>
          </div>

          <div class="stats">
            <div class="stat-card adm-card">
              <div class="stat-label">活跃用户</div>
              <div class="stat-value">{{ overview?.users.active ?? '—' }}</div>
              <div class="stat-meta">共 {{ overview?.users.total ?? '—' }} 个用户</div>
            </div>
            <div class="stat-card adm-card">
              <div class="stat-label">有效 Key</div>
              <div class="stat-value">{{ overview?.keys.active ?? '—' }}</div>
              <div class="stat-meta">共 {{ overview?.keys.total ?? '—' }} 把 Key</div>
            </div>
            <div class="stat-card adm-card">
              <div class="stat-label">文档总数</div>
              <div class="stat-value">{{ overview?.docs ?? '—' }}</div>
              <div class="stat-meta">全部用户</div>
            </div>
            <div class="stat-card adm-card">
              <div class="stat-label">今日导出</div>
              <div class="stat-value">{{ overview?.exportsToday ?? '—' }}</div>
              <div class="stat-meta">自服务器零点起</div>
            </div>
          </div>

          <div class="workspace">
            <UserListPanel />
            <DetailPanel
              @create-key="createKeyOpen = true"
              @revoke-key="confirmRevoke"
              @toggle-status="confirmToggle"
            />
          </div>

          <div class="footer-note">密钥完整值只在创建时显示一次 · 列表仅展示前缀</div>
        </div>
      </div>
    </main>

    <CreateUserModal v-model:show="createUserOpen" />
    <CreateKeyModal v-model:show="createKeyOpen" @created="onKeyCreated" />
    <NewKeyModal :show="newKeyOpen" :api-key="newKeyValue" :key-label="newKeyLabel" @close="newKeyOpen = false" />
    <ConfirmModal
      v-model:show="confirmOpen"
      :title="confirmTitle"
      :lines="confirmLines"
      :confirm-text="confirmText"
      :loading="confirmLoading"
      @confirm="runConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, useMessage } from 'naive-ui'

import { useAdminStore } from '../store'
import type { AdminKey, AdminUser } from '../types'
import { relativeTime } from '../format'
import { ApiError } from '../api'
import { IconBrand, IconLogout, IconPlus, IconShield, IconUsers } from '../icons'
import UserListPanel from '../components/UserListPanel.vue'
import DetailPanel from '../components/DetailPanel.vue'
import CreateUserModal from '../components/CreateUserModal.vue'
import CreateKeyModal from '../components/CreateKeyModal.vue'
import NewKeyModal from '../components/NewKeyModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const store = useAdminStore()
const message = useMessage()

const host = window.location.host
const overview = computed(() => store.overview)

const expiresText = computed(() =>
  store.sessionExpiresAt ? relativeTime(store.sessionExpiresAt).replace('前', '后') : '—'
)

const loggingOut = ref(false)
async function onLogout() {
  loggingOut.value = true
  try {
    await store.logout()
  }
  finally {
    loggingOut.value = false
  }
}

const createUserOpen = ref(false)
const createKeyOpen = ref(false)

// 一次性 Key 弹窗：明文只在内存中，关闭即丢弃
const newKeyOpen = ref(false)
const newKeyValue = ref('')
const newKeyLabel = ref('')

function onKeyCreated(payload: { key?: string, label: string | null }) {
  if (!payload.key) return
  newKeyValue.value = payload.key
  newKeyLabel.value = payload.label ?? '未命名'
  newKeyOpen.value = true
}

// 二次确认（吊销 / 停用 / 启用），文案明示影响范围
const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmLines = ref<string[]>([])
const confirmText = ref('')
const confirmLoading = ref(false)
let confirmAction: (() => Promise<void>) | null = null

function confirmRevoke(key: AdminKey) {
  const label = key.label || key.prefix
  confirmTitle.value = `吊销 Key「${label}」？`
  confirmLines.value = [
    `Key 前缀 ${key.prefix}… 将立即失效，使用该 Key 的 Agent 会立刻收到 401。`,
    '此操作只影响这一把 Key；该用户的其它 Key 与文档链接不受影响。',
    '吊销不可撤销，只能为该 Agent 重新创建一把新 Key。',
  ]
  confirmText.value = '确认吊销'
  confirmAction = async () => {
    const res = await store.revokeKey(key.id)
    message.success(res.alreadyRevoked ? '该 Key 此前已吊销' : 'Key 已吊销')
  }
  confirmOpen.value = true
}

function confirmToggle(user: AdminUser) {
  const disabling = user.status === 'active'
  confirmTitle.value = disabling ? `停用用户「${user.name}」？` : `恢复用户「${user.name}」？`
  confirmLines.value = disabling
    ? [
      '该用户的全部 Key 与文档链接将立即失效：Agent 调用返回 401，网页端编辑/只读链接全部失效。',
      `当前有 ${user.activeKeys} 把有效 Key、${user.docs} 份文档会受影响。`,
      '停用后可随时恢复，未被单独吊销的 Key 与文档链接会重新生效。',
    ]
    : [
      '恢复后，该用户未被单独吊销的 Key 与文档链接将重新生效。',
      '已被单独吊销的 Key 不会恢复。',
    ]
  confirmText.value = disabling ? '确认停用' : '确认恢复'
  confirmAction = async () => {
    await store.setUserStatus(user.id, disabling ? 'disabled' : 'active')
    message.success(disabling ? `已停用 ${user.name}` : `已恢复 ${user.name}`)
  }
  confirmOpen.value = true
}

async function runConfirm() {
  if (!confirmAction || confirmLoading.value) return
  confirmLoading.value = true
  try {
    await confirmAction()
    confirmOpen.value = false
  }
  catch (err) {
    message.error(err instanceof ApiError ? err.message : '操作失败，请稍后重试')
  }
  finally {
    confirmLoading.value = false
  }
}
</script>

<style scoped>
.admin-app {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
}

/* ---- Sidebar ---- */
.sidebar {
  background: var(--adm-surface);
  border-right: 1px solid var(--adm-line);
  display: flex;
  flex-direction: column;
  padding: 20px 14px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px 22px;
}
.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(145deg, #F29A4A 0%, #E8752A 55%, #C85A18 100%);
  display: grid;
  place-items: center;
  color: #fff;
  box-shadow: 0 6px 14px rgba(232, 117, 42, 0.28);
}
.brand-mark svg { width: 18px; height: 18px; }
.brand-text { display: flex; flex-direction: column; gap: 1px; }
.brand-name { font-size: 15px; font-weight: 700; letter-spacing: 0.01em; }
.brand-sub {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--adm-orange);
  text-transform: uppercase;
}

.nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--adm-ink-2);
  font-weight: 500;
  font-size: 14px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}
.nav-item svg { width: 18px; height: 18px; flex-shrink: 0; color: var(--adm-ink-3); }
.nav-item.active {
  background: var(--adm-orange-soft);
  color: var(--adm-orange);
  border-color: #F5D8BF;
}
.nav-item.active svg { color: var(--adm-orange); }

.security-box {
  margin-top: auto;
  background: var(--adm-surface-muted);
  border: 1px solid var(--adm-line);
  border-radius: 12px;
  padding: 12px;
}
.security-top {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--adm-ink-2);
}
.security-top svg { width: 14px; height: 14px; color: var(--adm-green); }
.security-desc {
  margin: 6px 0 10px;
  font-size: 11.5px;
  color: var(--adm-ink-3);
  line-height: 1.45;
}
.logout-btn :deep(svg) { width: 14px; height: 14px; }

/* ---- Main ---- */
.main { display: flex; flex-direction: column; min-width: 0; }
.topbar {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  border-bottom: 1px solid var(--adm-line);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 5;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--adm-ink-3);
  font-size: 13px;
}
.breadcrumb strong { color: var(--adm-ink); font-weight: 600; }
.breadcrumb .sep { color: var(--adm-ink-4); }
.env-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--adm-green-soft);
  color: var(--adm-green);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #C9EBD7;
  max-width: 46vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.env-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--adm-green);
  box-shadow: 0 0 0 3px rgba(24, 160, 88, 0.18);
  flex-shrink: 0;
}

.content { flex: 1; padding: 16px 28px 12px; }
.content-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.page-sub { margin: 4px 0 0; font-size: 13px; color: var(--adm-ink-3); }

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.stat-card { padding: 11px 14px 10px; }
.stat-label { font-size: 12px; color: var(--adm-ink-3); font-weight: 500; }
.stat-value {
  margin-top: 4px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}
.stat-meta { margin-top: 2px; font-size: 11px; color: var(--adm-ink-4); }

.workspace {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 14px;
  align-items: start;
}

.footer-note {
  text-align: center;
  font-size: 11.5px;
  color: var(--adm-ink-4);
  padding: 2px 0 8px;
}

/* ---- 移动端：侧栏收成顶栏，双列变单列 ---- */
@media (max-width: 900px) {
  .admin-app { grid-template-columns: 1fr; }
  .sidebar {
    position: static;
    height: auto;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-right: none;
    border-bottom: 1px solid var(--adm-line);
  }
  .brand { padding: 0; flex: 1; }
  .brand-mark { width: 30px; height: 30px; border-radius: 8px; }
  .brand-mark svg { width: 15px; height: 15px; }
  .brand-name { font-size: 14px; }
  .nav { display: none; }
  .security-box {
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
  }
  .security-top, .security-desc { display: none; }
  .logout-btn { width: auto; }
  .topbar { padding: 0 16px; }
  .content { padding: 14px 14px 10px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .workspace { grid-template-columns: 1fr; }
  .page-title { font-size: 20px; }
}
</style>
