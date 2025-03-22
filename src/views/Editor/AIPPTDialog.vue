<template>
  <div class="aippt-dialog">
    <div class="header">
      <span class="title">AIPPT</span>
      <span class="subtite" v-if="step === 'template'">Select the appropriate template from the following to start generating PPT</span>
      <span class="subtite" v-else-if="step === 'outline'">Confirm the content outline below (click to edit content, right-click to add/delete outline items), and start selecting a template</span>
      <span class="subtite" v-else>Enter your PPT topic below and add appropriate information, such as industry, position, subject, purpose, etc.</span>
    </div>
    
    <template v-if="step === 'setup'">
      <Input class="input" 
        ref="inputRef"
        v-model:value="keyword" 
        :maxlength="50" 
        placeholder="Please enter the PPT topic, such as: College Students' Career Planning" 
        @enter="createOutline()"
      >
        <template #suffix>
          <span class="count">{{ keyword.length }} / 50</span>
          <span class="language" v-tooltip="'Switch language'" @click="language = language === 'zh' ? 'en' : 'zh'">{{ language === 'zh' ? '中' : '英' }}</span>
          <div class="submit" type="primary" @click="createOutline()"><IconSend class="icon" /> AI Generate</div>
        </template>
      </Input>
      <div class="recommends">
        <div class="recommend" v-for="(item, index) in recommends" :key="index" @click="setKeyword(item)">{{ item }}</div>
      </div>
      <div class="model-selector">
        <div class="label">Select AI model:</div>
        <Select 
          style="width: 160px;"
          v-model:value="model"
          :options="[
            { label: 'Doubao-1.5-Pro', value: 'doubao-1.5-pro-32k' },
            { label: 'DeepSeek-v3', value: 'ark-deepseek-v3' },
            { label: 'GLM-4-Flash', value: 'GLM-4-flash' },
          ]"
        />
      </div>
    </template>
    <div class="preview" v-if="step === 'outline'">
      <pre ref="outlineRef" v-if="outlineCreating">{{ outline }}</pre>
       <div class="outline-view" v-else>
         <OutlineEditor v-model:value="outline" />
       </div>
      <div class="btns" v-if="!outlineCreating">
        <Button class="btn" type="primary" @click="step = 'template'">Select a template</Button>
        <Button class="btn" @click="outline = ''; step = 'setup'">Return to Setup</Button>
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
        <Button class="btn" type="primary" @click="createPPT()">Generate</Button>
        <Button class="btn" @click="step = 'outline'">Back to outline</Button>
      </div>
    </div>

    <FullscreenSpin :loading="loading" tip="AI is generating, please wait patiently ..." />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import api from '@/services'
import useAIPPT from '@/hooks/useAIPPT'
import type { AIPPTSlide } from '@/types/AIPPT'
import type { Slide } from '@/types/slides'
import message from '@/utils/message'
import { useMainStore, useSlidesStore } from '@/store'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Select from '@/components/Select.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import OutlineEditor from '@/components/OutlineEditor.vue'

const mainStore = useMainStore()
const { templates } = storeToRefs(useSlidesStore())
const { AIPPT } = useAIPPT()

const language = ref<'zh' | 'en'>('zh')
const keyword = ref('')
const outline = ref('')
const selectedTemplate = ref('template_1')
const loading = ref(false)
const outlineCreating = ref(false)
const outlineRef = ref<HTMLElement>()
const inputRef = ref<InstanceType<typeof Input>>()
const step = ref<'setup' | 'outline' | 'template'>('setup')
const model = ref('doubao-1.5-pro-32k')

const recommends = ref([
  'Career planning for college students',
  'Company annual meeting planning',
  'How Big Data is Changing the World',
  'Catering market survey and research',
  'Application of AIGC in education',
  'How 5G technology will change our lives',
  'Social Media and Brand Marketing',
  'Annual work summary and outlook',
  'Blockchain technology and its applications',
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
  if (!keyword.value) return message.error('Please enter the PPT theme first')

  loading.value = true
  outlineCreating.value = true
  
  const stream = await api.AIPPT_Outline(keyword.value, language.value, model.value)

  loading.value = false
  step.value = 'outline'

  const reader: ReadableStreamDefaultReader = stream.body.getReader()
  const decoder = new TextDecoder('utf-8')
  
  const readStream = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
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

const createPPT = async () => {
  loading.value = true

  const stream = await api.AIPPT(outline.value, language.value, 'doubao-1.5-pro-32k')
  const templateSlides: Slide[] = await api.getFileData(selectedTemplate.value).then(ret => ret.slides)

  const reader: ReadableStreamDefaultReader = stream.body.getReader()
  const decoder = new TextDecoder('utf-8')
  
  const readStream = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        loading.value = false
        mainStore.setAIPPTDialogState(false)
        return
      }
  
      const chunk = decoder.decode(value, { stream: true })
      try {
        const slide: AIPPTSlide = JSON.parse(chunk)
        AIPPT(templateSlides, [slide])
      }
      catch (err) {
        // eslint-disable-next-line
        console.error(err)
      }

      readStream()
    })
  }
  readStream()
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
    display: flex;
    margin-bottom: 10px;
    @include flex-grid-layout();
  
    .template {
      border: 2px solid $borderColor;
      border-radius: $borderRadius;
      width: 304px;
      height: 172.75px;
      margin-bottom: 12px;

      &:not(:nth-child(2n)) {
        margin-right: 12px;
      }

      &.selected {
        border-color: $themeColor;
      }
  
      img {
        width: 100%;
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
.configs {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;

  .items {
    display: flex;
  }
  .item {
    margin-right: 5px;
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
.model-selector {
  margin-top: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
}
.count {
  font-size: 12px;
  color: #999;
  margin-right: 10px;
}
.language {
  font-size: 12px;
  margin-right: 10px;
  color: $themeColor;
  cursor: pointer;
}
.submit {
  height: 20px;
  font-size: 12px;
  background-color: $themeColor;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 5px;
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
</style>