import axios from 'axios'
import localforage from 'localforage'

import store from '@/store/index.js'

export const xhrClient = axios.create()

export const apiClient = axios.create({
  baseURL: '/api/v1',
})

apiClient.defaults.timeout = 5000

apiClient.interceptors.request.use(async function addAuthHeader (config) {
  if (config.url === '/auth' || config.url.startsWith('/version')) {
    return config
  }

  const token = await localforage.getItem('psij-token')

  if (token) {
    Object.assign(config.headers, {
      Authorization: `Bearer ${token}`,
    })
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

apiClient.interceptors.response.use(
  response => {
    // const isSuccess = response.status >= 200 && response.status < 300
    // const isPDF = (response?.headers || {})['content-type'] === 'application/pdf'
    // if (!isSuccess && !isPDF) {
    //   const message = response?.data?.message || 'Oups ! Une erreur inconnue est survenue…'
    //   const messages = response?.data?.messages
    //   const error = new Error(message)
    //   error.messages = messages
    //   return Promise.reject(error)
    // }
    // store.dispatch('connectionAvailable')
    return response
  },
  error => {
    const response = error?.response
    const isUnauthorized = response?.status === 401
    if (isUnauthorized) {
      store.dispatch('logout')
      const customError = new Error('Authentification incorrecte, vous devez vous reconnecter')
      customError.httpCode = 401
      return Promise.reject(customError)
    }
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('Network Error')) {
      store.dispatch('noConnectionAvailable')
      const customError = new Error('Communication impossible avec le serveur')
      return Promise.reject(customError)
    }
    const apiError = new Error(response?.data?.message || response?.statusText || error?.message)
    apiError.statusCode = response?.status
    return Promise.reject(apiError)
  },
)
