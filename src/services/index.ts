import axios from './config'

// export const SERVER_URL = 'http://localhost:5000'
export const SERVER_URL = (import.meta.env.MODE === 'development') ? '/api' : 'https://server.pptist.cn'

interface ImageSearchPayload {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'square' | 'all';
  locale?: 'zh' | 'en';
  order?: 'popular' | 'latest';
  size?: 'large' | 'medium' | 'small';
  image_type?: 'all' | 'photo' | 'illustration' | 'vector';
  page?: number;
  per_page?: number;
}

interface AIPPTOutlinePayload {
  content: string
  language: string
  model: string
}

interface AIPPTPayload {
  content: string
  language: string
  style: string
  model: string
}

interface AIWritingPayload {
  content: string
  command: string
}

export default {
  getMockData(filename: string): Promise<any> {
    return axios.get(`./mocks/${filename}.json`)
  },

  searchImage(body: ImageSearchPayload): Promise<any> {
    return axios.post(`${SERVER_URL}/tools/img_search`, body)
  },

  async AIPPT_Outline({
    content,
    language,
    model,
  }: AIPPTOutlinePayload): Promise<any> {
    const response = await fetch(`${SERVER_URL}/tools/aippt_outline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        language,
        model,
        stream: true,
      }),
    })

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('text/event-stream') && !contentType.includes('application/octet-stream')) {
      try {
        const JSONResponse = await response.json()
        return JSONResponse
      }
      catch (err) {
        throw new Error('服务器返回了非流响应')
      }
    }
    return response
  },

  async AIPPT({
    content,
    language,
    style,
    model,
  }: AIPPTPayload): Promise<any> {
    const response = await fetch(`${SERVER_URL}/tools/aippt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        language,
        model,
        style,
        stream: true,
      }),
    })

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('text/event-stream') && !contentType.includes('application/octet-stream')) {
      try {
        const JSONResponse = await response.json()
        return JSONResponse
      }
      catch (err) {
        throw new Error('服务器返回了非流响应')
      }
    }
    return response
  },

  async AI_Writing({
    content,
    command,
  }: AIWritingPayload): Promise<any> {
    const response = await fetch(`${SERVER_URL}/tools/ai_writing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        command,
        model: 'GLM-4.5-Flash',
        stream: true,
      }),
    })

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('text/event-stream') && !contentType.includes('application/octet-stream')) {
      try {
        const JSONResponse = await response.json()
        return JSONResponse
      }
      catch (err) {
        throw new Error('服务器返回了非流响应')
      }
    }
    return response
  },
}