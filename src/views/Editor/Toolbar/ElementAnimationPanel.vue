<template>
  <div class="element-animation-panel">
    <div class="element-animation">
      <Popover trigger="click">
        <template #content>
          <div class="animation-pool">
            <div class="pool-type" v-for="type in animations" :key="type.name">
              <div class="type-title">{{type.name}}：</div>
              <div class="pool-item-wrapper">
                <div 
                  class="pool-item" 
                  v-for="item in type.children" :key="item.name"
                  :class="[
                    'animate__animated',
                    hoverPreviewAnimation === item.value && `animate__${item.value}`,
                  ]"
                  @mouseover="hoverPreviewAnimation = item.value"
                >
                  {{item.name}}
                </div>
              </div>
            </div>
          </div>
        </template>
        <Button class="element-animation-btn">旋转进入</Button>
      </Popover>
    </div>
    
    <Divider />

    <Draggable 
      class="animation-sequence"
      :modelValue="animationSequence"
      :animation="300"
      :scroll="true"
      :scrollSensitivity="50"
      itemKey="id"
    >
      <template #item="{ element, index }">
        <div class="sequence-item">
          <div class="index">{{index + 1}}</div>
          <div class="el-type">{{element.elType}}</div>
          <div class="animation-type">{{element.animationType}}</div>
          <div class="handler">
            <PlayCircleOutlined class="handler-btn" />
            <DeleteOutlined class="handler-btn" />
          </div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { PPTAnimation, Slide } from '@/types/slides'
import { ANIMATIONS } from '@/configs/animation'
import { ELEMENT_TYPE } from '@/configs/element'

import Draggable from 'vuedraggable'
import { Button, Divider, Popover } from 'ant-design-vue'
import {
  PlayCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'

const animationTypes: { [key: string]: string } = {}
for(const type of ANIMATIONS) {
  for(const animation of type.children) {
    animationTypes[animation.value] = animation.name
  }
}

export default defineComponent({
  name: 'element-animation-panel',
  components: {
    Draggable,
    Button,
    Divider,
    PlayCircleOutlined,
    DeleteOutlined,
    Popover,
  },
  setup() {
    const store = useStore<State>()
    const currentSlideAnimations: Ref<PPTAnimation[] | null> = computed(() => store.getters.currentSlideAnimations)
    const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

    const hoverPreviewAnimation = ref('')

    const animations = ANIMATIONS

    const animationSequence = computed(() => {
      if(!currentSlideAnimations.value) return []
      const animationSequence = []
      for(const animation of currentSlideAnimations.value) {
        const el = currentSlide.value.elements.find(el => el.id === animation.elId)
        if(!el) continue
        const elType = ELEMENT_TYPE[el.type]
        const animationType = animationTypes[animation.type]

        animationSequence.push({
          ...animation,
          elType,
          animationType,
        })
      }
      return animationSequence
    })

    return {
      animations,
      animationSequence,
      hoverPreviewAnimation,
    }
  },
})
</script>

<style lang="scss" scoped>
.element-animation-btn {
  width: 100%;
}
.animation-pool {
  width: 400px;
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 12px;
  margin-right: -12px;
  padding-right: 12px;
}
.type-title {
  width: 100%;
  font-size: 13px;
  margin-bottom: 10px;
  border-left: 4px solid #aaa;
  background-color: #eee;
  padding-left: 10px;
}
.pool-item-wrapper {
  @include grid-layout-wrapper();
}
.pool-item {
  @include grid-layout-item(4, 24%);

  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #f5f5f5;
  cursor: pointer;
}

.sequence-item {
  height: 32px;
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  padding: 6px;
  border-radius: $borderRadius;
  margin-bottom: 5px;

  &:hover {
    .animation-type {
      display: none;
    }
    .handler {
      display: block;
    }
  }

  .index {
    flex: 1;
  }
  .el-type {
    flex: 2;
  }
  .animation-type {
    flex: 3;
    text-align: right;
  }
  .handler {
    display: none;
    flex: 3;
    text-align: right;
  }
  .handler-btn {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>