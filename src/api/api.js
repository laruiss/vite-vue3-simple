import { apiClient } from './xhr-client.js'
import localforage from 'localforage'

/**
 * Récupère le tutoriel
 *
 * @async
 * @function
 *
 * @returns {Promise.<Object>} - Le fichier tutoriel
 */
export async function getTutorial () {
  const urlTutorial = '/tutorial'
  const token = await localforage.getItem('psij-token')
  const config = {
    headers: {
      Authorization: token,
      Accept: 'application/pdf',
    },
    responseType: 'blob', // important
  }

  return apiClient.get(
    urlTutorial,
    config,
  ).then(response => response.data)
}

/**
 * Sauvegarde une affaire en base de données
 *
 * @async
 * @function
 *
 * @param {Affaire} affaire - Données de l'affaire
 *
 * @returns {Promise.<AffaireData>}} - Le document sauvegardé
 */
export async function saveAffaire (affaire) {
  let route = '/affaires'
  let method = 'post'
  if (affaire.createdAt) {
    method = 'put'
    route += `/${affaire._id}`
  }
  const response = await apiClient[method](route, affaire)
  return response.data.affaire
}

/**
 * Récupère les affaires courantes (ni archivées ni mises à la poublelle) depuis la base de données
 *
 * @async
 * @function
 *
 * @returns {Promise.<AffaireData>[]} - Les affaires récupérées
 */
export async function getAffaires () {
  const response = await apiClient.get('/affaires')
  return response?.data?.affaires
}

/**
 * Récupère depuis la base de données une affaire par son ID
 *
 * @async
 * @function
 *
 * @param {string} affaireId - ID de l'affaire
 *
 * @returns {Promise.<AffaireData>} - Le document récupéré
 */
export async function getAffaire (affaireId) {
  const response = await apiClient.get(`/affaires/${affaireId}`)
  // return response.data.affaire // Avec votre API
  return response.data // Avec json-server
}

/**
 * Met une affaire "à la poubelle" (flag trashed) à partir de son ID
 *
 * @async
 * @function
 *
 * @param {string} affaireId - ID de l'affaire
 *
 * @returns {Promise.<AffaireData>} - L'affaire (mise à jour)
 */
export async function trashAffaire (affaireId) {
  const response = await apiClient.put(`/affaires/${affaireId}/trashed`)
  return response.data.affaire
}

/**
 * Restaure une affaire "depuis la poubelle" (retire le flag trashed) à partir de son ID
 *
 * @async
 * @function
 *
 * @param {string} affaireId - ID de l'affaire
 *
 * @returns {Promise.<AffaireData>} - L'affaire (mise à jour)
 */
export async function untrashAffaire (affaireId) {
  const response = await apiClient.delete(`/affaires/${affaireId}/trashed`)
  return response.data.affaire
}

/**
 * Sauvegarde un utilisateur en base de données
 *
 * @async
 * @function
 *
 * @param {User} user - Données de l'utilisateur
 *
 * @returns {Promise.<UsersResponse>}} - L'utilisateur sauvegardé
 */
export async function saveUser (user) {
  let route = '/users'
  let method = 'post'
  if (user.createdAt) {
    delete user.password
    delete user.confirmPassword
    delete user.email
    delete user.confirmEmail
    method = 'patch'
    route += `/${user._id}`
  }
  const response = await apiClient[method](route, user)
  return response.data
}

/**
 * Met à jour un utilisateur par le gestionnaire en base de données
 *
 * @async
 * @function
 *
 * @param {User} user - Données de l'utilisateur
 *
 * @returns {Promise.<UsersResponse>}} - L'utilisateur sauvegardé
 */
export async function updateUserByGestionnaire (user) {
  const response = await apiClient.patch(`/users/gestion/${user._id}`, user)
  return response.data
}

/**
 * Récupère  les utilisateurs
 *
 * @async
 * @function
 *
 *
 */
export async function getUsers () {
  const response = await apiClient.get('/users')
  return response.data.users
}
/**
 * Récupère  un utilisateur par son ID depuis la base de données
 *
 * @async
 * @function
 *
 * @param {string} userId - ID de l'utilisateur
 *
 * @returns {Promise.<UserData>}} - L'utilisateur
 */
export async function getUserById (userId) {
  const response = await apiClient.get(`/users/${userId}`)
  return response.data.user
}

/**
 * Récupère  les utilisateurs à partir d'une fraction de leur matricule depuis la base de données
 *
 * @async
 * @function
 *
 * @param {string} matricule - fraction de matricule utilisateur
 *
 * @returns {Promise.<UserData>[]}} - Les utlisateurs dont le matricule contient la chaine matricule envoyée
 */
export async function getUsersByMatricule (matricule) {
  const response = await apiClient.get(`/users?matricule=${matricule}`)
  return response.data.users
}

/**
 * Récupère  un token utilisateur à partir de son matricule et mot de passe
 *
 * @async
 * @function
 *
 * @param {string} matricule - matricule utilisateur
 * @param {string} password - password utilisateur
 *
 * @returns {Promise.<Object>}} - Objet avec success à `true`, le token dans la propriété token et l'utilisateur dans la propriété user,
 *                               ou avec success à `false`  et le message correspondant dans la propriété `message` en cas d'echec
 */
export async function requestToken (matricule, password) {
  const data = { matricule, password }
  const response = await apiClient.post('/auth', data)
  return response.data
}

/**
 * Récupère  un utilisateur à partir de son token
 *
 * @async
 * @function
 *
 * @param {string} token - token de l'utilisateur
 *
 * @returns {Promise.<Objet>}} - Objet avec success à `true` et l'utilisateur dans la propriété user,
 *                               ou avec success à `false`  et le message correspondant dans la propriété `message` en cas d'echec
 */
export async function verifyToken (token) {
  const data = { token }
  const response = await apiClient.get('/auth/verify-token', data)
  return response.data
}

/**
 * Envoie une adresse courriel pour envoyer un courriel permettant au destinataire de
 * réinitialiser son mot de passe
 *
 * @async
 * @function
 *
 * @param {string} email - Adresse courriel de l'utilisateur
 *
 * @returns {Promise.<Object>} - Objet avec success à `true` si le mail a pu être envoyé,
 *                               à `false` sinon, avec le message correspondant
 *                               dans la propriété `message`
 */
export async function sendMailResetLink (email) {
  const response = await apiClient.post('/users/reset-link', { email })
  return response.data
}

/**
 * Envoie le nouveau mot de passe de l'utilisateur
 *
 * @async
 * @function
 *
 * @param {string} email - Adresse courriel de l'utilisateur
 *
 * @returns {Promise.<Object>} - Objet avec success à `true` si le mail a pu être envoyé,
 *                               à `false` sinon, avec le message correspondant
 *                               dans la propriété `message`
 */
export async function resetPassword (email, hash, password) {
  const response = await apiClient.patch('/me', { email, hash, password })
  return response.data
}

/**
 * Sauvegarde en base de données le jeu de données de prélèvements
 *
 * @async
 * @function
 *
 * @param {string=} sampleSetId - ID du jeu de données
 *                                Si sa valeur est à `undefined`, ce sera une création (POST),
 *                                sinon, une modificaton (PUT)
 * @param {SampleSetData} sampleSet - Données de prélèvements
 *
 * @returns {Promise.<SampleSetData>} - Le document sauvegardé
 */
export async function saveSampleSet (sampleSetId, sampleSet) {
  let route = '/sampleSets'
  let method = 'post'
  if (sampleSetId) {
    method = 'put'
    route += `/${sampleSetId}`
  }
  const response = await apiClient[method](route, sampleSet)
  return response.data.sampleSet
}

/**
 * Récupère depuis la base de données le jeu de données de prélèvements par son ID
 *
 * @async
 * @function
 *
 * @param {string} sampleSetId - ID du jeu de données
 *
 * @returns {Promise.<SampleSetData>} - Le document récupéré
 */
export async function getSampleSet (sampleSetId) {
  const route = `/sampleSets/${sampleSetId}`
  const response = await apiClient.get(route)
  return response.data.sampleSet
}

/**
 * Récupère depuis la base de données le jeu de données de prélèvements
 * par l'ID de l'affaire à laquelle il est rattaché
 *
 * @async
 * @function
 *
 * @param {string} affaireId - ID de l'affaire
 *
 * @returns {Promise.<SampleSetData>} - Le document récupéré
 */
export async function getSampleSetByAffaireId (affaireId) {
  const route = `/sampleSets?affaireId=${affaireId}`
  const response = await apiClient.get(route)
  const sampleSets = response.data.sampleSets
  return sampleSets && sampleSets[0]
}

export async function validateEmail (id, emailValidationHash) {
  const response = await apiClient.patch(`/users/${id}`, { h: emailValidationHash })
  return response.data
}

/**
 * Retire un utilisateur d'une affaire
 *
 * @async
 * @function
 *
 * @param {string} affaireId - ID de l'affaire
 * @param {string} userId - ID de l'utilisateur à enlever de l'affaire
 *
 * @returns {Promise.<UsersResponse>} - Objet avec success à `true` et les agents PS de l'affaire dans la propriété users,
 *                               ou avec success à `false`  et le message correspondant dans la propriété `message` en cas d'echec
 */
export async function removeUserFromAffaire (affaireId, userId) {
  const response = await apiClient.delete(`/affaires/${affaireId}/users/${userId}`)
  return response.data
}

/**
 * Ajoute un utilisateur à une affaire
 *
 * @async
 * @function
 *
 * @param {string} affaireId - ID de l'affaire
 * @param {string} userId - ID de l'utilisateur à ajouter à l'affaire
 *
 * @returns {Promise.<UsersResponse>}  - Objet avec success à `true` et les agents PS de l'affaire dans la propriété users,
 *                               ou avec success à `false`  et le message correspondant dans la propriété `message` en cas d'echec
 */
export async function addUserToAffaire (affaireId, userId) {
  const response = await apiClient.post(`/affaires/${affaireId}/users`, { userId })
  return response.data
}

/**
 * Ajoute un ou plusieurs agents IJ à une affaire
 *
 * @async
 * @function
 *
 * @param {string} affaireId - ID de l'affaire
 * @param {string | string[]} ijOwnersId - ID de l'agent IJ à ajouter à l'affaire
 *
 * @returns {Promise.<Object>}  - Objet avec success à `true` et les agents IJ de l'affaire dans la propriété users,
 *                               ou avec success à `false`  et le message correspondant dans la propriété `message` en cas d'echec
 */
export async function addIJOwnerToAffaire (affaireId, ijOwnersId) {
  const response = await apiClient.post(`/affaires/${affaireId}/ijOwners`, { ijOwnersId })
  return response.data
}

/**
 * Met à jour la liste des IJOwners d'une affaire
 *
 * @async
 * @function
 *
 * @param {string} affaireId - ID de l'affaire
 * @param {string[]} ijOwnersId - ID de l'agent IJ à ajouter à l'affaire
 *
 * @returns {Promise.<UsersResponse>} - Objet avec success à `true` et les agents IJ de l'affaire dans la propriété users,
 *                               ou avec success à `false`  et le message correspondant dans la propriété `message` en cas d'echec
 */
export async function updateIJOwnersOfAffaire (affaireId, ijOwnersId) {
  const response = await apiClient.put(`/affaires/${affaireId}/ijOwners`, { ijOwnersId })
  return response.data
}

/**
 * Récupère la liste des agents IJ d'une affaire
 *
 * @async
 * @function
 *
 * @param {Promise.<string>} affaireId - ID de l'affaire
 *
 * @returns {UserData[]} - agents IJ de l'affaire
 */
export async function getIJOwnersOfAffaire (affaireId) {
  const response = await apiClient.get(`/affaires/${affaireId}/ijOwners`)
  return response.data.ijOwners
}

/**
 * @typedef UsersResponse
 * @type {Object}
 *
 * @property {string=} message - Message à afficher à l'utilisateur (surtout en cas d'erreur)
 * @property {boolean} success - Succès (`true`) ou non (`false`) de la requête
 * @property {UserData[]} users - Liste d'utilisateurs de l'affaire (en cas de succès)
 */

/**
 * @typedef UserData
 * @type {Object}
 *
 * @property {string} _id - ID de l'utilisateur
 * @property {Date} createdAt - Date de création du document danb bdd
 * @property {Date} updatedAt - Date de dernière modification daba bdd
 * @property {string} firstname - Prénom de l'utilisateur
 * @property {string} lastname - Nom d'usage de l'utilisateur
 * @property {string} email - Adresse courriel de l'utilisateur
 * @property {Date} profileIjRequestDate - Date de demande de profil IJ
 * @property {Date} profileIjValidationDate - Date de validation de profil IJ
 * @property {'IJ' | 'PS'} profile - Profile (Police Secours - PS, ou Identité Judiciaire - IJ) de l'utilisateur
 * @property {string} service - Service de l'utilisateur
 * @property {string} oldService - Ancien service PS de l'utilisateur
 * @property {string} matricule - Matricule de l'utilisateur
 * @property {string} emailValidationHash - Hash de validation de l'email de l'utilisateur
 * @property {string} emailValidatedAt - Date de validation du courrier de l'utilisateur
 * @property {string} isValidatedEmail - Valeur à (false) si l'email n'est pas valide
 */

/**
 * @typedef AffaireData
 * @type {Object}
 *
 * @property {string} _id
 * @property {UserData} owner
 * @property {UserData[]} ijOwners
 * @property {UserData[]} users
 * @property {boolean=} trashed
 * @property {boolean=} archived
 * @property {string=} status
 * @property {string=} validSteps
 * @property {string=} firstname
 * @property {string=} lastname
 * @property {string=} email
 * @property {Date=} reportBeginDateTime
 * @property {number=} procedureYear
 * @property {number=} procedureNumber
 * @property {Date=} beginDateTime
 * @property {Date=} endDateTime
 * @property {string=} breaking
 * @property {string=} frame
 * @property {string=} zipCode
 * @property {string=} city
 * @property {string=} address
 * @property {number=} latitude
 * @property {number=} longitude
 * @property {string=} interphone
 * @property {string=} digicode
 * @property {string=} etage
 * @property {string=} other
 * @property {string=} companyName
 * @property {string=} victimTitle
 * @property {string=} victimLastname
 * @property {string=} victimFirstname
 * @property {string=} maritalStatus
 * @property {string=} victimOtherLastname
 * @property {Date=} victimDOB
 * @property {string=} victimPOB
 * @property {string=} victimEmail
 * @property {string=} noPhoneNumber
 * @property {string=} countryCode
 * @property {string=} phone
 * @property {string=} otherAddress
 * @property {string=} otherContact
 * @property {string=} otherPerson
 * @property {string=} locationType
 * @property {string=} otherTypeDetails
 * @property {string=} codeVPEDetails
 * @property {number=} codeVPENumber
 * @property {string=} selections
 * @property {string=} otherModeInput
 * @property {string=} observation
 * @property {Date=} reportEndDateTime
 */

/**
 * @typedef SampleSetData
 * @type {Object}
 *
 * @property {string} affaire - Id de l'affaire concernant ces données de prélèvements
 * @property {number} papillary - Nombre de prélèvements papillaires
 * @property {number} bio - Nombre de prélèvements biologiques
 * @property {number} objects - Nombre de prélèvements d'objets
 * @property {number} regulars - Nombre de prélèvements d'empreintes de familiers
 * @property {number} photos - Nombre de photo prises
 */
