import { ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import localforage from 'localforage'
import uniqid from 'uniqid'
import {
  // // prepareAffaireForPersistance,
  prepareAffaireForLocalForage,
  // // syncPopinFilteredKeys,
} from '@/util/index.js'

import api from '@/api/index.js'

export const generateAffaireId = () => `psCase-${uniqid()}`

export const useUser = defineStore('user', () => {
  const currentUser = ref({})
  return {
    currentUser,
  }
})

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useAffaire = defineStore('affaire', () => {
  const affaire = ref({})
  // const affaireSampleSet = ref({})
  const isFetching = ref(false)
  const isCommunicating = ref(false)

  async function fetchAffaire (affaireId) {
    const storedAffaireId = await localforage.getItem('affaireId')
    const currentAffaireId = affaireId || storedAffaireId || generateAffaireId()
    isCommunicating.value = true
    isFetching.value = true
    affaire.value = (await localforage.getItem(String(currentAffaireId))) || {}

    try {
      const affaireFromDB = await api.getAffaire(currentAffaireId)
      // affaireSampleSet.value = await api.getSampleSetByAffaireId(currentAffaireId)
      // await dispatch('getSampleSetByAffaireId', currentAffaireId)
      affaire.value = prepareAffaireForLocalForage(affaireFromDB)
    } catch ({ message }) {
      // dispatch('setMessage', { message, type: 'warning' })
      console.log('catch', message)
    }

    affaire.value.validSteps = new Set(affaire.value.validSteps)
    if (!affaire.value.owner) {
      affaire.value.owner = useUser().currentUser
    }

    await localforage.setItem(String(currentAffaireId), toRaw(affaire))
    // commit('setAffaire', affaire)
    // commit('setGotStoredAffaire', true)
    isFetching.value = false
    isCommunicating.value = false
  }

  return {
    isFetching,
    isCommunicating,
    affaire,
    fetchAffaire,
  }
})

// async getStoredAffaire ({ commit, dispatch, rootState }, affaireId) {
//   commit('resetAffaire')
//   await dispatch('resetSampleSet')
//   const storedAffaireId = await localforage.getItem('affaireId')
//   const currentAffaireId = affaireId || storedAffaireId || generateAffaireId()
//   commit('setAffaireId', currentAffaireId)
//   dispatch('setCommunicating', true)
//   commit('setFetching', true)
//   let affaire = (await localforage.getItem(currentAffaireId)) || {}
//   try {
//     const affaireFromDB = await api.getAffaire(currentAffaireId)
//     await dispatch('getSampleSetByAffaireId', currentAffaireId)
//     affaire = prepareAffaireForLocalForage(affaireFromDB)
//   } catch ({ message }) {
//     dispatch('setMessage', { message, type: 'warning' })
//   }

//   affaire.validSteps = new Set(affaire.validSteps)
//   if (!affaire.owner) {
//     affaire.owner = rootState.currentUser
//   }
//   commit('setAffaire', affaire)
//   commit('setGotStoredAffaire', true)
//   commit('setFetching', false)
//   dispatch('setCommunicating', false)
// },
