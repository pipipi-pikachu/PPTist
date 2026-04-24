<template>
  <div class="aippt-dialog">
    <div class="header">
      <span class="title">AIPPT</span>
      <span class="subtite" v-if="step === 'template'">{{ $t('Commons.text.ppt', {}) }}<span class="local" v-tooltip="$t('Views.Editor.text.pptist')" @click="uploadLocalTemplate()">{{ $t('Commons.text.text_v9rhlw', {}) }}</span></span>
      <span class="subtite" v-else-if="step === 'outline'">{{ $t('Views.Editor.text.text_6bca8z', {}) }}</span>
      <span class="subtite" v-else>{{ $t('Views.Editor.text.ppt', {}) }}</span>
    </div>
    
    <template v-if="step === 'setup'">
      <Input class="input" 
        ref="inputRef"
        v-model:value="keyword" 
        :maxlength="50" 
        :placeholder="$t('Commons.placeholder.ppt')" 
        @enter="createOutline()"
      >
        <template #suffix>
          <span class="count">{{ keyword.length }} / 50</span>
          <div class="submit" type="primary" @click="createOutline()"><i-icon-park-outline:send class="icon" /> {{ $t('Commons.text.ai', {}) }}</div>
        </template>
      </Input>
      <div class="recommends">
        <div class="recommend" v-for="(item, index) in recommends" :key="index" @click="setKeyword(item)">{{ item }}</div>
      </div>
      <div class="configs">
        <div class="config-item">
          <div class="label">{{ $t('Commons.text.text_l6p53', {}) }}</div>
          <Select 
            class="config-content"
            style="width: 80px;"
            v-model:value="language"
            :options="[
              { label: $t('Commons.text.text_dure'), value: $t('Commons.text.text_dure') },
              { label: $t('Commons.text.text_mtva'), value: 'English' },
              { label: $t('Commons.text.text_hw02'), value: '日本語' },
            ]"
          />
        </div>
        <div class="config-item">
          <div class="label">{{ $t('Commons.text.text_mwv58', {}) }}</div>
          <Select 
            class="config-content"
            style="width: 80px;"
            v-model:value="style"
            :options="[
              { label: $t('Commons.text.text_p5ji'), value: $t('Commons.text.text_p5ji') },
              { label: $t('Commons.text.text_dwbxh'), value: '学术风' },
              { label: $t('Commons.text.text_j86jk'), value: '职场风' },
              { label: $t('Commons.text.text_fh4s5'), value: '教育风' },
              { label: $t('Commons.text.text_k2z77'), value: '营销风' },
            ]"
          />
        </div>
        <div class="config-item">
          <div class="label">{{ $t('Commons.text.text_fzwls', {}) }}</div>
          <Select 
            class="config-content"
            style="width: 190px;"
            v-model:value="model"
            :options="[
              { label: 'GLM-4.7-Flash', value: 'glm-4.7-flash' },
              { label: 'Doubao-Seed-1.6-Flash', value: 'doubao-seed-1.6-flash' },
            ]"
          />
        </div>
        <div class="config-item">
          <div class="label">{{ $t('Commons.text.text_lqd49', {}) }}</div>
          <Select 
            class="config-content"
            style="width: 100px;"
            v-model:value="img"
            :options="[
              { label: $t('Commons.label.text_k4g'), value: '' },
              { label: $t('Commons.text.text_dswrwo'), value: 'test' },
              { label: $t('Commons.text.text_1oih6'), value: 'ai-search', disabled: true },
              { label: $t('Commons.text.text_1renb'), value: 'ai-create', disabled: true },
            ]"
          />
        </div>
      </div>
      <div class="configs" v-if="!isEmptySlide">
        <div class="config-item">
          <Checkbox v-model:value="overwrite">{{ $t('Commons.text.text_35pm0c', {}) }}</Checkbox>
        </div>
      </div>
    </template>
    <div class="preview" v-if="step === 'outline'">
      <pre ref="outlineRef" v-if="outlineCreating">{{ outline }}</pre>
       <div class="outline-view" v-else>
         <OutlineEditor v-model:value="outline" />
       </div>
      <div class="btns" v-if="!outlineCreating">
        <Button class="btn" type="primary" @click="step = 'template'">{{ $t('Commons.button.text_il0hha', {}) }}</Button>
        <Button class="btn" @click="outline = ''; step = 'setup'">{{ $t('Commons.button.text_y1p066', {}) }}</Button>
      </div>
    </div>
    <div class="select-template" v-if="step === 'template'">
      <div class="templates">
        <div class="template" 
          :class="{ 'selected': selectedTemplate === template.id }" 
          v-for="template in templates" 
          :key="template.id" 
          @click="selectedTemplate = template.id"
        >
          <img :src="template.cover" :alt="template.name">
        </div>
      </div>
      <div class="btns">
        <Button class="btn" type="primary" @click="createPPT()">{{ $t('Commons.button.text_kgk1', {}) }}</Button>
        <Button class="btn" @click="step = 'outline'">{{ $t('Commons.button.text_ii8dpx', {}) }}</Button>
      </div>
    </div>

    <FullscreenSpin :loading="loading" :tip="$t('Views.Editor.text.ai')" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { jsonrepair } from 'jsonrepair'
import api from '@/services'
import useAIPPT from '@/hooks/useAIPPT'
import useSlideHandler from '@/hooks/useSlideHandler'
import type { AIPPTSlide } from '@/types/AIPPT'
import type { Slide, SlideTheme } from '@/types/slides'
import message from '@/utils/message'
import { decrypt } from '@/utils/crypto'
import { useMainStore, useSlidesStore } from '@/store'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Select from '@/components/Select.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import OutlineEditor from '@/components/OutlineEditor.vue'
import Checkbox from '@/components/Checkbox.vue'
import { t } from '@/i18n';

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { templates } = storeToRefs(slidesStore)

const { resetSlides, isEmptySlide } = useSlideHandler()
const { AIPPT, presetImgPool, getMdContent } = useAIPPT()

const language = ref(t('Commons.text.text_dure'))
const style = ref(t('Commons.text.text_p5ji'))
const img = ref('')
const keyword = ref('')
const outline = ref('')
const selectedTemplate = ref('template_1')
const loading = ref(false)
const outlineCreating = ref(false)
const overwrite = ref(true)
const step = ref<'setup' | 'outline' | 'template'>('setup')
const model = ref('glm-4.7-flash')
const outlineRef = useTemplateRef<HTMLElement>('outlineRef')
const inputRef = useTemplateRef<InstanceType<typeof Input>>('inputRef')

const recommends = ref([
  t('Commons.text.text_e4udtn'),
  t('Commons.text.text_juu9xv'),
  t('Commons.text.text_57o0uw'),
  t('Commons.text.text_87broi'),
  t('Commons.text.text_nsulnx'),
  t('Commons.text.text_e7c3de'),
  t('Commons.text.text_ifzhw3'),
  t('Commons.text.text_7yghio'),
  t('Commons.text.text_8a4z2s'),
  t('Commons.text.text_jzvp9f'),
]) 

onMounted(() => {
  setTimeout(() => {
    inputRef.value!.focus()
  }, 500)
})

const setKeyword = (value: string) => {
  keyword.value = value
  inputRef.value!.focus()
}

const createOutline = async () => {
  if (!keyword.value) return message.error(t('Commons.text.ppt_2'))

  loading.value = true
  outlineCreating.value = true
  
  const stream = await api.AIPPT_Outline({
    content: keyword.value,
    language: language.value,
    model: model.value,
  })
  if (typeof stream === 'object' && stream.state === -1) {
    loading.value = false
    return message.error(t('Commons.text.api'))
  }

  loading.value = false
  step.value = 'outline'

  const reader: ReadableStreamDefaultReader = stream.body.getReader()
  const decoder = new TextDecoder('utf-8')
  
  const readStream = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        outline.value = getMdContent(outline.value)
        outline.value = outline.value.replace(/<!--[\s\S]*?-->/g, '')
        outlineCreating.value = false
        return
      }
  
      const chunk = decoder.decode(value, { stream: true })
      outline.value += chunk

      if (outlineRef.value) {
        outlineRef.value.scrollTop = outlineRef.value.scrollHeight + 20
      }

      readStream()
    })
  }
  readStream()
}

const createPPT = async (template?: { slides: Slide[], theme: SlideTheme }) => {
  loading.value = true
  mainStore.setAIPPTDialogState('running')
  message.loading(t('Views.Editor.text.text_lhg40j'), { duration: 0 })

  if (overwrite.value) resetSlides()

  const stream = await api.AIPPT({
    content: outline.value,
    language: language.value,
    style: style.value,
    model: model.value,
  })
  if (typeof stream === 'object' && stream.state === -1) {
    loading.value = false
    message.closeAll()
    mainStore.setAIPPTDialogState(true)
    return message.error(t('Commons.text.api'))
  }

  if (img.value === 'test') {
    const imgs = await api.getMockData('imgs')
    presetImgPool(imgs)
  }

  let templateData = template
  if (!templateData) templateData = await api.getMockData(selectedTemplate.value)
  const templateSlides: Slide[] = templateData!.slides
  const templateTheme: SlideTheme = templateData!.theme

  const reader: ReadableStreamDefaultReader = stream.body.getReader()
  const decoder = new TextDecoder('utf-8')
  
  const readStream = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        loading.value = false
        message.closeAll()
        mainStore.setAIPPTDialogState(false)
        slidesStore.setTheme(templateTheme)
        return
      }
  
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split(/\n+/)

      for (const line of lines) {
        if (line) processChunk(line)
      }

      readStream()
    })
  }

  const processChunk = (chunk: string) => {
    try {
      const text = chunk.replace('```jsonl', '').replace('```json', '').replace('```', '').trim()
      if (text) {
        const slide: AIPPTSlide = JSON.parse(jsonrepair(text))
        AIPPT(templateSlides, [slide])
      }
    }
    catch (err) {
      // eslint-disable-next-line
      console.error(err)
    }
  }
  readStream()
}

const uploadLocalTemplate = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.pptist'
  input.click()
  input.addEventListener('change', e => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        try {
          const { slides, theme } = JSON.parse(decrypt(reader.result as string))
          createPPT({ slides, theme })
        }
        catch {
          message.error(t('Commons.text.text_2w4dl8'))
        }
      })
      reader.readAsText(file)
    }
  })
}
</script>

<style lang="scss" scoped>
.aippt-dialog {
  margin: -20px;
  padding: 30px;
}
.header {
  margin-bottom: 12px;

  .title {
    font-weight: 700;
    font-size: 20px;
    margin-right: 8px;
    background: linear-gradient(270deg, #d897fd, #33bcfc);
    background-clip: text;
    color: transparent;
    vertical-align: text-bottom;
    line-height: 1.1;
  }
  .subtite {
    color: #888;
    font-size: 12px;

    .local {
      color: $themeColor;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.preview {
  pre {
    max-height: 450px;
    padding: 10px;
    margin-bottom: 15px;
    background-color: #f1f1f1;
    overflow: auto;
  }
  .outline-view {
    max-height: 450px;
    padding: 10px;
    margin-bottom: 15px;
    background-color: #f1f1f1;
    overflow: auto;
  }
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      width: 120px;
      margin: 0 5px;
    }
  }
}
.select-template {
  .templates {
    max-height: 450px;
    overflow: auto;
    display: flex;
    margin-bottom: 10px;
    padding-right: 5px;
    @include flex-grid-layout();
  
    .template {
      border: 2px solid $borderColor;
      border-radius: $borderRadius;
      @include flex-grid-layout-children(2, 49%);

      &.selected {
        border-color: $themeColor;
      }
  
      img {
        width: 100%;
        min-height: 175px;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      width: 120px;
      margin: 0 5px;
    }
  }
}
.recommends {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;

  .recommend {
    font-size: 12px;
    background-color: #f1f1f1;
    border-radius: $borderRadius;
    padding: 3px 5px;
    margin-right: 5px;
    margin-top: 5px;
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }
  }
}
.configs {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;

  .config-item {
    font-size: 13px;
    display: flex;
    align-items: center;
  }
}
.count {
  font-size: 12px;
  color: #999;
  margin-right: 10px;
}
.submit {
  height: 20px;
  font-size: 12px;
  background-color: $themeColor;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 8px 0 6px;
  border-radius: $borderRadius;
  cursor: pointer;

  &:hover {
    background-color: $themeHoverColor;
  }

  .icon {
    font-size: 15px;
    margin-right: 3px;
  }
}

@media screen and (width <= 800px) {
  .configs {
    margin-top: 15px;
    display: flex;
    flex-direction: column;

    .config-item {
      margin-top: 8px;

      .label {
        flex-shrink: 0;
      }

      .config-content {
        width: 100% !important;
      }
    }
  }
  .select-template {
    .templates {
      padding-right: 0;
  
      .template {
        img {
          min-height: 60px;
        }
      }
    }
  }
}

@media screen and (width <= 380px) {
  .preview {
    pre {
      max-height: 400px;
    }
    .outline-view {
      max-height: 400px;
    }
  }
  .select-template {
    .templates {
      max-height: 400px;
    }
  }
}
</style>