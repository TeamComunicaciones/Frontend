<template>
  <div>
    <div class="container py-5">
      <h1 class="mb-4">Análisis de Precios y Variaciones</h1>

      <div class="card shadow-sm filter-bar mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-lg-3 col-md-6"><label class="form-label fw-bold">Listas de Precios</label><VueMultiselect v-model="filtros.listas_precios" :options="opcionesFiltro.listas_precios" :multiple="true" :custom-label="opt => opt.nombre" track-by="id" placeholder="Seleccione listas" /></div>
            <div class="col-lg-3 col-md-6"><label class="form-label fw-bold">Marcas</label><VueMultiselect v-model="filtros.marcas" :options="opcionesFiltro.marcas" :multiple="true" placeholder="Todas las marcas" /></div>
            <div class="col-lg-2 col-md-4">
              <label class="form-label fw-bold">Variación a Fecha</label>
              <select class="form-select" v-model="filtros.fecha_especifica">
                <option :value="null">Última variación</option>
                <option v-for="fecha in opcionesFiltro.fechas_validas" :key="fecha.valor" :value="fecha.valor">
                  {{ fecha.texto }}
                </option>
              </select>
            </div>
            <div class="col-lg-2 col-md-4"><label class="form-label fw-bold">Tendencia</label><select class="form-select" v-model="filtros.filtro_variacion"><option value="">Todas</option><option value="up">Aumentaron</option><option value="down">Bajaron</option><option value="neutral">Neutral</option></select></div>
            <div class="col-lg-2 col-md-4 d-flex align-items-end justify-content-start"><div class="form-check form-switch fs-5 pt-2"><input class="form-check-input" type="checkbox" role="switch" id="promoCheck" v-model="filtros.filtro_promo"><label class="form-check-label" for="promoCheck">Solo Promo</label></div></div>
          </div>
          <div class="row g-3 align-items-end mt-2">
            <div class="col-lg-10 col-md-8">
              <label class="form-label fw-bold">Referencia</label>
              <input type="text" class="form-control" v-model="filtros.referencia" placeholder="Escriba la referencia a buscar...">
            </div>
          </div>
          <hr class="my-3">
          <div class="d-flex justify-content-end gap-2">
            <BButton variant="danger" @click="aplicarFiltros" :disabled="isLoading"><i class="bi bi-search me-2"></i>Buscar</BButton>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="text-center p-5"><div class="spinner-border text-danger" role="status"></div></div>
      
      <div v-else-if="vistaHistorico">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Historial para: <strong>{{ historialActivo.equipo }}</strong></h3>
            <BButton variant="secondary" @click="volverAProductos">← Volver</BButton>
        </div>
        <div class="table-responsive card">
            <table class="table table-striped table-hover align-middle text-center mb-0">
                <thead class="table-light"><tr><th v-for="field in fields" :key="field.key">{{ field.label }}</th></tr></thead>
                <tbody>
                    <tr v-for="item in historialActivo.items" :key="item.fecha">
                        <td v-for="field in fields" :key="field.key">
                            <template v-if="field.key === 'variation'"><div class="d-flex justify-content-center align-items-center gap-2" v-if="item.indicador !== 'neutral'"><span class="text-muted">{{ formatCurrency(item.diferencial) }}</span><span class="d-flex align-items-center gap-1" :class="getVariationTextColor(item.indicador)"><span>{{ item.porcentaje }}%</span><i :class="getVariationIcon(item.indicador)" class="fs-5 fw-bold"></i></span></div><span v-else class="text-warning fs-4">–</span></template>
                            <template v-else>{{ formatCell(item[field.key], field.key) }}</template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
      
      <div v-else>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div v-if="items.length > 0" class="alert alert-light py-2 px-3 mb-0 border"><i class="bi bi-info-circle-fill me-2"></i>Mostrando <strong>{{ items.length }}</strong> resultados. <span v-if="fechaCarga"> Ref: <strong>{{ fechaCarga }}</strong>.</span></div>
            <div v-if="items.length > 0" class="d-flex gap-2">
              <BButton variant="success" @click="descargar"><i class="bi bi-file-earmark-excel-fill me-1"></i> Excel</BButton>
              <BButton variant="danger" @click="exportToPDF"><i class="bi bi-file-earmark-pdf-fill me-1"></i> PDF</BButton>
            </div>
        </div>
        
        <div v-if="filtros.listas_precios.length > 1 && items.length > 0">
          <BTabs content-class="mt-3" fill>
            <BTab v-for="(group, listName) in groupedItems" :key="listName" :title="listName">
              <p class="text-muted small pt-2">{{ group.length }} productos en esta lista.</p>
              <div class="row mt-3">
                <div v-for="item in group" :key="item.equipo + item.nombre_lista" class="col-md-6 col-lg-4 mb-4">
                  <div class="card product-card h-100">
                    <div class="card-header"><h5 class="card-title mb-0">{{ item.equipo }}</h5><div class="variation-badge" :class="getVariationClass(item.indicador)"><i :class="getVariationIcon(item.indicador)"></i><span>{{ item.porcentaje }}%</span></div></div>
                    <div class="card-body py-2">
                      <span v-if="item.Promo" class="badge bg-danger mb-2">PROMO</span>
                      <ul v-if="esListaCosto(item)" class="list-group list-group-flush price-details">
                          <li class="list-group-item"><span>Costo Principal</span><strong>{{ formatCurrency(item.costo) }}</strong></li>
                          <li class="list-group-item"><span>Descuento</span><strong>- {{ formatCurrency(item.descuento) }}</strong></li>
                      </ul>
                      <ul v-else class="list-group list-group-flush price-details">
                          <li class="list-group-item"><span>Equipo sin IVA</span><span>{{ formatCurrency(item['equipo sin IVA']) }}</span></li>
                          <li class="list-group-item"><span>IVA Equipo</span><span>{{ formatCurrency(item['IVA equipo']) }}</span></li>
                          <li class="list-group-item"><span>Precio Simcard</span><span>{{ formatCurrency(item['precio simcard']) }}</span></li>
                          <li class="list-group-item"><span>IVA Simcard</span><span>{{ formatCurrency(item['IVA simcard']) }}</span></li>
                          <li class="list-group-item" v-if="item.indicador !== 'neutral'">
                            <span class="fw-bold" :class="getVariationTextColor(item.indicador)">Diferencia</span>
                            <strong :class="getVariationTextColor(item.indicador)">{{ formatCurrency(item.diferencial) }}</strong>
                          </li>
                          <template v-for="(kit, index) in item.kits" :key="index">
                              <li v-if="kit && kit.nombre && shouldShowKit(item.nombre_lista, kit.nombre)" class="list-group-item">
                                  <span>{{ kit.nombre }}</span><strong>{{ formatCurrency(kit.valor) }}</strong>
                              </li>
                          </template>
                      </ul>
                    </div>
                    <div class="card-footer"><div class="total-price">Total Kit: <span class="total-value">{{ formatCurrency(calculateDynamicTotal(item)) }}</span></div><BButton variant="outline-secondary" size="sm" @click="verHistorico(item)"><i class="bi bi-clock-history me-1"></i> Historial</BButton></div>
                  </div>
                </div>
              </div>
            </BTab>
          </BTabs>
        </div>
        
        <div v-else>
          <div v-if="items.length > 0" class="row">
            <div v-for="item in paginatedItems" :key="item.equipo + item.nombre_lista" class="col-md-6 col-lg-4 mb-4">
              <div class="card product-card h-100">
                <div class="card-header"><h5 class="card-title mb-0">{{ item.equipo }}</h5><div class="variation-badge" :class="getVariationClass(item.indicador)"><i :class="getVariationIcon(item.indicador)"></i><span>{{ item.porcentaje }}%</span></div></div>
                <div class="card-body py-2">
                  <span v-if="item.Promo" class="badge bg-danger mb-2">PROMO</span>
                    <ul v-if="esListaCosto(item)" class="list-group list-group-flush price-details">
                        <li class="list-group-item"><span>Costo Principal</span><strong>{{ formatCurrency(item.costo) }}</strong></li>
                        <li class="list-group-item"><span>Descuento</span><strong>- {{ formatCurrency(item.descuento) }}</strong></li>
                    </ul>
                  <ul v-else class="list-group list-group-flush price-details">
                      <li class="list-group-item"><span>Equipo sin IVA</span><span>{{ formatCurrency(item['equipo sin IVA']) }}</span></li>
                      <li class="list-group-item"><span>IVA Equipo</span><span>{{ formatCurrency(item['IVA equipo']) }}</span></li>
                      <li class="list-group-item"><span>Precio Simcard</span><span>{{ formatCurrency(item['precio simcard']) }}</span></li>
                      <li class="list-group-item"><span>IVA Simcard</span><span>{{ formatCurrency(item['IVA simcard']) }}</span></li>
                      <li class="list-group-item" v-if="item.indicador !== 'neutral'">
                          <span class="fw-bold" :class="getVariationTextColor(item.indicador)">Diferencia</span>
                          <strong :class="getVariationTextColor(item.indicador)">{{ formatCurrency(item.diferencial) }}</strong>
                      </li>
                      <template v-for="(kit, index) in item.kits" :key="index">
                          <li v-if="kit && kit.nombre && shouldShowKit(item.nombre_lista, kit.nombre)" class="list-group-item">
                              <span>{{ kit.nombre }}</span><strong>{{ formatCurrency(kit.valor) }}</strong>
                          </li>
                      </template>
                  </ul>
                </div>
                <div class="card-footer"><div class="total-price">Total Kit: <span class="total-value">{{ formatCurrency(calculateDynamicTotal(item)) }}</span></div><BButton variant="outline-secondary" size="sm" @click="verHistorico(item)"><i class="bi bi-clock-history me-1"></i> Historial</BButton></div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted mt-5 pt-5"><h4>No hay resultados. Por favor, ajusta los filtros y haz clic en "Buscar".</h4></div>
          <div class="d-flex justify-content-center mt-4" v-if="totalRows > perPage && filtros.listas_precios.length <= 1">
            <BPagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import Loading from 'vue-loading-overlay';
import VueMultiselect from 'vue-multiselect';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { BButton, BPagination, BTabs, BTab } from 'bootstrap-vue-next';

export default {
  components: { Loading, BButton, BPagination, VueMultiselect, BTabs, BTab },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      items: [],
      fechaCarga: '',
      currentPage: 1,
      perPage: 12,
      vistaHistorico: false,
      historialActivo: { equipo: '', items: [] },
      fields: [],
      opcionesFiltro: { listas_precios: [], marcas: [], fechas_validas: [] },
      filtros: { listas_precios: [], marcas: [], fecha_especifica: null, filtro_variacion: '', filtro_promo: false, referencia: '' },
    };
  },
  computed: {
    totalRows() {
      return this.filteredItems.length;
    },
    filteredItems() {
      if (!this.filtros.referencia) {
        return this.items;
      }
      const ref = this.filtros.referencia.toLowerCase();
      return this.items.filter(item => item.equipo.toLowerCase().includes(ref));
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    },
    groupedItems() {
      return this.filteredItems.reduce((acc, item) => {
        const listName = item.nombre_lista;
        if (!acc[listName]) {
            acc[listName] = [];
        }
        acc[listName].push(item);
        return acc;
      }, {});
    },
    isCostoSelected() {
        return this.filtros.listas_precios.length === 1 && this.filtros.listas_precios[0].id === 'Costo';
    }
  },
  methods: {
    formatCurrency(v) { if (typeof v !== 'number') return '$0'; return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v); },
    getVariationClass(i) { if (i === 'up') return 'bg-danger text-white'; if (i === 'down') return 'bg-success text-white'; return 'bg-light text-muted'; },
    getVariationIcon(i) { if (i === 'up') return 'bi bi-arrow-up-short'; if (i === 'down') return 'bi bi-arrow-down-short'; return 'bi bi-dash'; },
    getVariationTextColor(i) { if (i === 'up') return 'text-danger'; if (i === 'down') return 'text-success'; return 'text-muted';},
    formatCell(value, key) { if (key && key.toLowerCase().includes('fecha')) { const date = new Date(value); if (!isNaN(date)) { return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }); } } if (typeof value === 'number') { return this.formatCurrency(value); } return value; },
    async getFilterOptions() { this.isLoading = true; try { const path = backendRouter.data + 'get_filtros_precios/'; const token = this.$cookies.get('jwt'); const response = await axios.get(path, { headers: { 'Authorization': `Bearer ${token}` } }); this.opcionesFiltro = response.data; } catch (e) { this.$swal('Error', 'No se pudieron cargar las opciones de filtro.', 'error'); } finally { this.isLoading = false; } },
    async aplicarFiltros() {
      this.isLoading = true;
      this.currentPage = 1;
      this.vistaHistorico = false;
      this.items = [];
      this.fechaCarga = '';
      
      const payload = { ...this.filtros, listas_precios: this.filtros.listas_precios.map(l => l.id) };
      const path = backendRouter.data + 'buscar-precios/';

      try {
        const response = await axios.post(path, {filtros: payload});
        this.items = response.data.data;
        this.fechaCarga = response.data.fecha_actual;
      } catch (e) {
        this.$swal('Error', 'No se pudieron cargar los productos.', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    shouldShowKit(listName, kitName) {
      if (!listName || !kitName) { return false; }
      const list = listName.toLowerCase();
      const kit = kitName.toLowerCase();
      const keywords = ['addi', 'sub', 'fintech', 'valle'];
      const hasKeyword = keywords.some(kw => kit.includes(kw));
      if (!hasKeyword) { return true; }
      if (kit.includes('addi') && list.includes('addi')) return true;
      if (kit.includes('sub') && list.includes('sub')) return true;
      if (kit.includes('fintech') && list.includes('fintech')) return true;
      if (kit.includes('valle') && list.includes('valle')) return true;
      return false;
    },
    esListaCosto(item) {
        return item && item.nombre_lista && item.nombre_lista.toLowerCase() === 'costo';
    },
    calculateDynamicTotal(item) {
        if (!item) return 0;
        if (this.esListaCosto(item)) {
            return item.costo - item.descuento;
        } else {
            const baseTotal = (item['equipo sin IVA'] || 0) +
                                (item['IVA equipo'] || 0) +
                                (item['precio simcard'] || 0) +
                                (item['IVA simcard'] || 0);
            
            let kitTotal = 0;
            if (Array.isArray(item.kits)) {
                const visibleKit = item.kits.find(k => k && k.nombre && this.shouldShowKit(item.nombre_lista, k.nombre));
                if (visibleKit) {
                    kitTotal = visibleKit.valor || 0;
                }
            }
            return baseTotal + kitTotal;
        }
    },
    async verHistorico(item) {
      this.isLoading = true;
      try {
        const path = backendRouter.data + 'lista-productos-prepago-equipo/';
        const response = await axios.post(path, { precio: item.nombre_lista, equipo: item.equipo });
        
        const historicoItems = response.data.data;

        for (let i = 0; i < historicoItems.length; i++) {
            const currentItem = historicoItems[i];
            if (i === historicoItems.length - 1) {
                currentItem.indicador = 'neutral';
                currentItem.diferencial = 0;
                currentItem.porcentaje = 0;
                continue;
            }

            const previousItem = historicoItems[i + 1];

            const totalActual = this.calculateDynamicTotal(currentItem);
            const totalAnterior = this.calculateDynamicTotal(previousItem);

            if (totalAnterior !== 0) {
                const diferencial = totalActual - totalAnterior;
                currentItem.diferencial = diferencial;
                currentItem.porcentaje = Math.round((diferencial / totalAnterior) * 100);
                
                if (diferencial > 0) {
                    currentItem.indicador = 'up';
                } else if (diferencial < 0) {
                    currentItem.indicador = 'down';
                } else {
                    currentItem.indicador = 'neutral';
                }
            } else {
                currentItem.indicador = 'neutral';
                currentItem.diferencial = totalActual;
                currentItem.porcentaje = 0;
            }
        }
        
        this.historialActivo = { equipo: item.equipo, items: historicoItems };

        this.generateTableFields();
        this.vistaHistorico = true;
      } catch (e) { this.$swal('Error', 'No se pudo cargar el historial.', 'error'); } 
      finally { this.isLoading = false; }
    },
    volverAProductos() { this.vistaHistorico = false; this.historialActivo = { equipo: '', items: [] }; },
    generateTableFields() {
      const items = this.historialActivo.items; if (items.length === 0) { this.fields = []; return; }
      const keysToHide = ['indicador', 'diferencial', 'porcentaje', 'Promo', 'nombre_lista', 'kits'];
      const allKeys = new Set(Object.keys(items[0]));
      const filteredKeys = [...allKeys].filter(key => !keysToHide.includes(key));
      this.fields = filteredKeys.map(key => ({ key: key, label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }));
      if (items.some(item => item.indicador)) { if (!this.fields.some(f => f.key === 'variation')) { this.fields.push({ key: 'variation', label: 'Variación' }); } }
    },
    descargar() {
        if (this.filteredItems.length === 0) {
            this.$swal('Aviso', 'No hay datos para exportar.', 'info');
            return;
        }

        // ===== INICIO CAMBIO 2: Lógica condicional para exportar Excel =====
        const isCostoOnly = this.filtros.listas_precios.length === 1 && this.filtros.listas_precios[0].id.toLowerCase() === 'costo';

        if (isCostoOnly) {
            // --- Lógica para exportar solo la lista de Costo ---
            const headers = ['Equipo', 'Costo Principal', 'Descuento', 'Total Kit', 'Diferencial', 'Porcentaje', 'Indicador', 'Promo'];
            const dataRows = this.filteredItems.map(item => [
                item.equipo,
                item.costo,
                item.descuento,
                this.calculateDynamicTotal(item),
                item.diferencial,
                item.porcentaje > 0 ? item.porcentaje / 100 : 0,
                item.indicador,
                item.Promo ? 'Sí' : 'No'
            ]);

            const finalData = [headers, ...dataRows];
            const worksheet = XLSX.utils.aoa_to_sheet(finalData);

            // Aplicar formato a las celdas
            for (let R = 1; R <= dataRows.length; ++R) {
                for (let C = 0; C < headers.length; ++C) {
                    const headerValue = headers[C];
                    const cell = worksheet[XLSX.utils.encode_cell({c: C, r: R})];
                    if (!cell || typeof cell.v !== 'number') continue;
                    
                    if (['Costo Principal', 'Descuento', 'Total Kit', 'Diferencial'].includes(headerValue)) {
                        cell.z = '$ #,##0';
                    } else if (headerValue === 'Porcentaje') {
                        cell.z = '0.00%';
                    }
                }
            }

            worksheet['!cols'] = [{ wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 10 }];
            
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Costos');
            XLSX.writeFile(workbook, `Reporte_Costo_${new Date().toISOString().slice(0,10)}.xlsx`);

        } else {
            // --- Lógica existente para la comparación de múltiples listas ---
            const productosAgrupados = this.filteredItems.reduce((acc, item) => {
                const equipo = item.equipo;
                if (!acc[equipo]) {
                    acc[equipo] = [];
                }
                acc[equipo].push(item);
                return acc;
            }, {});

            const listasDePreciosUnicas = [...new Set(this.filteredItems.map(item => item.nombre_lista))];
            const finalHeaders = ['Diferencial', 'Porcentaje', 'Indicador', 'Promo'];
            
            const header_principal = ['Equipo'];
            const header_secundario = [''];
            const merges = [];
            const kitHeadersPorLista = {};
            let colIndex = 1;

            listasDePreciosUnicas.forEach(lista => {
                const subColumnasBase = ['Precio Simcard', 'IVA Simcard', 'Equipo sin IVA', 'IVA Equipo'];
                let kitHeader = '';
                
                const representativeItem = this.filteredItems.find(i => i.nombre_lista === lista && Array.isArray(i.kits));
                if (representativeItem) {
                    const visibleKit = representativeItem.kits.find(k => k && k.nombre && this.shouldShowKit(lista, k.nombre));
                    if (visibleKit) {
                        kitHeader = visibleKit.nombre;
                        kitHeadersPorLista[lista] = kitHeader;
                    }
                }
                
                const subColumnas = [...subColumnasBase];
                if (kitHeader) {
                    subColumnas.push(kitHeader);
                }
                subColumnas.push('Total Kit');
                
                header_principal.push(lista, ...Array(subColumnas.length - 1).fill(''));
                subColumnas.forEach(subCol => header_secundario.push(subCol));
                merges.push({ s: { r: 0, c: colIndex }, e: { r: 0, c: colIndex + subColumnas.length - 1 } });
                colIndex += subColumnas.length;
            });
            
            finalHeaders.forEach(header => {
                header_principal.push('');
                header_secundario.push(header);
            });
            
            const dataRows = Object.values(productosAgrupados).map(itemsDelEquipo => {
                const firstItem = itemsDelEquipo[0];
                const row = [firstItem.equipo];

                listasDePreciosUnicas.forEach(lista => {
                    const item = itemsDelEquipo.find(i => i.nombre_lista === lista);
                    const isCosto = lista.toLowerCase() === 'costo';

                    if (isCosto) {
                        row.push(item ? item.costo : '');
                        row.push(item ? item.descuento : '');
                        row.push(item ? this.calculateDynamicTotal(item) : '');
                    } else {
                        row.push(item ? item['precio simcard'] : '');
                        row.push(item ? item['IVA simcard'] : '');
                        row.push(item ? item['equipo sin IVA'] : '');
                        row.push(item ? item['IVA equipo'] : '');
                        
                        const kitHeaderName = kitHeadersPorLista[lista];
                        if (kitHeaderName) {
                            let kitValor = '';
                            if (item && Array.isArray(item.kits)) {
                                const visibleKit = item.kits.find(k => k && k.nombre === kitHeaderName);
                                if (visibleKit) {
                                    kitValor = visibleKit.valor;
                                }
                            }
                            row.push(kitValor);
                        }
                        
                        row.push(item ? this.calculateDynamicTotal(item) : '');
                    }
                });

                row.push(firstItem.diferencial);
                row.push(firstItem.porcentaje > 0 ? firstItem.porcentaje / 100 : 0);
                row.push(firstItem.indicador);
                row.push(firstItem.Promo ? 'Sí' : 'No');
                
                return row;
            });

            const finalData = [header_principal, header_secundario, ...dataRows];
            const worksheet = XLSX.utils.aoa_to_sheet(finalData);
            worksheet['!merges'] = merges;
            
            for (let R = 1; R < finalData.length; ++R) {
                for (let C = 0; C < header_secundario.length; ++C) {
                    const headerValue = header_secundario[C];
                    const cell = worksheet[XLSX.utils.encode_cell({c: C, r: R})];
                    if (!cell || !headerValue || typeof cell.v !== 'number') continue;

                    if (['Diferencial', 'Total Kit', 'Precio Simcard', 'IVA Simcard', 'Equipo sin IVA', 'IVA Equipo', 'Costo Principal', 'Descuento'].includes(headerValue) || headerValue.includes('Kit')) {
                        cell.z = '$ #,##0';
                    } else if (headerValue === 'Porcentaje') {
                        cell.z = '0.00%';
                    }
                }
            }

            const colWidths = header_secundario.map(header => ({ wch: header.length > 15 ? header.length + 2 : 15 }));
            colWidths[0] = { wch: 35 };
            worksheet['!cols'] = colWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Comparativa de Precios');
            XLSX.writeFile(workbook, `Comparativa_Precios_${new Date().toISOString().slice(0,10)}.xlsx`);
        }
        // ===== FIN CAMBIO 2 =====
    }, 
    exportToPDF() {
      if (this.filteredItems.length === 0) {
        this.$swal('Aviso', 'No hay datos para exportar.', 'info');
        return;
      }
      this.isLoading = true;
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;
        let y = 15;
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Reporte de Precios y Variaciones', pageWidth / 2, y, { align: 'center' });
        y += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Fecha de Referencia: ${this.fechaCarga}`, pageWidth / 2, y, { align: 'center' });
        y += 12;
        
        const drawCard = (item, startX, startY) => {
          const cardWidth = (pageWidth - margin * 3) / 2;
          const lineSpacing = 4.5;
          const sectionSpacing = 3;
          let calculatedHeight = 0;
          const titleLines = pdf.splitTextToSize(item.equipo, cardWidth - 28);
          
          calculatedHeight += 7;
          calculatedHeight += titleLines.length * 5;
          calculatedHeight += sectionSpacing;
          if (item.Promo) calculatedHeight += 6;
          
          let detailsCount = 0;
          let visibleKits = [];

          if (this.esListaCosto(item)) {
            detailsCount = 2;
          } else {
            detailsCount = 4;
            visibleKits = Array.isArray(item.kits) ? item.kits.filter(kit => this.shouldShowKit(item.nombre_lista, kit.nombre)) : [];
          }
          
          calculatedHeight += detailsCount * lineSpacing;
          calculatedHeight += visibleKits.length * lineSpacing;
          calculatedHeight += 8;
          calculatedHeight += 2;
          
          if (startY + calculatedHeight > pageHeight - margin) {
            return 0;
          }

          let currentY = startY;
          pdf.setDrawColor(222, 226, 230);
          pdf.roundedRect(startX, startY, cardWidth, calculatedHeight, 3, 3, 'S');
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(52, 58, 64);
          currentY += 7;
          pdf.text(titleLines, startX + 5, currentY);
          currentY += titleLines.length * 5;
          
          const badgeColor = item.indicador === 'up' ? [220, 53, 69] : item.indicador === 'down' ? [25, 135, 84] : [108, 117, 125];
          pdf.setFillColor(...badgeColor);
          pdf.roundedRect(startX + cardWidth - 22, startY + 4, 18, 5, 2, 2, 'F');
          pdf.setFontSize(8);
          pdf.setTextColor(255, 255, 255);
          pdf.text(`${item.porcentaje}%`, startX + cardWidth - 13, startY + 7.5, { align: 'center'});
          currentY += sectionSpacing;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          
          if(item.Promo){
            pdf.setFillColor(220, 53, 69);
            pdf.roundedRect(startX + 5, currentY - 2, 15, 5, 2, 2, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.text('PROMO', startX + 12.5, currentY + 1.5, { align: 'center' });
            currentY += 6;
          }
          
          pdf.setTextColor(108, 117, 125);

          if (this.esListaCosto(item)) {
              const details = [
                  {label: 'Costo Principal:', value: this.formatCurrency(item.costo)},
                  {label: 'Descuento:', value: `- ${this.formatCurrency(item.descuento)}`},
              ];
              details.forEach(detail => {
                  pdf.text(detail.label, startX + 5, currentY);
                  pdf.text(detail.value, startX + cardWidth - 5, currentY, { align: 'right' });
                  currentY += lineSpacing;
              });
          } else {
              const details = [
                  {label: 'Equipo s/IVA:', value: this.formatCurrency(item['equipo sin IVA'])},
                  {label: 'IVA Equipo:', value: this.formatCurrency(item['IVA equipo'])},
                  {label: 'Simcard:', value: this.formatCurrency(item['precio simcard'])},
                  {label: 'IVA Simcard:', value: this.formatCurrency(item['IVA simcard'])},
              ];
              details.forEach(detail => {
                  pdf.text(detail.label, startX + 5, currentY);
                  pdf.text(detail.value, startX + cardWidth - 5, currentY, { align: 'right' });
                  currentY += lineSpacing;
              });
              visibleKits.forEach(kit => {
                  pdf.setFont('helvetica', 'bold');
                  pdf.text(`${kit.nombre}:`, startX + 5, currentY);
                  pdf.text(this.formatCurrency(kit.valor), startX + cardWidth - 5, currentY, { align: 'right' });
                  currentY += lineSpacing;
                  pdf.setFont('helvetica', 'normal');
              });
          }

          const diffColor = item.indicador === 'up' ? [220, 53, 69] : item.indicador === 'down' ? [25, 135, 84] : [108, 117, 125];
          pdf.setTextColor(...diffColor);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Diferencial:', startX + 5, currentY);
          pdf.text(this.formatCurrency(item.diferencial), startX + cardWidth - 5, currentY, { align: 'right' });
          
          currentY += 2;
          pdf.setDrawColor(222, 226, 230);
          pdf.line(startX, currentY, startX + cardWidth, currentY);
          currentY += 5;
          
          pdf.setTextColor(52, 58, 64);
          pdf.setFontSize(10);
          pdf.text('Total Kit:', startX + 5, currentY);
          pdf.setTextColor(223, 17, 21);
          pdf.text(this.formatCurrency(this.calculateDynamicTotal(item)), startX + cardWidth - 5, currentY, { align: 'right' });
          
          return calculatedHeight;
        }

        let x = margin;
        for (let i = 0; i < this.filteredItems.length; i++) {
          const item = this.filteredItems[i];
          let drawnHeight = drawCard(item, x, y);
          
          if (drawnHeight === 0) {
            pdf.addPage();
            y = margin + 10;
            x = margin;
            drawnHeight = drawCard(item, x, y);
          }
          
          if (i % 2 === 0) {
            x = margin + (pageWidth - margin * 3) / 2 + margin;
          } else {
            x = margin;
            y += drawnHeight + 5;
          }
        }
        
        // ===== INICIO CAMBIO 1: Corregir extensión del archivo PDF =====
        pdf.save(`Busqueda_Precios_${new Date().toISOString().slice(0,10)}.pdf`);
        // ===== FIN CAMBIO 1 =====

      } catch (error) {
        console.error("Error al generar el PDF:", error);
        this.$swal('Error', 'Ocurrió un error inesperado al generar el PDF.', 'error');
      } finally {
        this.isLoading = false;
      }
    }
  },
  created() {
    this.getFilterOptions();
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style lang="scss" scoped>
.filter-bar { 
  background-color: #f8f9fa; 
}

.product-card {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.75rem 1rem;
}

.card-body { 
  flex-grow: 1; 
}

.card-title { 
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0; 
}

.card-footer { 
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center; 
}

.price-details .list-group-item { 
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border: none;
  font-size: 0.9rem;
  color: #6c757d; 
}

.total-price { 
  font-size: 1.2rem;
  font-weight: bold;
  color: #343a40; 
}

.total-value { 
  color: #DF1115; 
}

.variation-badge { 
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.6rem;
  border-radius: 50rem;
  display: flex;
  align-items: center;
  gap: 0.25rem; 
}
</style>