<template>
  <div class="aippt-dialog">
    <div class="header">
      <span class="title">AIPPT</span>
      <span class="subtite" v-if="outline">检查确认下方PPT大纲，点击继续生成PPT</span>
      <span class="subtite" v-else>在下方输入您的PPT主题，并适当补充信息，如行业、岗位、学科、用途等</span>
    </div>
    <div class="preview" v-if="outline">
      <pre>{{ outline }}</pre>
      <div class="btns">
        <Button class="btn" type="primary" @click="createPPT()">继续</Button>
        <Button class="btn" @click="outline = ''">返回重新生成</Button>
      </div>
    </div>
    <template v-else>
      <Input class="input" 
        ref="inputRef"
        v-model:value="keyword" 
        :maxlength="50" 
        placeholder="请输入PPT主题，如：大学生职业生涯规划" 
        @enter="createOutline()"
      >
        <template #suffix>
          <span class="count">{{ keyword.length }} / 50</span>
          <span class="submit" @click="createOutline()"><IconSend class="icon" />AI生成</span>
        </template>
      </Input>
      <div class="recommends">
        <div class="recommend" v-for="(item, index) in recommends" :key="index" @click="keyword = item">{{ item }}</div>
      </div>
    </template>

    <FullscreenSpin :loading="loading" tip="AI生成中，请稍等 ..." />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import api from '@/services'
import useAIPPT from '@/hooks/useAIPPT'
import type { AIPPTSlide } from '@/types/AIPPT'
import type { Slide } from '@/types/slides'
import message from '@/utils/message'
import { useMainStore } from '@/store'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

const mainStore = useMainStore()
const { getMdContent, AIPPT } = useAIPPT()

const keyword = ref('')
const outline = ref('')
const loading = ref(false)
const inputRef = ref<InstanceType<typeof Input>>()
const recommends = ref([
  '年度工作总结',
  '大学生职业生涯规划',
  '公司年会策划方案',
  '大数据如何改变世界',
  '餐饮市场调查与研究',
]) 

onMounted(() => {
  setTimeout(() => {
    inputRef.value!.focus()
  }, 500)
})

const createOutline = async () => {
  if (!keyword.value) return message.error('请先输入PPT主题')

  loading.value = true

  outline.value = await api.AIPPT_Outline(keyword.value).then(ret => {
    return getMdContent(ret.data[0].content)
  })

  loading.value = false
}

const createPPT = async () => {
  if (!outline.value) return message.error('缺少PPT大纲')

  loading.value = true

  // const AISlides: AIPPTSlide[] = await api.getMockData('AIPPT')
  const AISlides: AIPPTSlide[] = await api.AIPPT(outline.value).then(ret => {
    const obj = JSON.parse(ret.data[0].content)
    return obj.data
  })
  const templateSlides: Slide[] = await api.getFileData('template_1').then(ret => ret.slides)

  AIPPT(templateSlides, AISlides)

  loading.value = false

  mainStore.setAIPPTDialogState(false)
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
    font-size: 18px;
    margin-right: 8px;
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
    padding: 2px 4px;
    margin-right: 5px;
    cursor: pointer;
  }
}
.count {
  font-size: 12px;
  color: #999;
  margin-right: 10px;
}
.submit {
  width: 65px;
  height: 20px;
  font-size: 12px;
  background-color: $themeColor;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: $borderRadius;
  cursor: pointer;

  .icon {
    font-size: 15px;
    margin-right: 3px;
  }
}
</style>