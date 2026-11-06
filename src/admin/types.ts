export interface Quota {
  docs: number
  docMb: number
  exportsPerDay: number
}

export interface QuotaCustom {
  docs: number | null
  docMb: number | null
  exportsPerDay: number | null
}

export interface AdminUser {
  id: string
  name: string
  note: string | null
  status: 'active' | 'disabled'
  createdAt: number
  docs: number
  activeKeys: number
  lastUsedAt: number | null
  keyPrefix: string | null
  quota: Quota
  quotaCustom: QuotaCustom
}

export interface AdminKey {
  id: string
  label: string | null
  prefix: string
  createdAt: number
  lastUsedAt: number | null
  revokedAt: number | null
}

export interface Overview {
  users: { total: number, active: number }
  keys: { total: number, active: number }
  docs: number
  exportsToday: number
}
