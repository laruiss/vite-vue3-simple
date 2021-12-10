import { getCurrentTzTimeFromUtc } from '@/util/date-util.js'

export const getUserInfoToDisplay = user => `${user.lastname} ${user.firstname} - ${user.matricule}`

export const referencedServices = window.isExperimentation
  ? [
      '00-SDPTS Expérimentation',
    ]
  : [
      '33-SDPTS Bordeaux',
      '38-SDPTS Grenoble',
      '59-SDPTS Lille',
      '69-SDPTS Lyon',
      '73-SDPTS Chambéry',
      '78-SDPTS Plaisir',
      '78-SDPTS Conflans',
      '78-SDPTS Elancourt',
      '78-SDPTS Saint-Germain-en-Laye',
      '94-SDPTS Villejuif',
      '974-SDPTS Saint-Pierre',
    ]

export const ijServicePlaceholder = window.isExperimentation
  ? '00-SDPTS Expérimentation'
  : '69-SDPTS Lyon'

export function formatDateUserList (value) {
  return getCurrentTzTimeFromUtc(value.value).date.split('-').reverse().join('/')
}
