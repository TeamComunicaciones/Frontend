<template>
  <div>
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>

    <div class="container py-5">
      <div v-if="items.length === 0 && !showDuplicadosModal" class="row justify-content-center">
        <div class="col-md-8">
          <div class="card text-center shadow-sm">
            <div class="card-body p-5">
              <IBiFileEarmarkArrowUp class="display-1 text-danger mb-3" />
              <h2 class="card-title">Cargar Archivo de Transacciones</h2>
              <p class="text-muted">Selecciona el archivo de Excel para analizar y guardar los registros.</p>
              <div class="mt-4">
                <label for="archivoExcel" class="btn btn-danger btn-lg">
                  <IBiUpload class="me-2" /> Seleccionar Archivo
                </label>
                <input id="archivoExcel" type="file" @change="subirExcel" class="d-none">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="items.length > 0">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">Registros a Procesar</h2>
          <div>
            <BButton variant="secondary" @click="resetCarga" class="me-2">
              <IBiArrowRepeat class="me-1" /> Cargar Otro Archivo
            </BButton>
            <BButton variant="danger" @click="guardar">
              <IBiSave class="me-1" /> Guardar {{ items.length }} Registros
            </BButton>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered table-hover mt-3">
            <thead class="table-light-custom">
              <tr><th v-for="titulo in titulos" :key="titulo">{{ titulo }}</th></tr>
              <tr>
                <th v-for="titulo in titulos" :key="'filter-' + titulo">
                  <input v-if="esColumnaFecha(titulo)" type="date" class="form-control form-control-sm" v-model="filtros[titulo]" @input="currentPage = 1" />
                  <select v-else-if="esColumnaSelect(titulo)" class="form-select form-select-sm" v-model="filtros[titulo]" @change="currentPage = 1">
                    <option value="">Todos</option>
                    <option v-for="opcion in getValoresUnicos(titulo)" :key="opcion" :value="opcion">{{ opcion }}</option>
                  </select>
                  <input v-else type="text" class="form-control form-control-sm" v-model="filtros[titulo]" @input="currentPage = 1" placeholder="Filtrar..." />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in paginatedItems" :key="rowIndex">
                <td v-for="(cell, colIndex) in row" :key="colIndex">{{ formatCelda(cell, titulos[colIndex]) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="text-muted">Mostrando {{ paginatedItems.length }} de {{ totalRows }} registros</span>
          <BPagination v-if="totalRows > perPage" v-model="currentPage" :total-rows="totalRows" :per-page="perPage" first-text="Primero" prev-text="Anterior" next-text="Siguiente" last-text="Último"/>
        </div>
      </div>
    </div>

    <div v-if="showDuplicadosModal" class="modal-backdrop">
      <div class="modal-container modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registros Duplicados Encontrados</h5>
            <button type="button" class="btn-close" @click="descartarDuplicados"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div>Se encontraron <strong>{{ duplicadosDetectados.length }}</strong> registros que ya existen. Marca los que deseas forzar y añadir de todas formas.</div>
            </div>
            <div class="list-group" style="max-height: 400px; overflow-y: auto;">
              <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <label class="form-check-label fw-bold">Seleccionar Todos</label>
                <input class="form-check-input" type="checkbox" @change="toggleSelectAll" :checked="areAllDuplicatesSelected">
              </div>
              <div v-for="duplicado in duplicadosDetectados" :key="duplicado.linea" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 align-items-center">
                  <input class="form-check-input me-3" type="checkbox" :value="duplicado" v-model="duplicadosParaAnadir">
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                      <h6 class="mb-1">Fila del Excel: {{ duplicado.linea }}</h6>
                      <small class="text-muted">{{ duplicado.razon }}</small>
                    </div>
                    <p class="mb-1 small text-muted">{{ duplicado.datos.slice(0, 5).join(' | ') }}...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <BButton variant="secondary" @click="descartarDuplicados">Continuar sin Añadir</BButton>
            <BButton variant="danger" @click="confirmarSeleccionDuplicados">
              Añadir {{ duplicadosParaAnadir.length }} Seleccionados y Continuar
            </BButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import readXlsFile from 'read-excel-file';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BButton, BPagination } from 'bootstrap-vue-next';

export default {
  components: { Loading, BButton, BPagination },
  data() {
    return {
      isLoading: false, fullPage: true, items: [], registrosDivididos: [], titulos: [],
      filtros: {}, currentPage: 1, perPage: 50, valoresUnicosCache: {},
      columnasConDropdown: ['operacion', 'esquema'],
      showDuplicadosModal: false, duplicadosDetectados: [], duplicadosParaAnadir: [], itemsTemporales: [],
    };
  },
  computed: {
    itemsFiltrados() {
      const activeFilters = Object.entries(this.filtros).filter(([, value]) => value && value.length > 0);
      if (activeFilters.length === 0) return this.items;
      return this.items.filter(row => activeFilters.every(([titulo, filtroValue]) => {
        const colIndex = this.titulos.indexOf(titulo);
        if (colIndex === -1) return true;
        const cellValue = row[colIndex];
        if (this.esColumnaFecha(titulo) && cellValue instanceof Date) {
          return cellValue.toISOString().split('T')[0] === filtroValue;
        }
        const v = String(cellValue || '').toLowerCase();
        const f = String(filtroValue).toLowerCase();
        return this.esColumnaSelect(titulo) ? v === f : v.includes(f);
      }));
    },
    totalRows() { return this.itemsFiltrados.length; },
    paginatedItems() { const start = (this.currentPage - 1) * this.perPage; const end = start + this.perPage; return this.itemsFiltrados.slice(start, end); },
    areAllDuplicatesSelected() {
      return this.duplicadosDetectados.length > 0 && this.duplicadosParaAnadir.length === this.duplicadosDetectados.length;
    }
  },
  methods: {
    toggleSelectAll() {
      if (this.areAllDuplicatesSelected) {
        this.duplicadosParaAnadir = [];
      } else {
        this.duplicadosParaAnadir = [...this.duplicadosDetectados];
      }
    },
    resetCarga() { this.items = []; this.titulos = []; this.filtros = {}; this.registrosDivididos = []; if(document.getElementById("archivoExcel")) document.getElementById("archivoExcel").value = ""; },
    esColumnaFecha(titulo) { return titulo.toLowerCase().includes('fecha'); },
    esColumnaSelect(titulo) { return this.columnasConDropdown.includes(titulo.toLowerCase()); },
    getValoresUnicos(titulo) { if (this.valoresUnicosCache[titulo]) return this.valoresUnicosCache[titulo]; const colIndex = this.titulos.indexOf(titulo); if (colIndex === -1) return []; const uniqueValues = new Set(this.items.map(row => row[colIndex]).filter(val => val !== null && val !== '')); const sortedValues = [...uniqueValues].sort(); this.valoresUnicosCache[titulo] = sortedValues; return sortedValues; },
    formatCelda(cell, titulo) { if (cell instanceof Date && this.esColumnaFecha(titulo)) { return cell.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }); } return cell; },
    subirExcel(event) { const input = event.target; if (!input.files[0]) return; this.currentPage = 1; this.valoresUnicosCache = {}; readXlsFile(input.files[0]).then((rows) => { if (rows.length < 2) { Swal.fire('Error', 'El archivo está vacío o no tiene datos.', 'error'); return; } this.titulos = rows[0]; const datos = rows.slice(1); this.filtros = {}; this.titulos.forEach(titulo => { this.filtros[titulo] = ''; }); this.analizarDuplicados(this.titulos, datos); }); },
    async analizarDuplicados(cabecera, items) {
      this.isLoading = true;
      const path = backendRouter.data + 'guardar-datos-corresponsal';
      const data = { action: 'analyze', cabecera, items };
      try {
        const response = await axios.post(path, data);
        const { duplicados, items_filtrados, cabecera: nuevaCabecera } = response.data;
        this.titulos = nuevaCabecera;
        if (duplicados && duplicados.length > 0) {
          this.duplicadosDetectados = duplicados;
          this.itemsTemporales = items_filtrados;
          this.showDuplicadosModal = true;
        } else {
          this.items = items_filtrados;
          this.dividirRegistros();
        }
      } catch (error) { Swal.fire({ icon: 'error', title: 'Error al procesar el archivo', text: 'Verifica el formato del archivo.' }); } finally { this.isLoading = false; }
    },
    confirmarSeleccionDuplicados() {
      const filasParaAnadir = this.duplicadosParaAnadir.map(d => d.datos);
      this.items = [...this.itemsTemporales, ...filasParaAnadir].sort((a, b) => a[0] - b[0]);
      this.dividirRegistros();
      this.cerrarModalDuplicados();
    },
    descartarDuplicados() {
      this.items = this.itemsTemporales;
      this.dividirRegistros();
      this.cerrarModalDuplicados();
    },
    cerrarModalDuplicados() {
      this.showDuplicadosModal = false;
      this.duplicadosDetectados = [];
      this.duplicadosParaAnadir = [];
      this.itemsTemporales = [];
    },
    dividirRegistros() { const tamanoBloque = 3000; this.registrosDivididos = []; for (let i = 0; i < this.items.length; i += tamanoBloque) { this.registrosDivididos.push(this.items.slice(i, i + tamanoBloque)); } },
    async guardar() { if(this.registrosDivididos.length === 0) { Swal.fire('Información', 'No hay registros nuevos para guardar.', 'info'); return; } this.isLoading = true; const path = backendRouter.data + 'guardar-datos-corresponsal'; const promesas = this.registrosDivididos.map((bloque) => { return axios.post(path, { action: 'save', cabecera: this.titulos, items: bloque }).then(() => ({ success: true })).catch(error => { console.error(`Error en un bloque:`, error); return { success: false }; }); }); const resultados = await Promise.all(promesas); const exitosos = resultados.filter(r => r.success).length; const errores = resultados.length - exitosos; this.isLoading = false; if (errores === 0) { Swal.fire('Éxito', 'Todos los registros fueron procesados.', 'success'); this.resetCarga(); } else { Swal.fire('Proceso Terminado con Errores', `${exitosos} bloques guardados con éxito. ${errores} bloques fallaron.`, 'warning'); } },
  },
};
</script>

<style scoped>
.table-wrapper { width: 95%; overflow-x: auto; margin: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
thead.table-light-custom th { position: sticky; top: 0; background-color: #f8f9fa; z-index: 2; }
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1050; }
.modal-container { background: white; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 90%; max-width: 800px; max-height: 90vh; display: flex; flex-direction: column; }
.modal-content { border: none; }
.modal-body { overflow-y: auto; }
.modal-footer { border-top: 1px solid #dee2e6; background-color: #f8f9fa; padding: 1rem; }
</style>