<template>
  <div class="slide-animation-panel">
    <div class="animation-pool">
      <div 
        class="animation-item" 
        :class="{ 'active': currentTurningMode === item.value }" 
        v-for="item in animations" 
        :key="item.label"
        @click="updateTurningMode(item.value)"
      >
        <div :class="['animation-block', item.value]"></div>
        <div class="animation-text">{{item.label}}</div>
      </div>
    </div>
    <Button style="width: 100%;" @click="applyAllSlide()">应用到全部</Button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { Slide } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default defineComponent({
  name: 'slide-animation-panel',
  setup() {
    const store = useStore<State>()
    const slides = computed(() => store.state.slides)
    const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

    const currentTurningMode = computed(() => currentSlide.value.turningMode || 'slideY')

    const animations = [
      { label: '无', value: 'no' },
      { label: '淡入淡出', value: 'fade' },
      { label: '左右推移', value: 'slideX' },
      { label: '上下推移', value: 'slideY' },
    ]

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateTurningMode = (mode: string) => {
      if(mode === currentTurningMode.value) return
      store.commit(MutationTypes.UPDATE_SLIDE, { turningMode: mode })
      addHistorySnapshot()
    }

    const applyAllSlide = () => {
      const newSlides = slides.value.map(slide => {
        return {
          ...slide,
          turningMode: currentSlide.value.turningMode,
        }
      })
      store.commit(MutationTypes.SET_SLIDES, newSlides)
      addHistorySnapshot()
    }

    return {
      currentTurningMode,
      animations,
      updateTurningMode,
      applyAllSlide,
    }
  },
})
</script>

<style lang="scss" scoped>
.animation-pool {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.animation-item {
  width: 50%;
  height: 115px;
  border: solid 1px #d6d6d6;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 25px 0 15px 0;
  position: relative;
  cursor: pointer;

  &.active {
    border-color: $themeColor;
    z-index: 1;
  }

  &:nth-child(2n) {
    margin-left: -1px;
  }
  &:nth-child(n+3) {
    margin-top: -1px;
  }
}
.animation-block {
  width: 64px;
  height: 36px;
  background: #666;
  position: relative;
  overflow: hidden;

  &:hover {
    animation: no 2s infinite linear;
  }
  &.fade:hover {
    animation: fade 2s infinite linear;
  }
  &.slideX:hover {
    &::after {
      width: 192px;
      height: 100%;
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      background-image: linear-gradient(to right, #666 0%, #666 64px, #d9dadb 64px, #d9dadb 128px, #666 128px, #666 192px);
      animation: slideX 3s infinite linear;
    }
  }
  &.slideY:hover {
    &::after {
      width: 100%;
      height: 108px;
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      background-image: linear-gradient(to bottom, #666 0%, #666 36px, #d9dadb 36px, #d9dadb 72px, #666 72px, #666 108px);
      animation: slideY 3s infinite linear;
    }
  }
}
.animation-text {
  font-size: 12px;
  color: #333;
  text-align: center;
}

@keyframes no {
  0% {
    background-color: #666;
  }
  50% {
    background-color: #666;
  }
  51% {
    background-color: #d9dadb;
  }
  100% {
    background-color: #d9dadb;
  }
}
@keyframes fade {
  0% {
    background-color: #d9dadb;
  }
  50% {
    background-color: #666;
  }
  51% {
    background-color: #d9dadb;
  }
  100% {
    background-color: #666;
  }
}
@keyframes slideX {
  0% {
    left: 0;
  }
  17% {
    left: -64px;
  }
  33% {
    left: -64px;
  }
  50% {
    left: -128px;
  }
  67% {
    left: -128px;
  }
  84% {
    left: -192px;
  }
  100% {
    left: -192px;
  }
}
@keyframes slideY {
  0% {
    top: 0;
  }
  17% {
    top: -36px;
  }
  33% {
    top: -36px;
  }
  50% {
    top: -72px;
  }
  67% {
    top: -72px;
  }
  84% {
    top: -108px;
  }
  100% {
    top: -108px;
  }
}
</style>