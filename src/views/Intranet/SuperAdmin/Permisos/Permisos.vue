<template>
  <div>
    <SidebarMenu :titulo="tituloMenu" />
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>

    <div v-if="!isLoading" class="container-fluid py-4">
      <BTableSimple responsive striped hover>
        <BThead>
          <BTr>
            <BTh sticky-column>Usuario</BTh>
            <BTh v-for="rol in roles" :key="rol.name">{{ rol.label }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="usuario in usuarios" :key="usuario.user_id">
            <BTh sticky-column class="bg-light">{{ usuario.username }}</BTh>
            <BTd v-for="rol in roles" :key="rol.name" class="text-center">
              <input 
                type="checkbox" 
                class="form-check-input"
                v-model="usuario.roles[rol.name]"
              >
            </BTd>
          </BTr>
        </BTbody>
      </BTableSimple>
      <div class="text-center mt-3">
        <BButton variant="danger" @click="save_changes">Guardar Cambios</BButton>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue'
import backendRouter from '@/components/BackendRouter/BackendRouter'
import Loading from 'vue-loading-overlay'
import axios from 'axios'
import router from '@/router'
// Asegúrate de importar los componentes de BootstrapVueNext si los usas
import { BTableSimple, BThead, BTbody, BTr, BTh, BTd, BButton } from 'bootstrap-vue-next'

export default {
  data() {
    return {
      tituloMenu: "Permisos Dinámicos",
      isLoading: true,
      fullPage: true,
      roles: [], // Para guardar la lista de roles disponibles
      usuarios: [], // Para guardar los usuarios y sus permisos
    }
  },
  methods: {
    get_permisos() {
      this.isLoading = true;
      // Apuntamos al nuevo endpoint GET
      const path = backendRouter.data + 'permissions-matrix';
      const token = this.$cookies.get('jwt');

      axios.get(path, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        // Guardamos los datos que nos envía el backend
        this.roles = response.data.roles;
        this.usuarios = response.data.users_permissions;
        this.isLoading = false;
      }).catch((error) => {
        this.$swal(error.response?.data?.detail || 'Error al cargar permisos.');
        this.isLoading = false;
        router.push('/login');
      });
    },
    save_changes() {
      this.isLoading = true;
      const path = backendRouter.data + 'permissions-edit';
      const token = this.$cookies.get('jwt');

      // Enviamos el array de usuarios con sus roles actualizados
      axios.post(path, 
        { data: this.usuarios }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      ).then(() => {
        this.isLoading = false;
        this.$swal('Permisos guardados con éxito');
      }).catch((error) => {
        this.isLoading = false;
        this.$swal(error.response?.data?.detail || 'Error al guardar cambios.');
      });
    }
  },
  components: {
    SidebarMenu,
    Loading,
    BTableSimple, BThead, BTbody, BTr, BTh, BTd, BButton
  },
  created() {
    this.get_permisos();
  },
}
</script>

<style scoped>
/* Estilos para la tabla (opcional) */
th, td {
  vertical-align: middle;
}
.form-check-input {
  width: 1.5em;
  height: 1.5em;
  cursor: pointer;
}
</style>