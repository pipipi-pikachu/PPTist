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
        :autoplay="autoplay"
        :poster="poster"
        webkit-playsinline
        playsinline
        @durationchange="handleDurationchange()"
        @timeupdate="handleTimeupdate()"
        @ended="handleEnded()"
        @progress="handleProgress()"
        @play="autoHideController(); paused = false"
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

const props = withDefaults(defineProps<{
  width: number
  height: number
  src: string
  poster?: string
  autoplay?: boolean
  scale?: number
}>(), {
  poster: '',
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
.video-player {
  position: relative;
  overflow: hidden;
  user-select: none;
  line-height: 1;
  transform-origin: 0 0;

  &.hide-controller {
    cursor: none;

    .controller-mask {
      opacity: 0;
      transform: translateY(100%);
    }
    .controller {
      opacity: 0;
      transform: translateY(100%);
    }
  }
}

.video-wrap {
  position: relative;
  background: #000;
  font-size: 0;
  width: 100%;
  height: 100%;

  .video {
    width: 100%;
    height: 100%;
  }
}

.controller-mask {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==) repeat-x bottom;
  height: 98px;
  width: 100%;
  position: absolute;
  bottom: 0;
  transition: all 0.3s ease;
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
    bottom: 33px;
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
    display: flex;
    align-items: center;

    &.icons-right {
      right: 15px;
    }
    .time {
      line-height: 38px;
      color: #eee;
      text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
      vertical-align: middle;
      font-size: 13px;
      cursor: default;
    }
    .icon {
      width: 40px;
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
      &.loop-icon {
        font-size: 12px;

        .icon-content {
          opacity: 0.5;
        }
      }
      &.speed-icon {
        font-size: 12px;
        position: relative;
      }
      .speed-menu {
        width: 70px;
        position: absolute;
        bottom: 30px;
        left: -23px;
        background-color: #22211b;
        padding: 5px 0;
        color: #ddd;

        .speed-menu-item {
          padding: 8px 0;
          text-align: center;

          &:hover {
            background-color: #393833;
            color: #fff;
          }
          &.active {
            font-weight: 700;
            color: #fff;
          }
        }
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
    .loop {
      display: inline-block;
      height: 100%;
    }
  }
}

.bezel {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  font-size: 22px;
  color: #fff;
  pointer-events: none;

  .bezel-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -26px 0 0 -26px;
    height: 52px;
    width: 52px;
    padding: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
    font-size: 40px;

    &.bezel-transition {
      animation: bezel-hide 0.5s linear;
    }

    @keyframes bezel-hide {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(2);
      }
    }
  }
}

.load-error {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  font-size: 15px;
  color: #fff;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>