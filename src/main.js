import { createApp } from 'vue'
import App from '@/App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'

// Initialize the app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount the app
app.mount('#app')

// Log environment info
console.log('Environment:', import.meta.env.MODE)
console.log('Base URL:', import.meta.env.BASE_URL)