<template>
  <div class="main-wrapper">
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>

    <div class="container py-4">
      <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
        <BFormRadioGroup
          v-model="buttonsSelected"
          :options="buttonsOptions"
          button-variant="outline-danger"
          name="radios-btn-default"
          buttons
        />
        <BFormInput v-if="buttonsSelected === 'mes'" type="month" v-model="fecha" @change="fetchData" class="form-control w-auto" />
        <BFormInput v-if="buttonsSelected === 'dia'" type="date" v-model="fecha" @change="fetchData" class="form-control w-auto" />

        <BFormSelect
          v-if="fecha"
          v-model="sucursal"
          :options="[{ value: null, text: 'Seleccione una sucursal' }, { value: '0', text: 'Todas' }, ...sucursales]"
          @change="filterData"
          class="form-select w-auto"
        />
      </div>

      <div v-if="sucursal !== null">
        <h3 class="mb-3">Gestionar Consignaciones Pendientes</h3>
        <div class="row">
          <div class="col-lg-9 mb-3">
            <div class="mb-3">
              <select class="form-select" v-model="bancoSeleccionado">
                <option value="">-- Filtrar por categoría --</option>
                <option v-for="banco in bancosDisponibles" :key="banco" :value="banco">{{ banco }}</option>
              </select>
            </div>
            <DetalleConsignacionesTabla
              :key="tableKey"
              :consignaciones="filtradasPorBanco"
              :selectable="true"
              :show-image-button="true"
              @view="mostrarInformacion"
              @selection-change="updateSeleccionados"
            />
          </div>
          <div class="col-lg-3" v-if="seleccionados.length">
            <div class="p-3 border rounded bg-light shadow-sm">
              <h5 class="text-end fw-bold">Total: {{ formatCurrency(totalSeleccionados) }}</h5>
              <BButton variant="danger" class="w-100" @click="showSaldarModal = true">SALDAR</BButton>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-muted mt-5">
        <h4>Seleccione una fecha y sucursal para ver los pendientes.</h4>
      </div>
    </div>

    <div v-if="showSaldarModal" class="modal show d-block bg-dark bg-opacity-75">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Saldar Consignaciones</h5>
            <button type="button" class="btn-close" @click="showSaldarModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="settleInvoices">
              <div class="mb-3">
                <label class="form-label">Valor Total a Saldar:</label>
                <input class="form-control" :value="formatCurrency(totalSeleccionados)" readonly />
              </div>
              <div class="mb-3">
                <label class="form-label">Fecha de Consignación:</label>
                <input type="date" class="form-control" v-model="saldar.fechaConsignacion" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Detalle:</label>
                <textarea class="form-control" v-model="saldar.detalle" required></textarea>
              </div>
              <div class="text-center">
                <BButton type="submit" variant="danger">Guardar</BButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showImagenModal" class="modal show d-block bg-dark bg-opacity-75">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content p-3">
          <div class="modal-header border-0">
            <button type="button" class="btn-close" @click="showImagenModal = false"></button>
          </div>
          <div class="modal-body text-center">
            <vue-image-zoomer :regular="`data:${imageContent};base64,${imageBlob}`" :zoom="`data:${imageContent};base64,${imageBlob}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';
import { VueImageZoomer } from 'vue-image-zoomer';
import 'vue-image-zoomer/dist/style.css';
import DetalleConsignacionesTabla from './DetalleConsignacionesTabla.vue';

export default {
  name: 'Tesoreria',
  components: {
    VueImageZoomer,
    Loading,
    DetalleConsignacionesTabla
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      fecha: '',
      buttonsSelected: 'mes',
      buttonsOptions: [
        { text: 'Mes', value: 'mes' },
        { text: 'Día', value: 'dia' },
      ],
      sucursales: [],
      sucursal: null,
      resumen: {},
      bancoSeleccionado: '',
      seleccionados: [],
      showImagenModal: false,
      imageBlob: null,
      imageContent: null,
      showSaldarModal: false,
      saldar: {
        fechaConsignacion: '',
        detalle: '',
      },
      tableKey: 0,
    };
  },
  computed: {
    consignacionesPendientes() {
      return this.resumen?.consignaciones?.filter(d => d.estado === 'pendiente') || [];
    },
    bancosDisponibles() {
      const bancos = this.consignacionesPendientes.map(d => d.banco);
      return [...new Set(bancos)].sort();
    },
    filtradasPorBanco() {
      if (!this.bancoSeleccionado) return this.consignacionesPendientes;
      return this.consignacionesPendientes.filter(d => d.banco === this.bancoSeleccionado);
    },
    totalSeleccionados() {
      return this.seleccionados.reduce((sum, item) => sum + item.valor, 0);
    },
  },
  methods: {
    formatCurrency(value) {
      if (typeof value !== 'number') return '$ 0';
      return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    },
    async fetchData() {
      if (!this.fecha) return;
      this.isLoading = true;
      this.resumen = {};
      try {
        const path = backendRouter.data + 'select-datos-corresponsal';
        const response = await axios.post(path, { fecha: this.fecha });
        this.sucursales = response.data.sucursales.sort((a, b) => a.text.localeCompare(b.text));
        if (this.sucursal) {
          this.filterData();
        }
      } catch (error) {
        console.error("Error en fetchData:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async filterData() {
      if (this.sucursal === null) {
        this.resumen = {};
        return;
      }
      this.isLoading = true;
      this.seleccionados = [];
      this.bancoSeleccionado = '';
      try {
        const path = backendRouter.data + 'resumen-corresponsal';
        const response = await axios.post(path, { fecha: this.fecha, sucursal: this.sucursal });
        this.resumen = response.data;
      } catch (error) {
        this.resumen = {};
        console.error("Error en filterData:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async settleInvoices() {
      if (!this.saldar.fechaConsignacion || !this.saldar.detalle) {
        this.$swal('Error', 'Debe completar la fecha de consignación y el detalle.', 'error');
        return;
      }
      if (this.seleccionados.length === 0) {
        this.$swal('Error', 'Debe seleccionar al menos una consignación.', 'error');
        return;
      }

      this.isLoading = true;

      const payload = {
        ids: this.seleccionados.map(item => item.id),
        saldar_data: this.saldar,
        jwt: this.$cookies.get('jwt'),
      };

      try {
        const path = backendRouter.data + 'settle-invoice';
        await axios.post(path, payload);
        
        this.$swal('Éxito', 'Consignaciones saldadas correctamente', 'success');
        this.showSaldarModal = false;
        this.seleccionados = [];
        this.saldar = { fechaConsignacion: '', detalle: '' };
        this.tableKey += 1;
        await this.filterData();

      } catch (error) {
        const errorMsg = error.response?.data?.detail || 'Ocurrió un error al saldar.';
        this.$swal('Error', errorMsg, 'error');
      } finally {
        this.isLoading = false;
      }
    },
    updateSeleccionados(nuevosSeleccionados) {
      this.seleccionados = nuevosSeleccionados;
    },
    mostrarInformacion(detalle) {
      this.isLoading = true;
      const path = backendRouter.data + 'get-imagen-corresponsal';
      axios.post(path, detalle).then((response) => {
        this.imageBlob = response.data.image;
        this.imageContent = response.data.content_type;
        this.showImagenModal = true;
      }).finally(() => {
        this.isLoading = false;
      });
    },
  },
};
</script>