import { validatePassword, validateMatricule, validateEmail, validateLatitude, validateLongitude } from './regex-util'

describe('Regex util functions', () => {
  it('should not accept weak password', () => {
    const weakPassword = '1234'

    const isValidPassword = validatePassword(weakPassword)

    expect(isValidPassword).toBe(false)
  })

  it('should accept strong password', () => {
    const weakPassword = 'aUei@1234'

    const isValidPassword = validatePassword(weakPassword)

    expect(isValidPassword).toBe(true)
  })

  it('Should validate matricule', () => {
    const matricule = '7897789'

    const isValidMatricule = validateMatricule(matricule)

    expect(isValidMatricule).toBe(true)
  })

  it('Should invalidate matricule', () => {
    const matricule = '789'

    const isValidMatricule = validateMatricule(matricule)

    expect(isValidMatricule).toBe(false)
  })

  it('Should invalidate matricule', () => {
    const matricule = undefined

    const isValidMatricule = validateMatricule(matricule)

    expect(isValidMatricule).toBe(false)
  })

  it('Should validate email address', () => {
    const email = 'test@interieur.gouv.fr'

    const isValidEmail = validateEmail(email)

    expect(isValidEmail).toBe(true)
  })

  it('Should invalidate email address', () => {
    const email = 'test@interieur.fr'

    const isValidEmail = validateEmail(email)

    expect(isValidEmail).toBe(false)
  })

  it('Should validate latitude gps coordinates', () => {
    const latitude = '2.876567'

    const isValidLatitude = validateLatitude(latitude)

    expect(isValidLatitude).toBe(true)
  })

  it('Should invalidate latitude gps coordinates', () => {
    const latitude = '890.87'

    const isValidLatitude = validateLatitude(latitude)

    expect(isValidLatitude).toBe(false)
  })

  it('Should validate longitude gps coordinates', () => {
    const longitude = '179.972343'

    const isValidLongitude = validateLongitude(longitude)

    expect(isValidLongitude).toBe(true)
  })

  it('Should invalidate longitude gps coordinates', () => {
    const longitude = '-200.8767'

    const isValidLongitude = validateLongitude(longitude)

    expect(isValidLongitude).toBe(false)
  })
})
