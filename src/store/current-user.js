import api from '@/api/index.js'
import localforage from 'localforage'

export const userTypes = {
  PS: 'PS',
  IJ: 'IJ',
}

export const userRole = {
  GESTIONNAIRE: 'GESTIONNAIRE',
  SUPERADMIN: 'SUPERADMIN',
}

const getDefaultUserState = () => ({
  _id: undefined,
  matricule: undefined,
  lastname: undefined,
  firstname: undefined,
  email: undefined,
  service: undefined,
  oldService: undefined,
  profile: undefined,
  profileIjRequestDate: undefined,
  profileIjValidationDate: undefined,
  roles: undefined,
  updatedAt: undefined,
  createdAt: undefined,
  centeringCity: undefined,
  centeringLatitude: undefined,
  centeringLongitude: undefined,
})

const getDefaultState = () => ({
  isSaving: false,
  loggedIn: undefined,
  deviceLocation: { lat: 45.763699, lng: 4.834777 },
  ...getDefaultUserState(),
})

export default {
  state () {
    return getDefaultState()
  },

  getters: {
    isGestionnaire: state => state.roles?.includes(userRole.GESTIONNAIRE),
  },

  mutations: {
    setFetching (state, isFetching) {
      state.isFetching = isFetching
    },

    login (state) {
      state.loggedIn = true
    },

    logout (state) {
      state.loggedIn = false
    },
    setUser (state, user) {
      const defaultUserState = getDefaultUserState()
      Object.assign(state, defaultUserState, user)
    },

    resetUser (state) {
      const defaultState = getDefaultState()
      Object.assign(state, defaultState)
    },

    setLocation (state, { lat, lng }) {
      state.deviceLocation.lat = lat
      state.deviceLocation.lng = lng
    },

  },

  actions: {
    async saveCurrentUser ({ commit, dispatch, state }, userData) {
      try {
        const { message, success, user } = await api.saveUser(userData)
        commit('setUser', user)
        const type = success ? 'success' : 'error'
        dispatch('setMessage', { type, message })
      } catch (error) {
        const errorMessage = `Impossible de modifier votre profil : ${error.message}` // eslint-disable-line no-irregular-whitespace
        if (userData.createdAt) {
          dispatch('setMessage', { type: 'error', errorMessage })
        }
        dispatch('setMessage', { message: errorMessage, type: 'error' })
      }
    },

    async setFetching ({ commit, dispatch }, isFetching) {
      commit('setFetching', isFetching)
    },

    resetUser ({ commit }) {
      commit('resetUser')
    },

    async setUser ({ commit }, { user, token }) {
      commit('setUser', user)
      await localforage.setItem('psij-token', token)
      await localforage.setItem('psij-user', user)
    },

    async authenticate ({ commit, dispatch }, { matricule, password }) {
      const { message, success, token, user } = await api.requestToken(matricule, password)
      if (!success) {
        throw new Error(message)
      }
      commit('login')
      dispatch('setMessage', { type: 'success', message: 'Bienvenue ' + user.firstname + ' ' + user.lastname, timeout: 2000 })
      await dispatch('setUser', { user, token })
    },

    async logout ({ commit, dispatch }) {
      commit('logout')
      commit('resetUser')
      await localforage.removeItem('psij-token')
      await localforage.removeItem('psij-user')
    },

    async checkToken ({ commit, dispatch }, token) {
      try {
        const responseData = await api.verifyToken(token)
        const { user, success, message } = responseData
        if (!success) {
          dispatch('setMessage', { type: 'error', message })
          throw new Error(message)
        }
        commit('setUser', user)
        await localforage.setItem('psij-user', user)
        commit('login')
      } catch {
        const user = await localforage.getItem('psij-user')
        commit('setUser', user)
      }
    },

    async setLocation ({ commit, dispatch, state }) {
      const dispatchError = (error) => {
        let message
        let type = 'error'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Vous avez refusé la géolocalisation'
            type = 'info'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Les informations de géolocalisation sont indisponibles'
            break
          case error.TIMEOUT:
            message = 'La requête pour obtenir les informations de géolocalisation n\'a pu aboutir dans le temps imparti'
            break
          case error.UNKNOWN_ERROR:
            message = 'Une erreur inconnue est survenue'
            break
        }
        message += ' - La ville de centrage définie dans votre profil va être utilisée - Sinon La carte sera centrée sur Lyon'
        dispatch('setMessage', { message, type })
      }
      let lat = state.centeringLatitude || 45.763688
      let lng = state.centeringLongitude || 4.834788
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          if ((position.coords.latitude || position.coords.latitude === 0) && (position.coords.longitude || position.coords.longitude === 0)) {
            lat = position.coords.latitude
            lng = position.coords.longitude
            commit('setLocation', { lat, lng })
          }
        }, dispatchError)
      }
      commit('setLocation', { lat, lng })
    },
  },
}
