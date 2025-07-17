// import './assets/main.css'

import { createApp } from 'vue'
import {createBootstrap} from 'bootstrap-vue-next'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import VueCookies from 'vue-cookies'

import App from './App.vue'
import router from './router'

import './assets/scss/global.scss'


import VueImageZoomer from 'vue-image-zoomer';
import 'vue-image-zoomer/dist/style.css';

const options = {
    confirmButtonColor: '#E11419',
    cancelButtonColor: '#ff7674',
  };

const app = createApp(App)

app.use(router)
app.use(createBootstrap({components: true, directives: true})) 
app.use(VueSweetalert2, options);
app.use(VueCookies);
app.use(VueImageZoomer);

app.mount('#app')
