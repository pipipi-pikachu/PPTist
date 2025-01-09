import axios from './config'

const SERVER_URL = (import.meta.env.MODE === 'development') ? '/api' : 'https://server.pptist.cn'
const ASSET_URL = 'https://asset.pptist.cn'

export default {
  getMockData(filename: string): Promise<any> {
    return axios.get(`./mocks/${filename}.json`)
  },

  getFileData(filename: string): Promise<any> {
    return axios.get(`${ASSET_URL}/data/${filename}.json`)
  },

  AIPPT_Outline(content: string, language: string) {
    return axios.post(`${SERVER_URL}/tools/aippt_outline`, { content, language })
  },

  AIPPT(content: string, language: string) {
    return axios.post(`${SERVER_URL}/tools/aippt`, { content, language })
  },
}