import { createRouter, createWebHistory } from 'vue-router'
import AppHome from '@views/AppHome.vue'
import AppLogin from '@views/AppLogin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: AppHome,
  },
  {
    path: '/connexion',
    name: 'Login',
    component: AppLogin,
  },
]

export default createRouter({
  routes,
  history: createWebHistory('/'),
})
