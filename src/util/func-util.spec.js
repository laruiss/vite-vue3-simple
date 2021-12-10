import { isEqual, isTruthy } from './func-util.js'

describe('func-util', () => {
  it('Should return isEqual', () => {
    const a = 'any value'
    const b = a

    const equal = isEqual(a)(b)

    expect(equal).toBe(true)
  })

  it('should not accept undefined value', () => {
    const invalidString = undefined

    const isValidString = isTruthy(invalidString)

    expect(isValidString).toBe(false)
  })

  it('should accept undefined value', () => {
    const validString = 'Tintin'

    const isValidString = isTruthy(validString)

    expect(isValidString).toBe(true)
  })
})
