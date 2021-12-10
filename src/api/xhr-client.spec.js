
import * as xhrClient from './xhr-client'

describe('xhr-client', () => {
  it('should throw error with specific message if response status >= 400', async () => {
    const message = 'Erreur lors de la réponse'
    const res = {
      response: { status: 500, data: { success: false, message } },
    }

    const rejectedRes = xhrClient.apiClient.interceptors.response.handlers[0].rejected(res)
    expect(rejectedRes).rejects.toMatchObject(new Error(message))
  })

  it('should throw error with statusText if response status is >= 400', async () => {
    const statusText = 'Erreur lors de la réponse'
    const res = {
      response: { status: 500, statusText },
    }

    const rejectedRes = xhrClient.apiClient.interceptors.response.handlers[0].rejected(res)
    expect(rejectedRes).rejects.toMatchObject(new Error(statusText))
  })

  it('should throw error with ECONNABORTED if response status >= 400', async () => {
    const message = 'Erreur lors de la réponse'
    const res = {
      response: { status: 400, data: { success: false, message } },
      code: 'ECONNABORTED',
    }

    const rejectedRes = xhrClient.apiClient.interceptors.response.handlers[0].rejected(res)
    expect(rejectedRes).rejects.toMatchObject(new Error('Communication impossible avec le serveur'))
  })

  it('should be fine for status 2XX', async () => {
    const res = {
      data: { success: true },
    }

    const fulfilled = await xhrClient.apiClient.interceptors.response.handlers[0].fulfilled(res)
    expect(fulfilled).toMatchObject(res)
  })

  it('should not be fine if success is false', async () => {
    const message = 'Erreur lors de la réponse'
    const res = {
      data: { success: false, message },
    }

    const rejectedRes = await xhrClient.apiClient.interceptors.response.handlers[0].fulfilled(res).catch(error => error)
    expect(rejectedRes).toMatchObject(new Error(message))
  })
})
