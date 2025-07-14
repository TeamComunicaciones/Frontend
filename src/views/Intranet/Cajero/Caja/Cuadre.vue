<template>
  <div class="container-fluid">
    <SidebarMenu :titulo="tituloMenu" />

    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage" />
    </div>

    <div class="row">
      <div class="col-md-5 m-3 p-4 bg-white shadow-sm rounded">
        <h2 class="mb-3">{{ sucursal }}</h2>

        <div class="mb-3">
          <label class="form-label">Fecha:</label>
          <BFormInput type="date" v-model="fecha" @change="getData" style="max-width: 200px;" />
        </div>

        <div class="mt-4">
          <h4 class="mb-2">Total en Cajero: <strong>{{ formatCurrency(total) }}</strong></h4>
          <h4 class="mb-2">Total Consignado: <strong>{{ formatCurrency(consignaciones) }}</strong></h4>
          <h4 class="mb-2 text-success">Disponible: <strong>{{ formatCurrency(diferencia) }}</strong></h4>
          <h4 class="mb-4 text-warning">Pendiente por Saldar: <strong>{{ formatCurrency(totalPendiente) }}</strong></h4>

          <BButton v-if="boton" variant="danger" class="px-4" @click="showConsignacionModal = true">
            Montar Consignación
          </BButton>
        </div>
      </div>

      <div class="col-md-6 m-3 p-4 bg-white shadow-sm rounded">
        <h4 class="mb-3">Detalle de Consignaciones</h4>
        <div v-if="detalleConsignaciones.length > 0" class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th v-for="header in detalleHeaders" :key="header.key">{{ header.label }}</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detalle in detalleConsignaciones" :key="detalle.id">
                <td v-for="header in detalleHeaders" :key="header.key">
                  {{ header.key === 'valor' ? formatCurrency(detalle[header.key]) : detalle[header.key] }}
                </td>
                <td>
                  <button class="btn btn-outline-dark btn-sm" @click="mostrarInformacion(detalle)">
                    <IBiEye />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center text-muted mt-4">
          No hay consignaciones para la fecha seleccionada.
        </div>
      </div>
    </div>

    <div v-if="showConsignacionModal" class="modal-backdrop">
      <div class="modal-container">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Montar Consignación</h2>
            <button type="button" class="btn-close" @click="showConsignacionModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="uploadConsignacion" enctype="multipart/form-data">
              <div class="form-group mb-3">
                <label for="valor">Valor a Consignar:</label>
                <input type="number" class="form-control" v-model.number="consignacion.valor" required />
              </div>

              <div class="form-group mb-3">
                <label for="banco">Categoría:</label>
                <select class="form-control" v-model="consignacion.banco" required>
                  <option disabled value="">Seleccione una categoría</option>
                  <option v-for="b in bancosPrincipales" :key="b" :value="b">{{ b }}</option>
                </select>
              </div>


              <div v-if="consignacion.banco === 'Otros bancos'" class="form-group mb-3">
                <label for="bancoDetalle">Banco Detalle:</label>
                <select class="form-control" v-model="consignacion.bancoDetalle" required>
                  <option disabled value="">Seleccione un banco</option>
                  <option v-for="b in bancosDetalleOptions" :key="b" :value="b">{{ b }}</option>
                </select>
              </div>

              <div v-if="consignacion.banco === 'Impuestos'" class="form-group mb-3">
                <label for="impuestoDetalle">Tipo de Impuesto:</label>
                <select class="form-control" v-model="consignacion.impuestoDetalle" required>
                   <option disabled value="">Seleccione un impuesto</option>
                   <option v-for="impuesto in impuestosOptions" :key="impuesto" :value="impuesto">{{ impuesto }}</option>
                </select>
              </div>

              <div v-if="consignacion.banco === 'Venta doble proposito'">
                <div class="form-group mb-3">
                  <label for="min">MIN:</label>
                  <input type="text" class="form-control" v-model="consignacion.min" required />
                </div>
                <div class="form-group mb-3">
                  <label for="imei">IMEI:</label>
                  <input type="text" class="form-control" v-model="consignacion.imei" required />
                </div>
                <div class="form-group mb-3">
                  <label for="planilla">Número de planilla:</label>
                  <input type="text" class="form-control" v-model="consignacion.planilla" required />
                </div>
              </div>

              <div v-if="['Proveedores', 'Obligaciones financieras'].includes(consignacion.banco)" class="form-group mb-3">
                <label for="proveedor">Detalle:</label>
                <select v-if="consignacion.banco === 'Obligaciones financieras'" class="form-control" v-model="consignacion.proveedor" required>
                  <option disabled value="">Seleccione un banco</option>
                  <option v-for="banco in obligacionesOptions" :key="banco" :value="banco">{{ banco }}</option>
                </select>
                <select v-else-if="consignacion.banco === 'Proveedores'" class="form-control" v-model="consignacion.proveedor" required>
                  <option disabled value="">Seleccione un proveedor</option>
                  <option v-for="prov in proveedoresOptions" :key="prov" :value="prov">{{ prov }}</option>
                </select>
              </div>

              <div class="form-group mb-3">
                <label for="fechaConsignacion">Fecha de Consignación:</label>
                <input type="date" class="form-control" v-model="consignacion.fechaConsignacion" required />
              </div>

              <div class="form-group mb-3">
                <label for="detalle">Detalle Adicional:</label>
                <textarea class="form-control" v-model="consignacion.detalle"></textarea>
              </div>

              <div class="form-group mb-4">
                <label for="imagen">Adjuntar Imagen:</label>
                <input type="file" class="form-control-file" @change="onFileChange" required />
              </div>

              <div class="text-center">
                <BButton type="submit" variant="danger">Guardar</BButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showImagenModal" class="modal-backdrop" @click="cerrarImagenModal">
      <div class="modal-container-img" @click.stop>
          <span class="close-btn" @click="cerrarImagenModal">&times;</span>
          <div class="zoom-container" @click="toggleZoom($event)">
              <img ref="imagen" :src="`data:${imageContent};base64,${imageBlob}`" :class="{ zoomed: zoomed }" :style="zoomStyles" alt="Imagen subida" />
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
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      tituloMenu: 'Cuadre caja',
      isLoading: false,
      fullPage: true,
      boton: false,
      fecha: new Date().toISOString().slice(0, 10),
      total: 0,
      consignaciones: 0,
      detalleConsignaciones: [],
      sucursal: '',
      showConsignacionModal: false,
      showImagenModal: false,
      image: null,
      imageBlob: null,
      imageContent: null,
      zoomed: false,
      zoomStyles: {},
      consignacion: {
        valor: '',
        banco: '',
        bancoDetalle: '',
        proveedor: '',
        impuestoDetalle: '',
        fechaConsignacion: '',
        detalle: '',
        min: '',
        imei: '',
        planilla: ''
      },
      bancosPrincipales: [
        'Corresponsal Banco de Bogota', 'Saitemp', 'Proveedores', 'Otros bancos',
        'Obligaciones financieras', 'Corresponsal Team (70981) Bancolombia',
        'Corresponsal Elena (70988) Bancolombia', 'Impuestos', 'Volantes Sub',
        'Volantes Agaval', 'Volantes venta grabada', 'Reclamaciones',
        'Venta doble proposito'
      ],
      bancosDetalleOptions: [
        'Bancolombia', 'Bogotá', 'Caja social Team', 'Caja social NPA', 'Davivienda', 'Agrario', 'Adquirencias'
      ],
      impuestosOptions: [
        'IVA', 'ReteIVA', 'Retefuente', 'ICA', 'Predial', 'Cámara de Comercio'
      ],
      proveedoresOptions: [
        '1Hora (HASTECK)', 'Polizas', 'Movictec Tecnología (Relojes)'
      ],
      obligacionesOptions: [
        'Banco de Bogotá', 'Bancolombia', 'Caja Social', 'Davivienda', 'Banco Agrario'
      ],
      detalleHeaders: [
        { key: 'banco', label: 'Banco' },
        { key: 'valor', label: 'Valor' },
        { key: 'estado', label: 'Estado' },
      ]
    };
  },
  computed: {
    diferencia() {
      return this.total - this.consignaciones;
    },
    totalPendiente() {
      return this.detalleConsignaciones
        .filter(c => c.estado === 'pendiente')
        .reduce((sum, c) => sum + (parseFloat(c.valor) || 0), 0);
    }
  },
  methods: {
    formatCurrency(value) {
      if (isNaN(value) || value === null) return '$0.00';
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    toggleZoom(event) {
      const img = this.$refs.imagen;
      if (!img) return;
      const rect = img.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      if (!this.zoomed) {
        this.zoomStyles = { transform: 'scale(2)', transformOrigin: `${x}% ${y}%`, cursor: 'zoom-out' };
        this.zoomed = true;
      } else {
        this.zoomStyles = { transform: 'scale(1)', transformOrigin: 'center center', cursor: 'zoom-in' };
        this.zoomed = false;
      }
    },
    cerrarImagenModal() {
      this.showImagenModal = false;
      this.zoomed = false;
      this.zoomStyles = {};
    },
    getData() {
      if (!this.fecha) {
        this.isLoading = false;
        return;
      }
      this.isLoading = true;
      const path = backendRouter.data + 'select-datos-corresponsal-cajero';
      const data = { fecha: this.fecha, jwt: this.$cookies.get('jwt') };
      axios.post(path, data).then((response) => {
        this.total = parseFloat(response.data.total) || 0;
        this.sucursal = response.data.sucursal;
        this.boton = true;
        this.getDataConsignaciones();
      }).catch(() => {
        this.isLoading = false;
      });
    },
    getDataConsignaciones() {
      if (!this.fecha) return;
      this.isLoading = true;
      const path = backendRouter.data + 'select-consignaciones-corresponsal-cajero';
      const data = { fecha: this.fecha, sucursal: this.sucursal };
      axios.post(path, data).then((response) => {
        this.consignaciones = parseFloat(response.data.total) || 0;
        this.detalleConsignaciones = response.data.detalles;
      }).finally(() => {
        this.isLoading = false;
      });
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
    onFileChange(event) {
      this.image = event.target.files[0];
    },
    async uploadConsignacion() {
      if (this.consignacion.valor > this.diferencia) {
        Swal.fire('Error', 'El valor a consignar no puede ser mayor al disponible en caja.', 'error');
        return;
      }
      const specialCases = ['Reclamaciones', 'Corresponsal Banco de Bogota'];
      this.consignacion.estado = specialCases.includes(this.consignacion.banco) ? 'saldado' : 'pendiente';
      if (this.consignacion.banco === 'Venta doble proposito' && (!this.consignacion.min || !this.consignacion.imei || !this.consignacion.planilla)) {
        Swal.fire('Error', 'Debe llenar los campos MIN, IMEI y planilla.', 'error');
        return;
      }
      const formData = new FormData();
      formData.append('image', this.image);
      formData.append('data', JSON.stringify(this.consignacion));
      formData.append('fecha', this.fecha);
      formData.append('jwt', this.$cookies.get('jwt'));
      formData.append('sucursal', this.sucursal);
      
      const path = backendRouter.data + 'consignacion-corresponsal';
      this.isLoading = true;
      try {
        const response = await axios.post(path, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (response.status === 200) {
          this.showConsignacionModal = false;
          this.getData();
          Swal.fire('Éxito', 'Consignación guardada con éxito', 'success');
        }
      } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al guardar la consignación.', 'error');
      } finally {
        this.isLoading = false;
      }
    }
  },
  components: {
    SidebarMenu,
    Loading,
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
@use './style.scss' as *;

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  .modal-content {
    border: none;
    overflow-y: auto;
  }
}

.modal-container-img {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
}

.close-btn {
  position: absolute;
  top: -10px;
  right: 5px;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 1100;
  text-shadow: 0 1px 3px black;
}

.zoom-container {
  overflow: hidden;
  cursor: zoom-in;
  max-width: 80vw;
  max-height: 85vh;
  img {
    transition: transform 0.3s ease;
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>