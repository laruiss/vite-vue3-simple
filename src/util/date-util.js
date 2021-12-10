import { format, zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz/fp'
import { parseISO } from 'date-fns/fp'

const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone
const pattern = 'yyyy-MM-dd HH:mm'
export const getSimpleFrenchFormat = format(pattern)

const getUtcFromCurrentZoneTime = zonedTimeToUtc(currentTz)
const getCurrentZoneTimeFromUtc = utcToZonedTime(currentTz)

export function getUtcDateFromCurrentTzDateTime ({ date, time }) {
  return getUtcFromCurrentZoneTime(`${date} ${time}`)
}

export function getUtcDateFromCurrenTzDate (date) {
  return getUtcFromCurrentZoneTime(`${date} 00:00:00`)
}

export function getJSDateFromUtcIso (dateUtcIso) {
  return parseISO(dateUtcIso)
}

export function getCurrentTzTimeFromUtc (dateUtcIso) {
  const dateTime = getCurrentZoneTimeFromUtc(dateUtcIso)
  const [date, time] = getSimpleFrenchFormat(dateTime).split(' ')
  return {
    date,
    time,
  }
}
