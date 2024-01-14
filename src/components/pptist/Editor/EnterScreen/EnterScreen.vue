<template>
  <div class="menu-item" v-tooltip="'幻灯片放映'" @click="enterScreening()">
    <IconPpt class="icon" />
  </div>
  <Popover trigger="click" center>
    <template #content>
      <PopoverMenuItem @click="enterScreeningFromStart()">从头开始</PopoverMenuItem>
      <PopoverMenuItem @click="enterScreening()">从当前页开始</PopoverMenuItem>
    </template>
    <div class="arrow-btn"><IconDown class="arrow" /></div>
  </Popover>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '../../store'
import useScreening from '../../hooks/useScreening'

import Popover from '../../components/Popover.vue'
import PopoverMenuItem from '../../components/PopoverMenuItem.vue'

const slidesStore = useSlidesStore()
const { enterScreening, enterScreeningFromStart } = useScreening()

</script>

<style lang="scss" scoped>
.menu-item {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 0px;
  border-radius: $borderRadius;
  cursor: pointer;

  .icon {
    font-size: 18px;
    color: #666;
  }

  &:hover {
    background-color: #f1f1f1;
  }
}
</style>
