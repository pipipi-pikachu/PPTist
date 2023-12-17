<template>
  <Transition 
    name="message-fade" 
    appear 
    mode="in-out"
    @beforeLeave="emit('close')"
    @afterLeave="emit('destroy')"
  >
    <div class="message" :id="id" v-if="visible">
      <div class="message-container"
        @mouseenter="clearTimer()"
        @mouseleave="startTimer()"
      >
        <div class="icons">
          <IconAttention theme="filled" size="18" fill="#faad14" v-if="type === 'warning'" />
          <IconCheckOne theme="filled" size="18" fill="#52c41a" v-if="type === 'success'" />
          <IconCloseOne theme="filled" size="18" fill="#ff4d4f" v-if="type === 'error'" />
          <IconInfo theme="filled" size="18" fill="#1677ff" v-if="type === 'info'" />
        </div>
        <div class="content">
          <div class="title" v-if="title">{{ title }}</div>
          <div class="description">{{ message }}</div>
        </div>
        <div class="control" v-if="closable">
          <span 
            class="close-btn"
            @click="close()"
          >
            <IconCloseSmall />
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeMount } from 'vue'
import { icons } from '@/plugins/icon'

const {
  IconAttention,
  IconCheckOne,
  IconCloseOne,
  IconInfo,
  IconCloseSmall,
} = icons

const props = withDefaults(defineProps<{
  id: string
  message: string
  type?: string
  title?: string
  duration?: number
  closable?: boolean
}>(), {
  type: 'success',
  title: '',
  duration: 3000,
  closable: false,
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'destroy'): void
}>()

const visible = ref(true)
const timer = ref<number | null>(null)

const startTimer = () => {
  if (props.duration <= 0) return
  timer.value = setTimeout(close, props.duration)
}
const clearTimer = () => {
  if (timer.value) clearTimeout(timer.value)
}

const close = () => visible.value = false

onBeforeMount(() => {
  clearTimer()
})
onMounted(() => {
  startTimer()
})

defineExpose({
  close,
})
</script>

<style lang="scss" scoped>
.message {
  max-width: 600px;

  & + & {
    margin-top: 15px;
  }
}
.message-container {
  min-width: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 13px;
  overflow: hidden;
  border-radius: $borderRadius;
  box-shadow: 0 1px 8px rgba(0, 0, 0, .15);
  background: #fff;
  pointer-events: all;
  position: relative;

  .icons {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  .title {
    font-size: 14px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .content {
    width: 100%;
  }
  .description {
    line-height: 1.5;
    color: $textColor;
  }
  .title + .description {
    margin-top: 5px;
  }
  .control {
    position: relative;
    height: 100%;
    margin-left: 10px;
  }
  .close-btn {
    font-size: 15px;
    color: #666;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }
  }
}

.message-fade-enter-active {
  animation: message-fade-in-down .3s;
}
.message-fade-leave-active {
  animation: message-fade-out .3s;
}

@keyframes message-fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes message-fade-out {
  0% {
    opacity: 1;
    margin-top: 0;
  }
  100% {
    opacity: 0;
    margin-top: -45px;
  }
}
</style>