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
