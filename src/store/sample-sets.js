import localforage from 'localforage'

import api from '@/api/index.js'

const getDefaultSampleSetState = () => ({
  bio: undefined,
  isFetching: false,
  isSaving: false,
  objects: undefined,
  papillary: undefined,
  photos: undefined,
  regulars: undefined,
  id: undefined,
})

let saveTimeoutId

export default {
  state () {
    return getDefaultSampleSetState()
  },

  mutations: {
    setSampleSet (state, sampleSet) {
      if (!sampleSet) {
        return
      }
      Object.entries(sampleSet).forEach(([key, value]) => {
        if (key === 'affaire') {
          return
        }
        if (key === '_id') {
          state.id = value
          return
        }
        state[key] = value
      })
    },

    setFetching (state, isFetching) {
      state.isFetching = isFetching
    },
    setSaving (state, isSaving) {
      state.isSaving = isSaving
    },
    setBio (state, bio) {
      state.bio = bio
    },
    setObjects (state, objects) {
      state.objects = objects
    },
    setPapillary (state, papillary) {
      state.papillary = papillary
    },
    setPhotos (state, photos) {
      state.photos = photos
    },
    setRegulars (state, regulars) {
      state.regulars = regulars
    },

    resetSampleSet (state) {
      const defaultState = getDefaultSampleSetState()
      Object.assign(state, defaultState)
    },
  },

  actions: {
    async getSampleSet ({ commit, dispatch, rootState }, sampleSetId) {
      // Récupération de l'ID de l'affaire
      const affaireId = rootState.currentAffaire.affaireId

      // Tentative de récupération des données de prélèvement depuis la base de données
      commit('setFetching', true)
      dispatch('setCommunicating', true)
      let persistedSampleSet
      try {
        persistedSampleSet = await api.getSampleSet(sampleSetId)
      } catch (error) {
        const errorMessage = `Une erreur est survenue : ${error.message}` // eslint-disable-line no-irregular-whitespace
        await dispatch('setMessage', { message: errorMessage, type: 'error' })
      }
      dispatch('setCommunicating', false)
      commit('setFetching', false)

      // Si la récupération
      const sampleSet = persistedSampleSet || await localforage.getItem(`sampleSet-${affaireId}`)

      commit('setSampleSet', sampleSet)
    },

    async getSampleSetByAffaireId ({ commit, dispatch, rootState }, affaireId) {
      // Tentative de récupération des données de prélèvement depuis la base de données
      commit('setFetching', true)
      dispatch('setCommunicating', true)
      let persistedSampleSet
      try {
        persistedSampleSet = await api.getSampleSetByAffaireId(affaireId)
      } catch (error) {
        const errorMessage = `Une erreur est survenue : ${error.message}` // eslint-disable-line no-irregular-whitespace
        await dispatch('setMessage', { message: errorMessage, type: 'error' })
      }
      dispatch('setCommunicating', false)
      commit('setFetching', false)

      // Si la récupération ne s'est pas faite, essayer de récupérée ce qu'il y a dans localforage
      const sampleSet = persistedSampleSet || await localforage.getItem(`sampleSet-${affaireId}`)

      commit('setSampleSet', sampleSet)
    },

    async saveSampleSet ({ commit, dispatch, rootState, state }) {
      if (state.isSaving) {
        clearTimeout(saveTimeoutId)
        saveTimeoutId = setTimeout(() => dispatch('saveSampleSet'), 500)
        return
      }
      commit('setSaving', true)
      // Récupération de l'ID de l'affaire
      const affaireId = rootState.currentAffaire.affaireId
      const sampleSet = {
        affaire: affaireId,
        bio: state.bio,
        objects: state.objects,
        papillary: state.papillary,
        photos: state.photos,
        regulars: state.regulars,
      }
      await localforage.setItem(`sampleSet-${affaireId}`, sampleSet)
      try {
        const persistedSampleSet = await api.saveSampleSet(state.id, sampleSet)
        commit('setSampleSet', persistedSampleSet)
      } catch (error) {
        const errorMessage = `Une erreur est survenue : ${error.message}` // eslint-disable-line no-irregular-whitespace
        await dispatch('setMessage', { message: errorMessage, type: 'error' })
      }
      commit('setSaving', false)
    },

    setBio ({ commit }, bio) {
      commit('setBio', bio)
    },
    setObjects ({ commit }, objects) {
      commit('setObjects', objects)
    },
    setPapillary ({ commit }, papillary) {
      commit('setPapillary', papillary)
    },
    setPhotos ({ commit }, photos) {
      commit('setPhotos', photos)
    },
    setRegulars ({ commit }, regulars) {
      commit('setRegulars', regulars)
    },

    resetSampleSet ({ commit }) {
      commit('resetSampleSet')
    },
  },
}
