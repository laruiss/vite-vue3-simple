import { createStore } from 'vuex'

import application from './application.js'
import connection from './connection.js'
import snackbar from './snackbar.js'
import affaires from './affaires.js'
import currentAffaire from './current-affaire.js'
import sampleSets from './sample-sets.js'
import users from './users.js'
import currentUser from './current-user.js'

const store = createStore({
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

export default store

if (import.meta.hot) {
  import.meta.hot.accept([
    './application.js',
    './connection.js',
    './snackbar.js',
    './affaires.js',
    './current-affaire.js',
    './sample-sets.js',
    './current-user.js',
    './users.js',
  ], async () => {
    const application = (await import('./application.js')).default
    const connection = (await import('./connection.js')).default
    const snackbar = (await import('./snackbar.js')).default
    const affaires = (await import('./affaires.js')).default
    const currentAffaire = (await import('./current-affaire.js')).default
    const sampleSets = (await import('./sample-sets.js')).default
    const currentUser = (await import('./current-user.js')).default
    const users = (await import('./users.js')).default

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
