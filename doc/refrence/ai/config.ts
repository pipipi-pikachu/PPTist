const baseUrl = window.location.origin + "/aiServer";
const baseAgent = window.location.origin + "/aiServer/v1";

// 智能体接口基础配置
const config: any = {
  // 指令流程
  agentUrl: baseAgent + "/workflows/run",
  agentToken: "app-glrdfPT5lXqNvi7LbnWKuBZ9",
  agentStop(taskId: any) {
    return baseAgent + `/workflows/tasks/${taskId}/stop`;
  },
  // 对话
  dialogUrl: baseAgent + "/chat-messages",
  newDialogUrl: window.location.origin+"/iccServer/aiExt/aiQA/query/chatMessages",
  dialogToken: "app-GaynQYgKodwb3J4zirxSmw4u",
  dialogStop(taskId: any) {
    // return baseAgent + `/chat-messages/${taskId}/stop`;
    return window.location.origin+"/iccServer/aiExt/aiQA/stop/chatMessages"
  },

  // rpaUrl: window.location.origin+"/iccServer/aiExt/rpaAgent/chatStream",
  rpaUrl: window.location.origin + "/iccServer/aiExt/rpaAgent/chatStream",
  rpaStop (sessionId: any) {
    return window.location.origin+`/ucc_server/chatStream/${sessionId}/stop`
  },

  // 面试
  interviewToken: 'app-z5wj7btipQ1IBLqPAirch30a',
  // 合同
  contractToken: 'app-hS6SR2iUu7Cs3LrTqgL869si',
  // 智摘
  summaryToken: 'app-Y0dofjYFgZTApZJ0avh89FhB',
  // 知识库
  // 集团
  globalToken: 'app-yYrrgIPVJw9BjbwJgwBUYfQy',
  // 员工手册
  employeeToken: 'app-F639DlGpXzJzInzGkxSVA5wv',
  // OA操作指引
  OAToken: 'app-vLcYlL74qNQtR3jy1RtT6TJH',
  // 个人
  jsApiToken: 'app-97kOyJ8jv5OzUWDo9q0zSynQ',
  // 智数
  dataToken: 'app-DPNfjRkCJeWpLxNgl5zRfXEf',

  // 公文
  officialToken: 'app-B6sIQCv2yXdnJlCdxwMIRw8W', // app-VBdL1BT1MKePFddOIOkDhdkq
  // 车辆
  carToken: 'app-PGFBBkjMkW4KvaFgWsbkcD7R', // 现场
  // 装备
  equipToken: 'app-ydM64LjQ9zESve6fvXd8zy13',
  // 警情
  policeToken: 'app-AeUISAJCCZ9Kio4S6urU8Sz8',
  // 全流程
  processToken: 'app-MiwnuS3zAHV8lytSs6wK3wAp',
  // 新集合装备
  equipNewToken: 'app-oNFeqQR0zG4yuChYj9RSQPVR',
  // knowledge
  knowledgeUrl: baseAgent + "/chat-messages",
  knowledgeToken: 'app-F639DlGpXzJzInzGkxSVA5wv',
  // receivingAlarm 接警
  receivingAlarmToken: 'app-zqDhdK1bklYwy0PE0n17Mtgb',
  // decision 辅助决策
  decisionToken: 'app-tlR4qQokCabnMH7jH4AjVZtB',
  knowledgeStop(taskId: any) {
    return baseAgent + `/chat-messages/${taskId}/stop`;
  },
  nowToken: '',
  getDownloadUrl: (fileId: string) => baseUrl + `/files/${fileId}`,
}

const { VITE_AI_ENV } = import.meta.env
// 现场环境 - 现场环境的智能体token，跟公司开发环境的token有差异
if (VITE_AI_ENV === 'production') {
  config.officialToken = 'app-VBdL1BT1MKePFddOIOkDhdkq'
  config.carToken = 'app-XkOlaiiXvajoCBKUyFYS1Xxm'
  config.equipToken = 'app-A5nCKQaQ0TMohI6c0Cf7Ss9f'
  config.policeToken = 'app-hhagFsFWpYkn3qdxwKdivBF3'
  config.processToken = 'app-KfgCeebHKq8mkxxzV6hLnGwY'
  config.equipNewToken = 'app-ZDTqwnGXjQBoSyMR6hdf94Tk'
}

// 获取配置
export const getConfig = () => {
  return config
}

// 设置配置
export const setConfig = (newConfig: any) => {
  newConfig && Object.keys(newConfig).forEach((key) => {
    config[key] = newConfig[key];
  })
}