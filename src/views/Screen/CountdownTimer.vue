<template>
  <MoveablePanel 
    class="countdown-timer" 
    :width="180"
    :height="110"
    :left="left" 
    :top="top"
  >
    <div class="header">
      <span class="text-btn" @click="toggle()">{{ inTiming ? '暂停' : '开始'}}</span>
      <span class="text-btn" @click="reset()">重置</span>
      <span class="text-btn" @click="toggleCountdown()" :class="{ 'active': isCountdown }">倒计时</span>
    </div>
    <div class="content">
      <div class="timer">
        <input 
          type="text"
          :value="fillDigit(minute, 2)"
          :maxlength="3" :disabled="inputEditable"
          @mousedown.stop 
          @blur="$event => changeTime($event, 'minute')"
          @keydown.stop
          @keydown.enter.stop="$event => changeTime($event, 'minute')"
        >
      </div>
      <div class="colon">:</div>
      <div class="timer">
        <input 
          type="text"
          :value="fillDigit(second, 2)"
          :maxlength="3" :disabled="inputEditable"
          @mousedown.stop 
          @blur="$event => changeTime($event, 'second')"
          @keydown.stop
          @keydown.enter.stop="$event => changeTime($event, 'second')"
        >
      </div>
    </div>

    <div class="close-btn" @click="emit('close')"><IconClose class="icon" /></div>
  </MoveablePanel>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import { fillDigit } from '@/utils/common'

import MoveablePanel from '@/components/MoveablePanel.vue'

withDefaults(defineProps<{
  left?: number
  top?: number
}>(), {
  left: 5,
  top: 5,
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const timer = ref<number | null>(null)
const inTiming = ref(false)
const isCountdown = ref(false)
const time = ref(0)
const minute = computed(() => Math.floor(time.value / 60))
const second = computed(() => time.value % 60)

const inputEditable = computed(() => {
  return !isCountdown.value || inTiming.value
})

const clearTimer = () => {
  if (timer.value) clearInterval(timer.value)
}

onUnmounted(clearTimer)

const pause = () => {
  clearTimer()
  inTiming.value = false
}

const reset = () => {
  clearTimer()
  inTiming.value = false
  
  if (isCountdown.value) time.value = 600
  else time.value = 0
}

const start = () => {
  clearTimer()

  if (isCountdown.value) {
    timer.value = setInterval(() => {
      time.value = time.value - 1

      if (time.value <= 0) reset()
    }, 1000)
  }
  else {
    timer.value = setInterval(() => {
      time.value = time.value + 1

      if (time.value > 36000) pause()
    }, 1000)
  }

  inTiming.value = true
}

const toggle = () => {
  if (inTiming.value) pause()
  else start()
}

const toggleCountdown = () => {
  isCountdown.value = !isCountdown.value
  reset()
}

const changeTime = (e: FocusEvent | KeyboardEvent, type: 'minute' | 'second') => {
  const inputRef = e.target as HTMLInputElement
  let value = inputRef.value
  const isNumber = /^(\d)+$/.test(value)
  if (isNumber) {
    if (type === 'second' && +value >= 60) value = '59'
    time.value = type === 'minute' ? (+value * 60 + second.value) : (+value + minute.value * 60)
  }
  else inputRef.value = type === 'minute' ? fillDigit(minute.value, 2) : fillDigit(second.value, 2)
}
</script>

<style lang="scss" scoped>
.countdown-timer {
  user-select: none;
}
.header {
  height: 16px;
  font-size: 13px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;

  .text-btn {
    margin-right: 8px;
    cursor: pointer;

    &:hover, &.active {
      color: $themeColor;
    }
  }
}
.content {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}
.timer {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: rgba($color: $themeColor, $alpha: .05);
  font-size: 22px;
  overflow: hidden;

  input {
    width: 100%;
    height: 100%;
    border: 0;
    outline: 0;
    background-color: transparent;
    text-align: center;
  }
}
.colon {
  height: 54px;
  line-height: 54px;
  font-size: 22px;
}
.icon-btn {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.pause, .play {
  font-size: 17px;
}
.reset {
  font-size: 12px;
}
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  cursor: pointer;
}
</style>