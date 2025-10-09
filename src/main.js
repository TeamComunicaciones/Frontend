// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' // <-- 1. Importar Pinia
import { createBootstrap } from 'bootstrap-vue-next'

// Imports de estilos
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'vue-image-zoomer/dist/style.css'
import './assets/scss/global.scss'

// Imports de la librería de notificaciones
import Toast from 'vue-toastification' // <-- 2. Importar vue-toastification
import 'vue-toastification/dist/index.css' // <-- 3. Importar sus estilos

// Imports de otras librerías y configuraciones
import VueSweetalert2 from 'vue-sweetalert2'
import VueCookies from 'vue-cookies'
import VueImageZoomer from 'vue-image-zoomer'
import App from './App.vue'
import router from './router'


// Opciones para SweetAlert2 (tu configuración original)
const sweetAlertOptions = {
  confirmButtonColor: '#E11419',
  cancelButtonColor: '#ff7674',
};

// Opciones para las notificaciones Toast (nuevo)
const toastOptions = {
    position: "top-right",
    timeout: 8000,
    closeOnClick: true,
};

const app = createApp(App)
const pinia = createPinia() // <-- 4. Crear la instancia de Pinia

// Uso de plugins y router
app.use(pinia) // <-- 5. Registrar Pinia en tu aplicación
app.use(router)
app.use(createBootstrap({components: true, directives: true})) 
app.use(VueSweetalert2, sweetAlertOptions)
app.use(Toast, toastOptions) // <-- 6. Registrar vue-toastification
app.use(VueCookies)
app.use(VueImageZoomer)

app.mount('#app')