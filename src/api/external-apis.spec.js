import { xhrClient } from './xhr-client'
import externalApis, { apiAdresse } from './external-apis'

const geoloc = externalApis.geoloc
jest.spyOn(geoloc, 'addressSearch')
jest.spyOn(xhrClient, 'get')

describe('external-apis', () => {
  it('Should call beta gouv adresse API with query and other params', async () => {
    // When
    const query = 'recherche'
    const autocomplete = 'off'
    const type = 'type'
    await geoloc.addressSearch(query, autocomplete, type)

    // Then
    expect(xhrClient.get).toHaveBeenCalled()
    expect(xhrClient.get.mock.calls[0][0]).toBe(apiAdresse)
    expect(xhrClient.get.mock.calls[0][1].params.q).toBe(query)
    expect(xhrClient.get.mock.calls[0][1].params.autocomplete).toBe(autocomplete)
    expect(xhrClient.get.mock.calls[0][1].params.type).toBe(type)
  })
})
