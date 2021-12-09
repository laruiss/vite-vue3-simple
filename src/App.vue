<script>
import PsijInput from './components/PsijInput.vue'

export default {
  components: {
    PsijInput,
  },

  data () {
    return {
      email: '',
      type: undefined,
    }
  },

  methods: {
    reset ($event) {
      // this.email = ''
    },
    login ($event) {
      console.log('login', $event)
    },
    log ($event) {
      console.log($event)
    },
  },
}
</script>

<template>
  <form
    class="form"
    @submit.prevent="login($event)"
    @reset="reset($event)"
  >
    <PsijInput
      v-model="email"
      :type="type"
      :required="true"
      placeholder="james.bond@mi6.gov.uk"
      @click="log($event)"
    />
    <br>
    {{ email }}
    <br>
    type :
    <PsijInput
      v-model="type"
      type="password"
    />
    <br>
    <PsijInput
      class="btn"
      type="submit"
      value="OK"
    />
    <PsijInput
      class="btn"
      type="reset"
      value="Annuler"
    />
  </form>
</template>

<style scoped>
.form {
  @apply bg-gray-700;
}
</style>
