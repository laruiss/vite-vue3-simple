import {
  getUtcDateFromCurrentTzDateTime,
  getUtcDateFromCurrenTzDate,
  getJSDateFromUtcIso,
  getCurrentTzTimeFromUtc,
} from './date-util.js'

describe('date-util', () => {
  it('Should return a french zoned time Date object', () => {
    const date = '2020-01-01'
    const time = '21:21:21'

    const displayTime = getUtcDateFromCurrentTzDateTime({ date, time })

    const hour = +displayTime.toISOString().split('T')[1].split(':')[0]
    expect(displayTime).toBeInstanceOf(Date)
    expect(typeof hour).toBe('number')
  })

  it('Should return a french zoned time Date object', () => {
    const date = '2020-01-01'

    const currentTzDate = getUtcDateFromCurrenTzDate(date)

    const hour = +currentTzDate.toISOString().split('T')[1].split(':')[0]
    const wholeDate = currentTzDate.toISOString().split('T')[0]
    const day = +wholeDate.split('-')[2]
    const month = +wholeDate.split('-')[1]

    expect(currentTzDate).toBeInstanceOf(Date)
    expect(typeof hour).toBe('number')
    expect(typeof day).toBe('number')
    expect(typeof month).toBe('number')
  })

  it('Should return a native Date object', () => {
    const date = '2020-02-02'

    const received = getJSDateFromUtcIso(date)

    expect(received.getMonth()).toBe(1)
    expect(received.getFullYear()).toBe(2020)
    expect(received.getDate()).toBeGreaterThan(1)
    expect(received.getDate()).toBeLessThan(4)
  })

  it('Should return an object with a date and a time properties, both strings', () => {
    const isoDate = '2020-02-02T20:21:21.000Z'

    const { date, time } = getCurrentTzTimeFromUtc(isoDate)

    expect(date).toBe('2020-02-02')
    expect(/[0-9]{2}:[0-9]{2}/.test(time)).toBe(true)
  })
})
