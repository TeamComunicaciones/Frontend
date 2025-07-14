<template>
  <div class="main-wrapper bg-white text-black" style="font-family: 'Comfortaa', sans-serif;">
    <SidebarMenu :titulo="tituloMenu" />

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
        <BFormInput v-if="buttonsSelected === 'mes'" type="month" v-model="fecha" @change="getData" class="form-control w-auto" />
        <BFormInput v-if="buttonsSelected === 'dia'" type="date" v-model="fecha" @change="getData" class="form-control w-auto" />

        <BFormSelect
          v-if="fecha"
          v-model="sucursal"
          :options="[{ value: null, text: 'Seleccione una sucursal' }, { value: '0', text: 'Todas' }, ...sucursales]"
          @change="filterSucursal"
          class="form-select w-auto"
        />
        
        <BButton variant="danger" v-if="dataExcel.length" @click="descargarBanco">Trs. Banco</BButton>
        <BButton variant="danger" v-if="resumen.consignaciones" @click="descargarCajero">Trs. Cajero</BButton>
      </div>

      <b-tabs active-nav-item-class="fw-bold text-uppercase text-danger" content-class="mt-3">
        <b-tab title="Sucursales" active>
          <h4 v-if="!consolidado.length && !isLoading">Seleccione una Fecha</h4>
          <div class="table-responsive" v-if="consolidado.length">
            <table class="table table-bordered table-striped align-middle">
              <thead class="table-light">
                <tr>
                  <th>Sucursal</th>
                  <th>Cuenta</th>
                  <th>Valor</th>
                  <th>Pendiente</th>
                  <th>Saldado</th>
                  <th>Restante</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in consolidado" :key="row.id">
                  <td>{{ row.codigo_incocredito }}</td>
                  <td>{{ row.cuenta }}</td>
                  <td>{{ formatCurrency(row.valor) }}</td>
                  <td>{{ formatCurrency(row.pendiente) }}</td>
                  <td>{{ formatCurrency(row.saldado) }}</td>
                  <td>{{ formatCurrency(row.restante) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-tab>

        <b-tab title="Todo">
          <h4 v-if="!sucursal && !isLoading">Seleccione una Sucursal</h4>
           <DetalleConsignacionesTabla v-else :consignaciones="resumen.consignaciones || []" :show-image-button="true" @view="mostrarInformacion" />
        </b-tab>

        <b-tab title="Saldado">
           <h4 v-if="!sucursal && !isLoading">Seleccione una Sucursal</h4>
           <DetalleConsignacionesTabla v-else :consignaciones="consignacionesSaldadas" :show-image-button="true" @view="mostrarInformacion" />
        </b-tab>

        <b-tab title="Resumen por Banco">
          <h4 v-if="!sucursal && !isLoading">Seleccione una Sucursal</h4>
          <div class="table-responsive" v-if="sucursal">
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th>Banco</th>
                  <th>Total Pendiente</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in resumenPorBanco" :key="index">
                  <td>{{ item.banco }}</td>
                  <td>{{ formatCurrency(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-tab>
      </b-tabs>
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
import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue';
import Loading from 'vue-loading-overlay';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { VueImageZoomer } from 'vue-image-zoomer';
import 'vue-image-zoomer/dist/style.css';
import DetalleConsignacionesTabla from './DetalleConsignacionesTabla.vue';

export default {
  components: {
    SidebarMenu,
    VueImageZoomer,
    Loading,
    DetalleConsignacionesTabla
  },
  data() {
    return {
      tituloMenu: 'Informe Corresponsal',
      isLoading: false,
      fullPage: true,
      fecha: '',
      buttonsSelected: 'mes',
      buttonsOptions: [
        { text: 'Mes', value: 'mes' },
        { text: 'Día', value: 'dia' },
      ],
      consolidado: [],
      sucursales: [],
      sucursal: null,
      dataExcel: [],
      resumen: {},
      showImagenModal: false,
      imageBlob: null,
      imageContent: null,
    };
  },
  computed: {
    consignacionesSaldadas() {
      return this.resumen?.consignaciones?.filter(d => ['saldado', 'Conciliado'].includes(d.estado)) || [];
    },
    resumenPorBanco() {
      const resumenMap = {};
      const pendientes = this.resumen?.consignaciones?.filter(d => d.estado === 'pendiente') || [];
      pendientes.forEach((item) => {
        if (!resumenMap[item.banco]) {
          resumenMap[item.banco] = 0;
        }
        resumenMap[item.banco] += item.valor;
      });
      return Object.entries(resumenMap).map(([banco, total]) => ({ banco, total }));
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
    async getData() {
      if (!this.fecha) return;
      this.isLoading = true;
      this.resumen = {};
      this.sucursal = null;
      try {
        const path = backendRouter.data + 'select-datos-corresponsal';
        const response = await axios.post(path, { fecha: this.fecha });
        this.consolidado = response.data.consolidado;
        this.sucursales = response.data.sucursales.sort((a, b) => a.text.localeCompare(b.text));
        this.dataExcel = response.data.data;
      } catch (error) {
        this.consolidado = [];
        console.error("Error en getData:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async filterSucursal() {
      if (!this.sucursal) {
        this.resumen = {};
        return;
      }
      this.isLoading = true;
      try {
        const path = backendRouter.data + 'resumen-corresponsal';
        const response = await axios.post(path, { fecha: this.fecha, sucursal: this.sucursal });
        this.resumen = response.data;
      } catch (error) {
        this.resumen = {};
        console.error("Error en filterSucursal:", error);
      } finally {
        this.isLoading = false;
      }
    },
    descargarBanco() {
      const data = this.dataExcel;
      const fileName = 'reporte_banco.xlsx';
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transacciones Banco');
      XLSX.writeFile(workbook, fileName);
    },
    descargarCajero() {
        if (!this.resumen.consignaciones || this.resumen.consignaciones.length === 0) {
            this.$swal('Aviso', 'No hay datos de consignaciones para descargar.', 'info');
            return;
        }
        const dataToExport = this.resumen.consignaciones.map(item => ({
            'Sucursal': item.sucursal_nombre,
            'Categoría': item.banco,
            'Valor': item.valor,
            'Responsable': item.responsable,
            'Estado': item.estado,
            'Detalle': item.detalle,
            'Detalle Categoría': item.detalle_categoria
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const currencyFormat = '$ #,##0.00';
        const currencyColumns = ['Valor'];
        const headers = Object.keys(dataToExport[0] || {});
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                if (currencyColumns.includes(headers[C])) {
                    const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
                    const cell = worksheet[cell_address];
                    if (cell && cell.t === 'n') {
                        cell.z = currencyFormat;
                    }
                }
            }
        }
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Consignaciones");
        XLSX.writeFile(workbook, "reporte_cajero.xlsx");
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