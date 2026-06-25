import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { setUnauthorizedHandler } from './lib/http'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Pinia is active now, so we can use stores.
const auth = useAuthStore()

// If a saved token turns out to be invalid (401), log out and go to login.
setUnauthorizedHandler(() => {
  auth.clearSession()
  router.push({ name: 'login' })
})

// Hydrate the current user from a saved token before showing the app.
auth.loadUser().finally(() => {
  app.mount('#app')
})
