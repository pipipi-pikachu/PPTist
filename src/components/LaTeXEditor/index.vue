<template>
  <div class="latex-editor">
    <div class="container">
      <div class="left">
        <div class="input-area">
          <TextArea v-model:value="latex" placeholder="输入 LaTeX 公式" ref="textAreaRef" />
        </div>
        <div class="preview">
          <div class="placeholder" v-if="!latex">公式预览</div>
          <div class="preview-content" v-else>
            <FormulaContent
              :width="518"
              :height="138"
              :latex="latex"
            />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="tabs">
          <div 
            class="tab" 
            :class="{ 'active': tab.value === toolbarState }"
            v-for="tab in tabs" 
            :key="tab.value"
            @click="toolbarState = tab.value"
          >{{tab.label}}</div>
        </div>
        <div class="content">
          <div class="symbol" v-if="toolbarState === 'symbol'">
            <div class="symbol-tabs">
              <div 
                class="symbol-tab" 
                :class="{ 'active': selectedSymbolKey === group.type }" 
                v-for="group in symbolList" 
                :key="group.type"
                @click="selectedSymbolKey = group.type"
              >{{group.label}}</div>
            </div>
            <div class="symbol-pool">
              <div class="symbol-item" v-for="item in symbolPool" :key="item.latex" @click="insertSymbol(item.latex)">
                <SymbolContent :latex="item.latex" />
              </div>
            </div>
          </div>
          <div class="formula" v-else>
            <div class="formula-item" v-for="item in formulaList" :key="item.label">
              <div class="formula-title">{{item.label}}</div>
              <div class="formula-item-content" @click="latex =item.latex">
                <FormulaContent
                  :width="236"
                  :height="60"
                  :latex="item.latex"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <Button class="btn" @click="emit('close')">取消</Button>
      <Button class="btn" type="primary" @click="update()">确定</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { hfmath } from './hfmath'
import { FORMULA_LIST, SYMBOL_LIST } from '@/configs/latex'

import FormulaContent from './FormulaContent.vue'
import SymbolContent from './SymbolContent.vue'

import { message } from 'ant-design-vue'

interface Tab {
  label: string
  value: 'symbol' | 'formula'
}

const tabs: Tab[] = [
  { label: '常用符号', value: 'symbol' },
  { label: '预置公式', value: 'formula' },
]

interface LatexResult {
  latex: string
  path: string
  w: number
  h: number
}

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (event: 'update', payload: LatexResult): void
  (event: 'close'): void
}>()

const formulaList = FORMULA_LIST
const symbolList = SYMBOL_LIST

const latex = ref('')
const toolbarState = ref<'symbol' | 'formula'>('symbol')
const textAreaRef = ref<HTMLTextAreaElement>()

const selectedSymbolKey = ref(SYMBOL_LIST[0].type)
const symbolPool = computed(() => {
  const selectedSymbol = SYMBOL_LIST.find(item => item.type === selectedSymbolKey.value)
  return selectedSymbol?.children || []
})

onMounted(() => {
  if (props.value) latex.value = props.value
})

const update = () => {
  if (!latex.value) return message.error('公式不能为空')

  const eq = new hfmath(latex.value)
  const pathd = eq.pathd({})
  const box = eq.box({})
  
  emit('update', {
    latex: latex.value,
    path: pathd,
    w: box.w + 32,
    h: box.h + 32,
  })
}

const insertSymbol = (latex: string) => {
  if (!textAreaRef.value) return
  textAreaRef.value.focus()
  document.execCommand('insertText', false, latex)
}
</script>

<style lang="scss" scoped>
.latex-editor {
  height: 560px;
}
.container {
  height: calc(100% - 50px);
  display: flex;
  padding-top: 25px;
}
.left {
  width: 540px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.input-area {
  flex: 1;

  textarea {
    height: 100% !important;
    border-color: $borderColor !important;
    padding: 10px !important;

    &:focus {
      box-shadow: none !important;
    }
  }
}
.preview {
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 20px;
  border: 1px solid $borderColor;
  user-select: none;
}
.placeholder {
  color: #888;
}
.preview-content {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.right {
  height: 100%;
  margin-left: 20px;
  flex: 1;
  border: solid 1px $borderColor;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  user-select: none;
}
.tabs {
  height: 40px;
  font-size: 12px;
  flex-shrink: 0;
  display: flex;
  user-select: none;
}
.tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $lightGray;
  border-bottom: 1px solid $borderColor;
  cursor: pointer;

  &.active {
    background-color: #fff;
    border-bottom-color: #fff;
  }

  & + .tab {
    border-left: 1px solid $borderColor;
  }
}
.content {
  height: calc(100% - 40px);
  font-size: 13px;
}
.formula {
  height: 100%;
  padding: 12px;

  @include overflow-overlay();
}
.formula-item {
  & + .formula-item {
    margin-top: 10px;
  }

  .formula-title {
    margin-bottom: 5px;
  }
  .formula-item-content {
    width: 246px;
    height: 60px;
    padding: 5px;
    display: flex;
    align-items: center;
    background-color: $lightGray;
    cursor: pointer;
  }
}
.symbol-tabs {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid $borderColor;
  margin: 12px 12px 5px;
}
.symbol-tab {
  padding: 6px 10px;
  border-bottom: 2px solid transparent;
  cursor: pointer;

  &.active {
    border-bottom: 2px solid $themeColor;
  }
}
.symbol {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.symbol-pool {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  padding: 12px;

  @include overflow-overlay();
}
.symbol-item {
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: $lightGray;
    cursor: pointer;
  }
}
.footer {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  .btn {
    margin-left: 10px;
  }
}
</style>