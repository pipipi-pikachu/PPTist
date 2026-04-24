import axios from 'axios'
import message from '@/utils/message'
import { t } from '@/i18n';

const instance = axios.create({ timeout: 1000 * 300 })

instance.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 400) {
      return Promise.resolve(response.data)
    }

    message.error(t('Commons.text.text_8zripj'))
    return Promise.reject(response)
  },
  error => {
    if (error && error.response) {
      if (error.response.status >= 400 && error.response.status < 500) {
        return Promise.reject(error.message)
      }
      else if (error.response.status >= 500) {
        return Promise.reject(error.message)
      }
      
      message.error(t('Commons.text.text_kn3dzn'))
      return Promise.reject(error.message)
    }

    message.error(t('Services.Axios.text.text_2jwcao'))
    return Promise.reject(error)
  }
)

export default instance