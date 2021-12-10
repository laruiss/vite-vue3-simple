<script setup>
import { onMounted, watch } from 'vue'

import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

function fetchAffaire (id) {
  return store.dispatch('getStoredAffaire', id)
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

  <router-link
    :to="{ name: 'Affaire', params: { id: 2 } }"
    class="btn"
  >
    Affaire 2
  </router-link>
</template>
