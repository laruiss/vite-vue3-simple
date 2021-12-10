<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, toRaw, watch } from 'vue'

import { useAffaire } from '../pinia/index.js'

const affaireStore = useAffaire()

const { affaire } = storeToRefs(affaireStore)

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const fetchAffaire = (id) => {
  affaireStore.fetchAffaire(props.id)
}

onMounted(() => fetchAffaire(props.id))

watch(() => props.id, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    fetchAffaire(props.id)
  }
})
</script>

<template>
  Affaire: {{ affaire?.id }}

  <pre style="padding: 1rem;">{{ JSON.stringify(affaire, null, '  ', 2) }}</pre>
  <p>
    {{ affaire.victimFirstname }}
    {{ affaire.victimLastname }}
    {{ affaire.victimDOB }}
  </p>

  <router-link
    :to="{ name: 'Affaire', params: { id: 2 } }"
    class="btn"
  >
    Affaire 2
  </router-link>
</template>
