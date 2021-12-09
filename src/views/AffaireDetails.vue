<script setup>
import { onMounted, reactive, watch } from 'vue'

const apiUrl = '/api/v1'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const affaire = reactive({ id: props.id })

const fetchAffaire = async () => {
  const res = await fetch(apiUrl + '/affaires/' + props.id)
  const data = await res.json()
  Object.assign(affaire, data)
}

watch(() => props.id, (id, prevId) => {
  fetchAffaire()
})

onMounted(fetchAffaire)
</script>

<template>
  Affaire: {{ affaire?.id }}

  <router-link
    :to="{ name: 'Affaire', params: { id: 2 } }"
    class="btn"
  >
    Lien vers Affaire 2
  </router-link>
</template>
