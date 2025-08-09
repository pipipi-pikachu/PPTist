<template>
  <div class="theme-colors-setting">
    <div class="title">图表主题配色</div>

    <div class="list">
      <div class="row" v-for="(item, index) in themeColors" :key="index">
        <div class="label" style="width: 40%;">主题配色{{ index + 1 }}：</div>
        <Popover trigger="click" style="width: 60%;">
          <template #content>
            <ColorPicker
              :modelValue="item"
              @update:modelValue="(value: string) => themeColors[index] = value"
            />
          </template>
          <div class="color-btn-wrap" style="width: 100%;">
            <ColorButton :color="item" />
            <div class="delete-color-btn" v-tooltip="'删除'" @click.stop="deleteThemeColor(index)" v-if="index !== 0"><IconCloseSmall /></div>
          </div>
        </Popover>
      </div>
      <Button
        style="width: 100%"
        :disabled="themeColors.length >= 10"
        @click="addThemeColor()"
      >
        <IconPlus /> 添加主题色
      </Button>
    </div>

    <Button class="btn" type="primary" @click="setThemeColors()">确认</Button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Popover from '@/components/Popover.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import ColorButton from '@/components/ColorButton.vue'
import Button from '@/components/Button.vue'

const props = defineProps<{
  colors: string[]
}>()

const emit = defineEmits<{
  (event: 'update', payload: string[]): void
}>()

const themeColors = ref<string[]>([])

onMounted(() => {
  themeColors.value = [...props.colors]
})

const setThemeColors = () => {
  emit('update', themeColors.value)
}

const addThemeColor = () => {
  const colors = [...themeColors.value, '#00000000']
  themeColors.value = colors
}

const deleteThemeColor = (index: number) => {
  const colors = themeColors.value.filter((c, i) => i !== index)
  themeColors.value = colors
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
.color-btn-wrap {
  position: relative;
}
.delete-color-btn {
  position: absolute;
  width: 30px;
  right: 2px;
  top: 2px;
  bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  cursor: pointer;
}
</style>
