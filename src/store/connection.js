const state = {
  state: {
    communicating: false,
    connected: undefined,
    trying: false,
    offline: false,
  },

  mutations: {
    setCommunicating (state, communicating) {
      state.trying = !state.connected && communicating
      if (!state.trying) {
        state.communicating = communicating
      }
    },
    setConnected (state, connected) {
      state.connected = connected
    },
  },

  getters: {
    connectionState: state => state.trying
      ? 'trying'
      : state.communicating
        ? 'communicating'
        : state.connected
          ? 'connected'
          : 'disconnected',
  },

  actions: {
    noConnectionAvailable ({ commit, dispatch }) {
      commit('setConnected', false)
      dispatch('setMessage', { type: 'warning', message: 'Communication impossible avec le server' })
    },
    async connectionAvailable ({ commit, dispatch, state }, disconnected) {
      if (disconnected || state.connected === false) {
        await dispatch('checkSync')
      }
      commit('setConnected', true)
    },
    setCommunicating ({ commit }, isCommunicating) {
      commit('setCommunicating', isCommunicating)
    },
  },
}

export default state
