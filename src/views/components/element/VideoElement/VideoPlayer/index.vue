<template>
  <div 
    class="video-player"
    :class="{ 'hide-controller': hideController }" 
    :style="{
      width: width * scale + 'px',
      height: height * scale + 'px',
      transform: `scale(${1 / scale})`,
    }"
    @mousemove="autoHideController()"
    @click="autoHideController()"
  >
    <div class="video-wrap" @click="toggle()">
      <div class="load-error" v-if="loadError">视频加载失败</div>

      <video
        class="video"
        ref="videoRef"
        :src="src"
        :poster="poster"
        webkit-playsinline
        playsinline
        @durationchange="handleDurationchange()"
        @timeupdate="handleTimeupdate()"
        @ended="handleEnded()"
        @progress="handleProgress()"
        @play="autoHideController()"
        @pause="autoHideController()"
        @error="handleError()"
      ></video>
      <div class="bezel">
        <span class="bezel-icon" :class="{ 'bezel-transition': bezelTransition }" @animationend="bezelTransition = false">
          <IconPause v-if="paused" />
          <IconPlayOne v-else />
        </span>
      </div>
    </div>

    <div class="controller-mask"></div>
    <div class="controller">
      <div class="icons icons-left">
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
        <span class="time">
          <span class="ptime">{{ptime}}</span> / <span class="dtime">{{dtime}}</span>
        </span>
      </div>

      <div class="icons icons-right">
        <div class="speed">
          <div class="icon speed-icon">
            <span class="icon-content" @click="speedMenuVisible = !speedMenuVisible">{{playbackRate === 1 ? '倍速' : (playbackRate + 'x')}}</span>
            <div class="speed-menu" v-if="speedMenuVisible" @mouseleave="speedMenuVisible = false">
              <div 
                class="speed-menu-item" 
                :class="{ 'active': item.value === playbackRate }"
                v-for="item in speedOptions" 
                :key="item.label" 
                @click="speed(item.value)"
              >{{item.label}}</div>
            </div>
          </div>
        </div>
        <div class="loop" @click="toggleLoop()">
          <div class="icon loop-icon" :class="{ 'active': loop }">
            <span class="icon-content">循环{{loop ? '开' : '关'}}</span>
          </div>
        </div>
      </div>

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
import useMSE from './useMSE'

const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    default: '',
  },
  scale: {
    type: Number,
    default: 1,
  },
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

const videoRef = ref<HTMLVideoElement>()
const playBarWrap = ref<HTMLElement>()
const volumeBarRef = ref<HTMLElement>()

const volume = ref(0.5)
const paused = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const loaded = ref(0)
const loop = ref(false)
const bezelTransition = ref(false)
const playbackRate = ref(1)

const playBarTimeVisible = ref(false)
const playBarTime = ref('00:00')
const playBarTimeLeft = ref('0')

const ptime = computed(() => secondToTime(currentTime.value))
const dtime = computed(() => secondToTime(duration.value))
const playedBarWidth = computed(() => currentTime.value / duration.value * 100 + '%')
const loadedBarWidth = computed(() => loaded.value / duration.value * 100 + '%')
const volumeBarWidth = computed(() => volume.value * 100 + '%')

const speedMenuVisible = ref(false)
const speedOptions = [
  { label: '2x', value: 2 },
  { label: '1.5x', value: 1.5 },
  { label: '1.25x', value: 1.25 },
  { label: '1x', value: 1 },
  { label: '0.75x', value: 0.75 },
  { label: '0.5x', value: 0.5 },
]

const seek = (time: number) => {
  if (!videoRef.value) return

  time = Math.max(time, 0)
  time = Math.min(time, duration.value)

  videoRef.value.currentTime = time
  currentTime.value = time
}

const play = () => {
  if (!videoRef.value) return

  paused.value = false
  videoRef.value.play()
  bezelTransition.value = true
}

const pause = () => {
  if (!videoRef.value) return

  paused.value = true
  videoRef.value.pause()
  bezelTransition.value = true
}

const toggle = () => {
  if (paused.value) play() 
  else pause()
}

const setVolume = (percentage: number) => {
  if (!videoRef.value) return

  percentage = Math.max(percentage, 0)
  percentage = Math.min(percentage, 1)

  videoRef.value.volume = percentage
  volume.value = percentage
  if (videoRef.value.muted && percentage !== 0) videoRef.value.muted = false
}

const speed = (rate: number) => {
  if (videoRef.value) videoRef.value.playbackRate = rate
  playbackRate.value = rate
}

const handleDurationchange = () => {
  duration.value = videoRef.value?.duration || 0
}

const handleTimeupdate = () => {
  currentTime.value = videoRef.value?.currentTime || 0
}

const handleEnded = () => {
  if (!loop.value) pause()
  else {
    seek(0)
    play()
  }
}

const handleProgress = () => {
  loaded.value = videoRef.value?.buffered.length ? videoRef.value.buffered.end(videoRef.value.buffered.length - 1) : 0
}

const loadError = ref(false)
const handleError = () => loadError.value = true

const thumbMove = (e: MouseEvent | TouchEvent) => {
  if (!videoRef.value || !playBarWrap.value) return
  const clientX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX
  let percentage = (clientX - getBoundingClientRectViewLeft(playBarWrap.value)) / playBarWrap.value.clientWidth
  percentage = Math.max(percentage, 0)
  percentage = Math.min(percentage, 1)
  const time = percentage * duration.value

  videoRef.value.currentTime = time
  currentTime.value = time
}

const thumbUp = (e: MouseEvent | TouchEvent) => {
  if (!videoRef.value || !playBarWrap.value) return

  const clientX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX
  let percentage = (clientX - getBoundingClientRectViewLeft(playBarWrap.value)) / playBarWrap.value.clientWidth
  percentage = Math.max(percentage, 0)
  percentage = Math.min(percentage, 1)
  const time = percentage * duration.value

  videoRef.value.currentTime = time
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
  if (!videoRef.value) return

  if (videoRef.value.muted) {
    videoRef.value.muted = false
    setVolume(0.5)
  }
  else {
    videoRef.value.muted = true
    setVolume(0)
  }
}

const toggleLoop = () => {
  loop.value = !loop.value
}

const autoHideControllerTimer = ref(-1)
const hideController = ref(false)
const autoHideController = () => {
  hideController.value = false
  clearTimeout(autoHideControllerTimer.value)
  autoHideControllerTimer.value = setTimeout(() => {
    if (videoRef.value?.played.length) hideController.value = true
  }, 3000)
}

useMSE(props.src, videoRef)
</script>

<style scoped lang="scss">
@import './style.scss';
</style>