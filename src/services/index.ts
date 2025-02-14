import axios from './config'

export const SERVER_URL = (import.meta.env.MODE === 'development') ? '/api' : 'https://server.pptist.cn'
export const ASSET_URL = 'https://asset.pptist.cn'

export default {
  getMockData(filename: string): Promise<any> {
    return axios.get(`./mocks/${filename}.json`)
  },

  getFileData(filename: string): Promise<any> {
    return axios.get(`${ASSET_URL}/data/${filename}.json`)
  },

  AIPPT_Outline(
    content: string,
    language: string,
    model = 'doubao-1.5-pro-32k'
  ): Promise<any> {
    return fetch(`${SERVER_URL}/tools/aippt_outline`, {
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
  },

  AIPPT(
    content: string,
    language: string,
    model = 'doubao-1.5-pro-32k'
  ) {
    return axios.post(`${SERVER_URL}/tools/aippt`, {
      content,
      language,
      model,
    })
  },
}