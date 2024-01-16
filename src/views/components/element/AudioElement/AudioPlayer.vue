<template>
  <div 
    class="audio-player"
    :style="{ transform: `scale(${1 / scale})` }"
  >
    <audio
      class="audio"
      ref="audioRef"
      :src="src"
      :autoplay="autoplay"
      @durationchange="handleDurationchange()"
      @timeupdate="handleTimeupdate()"
      @play="handlePlayed()"
      @ended="handleEnded()"
      @progress="handleProgress()"
      @error="handleError()"
    ></audio>

    <div class="controller">
      <div class="icons">
        <div class="icon play-icon" @click="toggle()">
          <span class="icon-content">
            <IconPlayOne v-if="paused" />
            <IconPause v-else />
          </span>
        </div>
        <div class="volume">
          <div class="icon volume-icon" @click="toggleVolume()">
            <span class="icon-content">
              <IconVolumeMute v-if="volume === 0" />
              <IconVolumeNotice v-else-if="volume === 1" />
              <IconVolumeSmall v-else />
            </span>
          </div>
          <div
            class="volume-bar-wrap"
            @mousedown="handleMousedownVolumeBar()"
            @touchstart="handleMousedownVolumeBar()"
            @click="$event => handleClickVolumeBar($event)"
          >
            <div class="volume-bar" ref="volumeBarRef">
              <div class="volume-bar-inner" :style="{ width: volumeBarWidth }">
                <span class="thumb"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span class="time">
        <span class="ptime">{{ptime}}</span> / <span class="dtime">{{dtime}}</span>
      </span>

      <div 
        class="bar-wrap"
        ref="playBarWrap"
        @mousedown="handleMousedownPlayBar()"
        @touchstart="handleMousedownPlayBar()"
        @mousemove="$event => handleMousemovePlayBar($event)"
        @mouseenter="playBarTimeVisible = true"
        @mouseleave="playBarTimeVisible = false"
      >
        <div class="bar-time" :class="{ 'hidden': !playBarTimeVisible }" :style="{ left: playBarTimeLeft }">{{playBarTime}}</div>
        <div class="bar">
          <div class="loaded" :style="{ width: loadedBarWidth }"></div>
          <div class="played" :style="{ width: playedBarWidth }">
            <span class="thumb"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import message from '@/utils/message'

const props = withDefaults(defineProps<{
  src: string
  loop: boolean
  autoplay?: boolean
  scale?: number
}>(), {
  autoplay: false,
  scale: 1,
})

const secondToTime = (second = 0) => {
  if (second === 0 || isNaN(second)) return '00:00'

  const add0 = (num: number) => (num < 10 ? '0' + num : '' + num)
  const hour = Math.floor(second / 3600)
  const min = Math.floor((second - hour * 3600) / 60)
  const sec = Math.floor(second - hour * 3600 - min * 60)
  return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':')
}

const getBoundingClientRectViewLeft = (element: HTMLElement) => {
  return element.getBoundingClientRect().left
}

const audioRef = ref<HTMLAudioElement>()
const playBarWrap = ref<HTMLElement>()
const volumeBarRef = ref<HTMLElement>()

const volume = ref(0.5)
const paused = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const loaded = ref(0)

const playBarTimeVisible = ref(false)
const playBarTime = ref('00:00')
const playBarTimeLeft = ref('0')

const ptime = computed(() => secondToTime(currentTime.value))
const dtime = computed(() => secondToTime(duration.value))
const playedBarWidth = computed(() => currentTime.value / duration.value * 100 + '%')
const loadedBarWidth = computed(() => loaded.value / duration.value * 100 + '%')
const volumeBarWidth = computed(() => volume.value * 100 + '%')

const seek = (time: number) => {
  if (!audioRef.value) return

  time = Math.max(time, 0)
  time = Math.min(time, duration.value)

  audioRef.value.currentTime = time
  currentTime.value = time
}

const play = () => {
  if (!audioRef.value) return

  paused.value = false
  audioRef.value.play()
}

const pause = () => {
  if (!audioRef.value) return

  paused.value = true
  audioRef.value.pause()
}

const toggle = () => {
  if (paused.value) play() 
  else pause()
}

const setVolume = (percentage: number) => {
  if (!audioRef.value) return

  percentage = Math.max(percentage, 0)
  percentage = Math.min(percentage, 1)

  audioRef.value.volume = percentage
  volume.value = percentage
  if (audioRef.value.muted && percentage !== 0) audioRef.value.muted = false
}

const handleDurationchange = () => {
  duration.value = audioRef.value?.duration || 0
}

const handleTimeupdate = () => {
  currentTime.value = audioRef.value?.currentTime || 0
}

const handlePlayed = () => {
  paused.value = false
}

const handleEnded = () => {
  if (!props.loop) pause()
  else {
    seek(0)
    play()
  }
}

const handleProgress = () => {
  loaded.value = audioRef.value?.buffered.length ? audioRef.value.buffered.end(audioRef.value.buffered.length - 1) : 0
}

const handleError = () => message.error('视频加载失败')

const thumbMove = (e: MouseEvent | TouchEvent) => {
  if (!audioRef.value || !playBarWrap.value) return
  const clientX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX
  let percentage = (clientX - getBoundingClientRectViewLeft(playBarWrap.value)) / playBarWrap.value.clientWidth
  percentage = Math.max(percentage, 0)
  percentage = Math.min(percentage, 1)
  const time = percentage * duration.value

  audioRef.value.currentTime = time
  currentTime.value = time
}

const thumbUp = (e: MouseEvent | TouchEvent) => {
  if (!audioRef.value || !playBarWrap.value) return

  const clientX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX
  let percentage = (clientX - getBoundingClientRectViewLeft(playBarWrap.value)) / playBarWrap.value.clientWidth
  percentage = Math.max(percentage, 0)
  percentage = Math.min(percentage, 1)
  const time = percentage * duration.value

  audioRef.value.currentTime = time
  currentTime.value = time

  document.removeEventListener('mousemove', thumbMove)
  document.removeEventListener('touchmove', thumbMove)
  document.removeEventListener('mouseup', thumbUp)
  document.removeEventListener('touchend', thumbUp)
}

const handleMousedownPlayBar = () => {
  document.addEventListener('mousemove', thumbMove)
  document.addEventListener('touchmove', thumbMove)
  document.addEventListener('mouseup', thumbUp)
  document.addEventListener('touchend', thumbUp)
}

const volumeMove = (e: MouseEvent | TouchEvent) => {
  if (!volumeBarRef.value) return
  const clientX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX
  const percentage = (clientX - getBoundingClientRectViewLeft(volumeBarRef.value)) / 45
  setVolume(percentage)
}

const volumeUp = () => {
  document.removeEventListener('mousemove', volumeMove)
  document.removeEventListener('touchmove', volumeMove)
  document.removeEventListener('mouseup', volumeUp)
  document.removeEventListener('touchend', volumeUp)
}

const handleMousedownVolumeBar = () => {
  document.addEventListener('mousemove', volumeMove)
  document.addEventListener('touchmove', volumeMove)
  document.addEventListener('mouseup', volumeUp)
  document.addEventListener('touchend', volumeUp)
}

const handleClickVolumeBar = (e: MouseEvent) => {
  if (!volumeBarRef.value) return
  const percentage = (e.clientX - getBoundingClientRectViewLeft(volumeBarRef.value)) / 45
  setVolume(percentage)
}

const handleMousemovePlayBar = (e: MouseEvent) => {
  if (duration.value && playBarWrap.value) {
    const px = playBarWrap.value.getBoundingClientRect().left
    const tx = e.clientX - px
    if (tx < 0 || tx > playBarWrap.value.offsetWidth) return

    const time = duration.value * (tx / playBarWrap.value.offsetWidth)
    playBarTimeLeft.value = `${tx - (time >= 3600 ? 25 : 20)}px`
    playBarTime.value = secondToTime(time)
    playBarTimeVisible.value = true
  }
}

const toggleVolume = () => {
  if (!audioRef.value) return

  if (audioRef.value.muted) {
    audioRef.value.muted = false
    setVolume(0.5)
  }
  else {
    audioRef.value.muted = true
    setVolume(0)
  }
}

defineExpose({
  toggle,
})
</script>

<style scoped lang="scss">

.audio-player {
  width: 280px;
  height: 50px;
  position: relative;
  user-select: none;
  line-height: 1;
  transform-origin: 0 0;
  background: #000;
}

.controller {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 41px;
  padding: 0 20px;
  user-select: none;
  transition: all 0.3s ease;

  .bar-wrap {
    padding: 5px 0;
    cursor: pointer;
    position: absolute;
    bottom: 35px;
    width: calc(100% - 40px);
    height: 3px;

    &:hover .bar .played .thumb {
      transform: scale(1);
    }

    .bar-time {
      position: absolute;
      left: 0;
      top: -20px;
      border-radius: 4px;
      padding: 5px 7px;
      background-color: rgba(0, 0, 0, 0.62);
      color: #fff;
      font-size: 12px;
      text-align: center;
      opacity: 1;
      transition: opacity 0.1s ease-in-out;
      word-wrap: normal;
      word-break: normal;
      z-index: 2;
      pointer-events: none;

      &.hidden {
        opacity: 0;
      }
    }
    .bar {
      position: relative;
      height: 3px;
      width: 100%;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer;

      .loaded {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.4);
        height: 3px;
        transition: all 0.5s ease;
        will-change: width;
      }
      .played {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height: 3px;
        will-change: width;
        background-color: #fff;

        .thumb {
          position: absolute;
          top: 0;
          right: 5px;
          margin-top: -4px;
          margin-right: -10px;
          height: 11px;
          width: 11px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          transform: scale(0);
          background-color: #fff;
        }
      }
    }
  }
  .icons {
    height: 38px;
    position: absolute;
    bottom: 0;
    left: 14px;
    display: flex;
    align-items: center;

    .icon {
      width: 36px;
      height: 100%;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 20px;

      &.play-icon {
        font-size: 26px;
      }

      .icon-content {
        transition: all .2s ease-in-out;
        opacity: 0.8;
        color: #fff;
      }

      &.active .icon-content {
        opacity: 1;
      }
      &:hover .icon-content {
        opacity: 1;
      }
    }
    .volume {
      height: 100%;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        .volume-bar-wrap .volume-bar {
          width: 45px;
        }
        .volume-bar-wrap .volume-bar .volume-bar-inner .thumb {
          transform: scale(1);
        }
      }
      &.volume-active {
        .volume-bar-wrap .volume-bar {
          width: 45px;
        }
        .volume-bar-wrap .volume-bar .volume-bar-inner .thumb {
          transform: scale(1);
        }
      }
    }
    .volume-bar-wrap {
      display: inline-block;
      margin: 0 15px 0 -5px;
      vertical-align: middle;
      height: 100%;
    }
    .volume-bar {
      position: relative;
      top: 17px;
      width: 0;
      height: 3px;
      background: #aaa;
      transition: all 0.3s ease-in-out;

      .volume-bar-inner {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 100%;
        transition: all 0.1s ease;
        will-change: width;
        background-color: #fff;

        .thumb {
          position: absolute;
          top: 0;
          right: 5px;
          margin-top: -4px;
          margin-right: -10px;
          height: 11px;
          width: 11px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          transform: scale(0);
          background-color: #fff;
        }
      }
    }
  }

  .time {
    height: 38px;
    position: absolute;
    right: 20px;
    bottom: 0;
    display: flex;
    align-items: center;
    line-height: 38px;
    color: #eee;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    vertical-align: middle;
    font-size: 13px;
    cursor: default;

    .ptime {
      margin-right: 2px;
    }
    .dtime {
      margin-left: 2px;
    }
  }
}
</style>