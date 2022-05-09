<template>
  <div class="element-animation-panel">
    <div class="element-animation" v-if="handleElement">
      <Popover 
        trigger="click" 
        v-model:visible="animationPoolVisible" 
        @visibleChange="visible => handlePopoverVisibleChange(visible)"
      >
        <template #content>
          <Tabs v-model:activeKey="tabsActiveKey" tab-position="left" type="card">
            <TabPane key="animation_in" tab="进场动效">
              <div class="animation-pool">
                <div class="pool-type" :key="type.name" v-for="type in animations">
                  <div v-if="!type.hiddenElement.includes(handleElement.type)">
                    <div class="type-title">{{type.name}}：</div>
                    <div class="pool-item-wrapper">
                      <div 
                        class="pool-item" 
                        v-for="item in type.children" :key="item.name"
                        @mouseenter="hoverPreviewAnimation = item.value"
                        @mouseleave="hoverPreviewAnimation = ''"
                        @click="addAnimation(item.value, 'in')"
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
                </div>
                <div class="mask" v-if="!popoverMaskHide"></div>
              </div>
            </TabPane>
            <TabPane key="animation_out" tab="退场动效">
              <div class="animation-pool">
                <div class="pool-type" :key="type.name" v-for="type in animationsExits">
                  <div v-if="!type.hiddenElement.includes(handleElement.type)">
                    <div class="type-title">{{type.name}}：</div>
                    <div class="pool-item-wrapper">
                      <div 
                        class="pool-item" 
                        v-for="item in type.children" :key="item.name"

                        @mouseenter="onAnimationOut(item)"
                        @mouseleave="hoverPreviewAnimation = ''"
                        @click="addAnimation(item.value, 'out')"
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
                </div>
                <div class="mask" v-if="!popoverMaskHide"></div>
              </div>
            </TabPane>
          </Tabs>
        </template>
        <Button class="element-animation-btn" @click="handleAnimationId = ''">
          <IconEffects style="margin-right: 5px;" /> 添加动画
        </Button>
      </Popover>
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
          <div class="sequence-content">
            <div class="index">{{index + 1}}</div>
            <div class="text">【{{element.elType}}】{{element.animationType}}</div>
            <div class="handler">
              <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="预览">
                <IconPlayOne class="handler-btn" @click="runAnimation(element.elId, element.type, element.duration, element.delay)" />
              </Tooltip>
              <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="删除">
                <IconCloseSmall class="handler-btn" @click="deleteAnimation(element.id)" />
              </Tooltip>
            </div>
          </div>

          <div class="configs" v-if="handleElementAnimation.length && handleElementAnimation[0].elId === element.elId">
            <Divider />

            <div class="duration">
              <div style="flex: 3 1 0%;">动画时长</div>
              <InputNumber 
                :min="100"
                :max="5000"
                :step="100"
                :value="element.duration" 
                @change="value => updateElementAnimationDuration(element, value)" 
                style="flex: 4 1 20%;" 
              />
              <div class="duration-r"> 毫秒</div>
            </div>

            <div class="duration">
              <div style="flex: 3;">动画启动方式</div>
              <Select
                v-model:value="element.implement"
                @change="value => updateElementAnimationImplement(element, value)"
                style="flex: 4;"
              >
                <SelectOption :value="0">单击时</SelectOption>
                <SelectOption :value="1">与上一个一起</SelectOption>
                <SelectOption :value="2">在上一个之后</SelectOption>
              </Select>
            </div>

            <div class="duration" v-if="element.implement !== 1">
              <div style="flex: 1;">延迟</div>
              <InputNumber 
                :min="0"
                :max="5000"
                :step="100"
                :value="element.delay" 
                @change="value => updateElementAnimationDelay(element, value)" 
                style="flex: 2;" 
              />
              <div class="duration-r">毫秒启动效果</div>
            </div>

            <div class="duration duration-btn">
              <Button @click="handlePopoverVisibleChange(true), animationPoolVisible = true, handleAnimationId = element.id">更换特效</Button>
              <Button @click="updateElementAnimationAll(element)">应用到本页所有</Button>
            </div>
          </div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { nanoid } from 'nanoid'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTAnimation } from '@/types/slides'
import { ANIMATIONS, ANIMATIONS_EXITS } from '@/configs/animation'
import { ELEMENT_TYPE_ZH } from '@/configs/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import { message } from 'ant-design-vue'

import Draggable from 'vuedraggable'

const defaultDuration = 1000
const defaultDelay = 0
const defaultImplement = 0 // (0->单击、1->与上一个一起、2->在上一个之后)

const animationTypes: { [key: string]: string } = {}
for (const type of ANIMATIONS) {
  for (const animation of type.children) {
    animationTypes[animation.value] = animation.name
  }
}
for (const type of ANIMATIONS_EXITS) {
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

    watch(() => handleElementId.value, () => {
      animationPoolVisible.value = false
    })

    const hoverPreviewAnimation = ref('')
    const tabsActiveKey = ref('animation_in')
    const animationPoolVisible = ref(false)

    const { addHistorySnapshot } = useHistorySnapshot()

    const animations = ANIMATIONS
    const animationsExits = ANIMATIONS_EXITS

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
      const animation = animations.filter(item => item.elId === handleElementId.value)
      return animation || []
    })

    // 删除元素入场动画
    const deleteAnimation = (id: string) => {
      const animations = (currentSlideAnimations.value as PPTAnimation[]).filter(item => item.id !== id)
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
    const runAnimation = (elId: string, animationType: string, duration: number, delay: number) => {
      const prefix = 'animate__'
      const elRef = document.querySelector(`#editable-element-${elId} [class^=editable-element-]`)
      if (elRef) {
        setTimeout(() => {
          const animationName = `${prefix}${animationType}`
          document.documentElement.style.setProperty('--animate-duration', `${duration}ms`)
          elRef.classList.add(`${prefix}animated`, animationName)

          emitter.emit(EmitterEvents.RUN_ANIMATION)

          const handleAnimationEnd = () => {
            document.documentElement.style.removeProperty('--animate-duration')
            elRef.classList.remove(`${prefix}animated`, animationName)

            emitter.emit(EmitterEvents.END_RUN_ANIMATION)
          }
          elRef.addEventListener('animationend', handleAnimationEnd, { once: true })
        }, delay)
      }
    }

    // 修改元素入场动画持续时间
    const updateElementAnimationDuration = (element: { id: string }, duration: number) => {
      if (!currentSlideAnimations.value) return
      if (duration < 100 || duration > 5000) return

      const animations = currentSlideAnimations.value.map(item => {
        if (item.id === element.id) return { ...item, duration }
        return item
      })
      slidesStore.updateSlide({ animations })
      addHistorySnapshot()
    }

    // 修改启动方式
    const updateElementAnimationImplement = (element: { id: string }, implement: number) => {
      if (!currentSlideAnimations.value) return

      const animations = currentSlideAnimations.value.map(item => {
        if (item.id === element.id) return { ...item, implement }
        return item
      })
      slidesStore.updateSlide({ animations })
      addHistorySnapshot()
    }

    // 修改延迟执行时间
    const updateElementAnimationDelay = (element: { id: string }, delay: number) => {
      if (!currentSlideAnimations.value) return
      if (delay < 0 || delay > 5000) return

      const animations = currentSlideAnimations.value.map(item => {
        if (item.id === element.id) return { ...item, delay }
        return item
      })
      slidesStore.updateSlide({ animations })
      addHistorySnapshot()
    }
    
    // 应用本页全部动画
    const updateElementAnimationAll = (element: { duration: number; delay: number; implement: number }) => {
      if (!handleElementAnimation.value) return
      const animations: PPTAnimation[] = currentSlideAnimations.value ? JSON.parse(JSON.stringify(currentSlideAnimations.value)) : []

      const handleElementAnimationMap = {
        duration: element.duration,
        delay: element.delay,
        implement: element.implement
      }
      const animationsUpdate: PPTAnimation[] = animations.map(x => Object.assign({}, x, handleElementAnimationMap))
      slidesStore.updateSlide({ animations: animationsUpdate })
      addHistorySnapshot()

      message.success({ content: '已应用本页其他动画', duration: 3 })
    }

    // 修改元素入场动画，并执行一次预览
    const updateElementAnimation = (type: string, effect: string) => {
      if (!currentSlideAnimations.value) return

      const animations = currentSlideAnimations.value.map(item => {
        if (item.id === handleAnimationId.value) return { ...item, type, effect }
        return item
      })
      slidesStore.updateSlide({ animations })
      animationPoolVisible.value = false
      addHistorySnapshot()

      const animationItem = currentSlideAnimations.value.find(item => item.elId === handleElementId.value)
      const duration = animationItem?.duration || defaultDuration
      const delay = animationItem?.delay || defaultDelay

      runAnimation(handleElementId.value, type, duration, delay)
    }

    const handleAnimationId = ref('')
    // 添加元素入场动画，并执行一次预览
    const addAnimation = (type: string, effect: string) => {
      if (handleAnimationId.value) {
        updateElementAnimation(type, effect)
        return
      }

      const animations: PPTAnimation[] = currentSlideAnimations.value ? JSON.parse(JSON.stringify(currentSlideAnimations.value)) : []
      animations.push({
        id: nanoid(10),
        elId: handleElementId.value,
        type,
        effect,
        duration: defaultDuration,
        delay: defaultDelay,
        implement: defaultImplement,
      })
      slidesStore.updateSlide({ animations })
      animationPoolVisible.value = false
      addHistorySnapshot()

      runAnimation(handleElementId.value, type, defaultDuration, defaultDelay)
    }

    // 动画选择面板打开500ms后再移除遮罩层，否则打开面板后迅速滑入鼠标预览会导致抖动
    const popoverMaskHide = ref(false)
    const handlePopoverVisibleChange = (visible: boolean) => {
      if (visible) {
        setTimeout(() => popoverMaskHide.value = true, 500)
      }
      else popoverMaskHide.value = false
    }

    const animationOutItem = ref({})
    const animationOutTimer = ref(0)
    const onAnimationOut = (item: { value: string }) => {
      if (item.value === animationOutItem.value) {
        return
      }
      clearTimeout(animationOutTimer.value)
      animationOutItem.value = item
      hoverPreviewAnimation.value = item.value
      animationOutTimer.value = window.setTimeout(() => {
        hoverPreviewAnimation.value = ''
      }, 500)
    }

    return {
      handleAnimationId,
      handleElement,
      animationPoolVisible,
      animations,
      animationsExits,
      animationSequence,
      hoverPreviewAnimation,
      handleElementAnimation,
      popoverMaskHide,
      addAnimation,
      deleteAnimation,
      handleDragEnd,
      runAnimation,
      updateElementAnimationDuration,
      updateElementAnimationImplement,
      updateElementAnimationDelay,
      handlePopoverVisibleChange,
      updateElementAnimationAll,
      tabsActiveKey,
      onAnimationOut,
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
  margin-top: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  word-break: keep-all;
  .duration-r {
    flex: 2;
    text-indent: 8px;
  }
  &.duration-btn {
    margin-top: 20px;
    justify-content: space-between;
  }
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
  // height: 35px;
  border: 1px solid $borderColor;
  padding: 9px 6px;
  border-radius: $borderRadius;
  margin-bottom: 8px;
  transition: all .5s;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &.active {
    border-color: $themeColor;
    height: auto;
  }

  .sequence-content {
    display: flex;
    align-items: center;
    // height: 23px;
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
}
</style>