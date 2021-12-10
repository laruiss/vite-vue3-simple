import api from '@/api/index.js'

export default {
  state () {
    return {
      list: [],
    }
  },

  mutations: {
    getUsers (state, list) {
      state.list = list
    },

  },

  actions: {
    async saveOtherUser ({ commit, dispatch }, userData) {
      try {
        const { message, success } = await api.updateUserByGestionnaire(userData)
        const type = success ? 'success' : 'error'
        dispatch('setMessage', { type, message })
        dispatch('getUsers')
      } catch (error) {
        const errorMessage = `Impossible de modifier l' utilisateur ${userData.firstname} - ${userData.firstname} - ${userData.matricule}  : ${error.message}` // eslint-disable-line no-irregular-whitespace
        if (userData.createdAt) {
          dispatch('setMessage', { type: 'error', errorMessage })
        }
        dispatch('setMessage', { message: errorMessage, type: 'error' })
      }
    },

    async getUsers ({ commit, dispatch }) {
      try {
        const allUsers = await api.getUsers()
        commit('getUsers', allUsers)
      } catch (error) {
        await dispatch('setMessage', { type: 'error', message: error })
      }
    },
  },
}
