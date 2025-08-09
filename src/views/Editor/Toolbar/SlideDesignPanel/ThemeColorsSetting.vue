<template>
  <div class="theme-colors-setting">
    <div class="title">编辑主题色</div>

    <Draggable 
      class="list"
      :modelValue="themeColors"
      :animation="200"
      :scroll="true"
      :scrollSensitivity="50"
      handle=".label"
      @end="handleDragEnd"
      itemKey="id"
    >
      <template #item="{ element, index }">
        <div class="row">
          <div class="label" style="width: 40%;">幻灯片主题色{{ index + 1 }}：</div>
          <Popover trigger="click" style="width: 60%;">
            <template #content>
              <ColorPicker
                :modelValue="element"
                @update:modelValue="(value: string) => themeColors[index] = value"
              />
            </template>
            <ColorButton :color="element" />
          </Popover>
        </div>
      </template>
    </Draggable>

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
import Draggable from 'vuedraggable'

const emit = defineEmits<{
  (event: 'close'): void 
}>()

const slidesStore = useSlidesStore()
const { theme } = storeToRefs(slidesStore)

const themeColors = ref<string[]>([])

onMounted(() => {
  const colors = [...theme.value.themeColors]

  while (colors.length < 6) {
    colors.push('#00000000')
  }
  
  themeColors.value = [...colors]
})

const setThemeColors = () => {
  let colors = themeColors.value.filter(item => item !== '#00000000')
  if (!colors.length) colors = ['#00000000']

  slidesStore.setTheme({ themeColors: colors })
  emit('close')
}

const handleDragEnd = (eventData: { newIndex: number; oldIndex: number }) => {
  const { newIndex, oldIndex } = eventData
  if (newIndex === undefined || oldIndex === undefined || newIndex === oldIndex) return
  
  const item = themeColors.value[oldIndex]
  themeColors.value.splice(oldIndex, 1)
  themeColors.value.splice(newIndex, 0, item)
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
  cursor: move;
}
.btn {
  width: 100%;
  margin-top: 12px;
}
</style>
