<template>
  <section class="panel adm-card" aria-label="用户列表">
    <div class="toolbar">
      <div class="search">
        <IconSearch />
        <input
          v-model="query"
          type="search"
          placeholder="搜索用户名或备注…"
          aria-label="搜索用户名或备注"
          @input="onQueryInput"
        />
      </div>
      <n-select
        class="status-select"
        :value="store.statusFilter"
        :options="statusOptions"
        size="medium"
        aria-label="状态筛选"
        @update:value="onStatusChange"
      />
    </div>

    <div class="table-wrap" role="region" aria-live="polite">
      <div class="state-box" v-if="store.usersLoading && !users.length">
        <n-spin size="small" />
        <span>正在加载用户…</span>
      </div>
      <div class="state-box" v-else-if="!users.length">
        <n-empty description="暂无符合条件的用户" size="small">
          <template #extra>可调整筛选条件，或点右上角「新建用户」</template>
        </n-empty>
      </div>
      <table v-else>
        <thead>
          <tr>
            <th style="width:36%">用户</th>
            <th style="width:15%">状态</th>
            <th style="width:19%">Key 前缀</th>
            <th style="width:17%">最近使用</th>
            <th style="width:13%">配额</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            :class="{ selected: user.id === store.selectedUserId }"
            tabindex="0"
            role="button"
            :aria-pressed="user.id === store.selectedUserId"
            @click="store.selectUser(user.id)"
            @keydown.enter.prevent="store.selectUser(user.id)"
            @keydown.space.prevent="store.selectUser(user.id)"
          >
            <td>
              <div class="user-cell">
                <div class="adm-avatar avatar" :style="{ background: avatarColor(user.name) }">
                  {{ avatarLetter(user.name) }}
                </div>
                <div class="user-meta">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-note">{{ rowNote(user) }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="adm-pill" :class="user.status === 'active' ? 'adm-pill--ok' : 'adm-pill--off'">
                <span class="adm-pill-dot"></span>{{ user.status === 'active' ? '活跃' : '已停用' }}
              </span>
            </td>
            <td><span class="adm-mono" v-if="user.keyPrefix">{{ user.keyPrefix }}…</span><span class="muted" v-else>—</span></td>
            <td class="muted">{{ relativeTime(user.lastUsedAt) }}</td>
            <td class="quota-mini">{{ user.quota.docs }} / {{ user.quota.docMb }}MB</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NEmpty, NSelect, NSpin } from 'naive-ui'

import { useAdminStore } from '../store'
import type { AdminUser } from '../types'
import { avatarColor, avatarLetter, relativeTime } from '../format'
import { IconSearch } from '../icons'

const store = useAdminStore()
const users = computed(() => store.users)

const query = ref(store.query)
let debounce = 0
function onQueryInput() {
  window.clearTimeout(debounce)
  debounce = window.setTimeout(() => {
    store.query = query.value.trim()
    store.loadUsers()
  }, 250)
}

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '活跃', value: 'active' },
  { label: '已停用', value: 'disabled' },
]
function onStatusChange(value: string) {
  store.statusFilter = value as 'all' | 'active' | 'disabled'
  store.loadUsers()
}

function rowNote(user: AdminUser): string {
  const bits = [user.note, `${user.docs} 文档`, `${user.activeKeys} 把 Key`].filter(Boolean)
  return bits.join(' · ')
}
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--adm-line);
}
.search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--adm-line-strong);
  border-radius: 8px;
  background: #fff;
}
.search:focus-within { border-color: var(--adm-orange); }
.search svg { width: 15px; height: 15px; color: var(--adm-ink-4); flex-shrink: 0; }
.search input {
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  color: var(--adm-ink);
  font: inherit;
}
.search input::placeholder { color: var(--adm-ink-4); }
.status-select { width: 118px; flex-shrink: 0; }

.table-wrap { flex: 1; overflow: auto; }
.state-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 16px;
  color: var(--adm-ink-3);
  font-size: 13px;
}
table { width: 100%; border-collapse: collapse; }
th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--adm-ink-3);
  padding: 10px 16px;
  border-bottom: 1px solid var(--adm-line);
  background: #FAFBFC;
  position: sticky;
  top: 0;
  z-index: 1;
}
td {
  padding: 11px 14px;
  border-bottom: 1px solid var(--adm-line);
  vertical-align: middle;
  font-size: 13.5px;
}
tbody tr { cursor: pointer; }
tbody tr:hover td { background: #FCFAF8; }
tr.selected td { background: #FFF8F2; }
tr:last-child td { border-bottom: none; }

.user-cell { display: flex; align-items: center; gap: 11px; }
.avatar { width: 34px; height: 34px; font-size: 13px; }
.user-meta { min-width: 0; }
.user-name { font-weight: 650; color: var(--adm-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-note {
  font-size: 12px;
  color: var(--adm-ink-3);
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 260px;
}
.muted { color: var(--adm-ink-3); }
.quota-mini { font-size: 12.5px; color: var(--adm-ink-2); white-space: nowrap; }
th, td { white-space: nowrap; }
td:first-child { white-space: normal; }

@media (max-width: 560px) {
  th:nth-child(3), td:nth-child(3),
  th:nth-child(5), td:nth-child(5) { display: none; }
}
</style>
