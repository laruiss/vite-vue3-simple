import './main.css'
import 'virtual:windi.css'
import 'virtual:windi-devtools'

import { OhVueIcon, addIcons } from 'oh-vue-icons/dist/index.esm.min.js'
import {
  FaExclamationTriangle,
  FaSyncAlt,
  FaSave,
  FaTimesCircle,
  FaRegularEye,
  FaRegularEyeSlash,
} from 'oh-vue-icons/icons/fa/index.js'

import { createApp } from 'vue'

import { createPinia } from 'pinia'
import router from './router.js'
import store from './store/index.js'

import App from './App.vue'

addIcons(
  FaExclamationTriangle,
  FaSyncAlt,
  FaSave,
  FaTimesCircle,
  FaRegularEye,
  FaRegularEyeSlash,
)

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(store)
  .use(router)
  .component('VIcon', OhVueIcon)
  .mount('#app')
