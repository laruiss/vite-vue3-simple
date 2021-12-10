export default {
  state () {
    return {
      openIJPopin: false,
      openSyncPopin: undefined,
      openGestionIJPopin: false,
      openFullProcedureNumberPopin: false,
      openConfirmServiceUpdatePopin: false,
    }
  },

  mutations: {
    setStatePopin (state, { popin, open }) {
      state[popin] = open
    },
  },

  actions: {
    setStatePopin ({ commit, dispatch }, { popin, open }) {
      commit('setStatePopin', { popin, open })
    },
  },
}
