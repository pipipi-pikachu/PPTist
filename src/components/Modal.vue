<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="modal" ref="modalRef" v-show="visible" tabindex="-1" @keyup.esc="onEsc()">
        <div class="mask" @click="onClickMask()"></div>
        <Transition name="modal-zoom"
          @afterLeave="contentVisible = false"
          @before-enter="contentVisible = true"
        >
          <div class="modal-content" v-show="visible" :style="contentStyle">
            <span class="close-btn" v-if="closeButton" @click="close()"><IconClose /></span>
            <slot v-if="contentVisible"></slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch, type CSSProperties } from 'vue'
import { icons } from '@/plugins/icon'

const { IconClose } = icons

const props = withDefaults(defineProps<{
  visible: boolean
  width?: number
  closeButton?: boolean
  closeOnClickMask?: boolean
  closeOnEsc?: boolean
  contentStyle?: CSSProperties
}>(), {
  width: 480,
  closeButton: false,
  closeOnClickMask: true,
  closeOnEsc: true,
})

const modalRef = ref<HTMLDivElement>()

const emit = defineEmits<{
  (event: 'update:visible', payload: boolean): void
  (event: 'closed'): void
}>()

const contentVisible = ref(false)

const contentStyle = computed(() => {
  return {
    width: props.width + 'px',
    ...(props.contentStyle || {})
  }
})

watch(() => props.visible, () => {
  if (props.visible) {
    nextTick(() => modalRef.value!.focus())
  }
})

const close = () => {
  emit('update:visible', false)
  emit('closed')
}

const onEsc = () => {
  if (props.visible && props.closeOnEsc) close()
}

const onClickMask = () => {
  if (props.closeOnClickMask) close()
}
</script>

<style lang="scss" scoped>
.modal, .mask {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5000;
}

.modal {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;
  border: 0;
}

.mask {
  position: absolute;
  background: rgba(0, 0, 0, .25);
}

.modal-content {
  z-index: 5001;
  padding: 20px;
  background: #fff;
  border-radius: $borderRadius;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
  position: relative;
}

.close-btn {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
}

.modal-fade-enter-active {
  animation: modal-fade-enter .25s both ease-in;
}
.modal-fade-leave-active {
  animation: modal-fade-leave .25s both ease-out;
}
.modal-zoom-enter-active {
  animation: modal-zoom-enter .25s both cubic-bezier(.4, 0, 0, 1.5);
}
.modal-zoom-leave-active {
  animation: modal-zoom-leave .25s both;
}

@keyframes modal-fade-enter {
  from {
    opacity: 0;
  }
}
@keyframes modal-fade-leave {
  to {
    opacity: 0;
  }
}
@keyframes modal-zoom-enter {
  from {
    transform: scale3d(.3, .3, .3);
  }
}
@keyframes modal-zoom-leave {
  to {
    transform: scale3d(.3, .3, .3);
  }
}
</style>