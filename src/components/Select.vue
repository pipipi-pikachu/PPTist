<template>
  <div class="select-wrap" v-if="disabled">
    <div class="select disabled" ref="selectRef">
      <div class="selector">{{ value }}</div>
      <div class="icon">
        <slot name="icon">
          <IconDown :size="14" />
        </slot>
      </div>
    </div>
  </div>
  <Popover 
    class="select-wrap"
    trigger="click" 
    v-model:value="popoverVisible" 
    placement="bottom"
    :contentStyle="{
      padding: 0,
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08)',
    }"
    v-else
  >
    <template #content>
      <template v-if="search">
        <Input ref="searchInputRef" simple :placeholder="searchLabel" v-model:value="searchKey" :style="{ width: width + 2 + 'px' }" />
        <Divider :margin="0" />
      </template>
      <div class="options" :style="{ width: width + 2 + 'px' }">
        <div class="option" 
          :class="{
            'disabled': option.disabled,
            'selected': option.value === value,
          }"
          v-for="option in showOptions" 
          :key="option.value"
          @click="handleSelect(option)"
        >{{ option.label }}</div>
      </div>
    </template>
    <div class="select" ref="selectRef">
      <div class="selector">{{ showLabel }}</div>
      <div class="icon">
        <slot name="icon">
          <IconDown :size="14" />
        </slot>
      </div>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import Popover from './Popover.vue'
import Input from './Input.vue'
import Divider from './Divider.vue'

interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  value: string | number
  options: SelectOption[]
  disabled?: boolean
  search?: boolean
  searchLabel?: string
}>(), {
  disabled: false,
  search: false,
  searchLabel: '搜索',
})

const emit = defineEmits<{
  (event: 'update:value', payload: string | number): void
}>()

const popoverVisible = ref(false)
const selectRef = ref<HTMLElement>()
const searchInputRef = ref<InstanceType<typeof Input>>()
const width = ref(0)
const searchKey = ref('')

const showLabel = computed(() => {
  return props.options.find(item => item.value === props.value)?.label || props.value
})

const showOptions = computed(() => {
  if (!props.search) return props.options
  if (!searchKey.value.trim()) return props.options
  const opts = props.options.filter(item => {
    return item.label.toLowerCase().indexOf(searchKey.value.toLowerCase()) !== -1
  })
  return opts.length ? opts : props.options
})

watch(popoverVisible, () => {
  if (popoverVisible.value) {
    nextTick(() => {
      if (searchInputRef.value) searchInputRef.value.focus()
    })
  }
  else searchKey.value = ''
})
onBeforeUnmount(() => {
  searchKey.value = ''
})

const updateWidth = () => {
  if (!selectRef.value) return
  width.value = selectRef.value.clientWidth
}
const resizeObserver = new ResizeObserver(updateWidth)
onMounted(() => {
  if (!selectRef.value) return
  resizeObserver.observe(selectRef.value)
})
onUnmounted(() => {
  if (!selectRef.value) return
  resizeObserver.unobserve(selectRef.value)
})

const handleSelect = (option: SelectOption) => {
  if (option.disabled) return

  emit('update:value', option.value)
  popoverVisible.value = false
}
</script>

<style lang="scss" scoped>
.select {
  width: 100%;
  height: 32px;
  padding-right: 32px;
  border-radius: $borderRadius;
  transition: border-color .25s;
  font-size: 13px;
  user-select: none;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  position: relative;
  cursor: pointer;

  &:not(.disabled):hover {
    border-color: $themeColor;
  }

  &.disabled {
    background-color: #f5f5f5;
    border-color: #dcdcdc;
    color: #b7b7b7;
    cursor: default;
  }

  .selector {
    min-width: 50px;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    @include ellipsis-oneline();
  }
}
.options {
  max-height: 260px;
  padding: 5px;
  overflow: auto;
  text-align: left;
  font-size: 13px;
  user-select: none;
}
.option {
  height: 32px;
  line-height: 32px;
  padding: 0 5px;
  border-radius: $borderRadius;
  @include ellipsis-oneline();

  &.disabled {
    color: #b7b7b7;
  }
  &:not(.disabled, .selected):hover {
    background-color: rgba($color: $themeColor, $alpha: .05);
    cursor: pointer;
  }

  &.selected {
    color: $themeColor;
    font-weight: 700;
  }
}
.icon {
  width: 32px;
  height: 30px;
  color: #bfbfbf;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>