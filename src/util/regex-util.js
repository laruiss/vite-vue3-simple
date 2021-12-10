/* eslint-disable-next-line no-useless-escape */
export const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const phone = /^0[1-79][0-9]{8}$/
export const formattedFrenchPhone = /(^0[1-79] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$)/
export const formattedPseudoInternational = /^00 00 00 00 00$/
export const formattedNeoCaledonianPhone = /^[0-9]{2} [0-9]{2} [0-9]{2}$/
export const internationalformattedFrenchMetropolitanPhone = /^\+33 [1-79] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$/
export const internationalformattedNeoCaledonianPhone = /^\+687 [0-9]{2} [0-9]{2} [0-9]{2}$/
export const internationalformattedGuadeloupeanPhone = /^\+590 590 [0-9]{2} [0-9]{2} [0-9]{2}$/
export const internationalformattedMartinicanPhone = /^\+596 596 [0-9]{2} [0-9]{2} [0-9]{2}$/
export const internationalformattedGuianesePhone = /^\+594 594 [0-9]{2} [0-9]{2} [0-9]{2}$/
export const internationalformattedReunionPhone = /^\+262 262 [0-9]{2} [0-9]{2} [0-9]{2}$/
export const formattedPhones = [
  formattedFrenchPhone,
  formattedPseudoInternational,
]
/* eslint-disable-next-line no-useless-escape */
export const emailMI = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@interieur.gouv.fr$/

export const fullProcedureNumberRegex = /^\d{4}\/[1-9]\d*$/

export const matricule = /^[0-9]{7}$/

export const strongEnoughPasswordObject = {
  'Au moins 8 caractères': /^.{8,}$/,
  'Au moins un chiffre': /[0-9]+/,
  'Au moins une majuscule': /[A-Z]+/,
  'Au moins une minuscule': /[a-z]+/,
  'Au moins un caractère spécial': /\W+/,
}

export const stripHtmlRegex = /<\/?[^>]+(>|$)/g

export const strongPassword = Object.values(strongEnoughPasswordObject)

export const latitude = /^(-?[1-8]?\d\.\d{6}|90\.0{6})$/
export const longitude = /^(-?(?:1[0-7]|[1-9])?\d\.\d{6}|180\.0{6}?)$/

export const validateMatricule = mat => matricule.test(mat)

export const validatePassword = pwd => strongPassword.every(passwdRegex => passwdRegex.test(pwd))

export const validateEmail = email => emailMI.test(email)

export const validateFullProcedureNumber = fullProcedureNumber => fullProcedureNumberRegex.test(fullProcedureNumber)

export const validateLatitude = lat => {
  if (lat) {
    return latitude.test(lat)
  } else {
    return true
  }
}
export const validateLongitude = long => {
  if (long) {
    return longitude.test(long)
  } else {
    return true
  }
}
