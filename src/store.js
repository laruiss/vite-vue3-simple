import { createStore } from 'vuex'

import application from './application.js'
import connection from './connection.js'
import snackbar from './snackbar.js'
import affaires from './affaires.js'
import currentAffaire from './current-affaire.js'
import sampleSets from './sampleSets.js'
import users from './users.js'
import currentUser from './current-user.js'

export default createStore({
  modules: {
    application,
    connection,
    snackbar,
    affaires,
    currentAffaire,
    sampleSets,
    currentUser,
    users,
  },
})

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept([
    './application.js',
    './connection.js',
    './snackbar.js',
    './affaires.js',
    './current-affaire.js',
    './sampleSets.js',
    './current-user.js',
    './users.js',
  ], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const application = require('./application.js').default
    const connection = require('./connection.js').default
    const snackbar = require('./snackbar.js').default
    const affaires = require('./affaires.js').default
    const currentAffaire = require('./current-affaire.js').default
    const sampleSets = require('./sampleSets.js').default
    const currentUser = require('./current-user.js').default
    const users = require('./users.js').default

    // swap in the new modules
    store.hotUpdate({
      modules: {
        application,
        connection,
        snackbar,
        affaires,
        currentAffaire,
        sampleSets,
        currentUser,
        users,
      },
    })
  })
}

