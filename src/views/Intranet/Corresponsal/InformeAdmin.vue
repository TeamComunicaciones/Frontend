    <template>
      <div class="main-wrapper">
        <div class="vld-parent">
          <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
        </div>

        <div class="container py-4">
          <h1 class="mb-4">Informe de Corresponsal</h1>
          <div class="card shadow-sm filter-bar mb-4">
            <div class="card-body">
              <div class="row g-3 align-items-end">
                <div class="col-auto">
                  <label class="form-label">Rango</label>
                  <BFormRadioGroup v-model="buttonsSelected" :options="buttonsOptions" button-variant="outline-danger" name="radios-btn-default" buttons />
                </div>
                <div class="col-auto">
                  <label class="form-label">{{ buttonsSelected === 'mes' ? 'Mes' : 'Día' }}</label>
                  <BFormInput v-if="buttonsSelected === 'mes'" type="month" v-model="fecha" @change="getData" class="form-control" />
                  <BFormInput v-else type="date" v-model="fecha" @change="getData" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Sucursal</label>
                  <BFormSelect v-if="fecha" v-model="sucursal" :options="[{ value: null, text: 'Seleccione sucursal' }, { value: '0', text: 'Todas' }, ...sucursales]" @change="filterSucursal" class="form-select" />
                </div>
                <div class="col-md-4 ms-auto text-end">
                    <BButton variant="danger" v-if="dataExcel.length" @click="descargarBanco" class="me-2">Trs. Banco</BButton>
                    <BButton variant="danger" v-if="resumen.consignaciones" @click="descargarCajero">Trs. Cajero</BButton>
                </div>
              </div>
            </div>
          </div>

          <div v-if="sucursal !== null && resumen.titulo" class="mb-4">
            <h4 class="text-center text-muted mb-3">Mostrando resumen para: <strong>{{ resumen.titulo }}</strong></h4>
            <b-row class="stats-row">
              <b-col md="3"><b-card class="stat-card text-center"><h6 class="text-muted mb-1">Total en Cajero</h6><h2 class="mb-0">{{ formatCurrency(resumen.valor) }}</h2></b-card></b-col>
              <b-col md="3"><b-card class="stat-card text-center"><h6 class="text-muted mb-1">Total Consignado</h6><h2 class="mb-0">{{ formatCurrency(resumen.consignacion) }}</h2></b-card></b-col>
              <b-col md="3"><b-card class="stat-card text-center text-danger"><h6 class="text-muted mb-1">Pendiente por Saldar</h6><h2 class="mb-0">{{ formatCurrency(resumen.pendiente) }}</h2></b-card></b-col>
              <b-col md="3"><b-card class="stat-card text-center"><h6 class="text-muted mb-1">Restante</h6><h2 class="mb-0">{{ formatCurrency(totalRestante) }}</h2></b-card></b-col>
            </b-row>
          </div>

          <b-tabs active-nav-item-class="fw-bold text-uppercase text-danger" content-class="mt-3">
            <b-tab title="Sucursales" active>
              <div v-if="!consolidado.length && !isLoading" class="text-center text-muted mt-5"><p>Seleccione una Fecha para ver el consolidado.</p></div>
              <div class="table-responsive card" v-if="consolidado.length">
                <table class="table table-striped align-middle text-center mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Sucursal</th><th># Transacciones</th><th>Valor Transado</th>
                      <th>Pendiente</th><th>Saldado</th><th>Restante</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in consolidado" :key="row.codigo_incocredito">
                      <td>{{ row.codigo_incocredito }}</td><td>{{ row.cuenta }}</td>
                      <td>{{ formatCurrency(row.valor) }}</td><td>{{ formatCurrency(row.pendiente) }}</td>
                      <td>{{ formatCurrency(row.saldado) }}</td><td>{{ formatCurrency(row.restante) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-tab>

            <b-tab title="Todo">
              <div v-if="!sucursal" class="text-center text-muted mt-5"><p>Seleccione una Sucursal para ver el detalle.</p></div>
              <div v-else>
                <div class="mb-3" style="max-width: 300px;">
                  <select class="form-select" v-model="bancoSeleccionado">
                    <option value="">-- Filtrar por categoría --</option>
                    <option v-for="banco in bancosDisponibles" :key="banco" :value="banco">{{ banco }}</option>
                  </select>
                </div>
                <DetalleConsignacionesTabla :consignaciones="paginatedTodo" :show-image-button="true" @view="mostrarInformacion" />
                <div class="d-flex justify-content-center mt-3" v-if="totalTodoRows > perPage"><BPagination v-model="todoCurrentPage" :total-rows="totalTodoRows" :per-page="perPage" /></div>
              </div>
            </b-tab>

            <b-tab title="Saldado">
              <div v-if="!sucursal" class="text-center text-muted mt-5"><p>Seleccione una Sucursal para ver el detalle.</p></div>
              <div v-else>
                <DetalleConsignacionesTabla :consignaciones="paginatedSaldado" :show-image-button="true" @view="mostrarInformacion" />
                <div class="d-flex justify-content-center mt-3" v-if="totalSaldadoRows > perPage"><BPagination v-model="saldadoCurrentPage" :total-rows="totalSaldadoRows" :per-page="perPage" /></div>
              </div>
            </b-tab>

            <b-tab title="Resumen por Banco">
              <div v-if="!sucursal" class="text-center text-muted mt-5"><p>Seleccione una Sucursal para ver el resumen.</p></div>
              <div class="table-responsive card" v-if="sucursal && resumenPorBanco.length">
                <table class="table table-bordered mb-0">
                  <thead class="table-light">
                    <tr><th>Categoría</th><th class="text-end">Total Pendiente</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in resumenPorBanco" :key="index">
                      <td>{{ item.banco }}</td><td class="text-end">{{ formatCurrency(item.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-tab>
          </b-tabs>
        </div>

        <div v-if="showImagenModal" class="modal show d-block bg-dark bg-opacity-75">
          <div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content p-3">
            <div class="modal-header border-0"><button type="button" class="btn-close" @click="showImagenModal = false"></button></div>
            <div class="modal-body text-center"><vue-image-zoomer :regular="`data:${imageContent};base64,${imageBlob}`" :zoom="`data:${imageContent};base64,${imageBlob}`" /></div>
          </div></div>
        </div>
      </div>
    </template>

<script>
import Loading from 'vue-loading-overlay';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { VueImageZoomer } from 'vue-image-zoomer';
import 'vue-image-zoomer/dist/style.css';
import DetalleConsignacionesTabla from './DetalleConsignacionesTabla.vue';
import { BFormRadioGroup, BFormInput, BFormSelect, BButton, BRow, BCol, BCard, BTabs, BTab, BPagination } from 'bootstrap-vue-next';

export default {
  components: { VueImageZoomer, Loading, DetalleConsignacionesTabla, BFormRadioGroup, BFormInput, BFormSelect, BButton, BRow, BCol, BCard, BTabs, BTab, BPagination },
  data() {
    return {
      isLoading: false, fullPage: true, fecha: '', buttonsSelected: 'mes',
      buttonsOptions: [ { text: 'Mes', value: 'mes' }, { text: 'Día', value: 'dia' }, ],
      consolidado: [], sucursales: [], sucursal: null, dataExcel: [],
      resumen: {}, bancoSeleccionado: '', showImagenModal: false,
      imageBlob: null, imageContent: null,
      todoCurrentPage: 1, saldadoCurrentPage: 1, perPage: 15,
    };
  },
  watch: {
    bancoSeleccionado() { this.todoCurrentPage = 1; },
    sucursal() { this.todoCurrentPage = 1; this.saldadoCurrentPage = 1; }
  },
  computed: {
    bancosDisponibles() { if (!this.resumen.consignaciones) return []; const bancos = this.resumen.consignaciones.map(d => d.banco); return [...new Set(bancos)].sort(); },
    filtradasPorBanco() { if (!this.bancoSeleccionado) { return this.resumen?.consignaciones || []; } return this.resumen.consignaciones.filter(d => d.banco === this.bancoSeleccionado); },
    consignacionesSaldadas() { return this.resumen?.consignaciones?.filter(d => ['saldado', 'Conciliado'].includes(d.estado)) || []; },
    resumenPorBanco() { const resumenMap = {}; const pendientes = this.resumen?.consignaciones?.filter(d => d.estado === 'pendiente') || []; pendientes.forEach((item) => { if (!resumenMap[item.banco]) { resumenMap[item.banco] = 0; } resumenMap[item.banco] += item.valor; }); return Object.entries(resumenMap).map(([banco, total]) => ({ banco, total })); },
    totalTodoRows() { return this.filtradasPorBanco.length; },
    paginatedTodo() { const start = (this.todoCurrentPage - 1) * this.perPage; const end = start + this.perPage; return this.filtradasPorBanco.slice(start, end); },
    totalSaldadoRows() { return this.consignacionesSaldadas.length; },
    paginatedSaldado() { const start = (this.saldadoCurrentPage - 1) * this.perPage; const end = start + this.perPage; return this.consignacionesSaldadas.slice(start, end); },
    totalRestante() {
      const totalCajero = this.resumen.valor || 0;
      const totalConsignado = this.resumen.consignacion || 0;
      const pendientePorSaldar = this.resumen.pendiente || 0;
      return totalCajero - totalConsignado - pendientePorSaldar;
    }
  },
  methods: {
    formatCurrency(value) { if (typeof value !== 'number') return '$ 0'; return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }); },
    async getData() { if (!this.fecha) return; this.isLoading = true; this.resumen = {}; try { const path = backendRouter.data + 'select-datos-corresponsal'; const response = await axios.post(path, { fecha: this.fecha }); this.consolidado = response.data.consolidado; this.sucursales = response.data.sucursales.sort((a, b) => a.text.localeCompare(b.text)); this.dataExcel = response.data.data; if (this.sucursal) { this.filterSucursal(); } } catch (error) { this.consolidado = []; console.error("Error en getData:", error); } finally { this.isLoading = false; } },
    async filterSucursal() { if (this.sucursal === null) { this.resumen = {}; return; } this.isLoading = true; try { const path = backendRouter.data + 'resumen-corresponsal'; const response = await axios.post(path, { fecha: this.fecha, sucursal: this.sucursal }); this.resumen = response.data; } catch (error) { this.resumen = {}; console.error("Error en filterSucursal:", error); } finally { this.isLoading = false; } },
    descargarBanco() { const data = this.dataExcel; const fileName = 'reporte_banco.xlsx'; const workbook = XLSX.utils.book_new(); const worksheet = XLSX.utils.json_to_sheet(data); XLSX.utils.book_append_sheet(workbook, worksheet, 'Transacciones Banco'); XLSX.writeFile(workbook, fileName); },
    descargarCajero() {
    // AHORA USAMOS LA NUEVA LISTA 'consignaciones_excel'
    if (!this.resumen.consignaciones_excel || this.resumen.consignaciones_excel.length === 0) {
      this.$swal('Aviso', 'No hay datos para descargar.', 'info');
      return;
    }

    // El resto del método usa la nueva lista y funciona igual
    const dataToExport = this.resumen.consignaciones_excel.map(item => ({
      'ID': item.id,
      'Valor': item.valor,
      'Banco': item.banco,
      'Fecha Consignacion': item.fecha_consignacion,
      'Fecha Cierre': item.fecha,
      'Responsable': item.responsable,
      'Estado': item.estado,
      'Detalle': item.detalle,
      'URL Imagen': item.url,
      'MIN': item.min || '',
      'IMEI': item.imei || '',
      'Planilla': item.planilla || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const currencyColumns = ['Valor'];
    const headers = Object.keys(dataToExport[0] || {});
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (currencyColumns.includes(headers[C])) {
          const cell = worksheet[cellAddress];
          if (cell && cell.t === 'n') {
            cell.z = '$ #,##0';
          }
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consignaciones");
    XLSX.writeFile(workbook, "reporte_cajero.xlsx");
  },
    mostrarInformacion(detalle) { this.isLoading = true; const path = backendRouter.data + 'get-imagen-corresponsal'; axios.post(path, detalle).then((response) => { this.imageBlob = response.data.image; this.imageContent = response.data.content_type; this.showImagenModal = true; }).finally(() => { this.isLoading = false; }); },
  },
};
</script>

<style scoped>
.filter-bar { background-color: #f8f9fa; }
.stat-card { border: 1px solid #e0e0e0; }
.stat-card h2 { font-size: 1.75rem; font-weight: 700; }
</style>