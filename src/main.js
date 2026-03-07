import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'; // Vuetify CSS
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// PrimeVue
import PrimeVue from "primevue/config"

// Theme (NEW in PrimeVue v4)
import Aura from "@primevue/themes/aura"

// Icons
import "primeicons/primeicons.css"

const vuetify = createVuetify({
  components,
  directives,
});


// const app = createApp(App) 
// const pinia = createPinia()

// app.use(pinia)
// app.mount('#app')

createApp(App)
  .use(createPinia()) // register Pinia
  .use(router) 
  .use(vuetify) 
  .use(PrimeVue, {
    theme: {
      preset: Aura
    }
  })
  .mount('#app')        // mount the app

