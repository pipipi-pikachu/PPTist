<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider placement="top">
      <n-dialog-provider>
        <div class="boot" v-if="!store.ready">
          <n-spin size="medium" />
          <span class="boot-text">正在验证管理员会话…</span>
        </div>
        <LoginView v-else-if="!store.authed" />
        <ConsoleView v-else />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { NConfigProvider, NDialogProvider, NMessageProvider, NSpin, dateZhCN, zhCN } from 'naive-ui'

import { themeOverrides } from './theme'
import { useAdminStore } from './store'
import LoginView from './views/LoginView.vue'
import ConsoleView from './views/ConsoleView.vue'

const store = useAdminStore()
store.bind()

onMounted(() => {
  store.checkSession()
})
</script>

<style scoped>
.boot {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  justify-content: center;
}
.boot-text {
  color: var(--adm-ink-3);
  font-size: 13px;
}
</style>
