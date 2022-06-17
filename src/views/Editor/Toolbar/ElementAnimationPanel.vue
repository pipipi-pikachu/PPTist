<template>
  <div class="element-animation-panel">
    <div class="element-animation" v-if="handleElement">
      <Popover 
        trigger="click" 
        v-model:visible="animationPoolVisible" 
        @visibleChange="visible => handlePopoverVisibleChange(visible)"
      >
        <template #content>
          <div class="tabs">
            <div 
              :class="['tab', tab.key, { 'active': activeTab === tab.key }]"
              v-for="tab in tabs" 
              :key="tab.key"
              @click="activeTab = tab.key"
            >{{tab.label}}</div>
          </div>
          <template v-for="key in animationTypes">
            <div :class="['animation-pool', key]" :key="key" v-if="activeTab === key">
              <div class="pool-type" :key="effect.name" v-for="effect in animations[key]">
                <div class="type-title">{{effect.name}}：</div>
                <div class="pool-item-wrapper">
                  <div 
                    class="pool-item" 
                    v-for="item in effect.children" :key="item.name"
                    @mouseenter="hoverPreviewAnimation = item.value"
                    @mouseleave="hoverPreviewAnimation = ''"
                    @click="addAnimation(key, item.value)"
                  >
                    <div 
                      class="animation-box"
                      :class="[
                        `${ANIMATION_CLASS_PREFIX}animated`,
                        `${ANIMATION_CLASS_PREFIX}fast`,
                        hoverPreviewAnimation === item.value && `${ANIMATION_CLASS_PREFIX}${item.value}`,
                      ]"
                    >{{item.name}}</div>
                  </div>
                </div>
              </div>
              <div class="mask" v-if="!popoverMaskHide"></div>
            </div>
          </template>
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
      handle=".sequence-content"
      @end="handleDragEnd"
      itemKey="id"
    >
      <template #item="{ element }">
        <div class="sequence-item" :class="[element.type, { 'active': handleElement?.id === element.elId }]">
          <div class="sequence-content">
            <div class="index">{{element.index}}</div>
            <div class="text">【{{element.elType}}】{{element.animationEffect}}</div>
            <div class="handler">
              <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="预览">
                <IconPlayOne class="handler-btn" @click="runAnimation(element.elId, element.effect, element.duration)" />
              </Tooltip>
              <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="删除">
                <IconCloseSmall class="handler-btn" @click="deleteAnimation(element.id)" />
              </Tooltip>
            </div>
          </div>

          <div class="configs" v-if="handleElementAnimation[0]?.elId === element.elId">
            <Divider style="margin: 16px 0;" />

            <div class="config-item">
              <div style="flex: 3;">持续时长：</div>
              <InputNumber 
                :min="500"
                :max="3000"
                :step="500"
                :value="element.duration" 
                @change="value => updateElementAnimationDuration(element.id, value as number)" 
                style="flex: 5;" 
              />
            </div>
            <div class="config-item">
              <div style="flex: 3;">触发方式：</div>
              <Select
                :value="element.trigger"
                @change="value => updateElementAnimationTrigger(element.id, value as 'click' | 'meantime' | 'auto')"
                style="flex: 5;"
              >
                <SelectOption value="click">主动触发</SelectOption>
                <SelectOption value="meantime">与上一动画同时</SelectOption>
                <SelectOption value="auto">上一动画之后</SelectOption>
              </Select>
            </div>
            <div class="config-item">
              <Button style="flex: 1;" @click="openAnimationPool(element.id)">更换动画</Button>
            </div>
          </div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { nanoid } from 'nanoid'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTAnimation } from '@/types/slides'
import { 
  ENTER_ANIMATIONS,
  EXIT_ANIMATIONS,
  ATTENTION_ANIMATIONS,
  ANIMATION_DEFAULT_DURATION,
  ANIMATION_DEFAULT_TRIGGER,
  ANIMATION_CLASS_PREFIX,
} from '@/configs/animation'
import { ELEMENT_TYPE_ZH } from '@/configs/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import Draggable from 'vuedraggable'

const animationEffects: { [key: string]: string } = {}
for (const effect of ENTER_ANIMATIONS) {
  for (const animation of effect.children) {
    animationEffects[animation.value] = animation.name
  }
}
for (const effect of EXIT_ANIMATIONS) {
  for (const animation of effect.children) {
    animationEffects[animation.value] = animation.name
  }
}
for (const effect of ATTENTION_ANIMATIONS) {
  for (const animation of effect.children) {
    animationEffects[animation.value] = animation.name
  }
}

type AnimationType = 'in' | 'out' | 'attention'
interface TabItem {
  key: AnimationType
  label: string
}

const animationTypes: AnimationType[] = ['in', 'out', 'attention']

const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(useMainStore())
const { currentSlide, formatedAnimations, currentSlideAnimations } = storeToRefs(slidesStore)

const tabs: TabItem[] = [
  { key: 'in', label: '入场' },
  { key: 'out', label: '退场' },
  { key: 'attention', label: '强调' },
]
const activeTab = ref('in')

watch(() => handleElementId.value, () => {
  animationPoolVisible.value = false
})

const hoverPreviewAnimation = ref('')
const animationPoolVisible = ref(false)

const { addHistorySnapshot } = useHistorySnapshot()

// 当前页面的动画列表
const animationSequence = computed(() => {
  const animationSequence = []
  for (let i = 0; i < formatedAnimations.value.length; i++) {
    const item = formatedAnimations.value[i]
    for (let j = 0; j < item.animations.length; j++) {
      const animation = item.animations[j]
      const el = currentSlide.value.elements.find(el => el.id === animation.elId)
      if (!el) continue

      const elType = ELEMENT_TYPE_ZH[el.type]
      const animationEffect = animationEffects[animation.effect]
      animationSequence.push({
        ...animation,
        index: j === 0 ? i + 1 : '',
        elType,
        animationEffect,
      })
    }
  }
  return animationSequence
})

// 当前选中元素的入场动画信息
const handleElementAnimation = computed(() => {
  const animations = currentSlideAnimations.value
  const animation = animations.filter(item => item.elId === handleElementId.value)
  return animation || []
})

// 删除元素动画
const deleteAnimation = (id: string) => {
  const animations = currentSlideAnimations.value.filter(item => item.id !== id)
  slidesStore.updateSlide({ animations })
  addHistorySnapshot()
}

// 拖拽修改动画顺序后同步数据
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

// 执行动画预览
const runAnimation = (elId: string, effect: string, duration: number) => {
  const elRef = document.querySelector(`#editable-element-${elId} [class^=editable-element-]`)
  if (elRef) {
    const animationName = `${ANIMATION_CLASS_PREFIX}${effect}`
    document.documentElement.style.setProperty('--animate-duration', `${duration}ms`)
    elRef.classList.add(`${ANIMATION_CLASS_PREFIX}animated`, animationName)

    const handleAnimationEnd = () => {
      document.documentElement.style.removeProperty('--animate-duration')
      elRef.classList.remove(`${ANIMATION_CLASS_PREFIX}animated`, animationName)
    }
    elRef.addEventListener('animationend', handleAnimationEnd, { once: true })
  }
}

// 修改元素动画持续时间
const updateElementAnimationDuration = (id: string, duration: number) => {
  if (duration < 100 || duration > 5000) return

  const animations = currentSlideAnimations.value.map(item => {
    if (item.id === id) return { ...item, duration }
    return item
  })
  slidesStore.updateSlide({ animations })
  addHistorySnapshot()
}

// 修改触发方式
const updateElementAnimationTrigger = (id: string, trigger: 'click' | 'meantime' | 'auto') => {
  const animations = currentSlideAnimations.value.map(item => {
    if (item.id === id) return { ...item, trigger }
    return item
  })
  slidesStore.updateSlide({ animations })
  addHistorySnapshot()
}

// 修改元素动画，并执行一次预览
const updateElementAnimation = (type: AnimationType, effect: string) => {
  const animations = currentSlideAnimations.value.map(item => {
    if (item.id === handleAnimationId.value) return { ...item, type, effect }
    return item
  })
  slidesStore.updateSlide({ animations })
  animationPoolVisible.value = false
  addHistorySnapshot()

  const animationItem = currentSlideAnimations.value.find(item => item.elId === handleElementId.value)
  const duration = animationItem?.duration || ANIMATION_DEFAULT_DURATION

  runAnimation(handleElementId.value, effect, duration)
}

const handleAnimationId = ref('')
// 添加元素动画，并执行一次预览
const addAnimation = (type: AnimationType, effect: string) => {
  if (handleAnimationId.value) {
    updateElementAnimation(type, effect)
    return
  }

  const animations: PPTAnimation[] = JSON.parse(JSON.stringify(currentSlideAnimations.value))
  animations.push({
    id: nanoid(10),
    elId: handleElementId.value,
    type,
    effect,
    duration: ANIMATION_DEFAULT_DURATION,
    trigger: ANIMATION_DEFAULT_TRIGGER,
  })
  slidesStore.updateSlide({ animations })
  animationPoolVisible.value = false
  addHistorySnapshot()

  runAnimation(handleElementId.value, effect, ANIMATION_DEFAULT_DURATION)
}

// 动画选择面板打开600ms后再移除遮罩层，否则打开面板后迅速滑入鼠标预览会导致抖动
const popoverMaskHide = ref(false)
const handlePopoverVisibleChange = (visible: boolean) => {
  if (visible) {
    setTimeout(() => popoverMaskHide.value = true, 600)
  }
  else popoverMaskHide.value = false
}

const openAnimationPool = (elementId: string) => {
  animationPoolVisible.value = true
  handleAnimationId.value = elementId
  handlePopoverVisibleChange(true)
}

const animations = {
  in: ENTER_ANIMATIONS,
  out: EXIT_ANIMATIONS,
  attention: ATTENTION_ANIMATIONS,
}
</script>

<style lang="scss" scoped>
$inColor: #68a490;
$outColor: #d86344;
$attentionColor: #e8b76a;

.element-animation-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tabs {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid $borderColor;
  margin-bottom: 20px;
}
.tab {
  width: 33.33%;
  padding-bottom: 8px;
  border-bottom: 2px solid transparent;
  text-align: center;
  cursor: pointer;

  &.active {
    border-bottom: 2px solid $themeColor;
  }
  &.in.active {
    border-bottom-color: $inColor;
  }
  &.out.active {
    border-bottom-color: $outColor;
  }
  &.attention.active {
    border-bottom-color: $attentionColor;
  }
}
.element-animation {
  height: 32px;
  display: flex;
  align-items: center;
}
.element-animation-btn {
  width: 100%;
}
.config-item {
  display: flex;
  align-items: center;

  & + .config-item {
    margin-top: 5px;
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
    @include absolute-0();
  }

  &.in .type-title {
    border-left-color: $inColor;
    background-color: rgba($color: $inColor, $alpha: .15);
  }
  &.out .type-title {
    border-left-color: $outColor;
    background-color: rgba($color: $outColor, $alpha: .15);
  }
  &.attention .type-title {
    border-left-color: $attentionColor;
    background-color: rgba($color: $attentionColor, $alpha: .15);
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
  border: 1px solid $borderColor;
  padding: 10px 6px;
  border-radius: $borderRadius;
  margin-bottom: 8px;
  transition: all .5s;

  &.in.active {
    border-color: $inColor;
  }
  &.out.active {
    border-color: $outColor;
  }
  &.attention.active {
    border-color: $attentionColor;
  }
  &.active {
    height: auto;
  }

  .sequence-content {
    display: flex;
    align-items: center;
    cursor: grab;

    &:active {
      cursor: grabbing;
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
}
</style>