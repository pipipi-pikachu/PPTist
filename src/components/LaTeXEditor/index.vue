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
        <Tabs 
          :tabs="tabs" 
          v-model:value="toolbarState" 
          card
        />
        <div class="content">
          <div class="symbol" v-if="toolbarState === 'symbol'">
            <Tabs 
              :tabs="symbolTabs" 
              v-model:value="selectedSymbolKey" 
              spaceBetween 
              :tabsStyle="{ margin: '10px 10px 0' }" 
            />
            <div class="symbol-pool">
              <div class="symbol-item" v-for="item in symbolPool" :key="item.latex" @click="insertSymbol(item.latex)">
                <SymbolContent :latex="item.latex" />
              </div>
            </div>
          </div>
          <div class="formula" v-else>
            <div class="formula-item" v-for="item in formulaList" :key="item.label">
              <div class="formula-title">{{item.label}}</div>
              <div class="formula-item-content" @click="latex = item.latex">
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
import message from '@/utils/message'

import FormulaContent from './FormulaContent.vue'
import SymbolContent from './SymbolContent.vue'
import Button from '../Button.vue'
import TextArea from '../TextArea.vue'
import Tabs from '../Tabs.vue'

interface TabItem {
  key: 'symbol' | 'formula'
  label: string
}

const tabs: TabItem[] = [
  { label: '常用符号', key: 'symbol' },
  { label: '预置公式', key: 'formula' },
]

interface LatexResult {
  latex: string
  path: string
  w: number
  h: number
}

const props = withDefaults(defineProps<{
  value?: string
}>(), {
  value: '',
})

const emit = defineEmits<{
  (event: 'update', payload: LatexResult): void
  (event: 'close'): void
}>()

const formulaList = FORMULA_LIST

const symbolTabs = SYMBOL_LIST.map(item => ({
  label: item.label,
  key: item.type,
}))

const latex = ref('')
const toolbarState = ref<'symbol' | 'formula'>('symbol')
const textAreaRef = ref<InstanceType<typeof TextArea>>()

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
}
.left {
  width: 540px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.input-area {
  flex: 1;

  textarea {
    height: 100% !important;
    border-color: $borderColor !important;
    padding: 10px !important;
    font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;

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
  font-size: 13px;
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
  width: 280px;
  height: 100%;
  margin-left: 20px;
  border: solid 1px $borderColor;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  user-select: none;
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
    height: 60px;
    padding: 5px;
    display: flex;
    align-items: center;
    background-color: $lightGray;
    cursor: pointer;
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