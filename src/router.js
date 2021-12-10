import { createRouter, createWebHistory } from 'vue-router'
import AppHome from '@views/AppHome.vue'
import AppLogin from '@views/AppLogin.vue'
import AppAffaire from '@views/AppAffaire.vue'
import NotFound from '@views/NotFound.vue'

const suffix = ' - PSIJ'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: AppHome,
    meta: {
      title: 'Bienvenue sur PSIJ' + suffix,
    },
  },
  {
    path: '/connexion',
    name: 'Login',
    component: AppLogin,
    meta: {
      title: 'Veuillez vous connecter' + suffix,
    },
  },
  {
    path: '/affaire/:id([0-9]+)',
    name: 'Affaire',
    component: AppAffaire,
    meta: {
      title: 'Affaire ' + suffix,
    },
    props: (route) => ({ id: +route.params.id }),
  },
  // {
  //   path: '/affaire/:name([-a-zA-Z][-a-zA-Z0-9]+)',
  //   name: 'AffaireName',
  //   component: AppAffaire,
  //   meta: {
  //     title: 'Affaire ' + suffix,
  //   },
  //   props: (route) => ({ name: route.params.name }),
  // },
  {
    path: '/:noMatch(.*)',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Désolé, nous n’avons pas cette ressource... ' + suffix,
    },
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})

router.beforeEach((to, from) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
  return true
})

export default router
