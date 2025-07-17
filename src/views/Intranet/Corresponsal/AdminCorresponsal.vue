<template>
  <div>
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>

    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Asignar Encargados</h1>
        <div class="col-md-4">
          <input type="text" class="form-control" v-model="filtroSucursal" placeholder="Buscar sucursal...">
        </div>
      </div>

      <div class="row">
        <div v-for="sucursal in sucursalesFiltradas" :key="sucursal" class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm card-hover">
            <div class="card-body">
              <h5 class="card-title">{{ sucursal }}</h5>
              <p class="card-text text-muted">Seleccione un encargado para esta sucursal.</p>
              <BFormSelect
                :options="users_options"
                v-model="assignedResponsables[sucursal]"
                @change="selectSucursal(sucursal, $event)"
              />
              <div v-if="recentlySaved === sucursal" class="save-indicator">
                <i class="bi bi-check-circle-fill"></i> Guardado
              </div>
            </div>
          </div>
        </div>
        <div v-if="sucursalesFiltradas.length === 0" class="col-12 text-center text-muted mt-5">
          <h4>No se encontraron sucursales.</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';
import { BFormSelect } from 'bootstrap-vue-next';
import Swal from 'sweetalert2';

export default {
  components: {
    Loading,
    BFormSelect
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      sucursales: [],
      assignedResponsables: {},
      users_options: [],
      filtroSucursal: '',
      recentlySaved: null,
    };
  },
  computed: {
    sucursalesFiltradas() {
      if (!this.filtroSucursal) {
        return this.sucursales;
      }
      return this.sucursales.filter(s => 
        s.toLowerCase().includes(this.filtroSucursal.toLowerCase())
      );
    }
  },
  methods: {
    async selectSucursal(sucursal, encargadoId) {
      if (encargadoId === this.assignedResponsables[sucursal]) return;
      
      const path = backendRouter.data + 'assign-responsible';
      const data = {
        'sucursal': sucursal,
        'encargado': encargadoId
      };
      
      try {
        await axios.post(path, data);
        this.assignedResponsables[sucursal] = encargadoId;
        this.showSaveIndicator(sucursal);
      } catch (error) {
        Swal.fire('Error', 'No se pudo asignar el encargado.', 'error');
        this.getData(); 
      }
    },
    showSaveIndicator(sucursal) {
        this.recentlySaved = sucursal;
        setTimeout(() => {
            if (this.recentlySaved === sucursal) {
                this.recentlySaved = null;
            }
        }, 2000);
    },
    async getData() {
      this.isLoading = true;
      try {
        const path = backendRouter.data + 'encargados-corresponsal';
        const response = await axios.post(path, {});
        this.sucursales = response.data.sucursales;
        this.users_options = [{ value: null, text: 'Sin Asignar' }, ...response.data.users_options];
        this.assignedResponsables = response.data.responsables;
      } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar los datos iniciales.', 'error');
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.card-hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
  }
}
.save-indicator {
  color: #198754;
  font-weight: 500;
  margin-top: 10px;
  opacity: 0;
  animation: fadeInOut 2s ease-in-out;
}
@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  25%, 75% { opacity: 1; }
}
</style>