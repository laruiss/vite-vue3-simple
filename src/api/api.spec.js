import { apiClient } from './xhr-client'
import {
  getAffaire,
  getAffaires,
  saveAffaire,
  saveUser,
  getUserById,
  getUsersByMatricule,
  saveSampleSet,
  getSampleSet,
  getSampleSetByAffaireId,
} from './api'

jest.spyOn(apiClient, 'get')
jest.spyOn(apiClient, 'post')
jest.spyOn(apiClient, 'put')
jest.spyOn(apiClient, 'patch')
jest.spyOn(apiClient, 'delete')

describe('api', () => {
  beforeEach(() => {
    apiClient.get.mockClear()
    apiClient.post.mockClear()
    apiClient.put.mockClear()
    apiClient.patch.mockClear()
    apiClient.delete.mockClear()
  })

  it('Should POST an affaire', async () => {
    // Given
    const affaire = {}
    apiClient.post.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    await saveAffaire(affaire)

    // Then
    expect(apiClient.post).toHaveBeenCalled()
    expect(apiClient.put).not.toHaveBeenCalled()
    expect(apiClient.post).toHaveBeenCalledTimes(1)
  })

  it('Should PUT an affaire', async () => {
    // Given
    const affaire = { createdAt: new Date().toISOString() }
    apiClient.put.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    await saveAffaire(affaire)

    // Then
    expect(apiClient.post).not.toHaveBeenCalled()
    expect(apiClient.put).toHaveBeenCalled()
    expect(apiClient.put).toHaveBeenCalledTimes(1)
  })

  it('Should GET all affaires', () => {
    // Given
    apiClient.get.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    getAffaires()

    // Then
    expect(apiClient.get).toHaveBeenCalled()
    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get.mock.calls[0][0]).toBe('/affaires')
  })

  it('Should GET a specific affaire', async () => {
    // Given
    const affaireId = 'psCase-tesarn7890'
    apiClient.get.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    await getAffaire(affaireId)

    // Then
    expect(apiClient.get).toHaveBeenCalled()
    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get.mock.calls[0][0]).toBe(`/affaires/${affaireId}`)
  })

  it('Should POST a user', async () => {
    // Given
    const user = {}
    apiClient.post.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    await saveUser(user)

    // Then
    expect(apiClient.post).toHaveBeenCalled()
    expect(apiClient.post).toHaveBeenCalledTimes(1)
    expect(apiClient.post.mock.calls[0][0]).toBe('/users')
    expect(apiClient.post.mock.calls[0][1]).toBe(user)
  })

  it('Should GET a user', async () => {
    // Given
    const userId = 1
    apiClient.get.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    await getUserById(userId)

    // Then
    expect(apiClient.get).toHaveBeenCalled()
    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get.mock.calls[0][0]).toBe(`/users/${userId}`)
  })

  it('Should GET users', () => {
    // Given
    const matriculePart = '007'
    apiClient.get.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    getUsersByMatricule(matriculePart)

    // Then
    expect(apiClient.get).toHaveBeenCalled()
    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get.mock.calls[0][0]).toBe(`/users?matricule=${matriculePart}`)
  })

  it('Should POST a sample set', async () => {
    // Given
    const sampleSet = {}
    apiClient.post.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    await saveSampleSet(null, sampleSet)

    // Then
    expect(apiClient.post).toHaveBeenCalled()
    expect(apiClient.post).toHaveBeenCalledTimes(1)
    expect(apiClient.post.mock.calls[0][0]).toBe('/sampleSets')
    expect(apiClient.post.mock.calls[0][1]).toBe(sampleSet)
  })

  it('Should PUT a sample set', async () => {
    // Given
    const sampleSet = {
      id: 42,
    }
    apiClient.put.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    await saveSampleSet(sampleSet.id, sampleSet)

    // Then
    expect(apiClient.put).toHaveBeenCalled()
    expect(apiClient.put).toHaveBeenCalledTimes(1)
    expect(apiClient.put.mock.calls[0][0]).toBe(`/sampleSets/${sampleSet.id}`)
    expect(apiClient.put.mock.calls[0][1]).toBe(sampleSet)
  })

  it('Should GET a sample set by its id', async () => {
    // Given
    const sampleSetId = 42
    apiClient.get.mockReturnValueOnce(Promise.resolve({ data: { success: true } }))

    // When
    await getSampleSet(sampleSetId)

    // Then
    expect(apiClient.get).toHaveBeenCalled()
    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get.mock.calls[0][0]).toBe(`/sampleSets/${sampleSetId}`)
  })

  it("Should GET a sample set by its affaire' id", async () => {
    // Given
    const affaireId = 42
    apiClient.get.mockReturnValueOnce(Promise.resolve({ data: { success: true, sampleSets: [] } }))

    // When
    await getSampleSetByAffaireId(affaireId)

    // Then
    expect(apiClient.get).toHaveBeenCalled()
    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get.mock.calls[0][0]).toBe(`/sampleSets?affaireId=${affaireId}`)
  })
})
