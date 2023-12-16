import './index.css'

import { initializeApp } from 'firebase/app'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { firebaseConfig } from './firebase'

import i18n from './i18n'
import App from './App.vue'
import router from './router'

initializeApp(firebaseConfig)
const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
