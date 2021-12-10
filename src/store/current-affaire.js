import localforage from 'localforage'
import uniqid from 'uniqid'

import {
  AFFAIRE_STATES_IN_PROGRESS,
  AFFAIRE_STATES_READY_TO_SEND,
  AFFAIRE_STATES_PROCESSING_BY_IJ,
  AFFAIRE_STATES_WAITING_FOR_RESULTS,
  AFFAIRE_STATES_RESULTS_AVAILABLE,
} from '@/views/utils/cases-utils.js'
import {
  prepareAffaireForPersistance,
  prepareAffaireForLocalForage,
  syncPopinFilteredKeys,
} from '@/util/index.js'
import api from '@/api/index.js'
import isEqual from 'lodash.isequal'

if (process.env.NODE_ENV === 'development') {
  localforage.setDriver(localforage.LOCALSTORAGE)
}

export const SAVE_STATE_IN_PROGRESS = 'SAVE_STATE_IN_PROGRESS'
export const SAVE_STATE_SUCCESS = 'SAVE_STATE_SUCCESS'
export const SAVE_STATE_ERROR = 'SAVE_STATE_ERROR'

export const generateAffaireId = () => `psCase-${uniqid()}`

const getDefaultAffaireState = () => ({
  affaireId: undefined,

  owner: undefined,
  ijOwners: [],

  users: [],

  reportBeginDate: undefined,
  reportBeginTime: undefined,

  procedureYear: undefined,
  procedureNumber: undefined,
  fullProcedureNumber: undefined,

  beginDate: undefined,
  beginTime: undefined,
  endTime: undefined,
  endDate: undefined,
  breaking: undefined,
  frame: undefined,

  apiAdresseUnreachable: undefined,
  zipCode: undefined,
  city: undefined,
  address: undefined,
  latitude: undefined,
  longitude: undefined,
  interphone: undefined,
  digicode: undefined,
  etage: undefined,
  other: undefined,
  secondaryResidence: undefined,
  victimLegalType: undefined,
  isRequerantDifferentFromVictim: undefined,
  companyName: undefined,
  victimTitle: undefined,
  victimLastname: undefined,
  victimFirstname: undefined,
  maritalStatus: undefined,
  victimOtherLastname: undefined,
  victimDOB: undefined,
  victimPOB: undefined,
  noPhoneNumber: undefined,
  countryCode: undefined,
  phone: undefined,
  victimEmail: undefined,
  otherAddressCheck: undefined,
  otherAddress: undefined,
  otherContact: undefined,
  otherPerson: undefined,

  requerantTitle: undefined,
  requerantLastname: undefined,
  requerantFirstname: undefined,
  requerantMaritalStatus: undefined,
  requerantOtherLastname: undefined,
  requerantDOB: undefined,
  requerantPOB: undefined,
  requerantNoPhoneNumber: undefined,
  requerantCountryCode: undefined,
  requerantPhone: undefined,
  requerantAddress: undefined,
  requerantLinkToVictim: undefined,

  locationType: undefined,
  otherTypeDetails: undefined,
  codeVPEDetails: undefined,
  codeVPENumber: undefined,

  selections: undefined,
  otherModeInput: undefined,

  observation: undefined,
  service: undefined,

  damageTypes: undefined,
  stolenMoney: undefined,
  otherDamage: undefined,
  reportEndDate: undefined,
  reportEndTime: undefined,

  IDCYear: undefined,
  IDCNumber: undefined,
  ijYear: undefined,
  ijNumber: undefined,
  ijNotCome: undefined,
  reasonIjNotCome: undefined,

  validSteps: new Set(),
  toSync: undefined,

  updatedAt: undefined,
  createdAt: undefined,

  status: AFFAIRE_STATES_IN_PROGRESS,

  gotStoredAffaire: false,
})

const getDefaultState = () => ({
  isFetching: false,
  isSaving: false,
  saveCurrentAffaireStatus: undefined,
  ...getDefaultAffaireState(),
})

export default {
  state () {
    return getDefaultState()
  },

  mutations: {
    setUsers (state, users) {
      if (users == null) {
        state.users = []
        return
      }
      state.users = users
    },

    setIJOwners (state, ijOwners) {
      if (ijOwners == null) {
        state.ijOwners = []
        return
      }
      state.ijOwners = ijOwners
    },

    setFetching (state, isFetching) {
      state.isFetching = isFetching
    },
    setSaving (state, isSaving) {
      state.isSaving = isSaving
    },

    setValidSteps (state, validSteps) {
      state.validSteps = new Set(validSteps)
    },
    saveValidSteps (state, saveValidStepsStatus) {
      state.saveValidStepsStatus = saveValidStepsStatus
    },

    setAffaireId (state, affaireId) {
      state.affaireId = affaireId
    },

    saveAffaireId (state, saveAffaireIdStatus) {
      state.saveAffaireIdStatus = saveAffaireIdStatus
    },

    setAffairePart (state, affairePart) {
      for (const key of Object.keys(affairePart)) {
        state[key] = affairePart[key]
      }
    },

    saveCurrentAffaireStatus (state, saveCurrentAffaireStatus) {
      state.saveCurrentAffaireStatus = saveCurrentAffaireStatus
    },

    setDateToAffaire (state, date) {
      state.reportBeginDate = date.toISOString().substr(0, 10)
      state.reportBeginTime = date.toLocaleTimeString().substr(0, 5)
    },
    setDateEndToAffaire (state, date) {
      state.reportEndDate = date.toISOString().substr(0, 10)
      state.reportEndTime = date.toLocaleTimeString().substr(0, 5)
    },

    setAffaire (state, wholeAffaire) {
      Object.keys(wholeAffaire).forEach(key => {
        state[key] = wholeAffaire[key]
      })
    },

    resetAffaire (state) {
      const defaultState = getDefaultAffaireState()
      Object.assign(state, defaultState)
    },

    setReadyForIJ (state) {
      if (state.status === AFFAIRE_STATES_IN_PROGRESS) {
        state.status = AFFAIRE_STATES_READY_TO_SEND
      }
    },

    setSampleSetAvailable (state) {
      if (
        state.status === AFFAIRE_STATES_PROCESSING_BY_IJ ||
        state.status === AFFAIRE_STATES_WAITING_FOR_RESULTS
      ) {
        state.status = AFFAIRE_STATES_RESULTS_AVAILABLE
      }
    },

    setGotStoredAffaire (state, gotStoredAffaire) {
      state.gotStoredAffaire = gotStoredAffaire
    },

    setSelectedOperationalMode (state, selections) {
      state.selections = selections
    },

    setLocationType (state, locationType) {
      state.locationType = locationType
    },
    setSelectedDamage (state, damageTypes) {
      state.damageTypes = damageTypes
    },
  },

  getters: {
    isDisabledAccordingToStatus: (state, getters, rootState, rootGetters) =>
      state.status === AFFAIRE_STATES_RESULTS_AVAILABLE &&
      !state.ijOwners.some(agent => agent === rootState.currentUser._id || agent._id === rootState.currentUser._id),

  },

  actions: {
    async addUserToAffaire ({ commit, dispatch, state }, userId) {
      if (!state.createdAt) {
        await dispatch('saveCurrentAffaire')
      }
      try {
        const { users } = await api.addUserToAffaire(state.affaireId, userId)
        commit('setUsers', users)
      } catch (error) {
        dispatch('setMessage', { message: error.message, type: 'error' })
      }
    },

    async addIJOwnerToAffaire ({ commit, dispatch, state }, { affaireId, ijOwnerId }) {
      try {
        const { ijOwners } = await api.addIJOwnerToAffaire(affaireId, ijOwnerId)
        commit('setIJOwners', ijOwners)
      } catch (error) {
        dispatch('setMessage', { message: error.message, type: 'error' })
      }
    },

    async updateIJOwnersOfAffaire ({ commit, dispatch, state }, { affaireId, ijOwnersId }) {
      try {
        const { ijOwners } = await api.updateIJOwnersOfAffaire(affaireId, ijOwnersId)
        commit('setIJOwners', ijOwners)
      } catch (error) {
        dispatch('setMessage', { message: error.message, type: 'error' })
      }
    },

    async removeUserFromAffaire ({ commit, dispatch, state }, userId) {
      try {
        const { users } = await api.removeUserFromAffaire(state.affaireId, userId)
        commit('setUsers', users)
      } catch (error) {
        dispatch('setMessage', { message: error.message, type: 'error' })
      }
    },

    async setAffaireId ({ commit, dispatch }, affaireId) {
      commit('setAffaireId', affaireId)
      await localforage.setItem('affaireId', affaireId)
    },

    async getAffaireId ({ commit }) {
      const affaireId = await localforage.getItem('affaireId')
      commit('setAffaireId', affaireId)
    },

    async saveAffairePart ({ commit, dispatch }, affairePart) {
      commit('setAffairePart', affairePart)
      await dispatch('saveCurrentAffaire')
    },

    async saveCurrentAffaire ({
      commit,
      dispatch,
      rootState,
      rootGetters,
      state,
      state: { affaireId, validSteps },
    }) {
      commit('setSaving', true)
      try {
        commit('saveCurrentAffaireStatus', SAVE_STATE_IN_PROGRESS)
        commit('setSaving', true)

        if (!affaireId) {
          const newAffaireId = generateAffaireId()
          await dispatch('setAffaireId', newAffaireId)
        }

        const affaire = getDefaultAffaireState()
        for (const key of Object.keys(affaire)) {
          affaire[key] = state[key]
        }

        affaire._id = state.affaireId
        affaire.validSteps = Array.from(affaire.validSteps)
        affaire.selections ??= []

        affaire.updatedAt = new Date().toISOString()
        state.updatedAt = affaire.updatedAt
        affaire.localUpdate = Date.now()
        affaire.modifier = {
          _id: rootState.currentUser._id,
          firstname: rootState.currentUser.firstname,
          lastname: rootState.currentUser.lastname,
          matricule: rootState.currentUser.matricule,
        }
        await localforage.setItem(affaire._id, affaire)
        const wasDisconnected = rootState.connection.connected === false
        if (wasDisconnected) {
          return
        }
        const preparedAffaire = prepareAffaireForPersistance(affaire)
        const savedAffaire = await api.saveAffaire(preparedAffaire)
        state.updatedAt = savedAffaire.updatedAt
        state.createdAt = savedAffaire.createdAt
        const preparedReturnedAffaire = prepareAffaireForLocalForage(savedAffaire)
        await localforage.setItem(savedAffaire._id, preparedReturnedAffaire)
        const affairesToSyncLength = rootGetters.affairesToSync.length
        const storedAffaire = rootGetters.affairesToSync.find(affaireToSync => affaireToSync._id === preparedReturnedAffaire._id)
        await dispatch('updateAffaires', preparedReturnedAffaire)
        const affairesToSyncLengthAfterUpdate = rootGetters.affairesToSync.length
        if (preparedReturnedAffaire.toSync && preparedReturnedAffaire.toSync !== {}) {
          const affaireToSyncDiff = Object.entries(preparedReturnedAffaire).some(([key, value]) => {
            return key !== 'updatedAt' && !isEqual(storedAffaire?.[key], value)
          })
          if (affaireToSyncDiff && affairesToSyncLength < affairesToSyncLengthAfterUpdate) {
            await dispatch('setStatePopin', { popin: 'openSyncPopin', open: true })
          }
        }
        commit('saveCurrentAffaireStatus', SAVE_STATE_SUCCESS)
        return true
      } catch (error) {
        const errorMessage = `Impossible d'enregistrer l'affaire. Une erreur est survenue : ${error.message}` // eslint-disable-line no-irregular-whitespace
        dispatch('setMessage', { message: errorMessage, type: 'error', timeout: '3000' })
        commit('saveCurrentAffaireStatus', SAVE_STATE_ERROR)
      } finally {
        commit('setSaving', false)
      }
    },

    async getIJOwners ({ commit }, affaireId) {
      const ijOwners = await api.getIJOwnersOfAffaire(affaireId)
      commit('setIJOwners', ijOwners)
    },

    async checkSync ({ commit, dispatch }) {
      localforage.keys().then(async lfKeys => { // Charge les éléments du localForage
        await Promise.all(
          lfKeys
            .filter(lfKey => lfKey.startsWith('psCase-')) // Filtre les éléments du localForage (garde uniquement les éléments 'psCase')
            .map(async lfKey => {
              const lfAffaire = await localforage.getItem(lfKey) // Récupère l'affaire (dans le LF) liée à la clé en cours de transformation
              if (!lfAffaire.localUpdate) { // Teste si l'affaire a été modifiée hors connexion (présence prop .localUpdate)
                return
              }
              let dbAffaire
              let preparedDbAffaire
              try {
                dbAffaire = await api.getAffaire(lfKey) // Tente de récupérer la version en DB de l'affaire LF
                preparedDbAffaire = prepareAffaireForLocalForage(dbAffaire)
              } catch (e) { // Si la récupération de l'affaire ne fonctionne pas
                const saveResult = await dispatch('saveAffairePart', lfAffaire) // `true` si l’enregistrement a réussi, undefined sinon
                if (saveResult) { // Si l'affaire DB ne peut être récupérée, tente de l'enregistrer en DB
                  delete lfAffaire.localUpdate
                  await localforage.setItem(lfAffaire._id, lfAffaire) // Si l'enregistrement réussi, on réenregistre l'affaire dans le LF sans la prop .localUpdate
                }
                return
              }

              const dbAffaireKeys = Object.keys(preparedDbAffaire) // Récupère les clés de l'affaire DB

              dbAffaireKeys
                .filter(fieldKey => !syncPopinFilteredKeys.includes(fieldKey)) // Enlève du test de différence les clés filtrées
                .forEach(fieldKey => {
                  const localValue = lfAffaire[fieldKey]
                  const dbValue = preparedDbAffaire[fieldKey]
                  if ((!localValue && !dbValue) || isEqual(localValue, dbValue)) { // return si local == DB ou si local ET DB == nullish
                    return
                  }
                  if (preparedDbAffaire.toSync?.[fieldKey]) {
                    preparedDbAffaire.toSync[fieldKey] = [
                      ...preparedDbAffaire.toSync[fieldKey],
                      { localValue, timestamp: lfAffaire.localUpdate, user: lfAffaire.modifier },
                    ]
                  } else {
                    preparedDbAffaire.toSync = preparedDbAffaire.toSync || {}
                    preparedDbAffaire.toSync[fieldKey] = [{ localValue, timestamp: lfAffaire.localUpdate, user: lfAffaire.modifier }]
                  }
                })
              await dispatch('setAffaireId', preparedDbAffaire._id)
              await dispatch('saveAffairePart', preparedDbAffaire)
            }),
        )
      })
    },

    async getStoredAffaire ({ commit, dispatch, rootState }, affaireId) {
      commit('resetAffaire')
      await dispatch('resetSampleSet')
      const storedAffaireId = await localforage.getItem('affaireId')
      const currentAffaireId = affaireId || storedAffaireId || generateAffaireId()
      commit('setAffaireId', currentAffaireId)
      dispatch('setCommunicating', true)
      commit('setFetching', true)
      let affaire = (await localforage.getItem(currentAffaireId)) || {}
      try {
        const affaireFromDB = await api.getAffaire(currentAffaireId)
        await dispatch('getSampleSetByAffaireId', currentAffaireId)
        affaire = prepareAffaireForLocalForage(affaireFromDB)
      } catch ({ message }) {
        dispatch('setMessage', { message, type: 'warning' })
      }

      affaire.validSteps = new Set(affaire.validSteps)
      if (!affaire.owner) {
        affaire.owner = rootState.currentUser
      }
      commit('setAffaire', affaire)
      commit('setGotStoredAffaire', true)
      commit('setFetching', false)
      dispatch('setCommunicating', false)
    },

    updateValidSteps ({ commit, dispatch, state }, { isValid, routeName }) {
      const validSteps = new Set(state.validSteps)
      if (
        (isValid && validSteps.has(routeName)) ||
        (!isValid && !validSteps.has(routeName))
      ) {
        return
      }
      isValid ? validSteps.add(routeName) : validSteps.delete(routeName)

      commit('setValidSteps', validSteps)
      return dispatch('saveCurrentAffaire')
    },

    setDateToAffaire ({ commit, state }, date = new Date()) {
      if (state.reportBeginDate) {
        return
      }
      commit('setDateToAffaire', date)
    },

    setDateEndToAffaire ({ commit, state }, date = new Date()) {
      if (state.reportEndDate) {
        return
      }
      commit('setDateEndToAffaire', date)
    },

    async setReadyForIJ ({ commit, dispatch }) {
      commit('setReadyForIJ')
      await dispatch('saveCurrentAffaire')
    },

    async setSampleSetAvailable ({ commit, dispatch }) {
      commit('setSampleSetAvailable')
      await dispatch('saveCurrentAffaire')
    },

    async resetAffaire ({ commit, dispatch, state }) {
      await dispatch('resetStorage')
      commit('resetAffaire')
      await dispatch('resetSampleSet')
      commit('setGotStoredAffaire', false)
    },

    async resetStorage () {
      await localforage.removeItem('affaireId')
    },

    async RemoveAffaireFromStorage ({ commit, dispatch }, affaireId) {
      await localforage.removeItem(affaireId)
    },

    setSelectedOperationalMode ({ commit }, selections) {
      commit('setSelectedOperationalMode', selections)
    },
    setSelectedDamage ({ commit }, damageTypes) {
      commit('setSelectedDamage', damageTypes)
    },

    setLocationType ({ commit }, locationType) {
      commit('setLocationType', locationType)
    },
  },
}
