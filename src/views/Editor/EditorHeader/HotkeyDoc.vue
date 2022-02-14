<template>
  <div class="hotkey-doc">
    <template v-for="item in hotkeys" :key="item.type">
      <div class="title">{{item.type}}</div>
      <div class="hotkey-item" v-for="hotkey in item.children" :key="hotkey.label">
        <div class="label">{{hotkey.label}}</div>
        <div class="value">{{hotkey.value}}</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { HOTKEY_DOC } from '@/configs/hotkey'

export default defineComponent({
  name: 'hotkey-doc',
  setup() {
    return {
      hotkeys: HOTKEY_DOC,
    }
  },
})
</script>

<style lang="scss" scoped>
.hotkey-doc {
  height: 100%;
  overflow: auto;
  font-size: 12px;
  margin: 0 -24px;
  padding: 0 24px;
}
.title {
  font-size: 14px;
  font-weight: 700;
  border-bottom: 1px solid #e5e5e5;
  padding: 15px 0 5px 0;
}
.hotkey-item {
  border-bottom: 1px solid #e5e5e5;
  padding: 15px 0 5px 0;
  display: flex;
  align-items: center;
}
.label {
  width: 140px;

  @include ellipsis-oneline();
}
</style>