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

import router from './router.js'

import App from './App.vue'

addIcons(
  FaExclamationTriangle,
  FaSyncAlt,
  FaSave,
  FaTimesCircle,
  FaRegularEye,
  FaRegularEyeSlash,
)

createApp(App)
  .use(router)
  .component('VIcon', OhVueIcon)
  .mount('#app')
