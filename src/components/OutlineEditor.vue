<template>
  <div class="outline-editor">
    <div class="item" :class="[{ 'title': item.title }, `lv-${item.lv}`]" :style="{ marginLeft: 20 * item.lv + 'px' }" v-for="item in data" :key="item.id">
      <Input ref="editableRef" class="editable-text" :value="item.content" v-if="activeItemId === item.id" @blur="activeItemId = ''" />
      <div class="text" @click="handleFocus(item.id)" v-else>{{ item.content }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue'
import { nanoid } from 'nanoid'
import Input from './Input.vue'

interface OutlineItem {
  id: string
  content: string
  lv: number
  title?: boolean
  item?: boolean
}

const props = defineProps<{
  value: string
}>()

const data = ref<OutlineItem[]>([])
const activeItemId = ref('')
const editableRef = ref<InstanceType<typeof Input>[]>()

onMounted(() => {
  const lines = props.value.split('\n')
  const result: OutlineItem[] = []

  for (const line of lines) {
    if (!line.trim()) continue

    const headerMatch = line.match(/^(#+)\s*(.*)/)
    const listMatch = line.match(/^-\s*(.*)/)

    if (headerMatch) {
      const lv = headerMatch[1].length
      const content = headerMatch[2]
      result.push({
        id: nanoid(),
        content,
        title: true,
        lv,
      })
    }
    else if (listMatch) {
      const content = listMatch[1]
      result.push({
        id: nanoid(),
        content,
        item: true,
        lv: 4,
      })
    }
    else {
      result.push({
        id: nanoid(),
        content: line.trim(),
        lv: 4
      })
    }
  }
  data.value = result
})

const handleFocus = (id: string) => {
  activeItemId.value = id

  nextTick(() => {
    editableRef.value && editableRef.value[0].focus()
  })
}
</script>

<style lang="scss">
.outline-editor {
  height: 600px;
  overflow: auto;

  .item {
    height: 32px;
  
    & + .item {
      margin-top: 2px;
    }

    &.title {
      font-weight: 700;
    }
    &.lv-1 {
      font-size: 20px;
    }
    &.lv-2 {
      font-size: 17px;
    }
    &.lv-3 {
      font-size: 15px;
    }
    &.lv-4 {
      font-size: 13px;
    }
  }
  .text {
    height: 100%;
    color: #41464b;
    padding: 0 10px;
    line-height: 32px;
  }
}
</style>