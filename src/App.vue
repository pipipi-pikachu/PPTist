<template>
  <pptist v-model="pptJson" :options="options"></pptist>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import pptist from '@/components/pptist/Index.vue'

const pptJson = ref({})
const options = ref({
  showEditorHeader: true // 是否显示编辑器header
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
