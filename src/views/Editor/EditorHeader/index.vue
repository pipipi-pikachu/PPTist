<template>
  <div class="editor-header">
    <div class="left">
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconEdit /> 编辑</div>
        <template #overlay>
          <Menu>
            <MenuItem @click="undo()">撤销</MenuItem>
            <MenuItem @click="redo()">重做</MenuItem>
            <MenuItem @click="createSlide()">添加页面</MenuItem>
            <MenuItem @click="deleteSlide()">删除页面</MenuItem>
            <MenuItem @click="toggleGridLines()">{{ showGridLines ? '关闭网格线' : '打开网格线' }}</MenuItem>
            <MenuItem @click="resetSlides()">重置幻灯片</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconPpt /> 演示</div>
        <template #overlay>
          <Menu>
            <MenuItem @click="enterScreeningFromStart()">从头开始</MenuItem>
            <MenuItem @click="enterScreening()">从当前页开始</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconHelpcenter /> 帮助</div>
        <template #overlay>
          <Menu>
            <MenuItem @click="openDoc()">开发文档</MenuItem>
            <MenuItem @click="hotkeyDrawerVisible = true">快捷键</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>

    <div class="right">
      <Tooltip :mouseLeaveDelay="0" title="幻灯片放映">
        <div class="menu-item" @click="enterScreening()">
          <IconPpt size="18" fill="#666" style="margin-top: 2px;" />
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="Github 仓库">
        <a href="https://github.com/pipipi-pikachu/PPTist" target="_blank">
          <div class="menu-item"><IconGithub size="18" fill="#666" /></div>
        </a>
      </Tooltip>
    </div>

    <Drawer
      width="320"
      placement="right"
      :visible="hotkeyDrawerVisible"
      @close="hotkeyDrawerVisible = false"
    >
      <div class="hotkeys">
        <template v-for="item in hotkeys" :key="item.type">
          <div class="title">{{item.type}}</div>
          <div class="hotkey-item" v-for="hotkey in item.children" :key="hotkey.label">
            <div class="label">{{hotkey.label}}</div>
            <div class="value">{{hotkey.value}}</div>
          </div>
        </template>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { createRandomCode } from '@/utils/common'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import { message } from 'ant-design-vue'

const hotkeys = [
  {
    type: '通用',
    children: [
      { label: '剪切', value: 'Ctrl + X' },
      { label: '复制', value: 'Ctrl + C' },
      { label: '粘贴', value: 'Ctrl + V' },
      { label: '快速复制粘贴', value: 'Ctrl + D' },
      { label: '全选', value: 'Ctrl + A' },
      { label: '撤销', value: 'Ctrl + Z' },
      { label: '恢复', value: 'Ctrl + Y' },
      { label: '删除', value: 'Delete' },
    ],
  },
  {
    type: '幻灯片放映',
    children: [
      { label: '开始放映幻灯片', value: 'Ctrl + F' },
      { label: '切换上一页', value: '↑ / ←' },
      { label: '切换下一页', value: '↓ / → / Enter / Space' },
      { label: '退出放映', value: 'ESC' },
    ],
  },
  {
    type: '幻灯片编辑',
    children: [
      { label: '新建幻灯片', value: 'Enter' },
      { label: '缩放画布', value: 'Ctrl + 鼠标滚动' },
      { label: '放大画布', value: 'Ctrl + =' },
      { label: '缩小画布', value: 'Ctrl + -' },
      { label: '缩放画布到合适大小', value: 'Ctrl + 0' },
      { label: '编辑上一页', value: '↑ / ←' },
      { label: '编辑下一页', value: '↓ / →' },
    ],
  },
  {
    type: '元素操作',
    children: [
      { label: '移动', value: '↑ / ← / ↓ / →' },
      { label: '锁定', value: 'Ctrl + L' },
      { label: '组合', value: 'Ctrl + G' },
      { label: '取消组合', value: 'Ctrl + Shift + G' },
      { label: '置顶层', value: 'Alt + F' },
      { label: '置底层', value: 'Alt + B' },
      { label: '多选', value: '按住 Ctrl 或 Shift' },
      { label: '锁定宽高比例', value: '按住 Ctrl 或 Shift' },
      { label: '创建水平 / 垂直线条', value: '按住 Ctrl 或 Shift' },
      { label: '确认图片裁剪', value: 'Enter' },
    ],
  },
  {
    type: '表格编辑',
    children: [
      { label: '聚焦到下一个单元格', value: 'Tab' },
      { label: '在上方插入一行', value: 'Ctrl + ↑' },
      { label: '在下方插入一行', value: 'Ctrl + ↓' },
      { label: '在左侧插入一列', value: 'Ctrl + ←' },
      { label: '在右侧插入一列', value: 'Ctrl + →' },
    ],
  },
  {
    type: '文本编辑',
    children: [
      { label: '加粗', value: 'Ctrl + B' },
      { label: '斜体', value: 'Ctrl + I' },
      { label: '下划线', value: 'Ctrl + U' },
      { label: '删除线', value: 'Ctrl + D' },
    ],
  },
]

export default defineComponent({
  name: 'editor-header',
  setup() {
    const store = useStore()

    const { enterScreening, enterScreeningFromStart } = useScreening()
    const { createSlide, deleteSlide } = useSlideHandler()
    const { redo, undo } = useHistorySnapshot()

    const showGridLines = computed(() => store.state.showGridLines)
    const toggleGridLines = () => {
      store.commit(MutationTypes.SET_GRID_LINES_STATE, !showGridLines.value)
    }

    const resetSlides = () => {
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
      store.commit(MutationTypes.SET_SLIDES, [{
        id: createRandomCode(),
        elements: [],
      }])
    }

    const openDoc = () => {
      message.warning('作者努力编写中...')
    }

    const hotkeyDrawerVisible = ref(false)

    return {
      enterScreening,
      enterScreeningFromStart,
      createSlide,
      deleteSlide,
      redo,
      undo,
      toggleGridLines,
      showGridLines,
      resetSlides,
      openDoc,
      hotkeyDrawerVisible,
      hotkeys,
    }
  },
})
</script>

<style lang="scss" scoped>
.editor-header {
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.left, .right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-item {
  font-size: 13px;
  margin: 0 10px;
  cursor: pointer;
}

.hotkeys {
  height: 100%;
  overflow: auto;
  font-size: 12px;
}
.title {
  font-size: 14px;
  font-weight: 700;
  border-bottom: 1px solid #e5e5e5;
  padding: 15px 0 5px 0;
}
.hotkey-item {
  border-bottom: 1px solid #e5e5e5;
  padding: 15px 0 5px 0;
  display: flex;
  align-items: center;
}
.label {
  width: 140px;

  @include ellipsis();
}
</style>