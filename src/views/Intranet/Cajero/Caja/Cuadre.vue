<template>
  <div class="container-fluid py-4">
    <h1 class="mb-4">Cuadre de Caja</h1>
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage" />
    </div>
    <div class="row">
      <div class="col-lg-5 mb-4">
        <div class="card h-100">
          <div class="card-body p-4">
            <h3 class="card-title mb-3">{{ sucursal }}</h3>
            <div class="mb-4">
              <label class="form-label fw-bold">Fecha de Cierre:</label>
              <BFormInput type="date" v-model="fecha" @change="getData" style="max-width: 200px;" />
            </div>
            <div class="mt-4 summary-section">
              <div class="summary-item"><span>Total en Cajero:</span> <strong>{{ formatCurrency(total) }}</strong></div>
              <div class="summary-item"><span>Total Consignado (Día):</span> <strong>{{ formatCurrency(consignaciones) }}</strong></div>
              <div class="summary-item text-danger"><span>Pendiente por Saldar (Día):</span> <strong>{{ formatCurrency(diferencia) }}</strong></div>
              
              <div class="historico-section mt-4 pt-3 border-top">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 text-danger">Histórico Pendiente (45 días):</h5>
                  <strong class="text-danger fs-5">{{ formatCurrency(historicoPendientes.total_general) }}</strong>
                </div>
                <BButton size="sm" variant="outline-secondary" @click="toggleHistorico" v-if="historicoPendientes.detalles.length > 0" class="w-100 mt-2">
                  {{ isHistoricoVisible ? 'Ocultar Detalle' : 'Ver Detalle' }}
                </BButton>
                <div v-if="isHistoricoVisible" class="historico-detalle mt-3 card card-body bg-light">
                  <ul class="list-group list-group-flush">
                    <li v-for="item in paginatedHistorico" :key="item.fecha" class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                      <span>{{ formatDate(item.fecha) }}</span>
                      <span :class="item.pendiente_dia >= 0 ? 'text-danger' : 'text-success'" class="fw-bold">{{ formatCurrency(item.pendiente_dia) }}</span>
                    </li>
                  </ul>
                  <div class="d-flex justify-content-center mt-3" v-if="totalHistoricoRows > historicoPerPage">
                    <BPagination v-model="historicoCurrentPage" :total-rows="totalHistoricoRows" :per-page="historicoPerPage" size="sm" />
                  </div>
                </div>
              </div>
              <BButton v-if="boton" variant="danger" class="px-4 mt-4 w-100" @click="showConsignacionModal = true">
                Montar Nueva Consignación
              </BButton>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-7 mb-4">
        <div class="card h-100">
          <div class="card-body p-4">
            <h4 class="card-title mb-3">Detalle de Consignaciones del Día</h4>
            <div v-if="detalleConsignaciones.length > 0" class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th v-for="header in detalleHeaders" :key="header.key">{{ header.label }}</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detalle in detalleConsignaciones" :key="detalle.id">
                    <td v-for="header in detalleHeaders" :key="header.key">{{ header.key === 'valor' ? formatCurrency(detalle[header.key]) : detalle[header.key] }}</td>
                    <td>
                      <button v-if="detalle.url" class="btn btn-outline-dark btn-sm rounded-circle" @click="mostrarInformacion(detalle)"><IBiEye /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center text-muted mt-5"><p>No hay consignaciones para la fecha seleccionada.</p></div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showConsignacionModal" class="modal-backdrop">
        <div class="modal-container">
            <div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">Registrar Nueva Consignación</h5><button type="button" class="btn-close" @click="showConsignacionModal = false" :disabled="isSubmitting"></button></div>
                <div class="modal-body p-4">
                    <form @submit.prevent="uploadConsignacion" enctype="multipart/form-data"><div class="row"><div class="col-md-6 mb-3"><label for="valor" class="form-label">Valor a Consignar</label><input type="number" class="form-control" id="valor" v-model.number="consignacion.valor" required /></div><div class="col-md-6 mb-3"><label for="fechaConsignacion" class="form-label">Fecha de Consignación</label><input type="date" class="form-control" id="fechaConsignacion" v-model="consignacion.fechaConsignacion" required /></div><div class="col-12 mb-3"><label for="banco" class="form-label">Categoría</label><select id="banco" class="form-select" v-model="consignacion.banco" required><option disabled value="">Seleccione una categoría</option><option v-for="b in bancosPrincipales" :key="b" :value="b">{{ b }}</option></select></div><div v-if="consignacion.banco === 'Otros bancos'" class="col-12 mb-3"><label for="bancoDetalle" class="form-label">Banco Específico</label><select id="bancoDetalle" class="form-select" v-model="consignacion.bancoDetalle" required><option v-for="b in bancosDetalleOptions" :key="b" :value="b">{{ b }}</option></select></div><div v-if="consignacion.banco === 'Impuestos'" class="col-12 mb-3"><label for="impuestoDetalle" class="form-label">Tipo de Impuesto</label><select id="impuestoDetalle" class="form-select" v-model="consignacion.impuestoDetalle" required><option v-for="impuesto in impuestosOptions" :key="impuesto" :value="impuesto">{{ impuesto }}</option></select></div><div v-if="['Proveedores', 'Obligaciones financieras'].includes(consignacion.banco)" class="col-12 mb-3"><label for="proveedor" class="form-label">Detalle Específico</label><select v-if="consignacion.banco === 'Obligaciones financieras'" id="proveedor" class="form-select" v-model="consignacion.proveedor" required><option v-for="banco in obligacionesOptions" :key="banco" :value="banco">{{ banco }}</option></select><select v-else-if="consignacion.banco === 'Proveedores'" id="proveedor" class="form-select" v-model="consignacion.proveedor" required><option v-for="prov in proveedoresOptions" :key="prov" :value="prov">{{ prov }}</option></select></div><div v-if="consignacion.banco === 'Venta doble proposito'" class="col-12"><div class="row"><div class="col-md-4 mb-3"><label for="min" class="form-label">MIN</label><input type="text" id="min" class="form-control" v-model="consignacion.min" required /></div><div class="col-md-4 mb-3"><label for="imei" class="form-label">IMEI</label><input type="text" id="imei" class="form-control" v-model="consignacion.imei" required /></div><div class="col-md-4 mb-3"><label for="planilla" class="form-label">N° Planilla</label><input type="text" id="planilla" class="form-control" v-model="consignacion.planilla" required /></div></div></div><div class="col-12 mb-3"><label for="detalle" class="form-label">Detalle Adicional</label><textarea id="detalle" class="form-control" v-model="consignacion.detalle" rows="3"></textarea></div><div class="col-12 mb-3"><label for="imagen" class="form-label">Adjuntar Soporte (Imagen)</label><input type="file" id="imagen" class="form-control" @change="onFileChange" accept="image/*" required /></div></div><div class="d-grid mt-4"><BButton type="submit" variant="danger" size="lg" :disabled="isSubmitting"><span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>{{ isSubmitting ? ' Guardando...' : 'Guardar Consignación' }}</BButton></div></form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showImagenModal" class="image-modal-backdrop" @click="cerrarImagenModal">
      <button class="btn-close-modal" @click="cerrarImagenModal">&times;</button>
      <div ref="zoomContainer" class="image-modal-content" @click.stop="toggleZoom" @mousemove="panImage">
        <img ref="imagen" :src="`data:${imageContent};base64,${imageBlob}`" :class="{ zoomed: zoomed }" :style="zoomStyles" alt="Soporte de consignación"/>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
// Opcional: backendRouter ya no es necesario si todas las rutas son relativas a la baseURL de apiService
// import backendRouter from '@/components/BackendRouter/BackendRouter'; 
import Swal from 'sweetalert2';
import { BFormInput, BButton, BPagination } from 'bootstrap-vue-next';
import apiService from '@/services/apiService'; // ¡IMPORTANTE!

export default {
  components: { Loading, BFormInput, BButton, BPagination },
  data() {
    return {
      isLoading: false, isSubmitting: false, fullPage: true,
      boton: false, fecha: new Date().toISOString().slice(0, 10),
      total: 0, consignaciones: 0, detalleConsignaciones: [], sucursal: '',
      showConsignacionModal: false, showImagenModal: false,
      image: null, imageBlob: null, imageContent: null,
      zoomed: false, zoomStyles: {}, isHistoricoVisible: false,
      historicoPendientes: { total_general: 0, detalles: [] },
      historicoCurrentPage: 1, historicoPerPage: 10,
      consignacion: { valor: '', banco: '', bancoDetalle: '', proveedor: '', impuestoDetalle: '', fechaConsignacion: '', detalle: '', min: '', imei: '', planilla: '' },
      bancosPrincipales: [ 'Corresponsal Banco de Bogota', 'Saitemp', 'Proveedores', 'Otros bancos', 'Obligaciones financieras', 'Corresponsal Team (70981) Bancolombia', 'Corresponsal Elena (70988) Bancolombia', 'Impuestos', 'Volantes Sub', 'Volantes Agaval', 'Volantes venta grabada', 'Reclamaciones', 'Venta doble proposito' ],
      bancosDetalleOptions: ['Bancolombia', 'Bogotá', 'Caja social Team', 'Caja social NPA', 'Davivienda', 'Agrario', 'Adquirencias','Alianza'],
      impuestosOptions: ['IVA', 'ReteIVA', 'Retefuente', 'ICA', 'Predial', 'Cámara de Comercio'],
      proveedoresOptions: ['1Hora (HASTECK)', 'Polizas', 'Movictec Tecnología (Relojes)', 'Impresistem', 'Otros'],
      obligacionesOptions: ['Banco de Bogotá', 'Bancolombia', 'Caja Social', 'Davivienda', 'Banco Agrario'],
      detalleHeaders: [ { key: 'banco', label: 'Banco' }, { key: 'valor', label: 'Valor' }, { key: 'estado', label: 'Estado' }, ]
    };
  },
  computed: {
    diferencia() { return this.total - this.consignaciones; },
    totalHistoricoRows() { return this.historicoPendientes.detalles.length; },
    paginatedHistorico() {
      const start = (this.historicoCurrentPage - 1) * this.historicoPerPage;
      const end = start + this.historicoPerPage;
      return this.historicoPendientes.detalles.slice(start, end);
    }
  },
  methods: {
    formatCurrency(value) { if (isNaN(value) || value === null) return '$0'; return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value); },
    formatDate(dateString) { const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }; return new Date(dateString).toLocaleDateString('es-CO', options); },
    toggleHistorico() { this.isHistoricoVisible = !this.isHistoricoVisible; },
    getHistoricoPendientes() {
      apiService.get('historico-pendientes-cajero')
        .then(response => { this.historicoPendientes = response.data; this.historicoCurrentPage = 1; })
        .catch(error => { console.error("Error al obtener el histórico:", error); });
    },
    toggleZoom(event) { if (!this.zoomed) { const rect = this.$refs.imagen.getBoundingClientRect(); const x = ((event.clientX - rect.left) / rect.width) * 100; const y = ((event.clientY - rect.top) / rect.height) * 100; this.zoomStyles = { transform: 'scale(2.5)', transformOrigin: `${x}% ${y}%` }; this.zoomed = true; } else { this.zoomStyles = {}; this.zoomed = false; } },
    panImage(event) { if (!this.zoomed) return; const rect = this.$refs.zoomContainer.getBoundingClientRect(); const x = ((event.clientX - rect.left) / rect.width) * 100; const y = ((event.clientY - rect.top) / rect.height) * 100; this.zoomStyles.transformOrigin = `${x}% ${y}%`; },
    cerrarImagenModal() { this.showImagenModal = false; this.zoomed = false; this.zoomStyles = {}; },
    getData() {
      if (!this.fecha) return;
      this.isLoading = true;
      const data = { fecha: this.fecha };
      apiService.post('select-datos-corresponsal-cajero', data)
        .then((response) => {
          this.total = response.data.total || 0;
          this.sucursal = response.data.sucursal;
          this.boton = true;
          this.getDataConsignaciones();
        })
        .catch((error) => {
          this.$swal('Error', error.response?.data?.error || 'No se pudieron cargar los datos.', 'error');
          this.isLoading = false;
        });
    },
    getDataConsignaciones() {
      if (!this.fecha || !this.sucursal) return;
      const data = { fecha: this.fecha, sucursal: this.sucursal };
      apiService.post('select-consignaciones-corresponsal-cajero', data)
        .then((response) => {
          this.consignaciones = response.data.total || 0;
          this.detalleConsignaciones = response.data.detalles;
        })
        .catch(() => { this.$swal('Error', 'No se pudieron cargar los detalles de consignaciones.', 'error'); })
        .finally(() => { this.isLoading = false; });
    },
    mostrarInformacion(detalle) {
      this.isLoading = true;
      apiService.post('get-imagen-corresponsal', detalle)
        .then((response) => {
          this.imageBlob = response.data.image;
          this.imageContent = response.data.content_type;
          this.showImagenModal = true;
        })
        .finally(() => { this.isLoading = false; });
    },
    onFileChange(event) { this.image = event.target.files[0]; },
    async uploadConsignacion() {
      if (this.consignacion.valor > this.total) { Swal.fire('Error', 'El valor a consignar no puede ser mayor al "Total en Cajero".', 'error'); return; }
      const specialCases = ['Reclamaciones', 'Corresponsal Banco de Bogota'];
      this.consignacion.estado = specialCases.includes(this.consignacion.banco) ? 'saldado' : 'pendiente';
      if (this.consignacion.banco === 'Venta doble proposito' && (!this.consignacion.min || !this.consignacion.imei || !this.consignacion.planilla)) { Swal.fire('Error', 'Debe llenar los campos MIN, IMEI y planilla.', 'error'); return; }
      
      this.isSubmitting = true;
      this.isLoading = true;
      
      const formData = new FormData();
      formData.append('image', this.image);
      formData.append('data', JSON.stringify(this.consignacion));
      formData.append('fecha', this.fecha);
      formData.append('sucursal', this.sucursal);
      
      try {
        await apiService.post('consignacion-corresponsal', formData);
        this.showConsignacionModal = false;
        this.getData();
        this.getHistoricoPendientes();
        Swal.fire('Éxito', 'Consignación guardada con éxito', 'success');
      } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al guardar la consignación.', 'error');
      } finally {
        this.isLoading = false;
        this.isSubmitting = false;
      }
    }
  },
  created() {
    this.getData();
    this.getHistoricoPendientes();
  }
};
</script>

<style lang="scss" scoped>
.card { border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.summary-item { display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 1.1rem; border-bottom: 1px solid #f0f0f0; }
.summary-item:last-of-type { border-bottom: none; }
.historico-section { font-size: 1.1rem; }
.historico-detalle { background-color: #f8f9fa; border-radius: 0.5rem; }
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1050; }
.modal-container { background: white; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 90%; max-width: 700px; max-height: 90vh; display: flex; flex-direction: column; }
.modal-content { border: none; }
.modal-body { overflow-y: auto; }
.image-modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.85); z-index: 1060; display: flex; justify-content: center; align-items: center; }
.image-modal-content { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; cursor: zoom-in; }
.image-modal-content.zoomed { cursor: grab; }
.image-modal-content img { display: block; max-width: 90vw; max-height: 90vh; object-fit: contain; transition: transform 0.2s ease; }
.image-modal-content img.zoomed { transform-origin: center center; cursor: grab; }
.btn-close-modal { position: absolute; top: 1rem; right: 1.5rem; font-size: 2.5rem; font-weight: bold; color: white; background: none; border: none; text-shadow: 0 1px 3px black; z-index: 1070; }
</style>