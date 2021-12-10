import { parse, isBefore } from 'date-fns/fp'

export const isEqual = a => b => a === b
export const isTruthy = a => !!a
export const isPositiveInteger = nb => typeof nb === 'number' && Math.floor(nb) === nb && nb >= 0
export const identity = x => x

export const isTrimmedValue = (value) => !!value && value === value.trim()

export const isValidDOB = value => {
  const parseDOB = parse(new Date(0, 0, 0, 0, 0, 0, 0))('dd/MM/yyyy')
  const isBeforeNow = isBefore(new Date())
  const simpleDobRegexTest = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/.test(value)
  if (!simpleDobRegexTest) {
    return false
  }
  const parsedDate = parseDOB(value)
  return (
    !!value &&
        parsedDate.toString() !== 'Invalid Date' &&
        isBeforeNow(parsedDate)
  )
}
