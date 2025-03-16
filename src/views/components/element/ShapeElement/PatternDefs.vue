<template>
  <pattern :id="id" patternContentUnits="objectBoundingBox" patternUnits="objectBoundingBox" width="1" height="1">
    <image :href="src" width="1" height="1" preserveAspectRatio="xMidYMid slice" />
  </pattern>
</template>

<script lang="ts" setup>
defineProps<{
  id: string
  src: string
}>()
</script>