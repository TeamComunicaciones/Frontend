<template>
  <div class="layout-wrapper">
    <div class="sidebar-backdrop" v-if="isSidebarVisible" @click="toggleSidebar"></div>
    <aside class="sidebar" :class="{ 'is-visible': isSidebarVisible }">
      <div class="sidebar-inner d-flex flex-column p-3">
        <div class="sidebar-header mb-4 text-center">
          <img class="img-fluid" :src="getImageUrl('logo.png')" alt="logo" style="height: 40px;"/>
        </div>

        <div v-if="!permisosCargados" class="text-center my-auto">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <ul v-if="permisosCargados" class="nav-menu list-unstyled">
          <li v-if="permisos.superadmin" class="nav-item">
            <a @click.prevent="toggleMenu('superadmin')" href="#" class="nav-link" :class="{active: menu.superadmin}">
              <i class="bi bi-shield-lock-fill me-2"></i><span>Superadmin</span>
              <i class="bi bi-chevron-right ms-auto chevron" :class="{ rotated: menu.superadmin }"></i>
            </a>
            <ul v-if="menu.superadmin" class="submenu list-unstyled">
              <li><a href="/permisos"><i class="bi bi-key-fill me-2"></i>Permisos</a></li>
            </ul>
          </li>
          
          <li v-if="permisos.administrador.main" class="nav-item">
            <a @click.prevent="toggleMenu('administrador')" href="#" class="nav-link" :class="{active: menu.administrador}">
              <i class="bi bi-person-fill me-2"></i><span>Administrador</span>
              <i class="bi bi-chevron-right ms-auto chevron" :class="{ rotated: menu.administrador }"></i>
            </a>
            <ul v-if="menu.administrador" class="submenu list-unstyled">
              <li><a href="/usuarios"><i class="bi bi-people-fill me-2"></i>Usuarios</a></li>
            </ul>
          </li>

          <li v-if="permisos.informes.main" class="nav-item">
            <a @click.prevent="toggleMenu('informes')" href="#" class="nav-link" :class="{active: menu.informes}">
              <i class="bi bi-file-earmark-bar-graph-fill me-2"></i><span>Informes</span>
              <i class="bi bi-chevron-right ms-auto chevron" :class="{ rotated: menu.informes }"></i>
            </a>
            <ul v-if="menu.informes" class="submenu list-unstyled">
              <li><a href="/informes"><i class="bi bi-file-earmark-text-fill me-2"></i>Informes</a></li>
            </ul>
          </li>

          <li v-if="permisos.control_interno.main" class="nav-item">
            <a @click.prevent="toggleMenu('control_interno')" href="#" class="nav-link" :class="{active: menu.control_interno}">
              <i class="bi bi-gear-fill me-2"></i><span>Control Interno</span>
              <i class="bi bi-chevron-right ms-auto chevron" :class="{ rotated: menu.control_interno }"></i>
            </a>
            <ul v-if="menu.control_interno" class="submenu list-unstyled">
              <li><a href="/actualizar-equipos-prepagos"><i class="bi bi-currency-exchange me-2"></i>Precios prepagos</a></li>
              <li><a href="/administrar-traducciones"><i class="bi bi-translate me-2"></i>Traducciones</a></li>
              <li><a href="/formulas-prepago"><i class="bi bi-list-ol me-2"></i>Lista Precios</a></li>
              <li><a href="/lista-negra"><i class="bi bi-x-circle-fill me-2"></i>Lista Negra</a></li>
            </ul>
          </li>

          <li v-if="permisos.comisiones.main" class="nav-item">
            <a @click.prevent="toggleMenu('comisiones')" href="#" class="nav-link" :class="{active: menu.comisiones}">
              <i class="bi bi-cash-stack me-2"></i><span>Comisiones</span>
              <i class="bi bi-chevron-right ms-auto chevron" :class="{ rotated: menu.comisiones }"></i>
            </a>
            <ul v-if="menu.comisiones" class="submenu list-unstyled">
              <li><a href="/comisiones"><i class="bi bi-clipboard-check-fill me-2"></i>Administrar</a></li>
              <li><a href="/liquidador-comisiones"><i class="bi bi-calculator-fill me-2"></i>Liquidar</a></li>
            </ul>
          </li>

          <li v-if="permisos.comercial.main" class="nav-item">
            <a @click.prevent="toggleMenu('comercial')" href="#" class="nav-link" :class="{active: menu.comercial}">
              <i class="bi bi-shop-window me-2"></i><span>Comercial</span>
              <i class="bi bi-chevron-right ms-auto chevron" :class="{ rotated: menu.comercial }"></i>
            </a>
            <ul v-if="menu.comercial" class="submenu list-unstyled">
              <li><a href="/lista-precios-prepago"><i class="bi bi-tag-fill me-2"></i>Precios prepagos</a></li>
            </ul>
          </li>

          <li v-if="permisos.corresponsal.main" class="nav-item">
            <a @click.prevent="toggleMenu('corresponsal')" href="#" class="nav-link" :class="{active: menu.corresponsal}">
              <i class="bi bi-person-badge-fill me-2"></i><span>Corresponsal</span>
              <i class="bi bi-chevron-right ms-auto chevron" :class="{ rotated: menu.corresponsal }"></i>
            </a>
            <ul v-if="menu.corresponsal" class="submenu list-unstyled">
              <li><a href="/cargar-datos-corresponsal"><i class="bi bi-upload me-2"></i>Cargar datos</a></li>
              <li><a href="/Tesoreria"><i class="bi bi-safe-fill me-2"></i>Tesorería</a></li>
              <li><a href="/informe-admin-corresponsal"><i class="bi bi-file-earmark-bar-graph-fill me-2"></i>Informes</a></li>
              <li><a href="/admin-corresponsal"><i class="bi bi-person-lines-fill me-2"></i>Administrar</a></li>
              <li><a href="/subir-imagen"><i class="bi bi-clipboard-data-fill me-2"></i>Configuración</a></li>
            </ul>
          </li>
          
          <li v-if="permisos.caja.main" class="nav-item">
            <a @click.prevent="toggleMenu('caja')" href="#" class="nav-link" :class="{active: menu.caja}">
              <i class="bi bi-cash-coin me-2"></i><span>Cajero</span>
              <i class="bi bi-chevron-right ms-auto chevron" :class="{ rotated: menu.caja }"></i>
            </a>
            <ul v-if="menu.caja" class="submenu list-unstyled">
              <li><a href="/cuadre-caja"><i class="bi bi-clipboard-data-fill me-2"></i>Cuadre</a></li>
            </ul>
          </li>
        </ul>

        <div class="sidebar-footer mt-auto">
          <div class="user-info">
            <i class="bi bi-person-circle me-2"></i>
            <span>{{ usuario }}</span>
          </div>
          <button class="btn btn-outline-danger w-100 mt-2" @click="confirmLogout">
            <i class="bi bi-box-arrow-left me-2"></i>Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>

    <div class="main-container">
      <header class="top-header">
        <button class="menu-toggle-btn" @click="toggleSidebar" aria-label="Toggle Menu">
          <i class="bi bi-list"></i>
        </button>
      </header>

      <main class="main-content p-4">
        <slot></slot>
      </main>
    </div>
    
    <div v-if="cambioClave" class="password-modal-backdrop">
      <div class="password-modal-content">
        <h4 class="mb-4 text-center">Debes cambiar tu contraseña</h4>
        <div class="input-group"><label for="password">Nueva contraseña:</label><input type="password" id="password" v-model.trim="form.password"></div>
        <div class="input-group"><label for="newPassword">Confirmar contraseña:</label><input type="password" id="newPassword" v-model.trim="form.retrypassword"></div>
        <button class="btn btn-danger w-100 mt-3" @click="cambio">Actualizar Contraseña</button>
      </div>
    </div>
  </div>
</template>

<script>
import backendRoute from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';
import router from '@/router';
import Swal from 'sweetalert2';
import { authState } from '@/auth';

export default {
  name: 'SidebarMenu',
  data() {
    return {
      isSidebarVisible: false,
      permisosCargados: false,
      usuario: '',
      permisos: {
        superadmin: false, administrador: { main: false },
        informes: { main: false }, control_interno: { main: false },
        comisiones: { main: false }, comercial: { main: false },
        corresponsal: { main: false }, caja: { main: false },
      },
      menu: {
        superadmin: false, administrador: false, informes: false,
        control_interno: false, comisiones: false, comercial: false,
        corresponsal: false, caja: false,
      },
      cambioClave: false,
      form: { password: '', retrypassword: '' },
    };
  },
  methods: {
    toggleMenu(item) {
      this.menu[item] = !this.menu[item];
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    validate() {
      const path = backendRoute.data + 'user-permissions';
      const token = this.$cookies.get('jwt');
      if (!token) {
        router.push('/login');
        return;
      }
      axios.get(path, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        if (response.data.cambioClave) {
          this.cambioClave = response.data.cambioClave;
        } else {
          this.permisos = response.data.permisos;
          this.usuario = response.data.usuario;
        }
        this.permisosCargados = true;
      })
      .catch(() => {
        this.permisosCargados = true; 
        this.logout();
      });
    },
    confirmLogout() {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Tendrás que volver a iniciar sesión.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) { this.logout(); }
      });
    },
    logout() {
      authState.logout();
      this.$router.push('/login');
    },
    getImageUrl(name) {
      return new URL(`../../../assets/${name}`, import.meta.url).href;
    },
    cambio() {
      this.form['jwt'] = this.$cookies.get('jwt');
      const path = backendRoute.data + 'cambio-clave';
      axios.post(path, this.form)
        .then(() => {
          this.$swal('Clave cambiada con éxito, por favor inicia sesión de nuevo.');
          this.logout();
        })
        .catch((error) => {
          this.$swal(error.response.data.detail);
        });
    },
  },
  created() {
    this.validate();
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffffff;
  border-right: 1px solid #dee2e6;
  z-index: 1045;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}
.sidebar.is-visible {
  transform: translateX(0);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
.main-container {
  width: 100%;
}
.top-header {
  background-color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 1020;
}
.nav-menu {
  overflow-y: auto;
  flex-grow: 1;
}
.nav-link {
  color: #495057;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  border-radius: 0.375rem;
  transition: all 0.2s;
  font-weight: 500;
  cursor: pointer;
}
.nav-link .chevron {
  transition: transform 0.2s ease-in-out;
}
.nav-link.active .chevron {
  transform: rotate(90deg);
}
.nav-link:hover, .nav-link.active {
  background-color: rgba(223, 17, 21, 0.07);
  color: #DF1115;
}
.submenu a {
  padding: 10px 15px 10px 45px;
  color: #6c757d;
  text-decoration: none;
  display: block;
  font-size: 0.9rem;
}
.submenu a:hover {
  color: #DF1115;
}
.sidebar-footer {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

// Estilos mejorados para el botón del menú
@keyframes pulse-once {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(223, 17, 21, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 10px 15px rgba(223, 17, 21, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(223, 17, 21, 0);
  }
}

.menu-toggle-btn {
  background-color: transparent;
  border: none;
  color: #495057;
  padding: 0.5rem;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  animation: pulse-once 1.5s ease-out 1s 1;

  i {
    font-size: 1.75rem;
    line-height: 1;
  }

  &:hover {
    background-color: #f0f0f0;
    color: #DF1115;
  }
}
</style>