// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/tailwind.css'

if (process.env.NODE_ENV === 'development') {
  console.log('OpenAI API Key:', process.env.VUE_APP_OPENAI_API_KEY)
}

createApp(App).use(store).use(router).mount('#app')