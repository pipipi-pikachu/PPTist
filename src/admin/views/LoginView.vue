<template>
  <div class="login-page">
    <div class="login-card adm-card">
      <div class="brand">
        <div class="brand-mark"><IconBrand /></div>
        <div class="brand-text">
          <div class="brand-name">PPTist</div>
          <div class="brand-sub">Admin</div>
        </div>
      </div>

      <h1 class="title">管理员登录</h1>
      <p class="sub">用户与访问权限管理需要管理员会话</p>

      <form @submit.prevent="submit">
        <label class="field-label" for="admin-password">管理员密码</label>
        <n-input
          id="admin-password"
          v-model:value="password"
          type="password"
          size="large"
          placeholder="请输入管理员密码"
          :disabled="loading"
          :input-props="{ autocomplete: 'current-password' }"
          show-password-on="click"
          autofocus
        />

        <div class="alert" role="alert" v-if="errorMsg">
          <IconWarn class="alert-icon" />
          <span>{{ errorMsg }}</span>
        </div>

        <n-button
          class="submit"
          type="primary"
          size="large"
          attr-type="submit"
          :loading="loading"
          :disabled="!password"
          block
        >
          登录
        </n-button>
      </form>

      <p class="hint">
        首次部署：在服务端以 <code>ADMIN_INITIAL_PASSWORD</code> 环境变量启动即可初始化密码；
        之后用 <code>pptist-admin passwd</code> 轮换。
      </p>
    </div>
    <p class="foot">管理入口仅面向运维；登录尝试受限速保护</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, NInput } from 'naive-ui'

import { ApiError } from '../api'
import { useAdminStore } from '../store'
import { IconBrand, IconWarn } from '../icons'

const store = useAdminStore()
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function submit() {
  if (!password.value || loading.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await store.login(password.value)
    password.value = ''
  }
  catch (err) {
    if (err instanceof ApiError && err.status === 503) {
      errorMsg.value = '管理员密码未配置，请先在服务端完成初始化'
    }
    else if (err instanceof ApiError) {
      errorMsg.value = err.message
    }
    else {
      errorMsg.value = '登录失败，请稍后重试'
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  gap: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 32px 30px 26px;
  box-shadow: var(--adm-shadow-md);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(145deg, #F29A4A 0%, #E8752A 55%, #C85A18 100%);
  display: grid;
  place-items: center;
  color: #fff;
  box-shadow: 0 6px 14px rgba(232, 117, 42, 0.28);
}
.brand-mark svg { width: 20px; height: 20px; }
.brand-name { font-size: 16px; font-weight: 700; color: var(--adm-ink); }
.brand-sub {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--adm-orange);
  text-transform: uppercase;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.sub {
  margin: 6px 0 20px;
  font-size: 13px;
  color: var(--adm-ink-3);
}

.field-label {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--adm-ink-2);
  margin-bottom: 7px;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--adm-red-soft);
  border: 1px solid #F0C9D1;
  color: var(--adm-red);
  font-size: 12.5px;
  line-height: 1.45;
}
.alert-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  margin-top: 1px;
}

.submit {
  margin-top: 18px;
}

.hint {
  margin: 18px 0 0;
  font-size: 11.5px;
  color: var(--adm-ink-4);
  line-height: 1.55;
}
.hint code {
  font-family: var(--adm-mono);
  font-size: 11px;
  background: var(--adm-surface-muted);
  padding: 1px 5px;
  border-radius: 4px;
}

.foot {
  margin: 0;
  font-size: 12px;
  color: var(--adm-ink-4);
}
</style>
