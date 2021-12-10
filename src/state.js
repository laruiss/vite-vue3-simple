import { reactive, computed } from 'vue'

import { apiUrl } from './config.js'

const state = reactive({
  affaires: [],
  affaire: undefined,
})

export const affaire = computed(() => state.affaire)

export async function fetchAffaire (id) {
  const affaireData = await fetch(apiUrl + '/affaires/' + id).then(res => res.json())
  state.affaire = affaireData
}
