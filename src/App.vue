<template>
  <pptist v-model="pptJson" :options="options"></pptist>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import pptist from '@/components/pptist/Index.vue'

const pptJson = ref({})
const options = ref({
  showEditorHeader: true, // 是否显示编辑器header
  exportFileTypes: ['pptist', 'json', 'pptx', 'image', 'pdf'], // 导出文件类型支持'pptist', 'pptx', 'image', 'json', 'pdf'
  fileMenuItems: ['importPPTIST', 'importPPTX', 'export', 'resetSliders', 'hotkey', 'issues', 'qa'], // 文件菜单项目支持'importPPTIST', 'importPPTX', 'export', 'resetSliders', 'hotkey', 'issues', 'qa'
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
