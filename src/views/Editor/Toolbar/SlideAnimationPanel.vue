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
import { computed, defineComponent } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { Slide } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default defineComponent({
  name: 'slide-animation-panel',
  setup() {
    const store = useStore()
    const slides = computed(() => store.state.slides)
    const currentSlide = computed<Slide>(() => store.getters.currentSlide)

    const currentTurningMode = computed(() => currentSlide.value.turningMode || 'slideY')

    const animations = [
      { label: '无', value: 'no' },
      { label: '淡入淡出', value: 'fade' },
      { label: '左右推移', value: 'slideX' },
      { label: '上下推移', value: 'slideY' },
    ]

    const { addHistorySnapshot } = useHistorySnapshot()

    // 修改播放时的切换页面方式
    const updateTurningMode = (mode: string) => {
      if (mode === currentTurningMode.value) return
      store.commit(MutationTypes.UPDATE_SLIDE, { turningMode: mode })
      addHistorySnapshot()
    }

    // 将当前页的切换页面方式应用到全部页面
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

  @mixin elAnimation($animationType) {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #d9dadb;
    animation: $animationType .3s linear;
  }

  &.fade:hover {
    &::after {
      @include elAnimation(fade);
    }
  }
  &.slideX:hover {
    &::after {
      @include elAnimation(slideX);
    }
  }
  &.slideY:hover {
    &::after {
      @include elAnimation(slideY);
    }
  }
}
.animation-text {
  font-size: 12px;
  color: #333;
  text-align: center;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes slideX {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes slideY {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>