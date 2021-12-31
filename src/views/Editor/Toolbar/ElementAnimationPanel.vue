<template>
  <div class="element-animation-panel">
    <div class="element-animation" v-if="handleElement">
      <Popover 
        trigger="click" 
        v-model:visible="animationPoolVisible" 
        v-if="!['chart', 'video'].includes(handleElement.type)"
        @visibleChange="visible => handlePopoverVisibleChange(visible)"
      >
        <template #content>
          <div class="animation-pool">
            <div class="pool-type" v-for="type in animations" :key="type.name">
              <div class="type-title">{{type.name}}：</div>
              <div class="pool-item-wrapper">
                <div 
                  class="pool-item" 
                  v-for="item in type.children" :key="item.name"
                  @mouseenter="hoverPreviewAnimation = item.value"
                  @mouseleave="hoverPreviewAnimation = ''"
                  @click="addAnimation(item.value)"
                >
                  <div 
                    class="animation-box"
                    :class="[
                      'animate__animated',
                      'animate__faster',
                      hoverPreviewAnimation === item.value && `animate__${item.value}`,
                    ]"
                  >
                    {{item.name}}
                  </div>
                </div>
              </div>
            </div>
            <div class="mask" v-if="!popoverMaskHide"></div>
          </div>
        </template>
        <Button class="element-animation-btn">
          <IconEffects style="margin-right: 5px;" /> {{handleElementAnimationName || '点击选择动画'}}
        </Button>
      </Popover>
      <Button class="element-animation-btn" v-else disabled>
        <IconEffects style="margin-right: 5px;" /> 该元素暂不支持动画
      </Button>
    </div>

    <div class="tip" v-else><IconClick style="margin-right: 5px;" /> 选中画布中的元素添加动画</div>
    
    <Divider />

    <Draggable 
      class="animation-sequence"
      :modelValue="animationSequence"
      :animation="300"
      :scroll="true"
      :scrollSensitivity="50"
      @end="handleDragEnd"
      itemKey="id"
    >
      <template #item="{ element, index }">
        <div class="sequence-item" :class="{ 'active': handleElement?.id === element.elId }">
          <div class="index">{{index + 1}}</div>
          <div class="text">【{{element.elType}}】{{element.animationType}}</div>
          <div class="handler">
            <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="预览">
              <IconPlayOne class="handler-btn" @click="runAnimation(element.elId, element.type, element.duration)" />
            </Tooltip>
            <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="删除">
              <IconCloseSmall class="handler-btn" @click="deleteAnimation(element.elId)" />
            </Tooltip>
          </div>
        </div>
      </template>
    </Draggable>

    <div class="configs" v-if="handleElementAnimation">
      <Divider />

      <div class="duration">
        <div style="flex: 4;">持续时间（毫秒）：</div>
        <InputNumber 
          :min="100"
          :max="5000"
          :step="100"
          :value="handleElementAnimation.duration" 
          @change="value => updateElementAnimationDuration(value)" 
          style="flex: 3;" 
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTAnimation } from '@/types/slides'
import { ANIMATIONS } from '@/configs/animation'
import { ELEMENT_TYPE_ZH } from '@/configs/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import Draggable from 'vuedraggable'

const defaultDuration = 1000

const animationTypes: { [key: string]: string } = {}
for (const type of ANIMATIONS) {
  for (const animation of type.children) {
    animationTypes[animation.value] = animation.name
  }
}

export default defineComponent({
  name: 'element-animation-panel',
  components: {
    Draggable,
  },
  setup() {
    const slidesStore = useSlidesStore()
    const { handleElement, handleElementId } = storeToRefs(useMainStore())
    const { currentSlide, currentSlideAnimations } = storeToRefs(slidesStore)

    const hoverPreviewAnimation = ref('')
    const animationPoolVisible = ref(false)

    const { addHistorySnapshot } = useHistorySnapshot()

    const animations = ANIMATIONS

    // 当前页面的动画列表
    const animationSequence = computed(() => {
      if (!currentSlideAnimations.value) return []
      const animationSequence = []
      for (const animation of currentSlideAnimations.value) {
        const el = currentSlide.value.elements.find(el => el.id === animation.elId)
        if (!el) continue
        const elType = ELEMENT_TYPE_ZH[el.type]
        const animationType = animationTypes[animation.type]

        animationSequence.push({
          ...animation,
          elType,
          animationType,
        })
      }
      return animationSequence
    })

    // 当前选中元素的入场动画信息
    const handleElementAnimation = computed(() => {
      const animations = currentSlideAnimations.value || []
      const animation = animations.find(item => item.elId === handleElementId.value)
      return animation || null
    })

    // 当前选中元素的入场动画名称
    const handleElementAnimationName = computed(() => {
      if (!handleElementAnimation.value) return null
      return animationTypes[handleElementAnimation.value.type]
    })

    // 删除元素入场动画
    const deleteAnimation = (elId: string) => {
      const animations = (currentSlideAnimations.value as PPTAnimation[]).filter(item => item.elId !== elId)
      slidesStore.updateSlide({ animations })
      addHistorySnapshot()
    }

    // 拖拽修改入场动画顺序后同步数据
    const handleDragEnd = (eventData: { newIndex: number; oldIndex: number }) => {
      const { newIndex, oldIndex } = eventData
      if (oldIndex === newIndex) return

      const animations: PPTAnimation[] = JSON.parse(JSON.stringify(currentSlideAnimations.value))
      const animation = animations[oldIndex]
      animations.splice(oldIndex, 1)
      animations.splice(newIndex, 0, animation)
      
      slidesStore.updateSlide({ animations })
      addHistorySnapshot()
    }

    // 执行入场动画预览
    const runAnimation = (elId: string, animationType: string, duration: number) => {
      const prefix = 'animate__'
      const elRef = document.querySelector(`#editable-element-${elId} [class^=editable-element-]`)
      if (elRef) {
        const animationName = `${prefix}${animationType}`
        document.documentElement.style.setProperty('--animate-duration', `${duration}ms`)
        elRef.classList.add(`${prefix}animated`, animationName)

        const handleAnimationEnd = () => {
          document.documentElement.style.removeProperty('--animate-duration')
          elRef.classList.remove(`${prefix}animated`, animationName)
        }
        elRef.addEventListener('animationend', handleAnimationEnd, { once: true })
      }
    }

    // 修改元素入场动画，并执行一次预览
    const updateElementAnimation = (type: string) => {
      if (!currentSlideAnimations.value) return

      const animations = currentSlideAnimations.value.map(item => {
        if (item.elId === handleElementId.value) return { ...item, type }
        return item
      })
      slidesStore.updateSlide({ animations })
      animationPoolVisible.value = false
      addHistorySnapshot()

      const animationItem = currentSlideAnimations.value.find(item => item.elId === handleElementId.value)
      const duration = animationItem?.duration || defaultDuration

      runAnimation(handleElementId.value, type, duration)
    }

    // 修改元素入场动画持续时间
    const updateElementAnimationDuration = (duration: number) => {
      if (!currentSlideAnimations.value) return
      if (duration < 100 || duration > 5000) return

      const animations = currentSlideAnimations.value.map(item => {
        if (item.elId === handleElementId.value) return { ...item, duration }
        return item
      })
      slidesStore.updateSlide({ animations })
      addHistorySnapshot()
    }

    // 添加元素入场动画，并执行一次预览
    const addAnimation = (type: string) => {
      if (handleElementAnimationName.value) {
        updateElementAnimation(type)
        return
      }
      const animations: PPTAnimation[] = currentSlideAnimations.value ? JSON.parse(JSON.stringify(currentSlideAnimations.value)) : []
      animations.push({
        elId: handleElementId.value,
        type,
        duration: defaultDuration,
      })
      slidesStore.updateSlide({ animations })
      animationPoolVisible.value = false
      addHistorySnapshot()

      runAnimation(handleElementId.value, type, defaultDuration)
    }

    // 动画选择面板打开500ms后再移除遮罩层，否则打开面板后迅速滑入鼠标预览会导致抖动
    const popoverMaskHide = ref(false)
    const handlePopoverVisibleChange = (visible: boolean) => {
      if (visible) {
        setTimeout(() => popoverMaskHide.value = true, 500)
      }
      else popoverMaskHide.value = false
    }

    return {
      handleElement,
      animationPoolVisible,
      animations,
      animationSequence,
      hoverPreviewAnimation,
      handleElementAnimation,
      handleElementAnimationName,
      popoverMaskHide,
      addAnimation,
      deleteAnimation,
      handleDragEnd,
      runAnimation,
      updateElementAnimationDuration,
      handlePopoverVisibleChange,
    }
  },
})
</script>

<style lang="scss" scoped>
.element-animation-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.element-animation {
  height: 32px;
  display: flex;
  align-items: center;
}
.element-animation-btn {
  width: 100%;
}
.duration {
  width: 100%;
  display: flex;
  align-items: center;
}
.tip {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
}
.animation-pool {
  width: 400px;
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 12px;
  margin-right: -12px;
  padding-right: 12px;
  position: relative;

  .mask {
    width: 400px;
    height: 500px;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.type-title {
  width: 100%;
  font-size: 13px;
  margin-bottom: 10px;
  border-left: 4px solid #aaa;
  background-color: #eee;
  padding: 2px 0 2px 10px;
}
.pool-item-wrapper {
  @include flex-grid-layout();
}
.pool-item {
  @include flex-grid-layout-children(4, 24%);

  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}
.animation-box {
  background-color: $lightGray;
}

.animation-sequence {
  flex: 1;
  padding-right: 12px;
  margin-right: -12px;

  @include overflow-overlay();
}
.sequence-item {
  height: 36px;
  display: flex;
  align-items: center;
  border: 1px solid $borderColor;
  padding: 6px;
  border-radius: $borderRadius;
  margin-bottom: 8px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &.active {
    border-color: $themeColor;
  }

  .index {
    flex: 1;
  }
  .text {
    flex: 6;
  }
  .handler {
    flex: 2;
    font-size: 15px;
    text-align: right;
  }
  .handler-btn {
    margin-left: 8px;
    cursor: pointer;
  }
}
</style>