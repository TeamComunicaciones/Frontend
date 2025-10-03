<template>
  <div class="container-fluid no-scroll">
    <div class="row h-100">
      <div class="col-md-6 col-12 d-flex flex-column h-100">
        <div class="login-card flex-grow-1 d-flex flex-column justify-content-between">
          <div class="centering-form">
            <div class="img-container">
              <img src="/icons/Logo.png" alt="logo-team-comunicaicones">
            </div>
            <div class="text-container">
              <h2>Bienvenid@ de nuevo</h2>
              <p>Ingresa tu usuario y contraseña para continuar.</p>
            </div>
            <form @submit.prevent="logineo">
              <div class="form-group">
                <input type="text" name="username" class="form-control input_user" placeholder="Usuario" v-model.trim="form.username">
              </div>
              <div class="form-group">
                <input type="password" name="password" class="form-control input_pass" placeholder="Contraseña" v-model.trim="form.password">
              </div>
              <button type="submit" name="button" class="btn login_btn">Ingresar</button>
            </form>
          </div>
          <div class="cors mt-auto">
            <ul>
              <li>@2024 Team Comunicaciones S.A.S. Todos los derechos reservados</li>
              <li><a href="/politicas-privacidad">Política de privacidad</a>&nbsp;&nbsp;-&nbsp;&nbsp;<a href="/tratamiento-datos">Tratamiento de datos</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-12 d-flex flex-column h-100">
          <div class="img-destacada">
            <img :src="form.imgUrl" alt="Imagen destacada del login" />
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../../../router'; // Asegúrate de que la ruta al router sea la correcta
import Swal from 'sweetalert2';
import backendRouter from '@/components/BackendRouter/BackendRouter';
// La línea de authState ya no parece necesaria si el interceptor maneja el estado
// import { authState } from '@/auth'; 

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        imgUrl: "/img-example.jpg",
      },
    }
  },
  async mounted() {
    try {
      const res = await fetch(backendRouter.data + 'api/imagen-login/');
      const data = await res.json();
      if (data.url) {
        this.form.imgUrl = data.url;
      }
    } catch (err) {
      console.error("Error al cargar imagen destacada:", err);
    }
  },
  methods: {
    async logineo() {
      const path = backendRouter.data + 'login';
      const access = {
        email: this.form.username,
        password: this.form.password,
      };

      try {
        const response = await axios.post(path, access);
        const token = response.data.jwt;

        if (token) {
          // 1. Guardamos el token en las cookies
          this.$cookies.set('jwt', token);
          
          // 2. CAMBIO: Navegamos con el router de Vue para evitar recargar la página
          router.push('/home');
        } else {
          throw new Error('No se recibió un token del servidor.');
        }

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.',
          customClass: {
            confirmButton: 'btn login_btn',
          },
          buttonsStyling: false,
        });
      }
    },
  },
}
</script>