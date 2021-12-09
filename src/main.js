import './main.css'
import 'virtual:windi.css'
import 'virtual:windi-devtools'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  FaExclamationTriangle,
  FaSyncAlt,
  FaSave,
  FaTimesCircle,
  FaRegularEye,
  FaRegularEyeSlash,
} from 'oh-vue-icons/icons'

import { createApp } from 'vue'

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
  .component('VIcon', OhVueIcon)
  .mount('#app')
