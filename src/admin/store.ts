import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

import { api, onUnauthorized, setCsrfToken } from './api'
import type { AdminKey, AdminUser, Overview } from './types'

interface AdminState {
  ready: boolean
  authed: boolean
  sessionExpiresAt: number | null
  overview: Overview | null
  users: AdminUser[]
  usersLoading: boolean
  query: string
  statusFilter: 'all' | 'active' | 'disabled'
  selectedUserId: string | null
  keys: AdminKey[]
  keysLoading: boolean
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    ready: false,
    authed: false,
    sessionExpiresAt: null,
    overview: null,
    users: [],
    usersLoading: false,
    query: '',
    statusFilter: 'all',
    selectedUserId: null,
    keys: [],
    keysLoading: false,
  }),

  getters: {
    selectedUser(state): AdminUser | null {
      return state.users.find(u => u.id === state.selectedUserId) ?? null
    },
  },

  actions: {
    bind() {
      onUnauthorized(() => {
        this.authed = false
        this.users = []
        this.keys = []
        this.selectedUserId = null
      })
    },

    async checkSession() {
      try {
        const res = await api<{ authenticated: boolean, csrfToken: string, expiresAt: number }>('/session')
        setCsrfToken(res.csrfToken)
        this.sessionExpiresAt = res.expiresAt
        this.authed = true
        this.ready = true
        // 数据加载失败只提示、不影响已建立的会话（401 由 api 层统一打回登录页）
        this.refresh().catch(() => {})
        return
      }
      catch {
        this.authed = false
      }
      this.ready = true
    },

    async login(password: string) {
      const res = await api<{ csrfToken: string, expiresAt: number }>('/login', {
        method: 'POST',
        body: { password },
      })
      setCsrfToken(res.csrfToken)
      this.sessionExpiresAt = res.expiresAt
      this.authed = true
      await this.refresh()
    },

    async logout() {
      try {
        await api('/logout', { method: 'POST', body: {} })
      }
      finally {
        this.authed = false
      }
    },

    async refresh() {
      await Promise.all([this.loadOverview(), this.loadUsers()])
    },

    async loadOverview() {
      this.overview = await api<Overview>('/overview')
    },

    async loadUsers() {
      this.usersLoading = true
      try {
        const res = await api<{ users: AdminUser[] }>('/users', {
          query: {
            q: this.query || undefined,
            status: this.statusFilter === 'all' ? undefined : this.statusFilter,
          },
        })
        this.users = res.users
        if (this.selectedUserId && !res.users.some(u => u.id === this.selectedUserId)) {
          this.selectedUserId = null
          this.keys = []
        }
        if (!this.selectedUserId && res.users.length) {
          await this.selectUser(res.users[0].id)
        }
      }
      finally {
        this.usersLoading = false
      }
    },

    async selectUser(id: string) {
      if (this.selectedUserId === id) return
      this.selectedUserId = id
      await this.loadKeys()
    },

    async loadKeys() {
      if (!this.selectedUserId) {
        this.keys = []
        return
      }
      this.keysLoading = true
      try {
        const res = await api<{ keys: AdminKey[] }>(`/users/${this.selectedUserId}/keys`)
        this.keys = res.keys
      }
      finally {
        this.keysLoading = false
      }
    },

    async createUser(name: string, note: string | null) {
      const res = await api<{ user: AdminUser }>('/users', {
        method: 'POST',
        body: { name, note },
      })
      await this.refresh()
      await this.selectUser(res.user.id)
      return res.user
    },

    async createKey(label: string | null) {
      // requestId：网络重试 / 重复提交由服务端去重，不会创建第二把 Key
      const res = await api<{ id: string, key?: string, prefix: string, duplicated: boolean }>(
        `/users/${this.selectedUserId}/keys`,
        { method: 'POST', body: { label, requestId: `ui-${nanoid(21)}` } },
      )
      await Promise.all([this.loadKeys(), this.loadOverview(), this.loadUsers()])
      return res
    },

    async revokeKey(keyId: string) {
      const res = await api<{ ok: boolean, alreadyRevoked: boolean }>(`/keys/${keyId}/revoke`, {
        method: 'POST',
        body: {},
      })
      await Promise.all([this.loadKeys(), this.loadOverview()])
      return res
    },

    async setUserStatus(userId: string, status: 'active' | 'disabled') {
      const res = await api<{ ok: boolean, status: string }>(`/users/${userId}/status`, {
        method: 'POST',
        body: { status },
      })
      await Promise.all([this.loadUsers(), this.loadOverview()])
      return res
    },

    async saveQuota(userId: string, quota: { docs: number | null, docMb: number | null, exportsPerDay: number | null }) {
      const res = await api<{ user: AdminUser }>(`/users/${userId}`, {
        method: 'PATCH',
        body: {
          quotaDocs: quota.docs,
          quotaDocMb: quota.docMb,
          quotaExportsPerDay: quota.exportsPerDay,
        },
      })
      await this.loadUsers()
      return res.user
    },
  },
})
