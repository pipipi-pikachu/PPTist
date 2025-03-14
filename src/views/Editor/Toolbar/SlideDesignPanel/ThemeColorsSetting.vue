<template>
  <div class="theme-colors-setting">
    <div class="title">编辑主题色</div>

    <div class="list">
      <div class="row" v-for="(item, index) in themeColors" :key="index">
        <div class="label" style="width: 40%;">幻灯片主题色{{ index + 1 }}：</div>
        <Popover trigger="click" style="width: 60%;">
          <template #content>
            <ColorPicker
              :modelValue="item"
              @update:modelValue="(value: string) => themeColors[index] = value"
            />
          </template>
          <ColorButton :color="item" />
        </Popover>
      </div>
    </div>

    <Button class="btn" type="primary" @click="setThemeColors()">确认</Button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import Popover from '@/components/Popover.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import ColorButton from '@/components/ColorButton.vue'
import Button from '@/components/Button.vue'

const emit = defineEmits<{
  (event: 'close'): void 
}>()

const slidesStore = useSlidesStore()
const { theme } = storeToRefs(slidesStore)

const themeColors = ref<string[]>([])

onMounted(() => {
  let colors = theme.value.themeColors

  while (colors.length < 6) {
    colors.push('#00000000')
  }
  
  themeColors.value = [...colors]
})

const setThemeColors = () => {
  slidesStore.setTheme({ themeColors: themeColors.value })
  emit('close')
}
</script>

<style lang="scss" scoped>
.theme-colors-setting {
  display: flex;
  flex-direction: column;
}
.title {
  margin-bottom: 15px;
  font-size: 17px;
  font-weight: 700;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.label {
  font-size: 13px;
}
.btn {
  width: 100%;
  margin-top: 12px;
}
</style>
