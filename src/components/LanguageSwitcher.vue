<template>
  <div class="language-switcher">
    <select v-model="locale" :aria-label="$t('components.LanguageSwitcher.aria_label.change_language')">
      <option value="zh">{{ $t('Commons.text.text_dure', {}) }}</option>
      <option value="en">{{ $t('Commons.text.english', {}) }}</option>
      <option value="fr">{{ $t('Commons.text.francais', {}) }}</option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({ useScope: 'global' })
</script>

<style scoped>
.language-switcher select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
}
</style>
