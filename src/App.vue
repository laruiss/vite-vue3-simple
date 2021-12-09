<script>
import { defineComponent } from 'vue'

export default defineComponent({
  mounted () {
    console.log(import.meta.env.VITE_EXPERIMENTATION)
    console.log(import.meta.env.KEY)
  },
})
</script>
<template>
  <nav>
    <router-link
      :to="{name: 'Home'}"
      class="btn"
    >
      AppHome
    </router-link>
    <router-link
      :to="{name: 'Login'}"
      class="btn"
    >
      AppLogin
    </router-link>
  </nav>
  <router-view />
</template>
