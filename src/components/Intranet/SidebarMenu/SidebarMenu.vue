<template>
  <div>
    <div class="header d-flex align-items-center justify-content-between p-3 borde-rojo">
      <button class="btn btn-danger" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu" aria-controls="offcanvasMenu">
        <i class="bi bi-list"></i>
      </button>
      <img class="img-fluid" :src="getImageUrl('logo.png')" alt="logo" style="height: 50px;"/>
    </div>
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenuLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasMenuLabel">MENU</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="menu list-unstyled">
          <li v-if="permisos.superadmin" @click="menu.superadmin = !menu.superadmin" class="menu-item">
            <i class="bi bi-shield-lock-fill me-2"></i>SUPERADMIN
            <ul v-if="menu.superadmin" class="submenu list-unstyled ms-3">
              <li v-if="permisos.superadmin"><a href="/permisos"><i class="bi bi-key-fill me-2"></i>Permisos</a></li>
            </ul>
          </li>
          <li v-if="permisos.administrador.main" @click="menu.administrador = !menu.administrador" class="menu-item">
            <i class="bi bi-person-fill me-2"></i>ADMINISTRADOR
            <ul v-if="menu.administrador" class="submenu list-unstyled ms-3">
              <li><a href="/usuarios"><i class="bi bi-people-fill me-2"></i>Usuarios</a></li>
            </ul>
          </li>
          <li v-if="permisos.informes.main" @click="menu.informes = !menu.informes" class="menu-item">
            <i class="bi bi-file-earmark-bar-graph-fill me-2"></i>INFORMES
            <ul v-if="menu.informes" class="submenu list-unstyled ms-3">
              <li><a href="/informes"><i class="bi bi-file-earmark-text-fill me-2"></i>Informes</a></li>
            </ul>
          </li>
          <li v-if="permisos.control_interno.main" @click="menu.controlInterno = !menu.controlInterno" class="menu-item">
            <i class="bi bi-gear-fill me-2"></i>CONTROL INTERNO
            <ul v-if="menu.controlInterno" class="submenu list-unstyled ms-3">
              <li><a href="actualizar-equipos-prepagos"><i class="bi bi-currency-exchange me-2"></i>Precios prepagos</a></li>
              <li><a href="administrar-traducciones"><i class="bi bi-translate me-2"></i>Traducciones</a></li>
              <li><a href="formulas-prepago"><i class="bi bi-list-ol me-2"></i>Lista Precios</a></li>
              <li><a href="lista-negra"><i class="bi bi-x-circle-fill me-2"></i>Lista Negra</a></li>
            </ul>
          </li>
          <li v-if="permisos.comisiones.main" @click="menu.comisiones = !menu.comisiones" class="menu-item">
            <i class="bi bi-cash-stack me-2"></i>COMISIONES
            <ul v-if="menu.comisiones" class="submenu list-unstyled ms-3">
              <li><a href="comisiones"><i class="bi bi-clipboard-check-fill me-2"></i>Administrar</a></li>
              <li><a href="liquidador-comisiones"><i class="bi bi-calculator-fill me-2"></i>Liquidar</a></li>
            </ul>
          </li>
          <li v-if="permisos.comercial.main" @click="menu.comercial = !menu.comercial" class="menu-item">
            <i class="bi bi-shop-window me-2"></i>COMERCIAL
            <ul v-if="menu.comercial" class="submenu list-unstyled ms-3">
              <li><a href="lista-precios-prepago"><i class="bi bi-tag-fill me-2"></i>Precios prepagos</a></li>
            </ul>
          </li>
          <li v-if="permisos.corresponsal.main" @click="menu.corresponsal = !menu.corresponsal" class="menu-item">
            <i class="bi bi-person-badge-fill me-2"></i>CORRESPONSAL
            <ul v-if="menu.corresponsal" class="submenu list-unstyled ms-3">
              <li><a href="cargar-datos-corresponsal"><i class="bi bi-upload me-2"></i>Cargar datos</a></li>
              <li><a href="Tesoreria"><i class="bi bi-tag-fill me-2"></i>Tesorería</a></li>
              <li><a href="informe-admin-corresponsal"><i class="bi bi-file-earmark-bar-graph-fill me-2"></i>Informes</a></li>
              <li><a href="admin-corresponsal"><i class="bi bi-person-lines-fill me-2"></i>Administrar</a></li>
              <li><a href="subir-imagen"><i class="bi bi-clipboard-data-fill me-2"></i>Configuracíon</a></li>
            </ul>
          </li>
          <li v-if="permisos.caja.main" @click="menu.caja = !menu.caja" class="menu-item">
            <i class="bi bi-cash-coin me-2"></i>CAJERO
            <ul v-if="menu.caja" class="submenu list-unstyled ms-3">
              <li><a href="cuadre-caja"><i class="bi bi-clipboard-data-fill me-2"></i>Cuadre</a></li>
            </ul>
          </li>
        </ul>
        <button class="btn btn-danger mt-3" @click="confirmLogout">Cerrar Sesión</button>
      </div>
    </div>

    <div v-if="cambioClave" class="ventana">
      <div class="titulo">Cambia tu contraseña</div>
      <div class="input-group">
        <label for="password">Nueva contraseña:</label>
        <input type="password" id="password" name="password" placeholder="Ingresa tu nueva contraseña" v-model.trim="form.password">
      </div>
      <div class="input-group">
        <label for="newPassword">Confirmar contraseña:</label>
        <input type="password" id="newPassword" name="newPassword" placeholder="Ingresa tu nueva contraseña" v-model.trim="form.retrypassword">
      </div>
      <button class="btn btn-danger mb-2" @click="cambio">Actualizar Contraseña</button>
    </div>
  </div>
</template>


<script>
import backendRoute from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';
import router from '@/router';
import { ref } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'SidebarMenu',
  props: {
    titulo: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      show: false,
      usuario: 'sebas',
      permisos: {
        superadmin: false,
        administrador: { main: false },
        informes: { main: false },
        control_interno: { main: false },
        comisiones: { main: false },
        comercial: { main: false },
        corresponsal: { main: false },
        caja: { main: false },
      },
      menu: {
        superadmin: false,
        administrador: false,
        informes: false,
        control_interno: false,
        gestionHumana: false,
        contabilidad: false,
        comisiones: false,
        soporte: false,
        auditoria: false,
        comercial: false,
        corresponsal: false,
        caja: false,
      },
      cambioClave: false,
      form: {
        password: '',
        retrypassword: '',
      },
    };
  },
  methods: {
    click() {
      this.show = !this.show;
    },
    cambio() {
      this.form['jwt'] = this.$cookies.get('jwt');
      const path = backendRoute.data + 'cambio-clave';
      axios.post(path, this.form)
        .then((response) => {
          router.push('/login');
          this.$swal('Clave cambiada con éxito');
        })
        .catch((error) => {
          this.$swal(error.response.data.detail);
        });
    },
    validate() {
      const path = backendRoute.data + 'user-permissions';
      axios.post(path, { 'jwt': this.$cookies.get('jwt') }).then((response) => {
        if (response.data.cambioClave) {
          this.cambioClave = response.data.cambioClave;
        } else {
          this.permisos = response.data.permisos;
        }
      })
        .catch((error) => {
          router.push('/login');
          this.$swal(error.response.data.detail);
        });
    },
    confirmLogout() {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#000',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.logout();
        }
      });
    },
    logout() {
      this.$cookies.remove('jwt');
      this.$router.push('/login');
    }
  },
  created() {
    this.validate();
  },
  setup() {
    const getImageUrl = (name) => {
      return new URL(`../../../assets/${name}`, import.meta.url).href;
    };
    return { getImageUrl };
  }
};
</script>

<style scoped>
.header {
  background-color: #ffffff;
  border-bottom: 2px solid #DF1115;
  padding: 10px;
}

.offcanvas-menu {
  width: 250px;
}

.menu-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #DF1115;
  transition: background-color 0.3s, color 0.3s;
  color: #333333;
  flex-direction: column; /* Asegura que los submenús se desplieguen hacia abajo */
}

.menu-item:hover {
  background-color: #f8f9fa;
  color: #DF1115;
}

.submenu {
  width: 100%; /* Asegura que los submenús ocupen todo el ancho del contenedor */
}

.submenu a {
  font-size: 14px;
  color: #555555;
  text-decoration: none;
  display: block;
  padding: 5px 0;
  transition: color 0.3s;
}

.submenu a:hover {
  color: #DF1115;
  text-decoration: underline;
}

.ventana {
  color: black;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 50%;
  max-width: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.titulo {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn-danger {
  background-color: #DF1115;
  border-color: #DF1115;
}

.borde-rojo {
  border-bottom: 2px solid #DF1115;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.borde-rojo-menu {
  border-bottom: 1px solid #DF1115;
}

.offcanvas-header {
  background-color: #DF1115;
  color: #ffffff;
}

.offcanvas-title {
  color: #ffffff;
}

.btn-close {
  background-color: #ffffff;
  border: none;
}

.btn-close:hover {
  background-color: #f8f9fa;
}
</style>