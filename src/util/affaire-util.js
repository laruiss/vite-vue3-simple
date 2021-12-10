import { getUtcDateFromCurrentTzDateTime, getCurrentTzTimeFromUtc, getJSDateFromUtcIso } from '@/util/date-util.js'
import { AFFAIRE_STATES_READY_TO_SEND, AFFAIRE_STATES_SENT, syncInfoCaseDictionary } from '@/views/utils/cases-utils.js'

export function prepareAffaireForLocalForage (affaire) {
  const preparedAffaire = { ...affaire }

  // soft migration crimIn -> IDC, macros -> ij
  preparedAffaire.IDCNumber ??= preparedAffaire.crimInNumber
  preparedAffaire.IDCYear ??= preparedAffaire.crimInYear
  preparedAffaire.ijNumber ??= preparedAffaire.macrosNumber
  preparedAffaire.ijYear ??= preparedAffaire.macrosYear

  delete preparedAffaire.crimInNumber
  delete preparedAffaire.crimInYear
  delete preparedAffaire.macrosNumber
  delete preparedAffaire.macrosYear
  // /soft migration crimIn -> IDC, macros -> ij

  if (affaire.beginDateTime) {
    const { date: beginDate, time: beginTime } = getCurrentTzTimeFromUtc(affaire.beginDateTime)
    preparedAffaire.beginDate = beginDate
    preparedAffaire.beginTime = beginTime
    delete preparedAffaire.beginDateTime
  }

  if (affaire.endDateTime) {
    const { date: endDate, time: endTime } = getCurrentTzTimeFromUtc(affaire.endDateTime)
    preparedAffaire.endDate = endDate
    preparedAffaire.endTime = endTime
    delete preparedAffaire.endDateTime
  }

  if (affaire.reportBeginDateTime) {
    const { date: beginDate, time: beginTime } = getCurrentTzTimeFromUtc(affaire.reportBeginDateTime)
    preparedAffaire.reportBeginDate = beginDate
    preparedAffaire.reportBeginTime = beginTime
    delete preparedAffaire.reportBeginDateTime
  }

  if (affaire.reportEndDateTime) {
    const { date: endDate, time: endTime } = getCurrentTzTimeFromUtc(affaire.reportEndDateTime)
    preparedAffaire.reportEndDate = endDate
    preparedAffaire.reportEndTime = endTime
    delete preparedAffaire.reportEndDateTime
  }

  if (affaire.victimDOB) {
    const { date: victimDOB } = getCurrentTzTimeFromUtc(affaire.victimDOB)
    preparedAffaire.victimDOB = victimDOB
  }
  if (affaire.requerantDOB) {
    const { date: requerantDOB } = getCurrentTzTimeFromUtc(affaire.requerantDOB)
    preparedAffaire.requerantDOB = requerantDOB
  }

  preparedAffaire.otherAddressCheck = !!preparedAffaire.otherAddress

  return preparedAffaire
}

export function prepareAffaireForPersistance (affaire) {
  const preparedAffaire = { ...affaire }

  if (affaire.beginDate && affaire.beginTime) {
    preparedAffaire.beginDateTime = getUtcDateFromCurrentTzDateTime({
      date: affaire.beginDate,
      time: affaire.beginTime,
    })
  }

  if (affaire.endDate && affaire.endTime) {
    preparedAffaire.endDateTime = getUtcDateFromCurrentTzDateTime({
      date: affaire.endDate,
      time: affaire.endTime,
    })
  }
  delete preparedAffaire.beginDate
  delete preparedAffaire.beginTime
  delete preparedAffaire.endDate
  delete preparedAffaire.endTime

  if (affaire.reportBeginDate && affaire.reportBeginTime) {
    preparedAffaire.reportBeginDateTime = getUtcDateFromCurrentTzDateTime({
      date: affaire.reportBeginDate,
      time: affaire.reportBeginTime,
    })
  }

  if (affaire.reportEndDate && affaire.reportEndTime) {
    preparedAffaire.reportEndDateTime = getUtcDateFromCurrentTzDateTime({
      date: affaire.reportEndDate,
      time: affaire.reportEndTime,
    })
  }
  delete preparedAffaire.reportBeginDate
  delete preparedAffaire.reportBeginTime
  delete preparedAffaire.reportEndDate
  delete preparedAffaire.reportEndTime

  if (!affaire.otherAddressCheck) {
    delete preparedAffaire.otherAddress
  }
  delete preparedAffaire.otherAddressCheck

  if (affaire.victimLegalType === 'natural' && !affaire.isRequerantDifferentFromVictim) {
    delete preparedAffaire.companyName
    delete preparedAffaire.requerantTitle
    delete preparedAffaire.requerantLastname
    delete preparedAffaire.requerantFirstname
    delete preparedAffaire.requerantMaritalStatus
    delete preparedAffaire.requerantOtherLastname
    delete preparedAffaire.requerantDOB
    delete preparedAffaire.requerantPOB
    delete preparedAffaire.requerantNoPhoneNumber
    delete preparedAffaire.requerantCountryCode
    delete preparedAffaire.requerantPhone
    delete preparedAffaire.requerantAddress
    delete preparedAffaire.requerantLinkToVictim
  }

  if (affaire.victimLegalType === 'legal') {
    delete preparedAffaire.victimTitle
    delete preparedAffaire.victimLastname
    delete preparedAffaire.victimFirstname
    delete preparedAffaire.maritalStatus
    delete preparedAffaire.victimOtherLastname
    delete preparedAffaire.victimDOB
    delete preparedAffaire.victimPOB
    delete preparedAffaire.noPhoneNumber
    delete preparedAffaire.countryCode
    delete preparedAffaire.phone
    delete preparedAffaire.victimEmail
    delete preparedAffaire.otherAddressCheck
    delete preparedAffaire.otherAddress
    delete preparedAffaire.otherContact
    delete preparedAffaire.otherPerson
  }

  if (affaire.status === AFFAIRE_STATES_READY_TO_SEND) {
    preparedAffaire.status = AFFAIRE_STATES_SENT
  }
  return preparedAffaire
}

export function isDate (valueToTest) {
  return valueToTest instanceof Date || (valueToTest.toString().length > 4 && getJSDateFromUtcIso(valueToTest).toString() !== 'Invalid Date')
}

export function transformSyncPopin (valueToSync, valueKey) {
  let value = 'Non renseigné'
  if (valueToSync && syncInfoCaseDictionary[valueKey]?.fn) {
    value = syncInfoCaseDictionary[valueKey].fn(valueToSync)
  } else if (valueToSync && !syncInfoCaseDictionary[valueKey]?.fn) {
    value = valueToSync
  }
  return {
    label: syncInfoCaseDictionary[valueKey] ? syncInfoCaseDictionary[valueKey].label : valueKey,
    value,
  }
}

export const syncPopinFilteredKeys = [
  '_id',
  'trashed',
  'archived',
  'status',
  'validSteps',
  'toSync',
  'statusTracker',
  'owner',
  'ijOwners',
  'users',
  'apiAdresseUnreachable',
  'updatedAt',
  'createdAt',
]
