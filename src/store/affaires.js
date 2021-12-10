import localforage from 'localforage'
import { parseISO } from 'date-fns/fp'

import api from '@/api/index.js'
import { prepareAffaireForLocalForage, prepareAffaireForPersistance } from '@/util/index.js'
import { generateAffaireId } from './current-affaire.js'

export default {
  state () {
    return {
      isFetching: false,
      list: [],
    }
  },

  mutations: {
    setAffaires (state, affaires) {
      state.list = affaires
    },

    updateAffaires (state, affaire) {
      state.list = [
        ...state.list.filter(listAffaire => listAffaire._id !== affaire._id),
        affaire,
      ]
    },

    setFetching (state, isFetching) {
      state.isFetching = isFetching
    },

    deleteAffaire (state, affaireId) {
      state.list = state.list.filter(affaire => affaire._id !== affaireId)
    },
  },

  getters: {
    affairesToSync: (state, getters, rootState) => {
      const isUser = async affaire => {
        const users = new Set([
          affaire.owner,
          ...affaire.users,
          ...affaire.ijOwners,
        ])
        return [...users]
          .some(async user => {
            return await user?.toString() === rootState.currentUser?._id?.toString() ||
              user?._id?.toString() === rootState.currentUser?._id?.toString()
          })
      }
      return state.list.filter(affaire => affaire.toSync && affaire.toSync !== {} && isUser(affaire))
    },
  },

  actions: {
    async setAffaires ({ commit, dispatch }, affaires) {
      await commit('setAffaires', affaires)
    },

    async updateAffaires ({ commit }, affaire) {
      await commit('updateAffaires', affaire)
    },

    async getAffaires ({ commit, dispatch, rootState }) {
      commit('setFetching', true)
      dispatch('setCommunicating', true)
      let preparedAffaires
      try {
        const persistedAffaires = await api.getAffaires()
        preparedAffaires = persistedAffaires.map(prepareAffaireForLocalForage)
      } catch (error) {
        const errorMessage = `Une erreur est survenue : ${error.message}` // eslint-disable-line no-irregular-whitespace
        await dispatch('setMessage', { message: errorMessage, type: 'error' })
        preparedAffaires = []
      }

      dispatch('setCommunicating', false)
      commit('setFetching', false)

      const storedKeys = await localforage.keys()
      const affairesKeys = storedKeys.filter(storedKey =>
        storedKey.startsWith('psCase-'),
      )
      // Affichage Antéchronologique de la liste des affaires
      const affairesReverse = affairesKeys.reverse()
      const affairesAsPromises = affairesReverse.map(affaireKey =>
        localforage.getItem(affaireKey),
      )
      const localAffaires = await Promise.all(affairesAsPromises)
      const uniqAffaires = new Map()
      for (const affaire of localAffaires) {
        uniqAffaires.set(affaire._id, affaire)
      }

      for (const affaire of preparedAffaires) {
        const affaireCopy = uniqAffaires.get(affaire._id)
        if (
          !affaireCopy ||
          !affaireCopy.updatedAt ||
          parseISO(affaireCopy.updatedAt) < parseISO(affaire.updatedAt)
        ) {
          uniqAffaires.set(affaire._id, affaire)
        }
      }
      await commit('setAffaires', [...uniqAffaires.values()])
    },

    async createAffaire ({ commit, dispatch }) {
      await dispatch('resetStorage')
      await dispatch('resetAffaire')
      const affaireId = generateAffaireId()
      await dispatch('setAffaireId', affaireId)
    },

    async saveAffaire ({ commit, dispatch }, affaire) {
      const preparedAffaire = prepareAffaireForPersistance(affaire)
      await api.saveAffaire(preparedAffaire)
      await dispatch('getAffaires')
    },

    async trashAffaire ({ commit, dispatch, rootState }) {
      commit('setFetching', true)
      dispatch('setCommunicating', true)
      try {
        const affaireId = rootState.currentAffaire.affaireId
        await api.trashAffaire(affaireId)
        await dispatch('RemoveAffaireFromStorage', affaireId)
        await dispatch('resetStorage')
        await dispatch('resetAffaire')
        await commit('deleteAffaire', affaireId)
      } catch (error) {
        const errorMessage = `L'affaire n'a pas pu être effacée : ${error.message}` // eslint-disable-line no-irregular-whitespace
        await dispatch('setMessage', { message: errorMessage, type: 'error' })
      }
      dispatch('setCommunicating', false)
      commit('setFetching', false)
    },

  },
}
