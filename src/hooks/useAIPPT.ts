import api from '@/services'

export default () => {
  const AIPPT = () => {
    api.getMockData('template').then(ret => {
      console.log(ret)
    })
  }

  return {
    AIPPT,
  }
}