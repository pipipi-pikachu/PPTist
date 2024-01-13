<template>
  <pptist v-model="pptJson"></pptist>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import pptist from '@/components/pptist/Index.vue'

const pptJson = ref({})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
