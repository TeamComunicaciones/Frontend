<template>
  <div>
    <div class="vld-parent">
      <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    </div>

    <div class="container mt-4">
      <BCard>
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="mb-0">{{ tituloMenu }}</h4>
            <BButton
              variant="secondary"
              @click="descargarUltimoExcel"
              :disabled="!ultimoExcelDisponible"
            >
              <i class="bi bi-download me-2"></i>Descargar Último Generado
            </BButton>
          </div>
        </template>

        <!-- PASO 1 -->
        <BCard no-body class="mb-4">
          <BCard-header>Paso 1: Cargar Archivo Excel</BCard-header>
          <BCard-body>
            <div class="row">
              <div class="col">
                <input
                  class="form-control"
                  id="archivoExcel"
                  type="file"
                  @change="subirExcel"
                  accept=".xlsx, .xls"
                >
              </div>
            </div>
          </BCard-body>
        </BCard>

        <!-- CONTENIDO CUANDO HAY ITEMS -->
        <div v-if="items.length > 0">
          <!-- PASO 2 -->
          <BCard no-body class="mb-4">
            <BCard-header>Paso 2: Procesar Datos</BCard-header>
            <BCard-body>
              <div class="d-flex justify-content-center gap-2 mb-3">
                <BButton
                  variant="danger"
                  @click="traducir"
                  :disabled="pasoTraduccionCompleto"
                >
                  <i class="bi bi-translate me-2"></i>Traducir Nombres
                </BButton>
                <BButton
                  variant="danger"
                  @click="guardarPrecios"
                  :disabled="!pasoTraduccionCompleto || pasoGuardadoCompleto"
                >
                  <i class="bi bi-save me-2"></i>Guardar en Sistema
                </BButton>
                <BButton
                  variant="dark"
                  @click="generarYDescargarExcel"
                  :disabled="!pasoGuardadoCompleto"
                >
                  <i class="bi bi-file-earmark-excel me-2"></i>Generar y Descargar Excel
                </BButton>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Buscar en la tabla..."
                v-model="searchQuery"
              />
            </BCard-body>
          </BCard>

          <!-- PASO 3: EXCEPCIONES DE IVA (solo después de traducir) -->
          <BCard
            v-if="items.length > 0 && pasoTraduccionCompleto"
            no-body
            class="mb-4"
          >
            <BCard-header class="d-flex justify-content-between align-items-center">
              <span>Paso 3: Excepciones de IVA</span>
              <BButton
                size="sm"
                variant="outline-secondary"
                @click="gestionExcepcionesAbierta = !gestionExcepcionesAbierta"
              >
                <i :class="['bi', gestionExcepcionesAbierta ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
                <span class="ms-1">Gestionar</span>
              </BButton>
            </BCard-header>

            <BCard-body v-if="gestionExcepcionesAbierta">
              <p class="small text-muted mb-2">
                Marca los productos que <strong>siempre</strong> deben calcular IVA, aunque no cumplan la regla general del valor mínimo.
              </p>

              <div class="row mb-2">
                <div class="col-12 col-md-6">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Filtrar productos..."
                    v-model="searchProductoExcepcion"
                  />
                </div>
              </div>

              <div class="table-responsive" style="max-height: 250px;">
                <table class="table table-sm table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th class="text-center">Forzar IVA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="producto in productosFiltradosExcepcion" :key="producto">
                      <td>{{ producto }}</td>
                      <td class="text-center">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :checked="isProductoExcepcion(producto)"
                          @change="toggleExcepcionIVA(producto)"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </BCard-body>
          </BCard>

          <!-- VISTA PREVIA -->
          <BCard no-body>
            <BCard-header>Vista Previa de Datos</BCard-header>
            <div class="table-responsive">
              <table class="table table-striped table-bordered mb-0">
                <thead class="table-dark">
                  <tr>
                    <th v-for="header in titulos" :key="header">{{ header }}</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, rowIndex) in filteredItems"
                    :key="rowIndex"
                    :class="{ 'iva-excepcion-row': isProductoExcepcion(row[titulos[0]]) }"
                  >
                    <td
                      v-for="(key, cellIndex) in Object.keys(row).filter(k => k !== 'editing')"
                      :key="cellIndex"
                    >
                      <span v-if="!row.editing">{{ row[key] }}</span>
                      <input
                        v-else
                        type="text"
                        v-model="row[key]"
                        class="form-control form-control-sm"
                      />
                    </td>
                    <td>
                      <BButton
                        variant="secondary"
                        size="sm"
                        @click="toggleEditRow(row)"
                        class="me-2"
                      >
                        <i :class="['bi', row.editing ? 'bi-check-lg' : 'bi-pencil']"></i>
                      </BButton>
                      <BButton
                        variant="danger"
                        size="sm"
                        @click="eliminarFila(rowIndex)"
                      >
                        <i class="bi bi-trash"></i>
                      </BButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </BCard>
        </div>
      </BCard>
    </div>

    <!-- MODAL TRADUCCIÓN FALTANTES -->
    <BModal
      v-model="showMissingProductModal"
      title="Producto No Encontrado"
      hide-footer
      centered
    >
      <p>
        El producto <strong>"{{ form.product }}"</strong> no se encontró. Por favor, proporciona una traducción o acción.
      </p>
      <div class="form-group mb-2">
        <label for="translate">Nombre en Stok (Traducción)</label>
        <input
          type="text"
          class="form-control"
          id="translate"
          placeholder="Ej: SAMSUNG A14 128GB"
          v-model.trim="form.stok"
        >
      </div>
      <div class="form-check form-switch mb-2">
        <input
          type="checkbox"
          class="form-check-input"
          id="IVA"
          v-model="form.iva"
          role="switch"
        >
        <label for="IVA" class="form-check-label">Aplica IVA</label>
      </div>
      <div class="form-check form-switch mb-3">
        <input
          type="checkbox"
          class="form-check-input"
          id="ACTIVO"
          v-model="form.active"
          role="switch"
        >
        <label for="ACTIVO" class="form-check-label">Producto Activo</label>
      </div>
      <div class="d-flex justify-content-end gap-2">
        <BButton variant="secondary" @click="omitirTranslate">Omitir</BButton>
        <BButton variant="dark" @click="addToBlacklist">Añadir a Lista Negra</BButton>
        <BButton variant="danger" @click="crearTranslate">Crear Traducción</BButton>
      </div>
    </BModal>
  </div>
</template>

<script>
import axios from 'axios';
import readXlsFile from 'read-excel-file';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import router from '@/router';
import Loading from 'vue-loading-overlay';
import Swal from 'sweetalert2';
import { BButton, BCard, BCardBody, BCardHeader, BModal } from 'bootstrap-vue-next';
import * as XLSX from 'xlsx';

export default {
  components: {
    Loading,
    BButton,
    BCard,
    BCardBody,
    BCardHeader,
    BModal,
  },
  data() {
    return {
      tituloMenu: 'Gestor de Precios',
      items: [],
      titulos: [],
      missing: [],
      cont: 0,
      form: {
        product: '',
        stok: '',
        iva: true,
        active: true,
      },
      isLoading: false,
      fullPage: true,
      searchQuery: '',
      pasoTraduccionCompleto: false,
      pasoGuardadoCompleto: false,
      ultimoExcelDisponible: false,
      showMissingProductModal: false,

      // Gestión de excepciones de IVA
      gestionExcepcionesAbierta: false,
      searchProductoExcepcion: '',
      ivaExcepciones: [], // nombres de productos que siempre llevan IVA
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      const query = this.searchQuery.toLowerCase();
      return this.items.filter(row =>
        Object.values(row).some(cell =>
          cell && cell.toString().toLowerCase().includes(query)
        )
      );
    },

    // Lista única de productos (asumiendo que la primera columna es el nombre)
    productosUnicos() {
      if (!this.titulos.length) return [];
      const keyProducto = this.titulos[0];
      const set = new Set();
      this.items.forEach(row => {
        const nombre = row[keyProducto];
        if (nombre) set.add(nombre);
      });
      return Array.from(set);
    },

    // Productos filtrados para el gestor de excepciones de IVA
    productosFiltradosExcepcion() {
      if (!this.searchProductoExcepcion) return this.productosUnicos;
      const q = this.searchProductoExcepcion.toLowerCase();
      return this.productosUnicos.filter(p =>
        p && p.toLowerCase().includes(q)
      );
    },
  },
  methods: {
    subirExcel(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.isLoading = true;
      readXlsFile(file).then((rows) => {
        this.resetState();
        this.titulos = rows[0];
        const headers = this.titulos;

        this.items = rows.slice(1).map(row => {
          const item = {};
          headers.forEach((header, index) => {
            item[header] = row[index];
          });
          item.editing = false;
          return item;
        });

        this.isLoading = false;
      }).catch(error => {
        this.isLoading = false;
        Swal.fire('Error', 'No se pudo leer el archivo Excel.', 'error');
        console.error(error);
      });
    },

    traducir() {
      this.isLoading = true;
      const dataForBackend = this.items.map(item => this.titulos.map(h => item[h]));
      const path = backendRouter.data + 'translate-prepago';

      axios.post(path, dataForBackend).then((response) => {
        this.isLoading = false;
        if (!response.data.validate) {
          this.missing = response.data.data;
          this.cont = 0;
          this.procesarSiguienteFaltante();
        } else {
          this.titulos = response.data.cabecera.map(item => item.text);
          this.items = response.data.data.map(rowArray => {
            const item = {};
            this.titulos.forEach((header, index) => {
              item[header] = rowArray[index];
            });
            item.editing = false;
            return item;
          });
          this.pasoTraduccionCompleto = true;
          Swal.fire('Éxito', 'Todos los productos han sido traducidos.', 'success');
        }
      }).catch(error => {
        this.isLoading = false;
        Swal.fire('Error', 'Ocurrió un error durante la traducción.', 'error');
        console.error(error);
      });
    },

    procesarSiguienteFaltante() {
      if (this.cont >= this.missing.length) {
        this.showMissingProductModal = false;
        Swal.fire('Completado', 'Se han procesado todos los productos pendientes.', 'info');
        this.traducir();
        return;
      }
      this.form.product = this.missing[this.cont];
      this.form.stok = '';
      this.showMissingProductModal = true;
    },

    crearTranslate() {
      this.isLoading = true;
      const data = {
        equipo: this.form.product,
        stok: this.form.stok,
        iva: this.form.iva,
        active: this.form.active,
      };
      const path = backendRouter.data + 'translate-products-prepago';
      axios.post(path, data).then(() => {
        this.isLoading = false;
        this.cont++;
        this.procesarSiguienteFaltante();
      }).catch(error => {
        this.isLoading = false;
        Swal.fire('Error', error.response?.data?.detail || 'No se pudo crear la traducción.', 'error');
      });
    },

    omitirTranslate() {
      const productoOmitido = this.missing[this.cont];
      this.items = this.items.filter(item => item[this.titulos[0]] !== productoOmitido);
      this.cont++;
      this.procesarSiguienteFaltante();
    },

    async addToBlacklist() {
      const productoOmitido = this.missing[this.cont];
      this.items = this.items.filter(item => item[this.titulos[0]] !== productoOmitido);
      this.cont++;
      this.showMissingProductModal = false;
      setTimeout(() => this.procesarSiguienteFaltante(), 100);
    },

    guardarPrecios() {
      this.isLoading = true;
      const cabecera = this.titulos.map((text, index) => ({ text, value: index }));
      const itemsParaGuardar = this.items.map(item => this.titulos.map(h => item[h]));

      const data = {
        cabecera,
        items: itemsParaGuardar,
        iva_excepciones: this.ivaExcepciones, // envío de productos que siempre llevan IVA
      };

      const path = backendRouter.data + 'guardar-precios';

      axios.post(path, data).then(() => {
        this.isLoading = false;
        this.pasoGuardadoCompleto = true;
        Swal.fire('Guardado', 'Los precios se han guardado exitosamente en el sistema.', 'success');
      }).catch(error => {
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron guardar los precios.', 'error');
      });
    },

    generarYDescargarExcel() {
      this.isLoading = true;
      const path = backendRouter.data + 'excel-precios';

      const cabeceraParaBackend = this.titulos.map((titulo, index) => ({
        text: titulo,
        value: index,
      }));

      const itemsParaBackend = this.items.map(filaObjeto => {
        return this.titulos.map(titulo => filaObjeto[titulo]);
      });

      const payload = {
        items: itemsParaBackend,
        cabecera: cabeceraParaBackend,
      };

      axios.post(path, payload).then(response => {
        const excelData = response.data.excel;

        try {
          localStorage.setItem('ultimoExcelGenerado', JSON.stringify(excelData));
          localStorage.setItem(
            'ultimoExcelNombre',
            `precios_${new Date().toISOString().split('T')[0]}.xlsx`
          );
          this.ultimoExcelDisponible = true;
          Swal.fire(
            'Generado',
            'El archivo Excel está listo y se ha guardado para futuras descargas.',
            'success'
          );
        } catch (e) {
          console.error('Error guardando en localStorage:', e);
          Swal.fire('Advertencia', 'No se pudo guardar el archivo para futuras descargas.', 'warning');
        }

        this.descargarDesdeJSON(excelData, 'precios_generados.xlsx');
        this.isLoading = false;
      }).catch(error => {
        this.isLoading = false;
        console.error('Error en la respuesta del backend:', error.response);
        Swal.fire('Error', 'No se pudo generar el archivo Excel desde el servidor.', 'error');
      });
    },

    descargarUltimoExcel() {
      const dataJSON = localStorage.getItem('ultimoExcelGenerado');
      const fileName = localStorage.getItem('ultimoExcelNombre') || 'precios_guardados.xlsx';
      if (dataJSON) {
        try {
          const data = JSON.parse(dataJSON);
          this.descargarDesdeJSON(data, fileName);
        } catch (e) {
          Swal.fire('Error', 'El archivo guardado parece estar corrupto.', 'error');
        }
      } else {
        Swal.fire('No encontrado', 'No hay ningún archivo Excel guardado para descargar.', 'info');
      }
    },

    descargarDesdeJSON(data, fileName) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Precios');
      XLSX.writeFile(workbook, fileName);
    },

    toggleEditRow(row) {
      row.editing = !row.editing;
    },

    eliminarFila(index) {
      this.items.splice(index, 1);
    },

    // Excepciones de IVA
    isProductoExcepcion(nombreProducto) {
      return this.ivaExcepciones.includes(nombreProducto);
    },

    toggleExcepcionIVA(nombreProducto) {
      const idx = this.ivaExcepciones.indexOf(nombreProducto);
      if (idx === -1) {
        this.ivaExcepciones.push(nombreProducto);
      } else {
        this.ivaExcepciones.splice(idx, 1);
      }
    },

    resetState() {
      this.items = [];
      this.titulos = [];
      this.missing = [];
      this.cont = 0;
      this.pasoTraduccionCompleto = false;
      this.pasoGuardadoCompleto = false;
      this.searchQuery = '';

      // limpiar gestión de excepciones
      this.ivaExcepciones = [];
      this.searchProductoExcepcion = '';
      this.gestionExcepcionesAbierta = false;
    },

    verificarUltimoExcel() {
      if (localStorage.getItem('ultimoExcelGenerado')) {
        this.ultimoExcelDisponible = true;
      }
    },
  },
  mounted() {
    this.verificarUltimoExcel();
  },
};
</script>

<style scoped>
.form-check-input:checked {
  background-color: #df1115;
  border-color: #df1115;
}

.table-responsive {
  max-height: 60vh;
}

th {
  position: sticky;
  top: 0;
  z-index: 1;
}

/* Resaltado visual para filas con excepción de IVA */
.iva-excepcion-row {
  background-color: rgba(223, 17, 21, 0.08);
}
</style>
