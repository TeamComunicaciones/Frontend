<template>
  <div class="bg-light">
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Dashboard de Asesor</h1>
      </div>
      
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <fieldset :disabled="isLoadingReport">
            <div class="row g-3 align-items-end">
              <div class="col-md-4">
                <label for="filtroPdv" class="form-label fw-bold">Punto de Venta</label>
                <v-select
                  id="filtroPdv"
                  v-model="filters.idpos"
                  placeholder="Buscar por nombre o ID..."
                  :options="pdvOptions"
                  :get-option-label="(option) => `${option.punto_de_venta} (${option.idpos})`"
                  :reduce="(option) => option.idpos"
                  :clearable="false"
                >
                  <template #no-options>
                    No se encontraron puntos de venta.
                  </template>
                </v-select>
              </div>
              <div class="col-md-6">
                <label for="filtroMes" class="form-label fw-bold">Mes Pago</label>
                <input type="month" id="filtroMes" class="form-control" v-model="filters.mes">
              </div>
              <div class="col-md-2 d-grid">
                <button class="btn btn-danger" @click="generarReporte(1)" :disabled="isLoadingReport">
                  <span v-if="isLoadingReport" class="spinner-border spinner-border-sm"></span>
                  <span v-else>Generar</span>
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      
      <div v-if="isLoadingReport" class="text-center p-5">
        <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-2">Generando reporte...</p>
      </div>

      <!-- SECCIÓN DE COMISIONES MOVIDA HACIA ARRIBA -->
      <div v-else-if="reportData && reportData.detalle.count > 0" class="animate__animated animate__fadeIn">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-transparent border-0 pt-4 d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Detalle de Comisiones ({{ reportData.detalle.count }} registros)</h4>
            <transition name="fade">
                <div v-if="selectedComisiones.length > 0" class="d-flex align-items-center">
                    <div class="me-3">
                        <span>Seleccionado:</span>
                        <strong class="ms-2 fs-5">{{ formatCurrency(subtotalSeleccionado) }}</strong>
                    </div>
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#paymentModal">Pagar</button>
                </div>
            </transition>
          </div>
          <div class="card-body pt-0">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th class="text-center"><input type="checkbox" class="form-check-input" @change="toggleSelectAll" :checked="isAllSelected"></th>
                    <th>Mes Pago</th>
                    <th>Asesor</th>
                    <th>Detalle</th>
                    <th class="text-end">Valor Comisión</th>
                    <th class="text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in reportData.detalle.results" :key="item.id">
                    <td class="text-center">
                      <input type="checkbox" class="form-check-input" :value="item.id" v-model="selectedComisiones" :disabled="item.estado !== 'Pendiente' && item.estado !== 'Acumulada'">
                    </td>
                    <td>{{ formatMonthYear(item.mes_pago) }}</td>
                    <td>{{ item.asesor_identificador }}</td>
                    <td>{{ item.producto }}</td>
                    <td class="text-end fw-bold">{{ formatCurrency(item.comision_final) }}</td>
                    <td class="text-center"><span :class="['badge', getStatusClass(item.estado)]">{{ item.estado }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-3">
              <ul class="pagination"><li class="page-item" :class="{ disabled: !reportData.detalle.previous }"><a class="page-link" href="#" @click.prevent="generarReporte(currentPage - 1)">Anterior</a></li><li v-for="page in pagesToShow" :key="page" class="page-item" :class="{ active: page === currentPage, disabled: page === '...' }"><a class="page-link" href="#" @click.prevent="generarReporte(page)">{{ page }}</a></li><li class="page-item" :class="{ disabled: !reportData.detalle.next }"><a class="page-link" href="#" @click.prevent="generarReporte(currentPage + 1)">Siguiente</a></li></ul>
            </nav>
          </div>
        </div>

        <!-- SECCIÓN DE GRÁFICAS -->
        <div class="row mb-4 g-4">
            <div class="col-md-4"><div class="card h-100 shadow-sm border-0"><div class="card-body text-center d-flex flex-column justify-content-center"><h6>Total Comisiones</h6><div class="stat-value">{{ formatCurrency(reportData.kpis.totalComisiones) }}</div></div></div></div>
            <div class="col-md-4"><div class="card h-100 shadow-sm border-0"><div class="card-body text-center d-flex flex-column justify-content-center"><h6>Comisiones Pagadas</h6><div class="stat-value text-success">{{ formatCurrency(reportData.kpis.totalPagado) }}</div></div></div></div>
            <div class="col-md-4"><div class="card h-100 shadow-sm border-0"><div class="card-body text-center d-flex flex-column justify-content-center"><h6>Comisiones Pendientes</h6><div class="stat-value text-warning">{{ formatCurrency(reportData.kpis.totalPendiente) }}</div></div></div></div>
        </div>
        
        <div class="row g-4 mb-4">
            <div class="col-lg-12">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <h5 class="card-title">Distribución por Estado (Filtro)</h5>
                        <div style="position: relative; height: 300px;">
                            <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row g-4 mb-4">
          <div class="col-lg-7">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">Valor Total por Método de Pago (Filtro)</h5>
                <div style="position: relative; height: 300px;">
                  <Bar :data="metodoValorChartData" :options="barChartOptions" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title">Uso de Métodos de Pago (Filtro)</h5>
                <div style="position: relative; height: 300px;">
                  <Doughnut :data="metodoCantidadChartData" :options="pieChartOptions" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-4">
            <div class="col-12"><div class="card border-0 shadow-sm"><div class="card-body"><h5 class="card-title">Comparativa Mes Actual vs Anterior</h5><div class="row g-2 align-items-end mb-3"><div class="col-md-10"><label for="pdvSelector" class="form-label small">Añadir Puntos de Venta a la Comparativa:</label><v-select id="pdvSelector" multiple placeholder="Busca y selecciona uno o más PDV..." v-model="comparativeFilters.selectedPdvs" :options="comparativeOptions" :get-option-label="(option) => option.punto_de_venta" :reduce="(option) => option.punto_de_venta"><template #no-options>No hay PDV para mostrar.</template></v-select></div><div class="col-md-2 d-grid"><button class="btn btn-secondary" @click="fetchComparativeData" :disabled="isLoadingComparative"><span v-if="isLoadingComparative" class="spinner-border spinner-border-sm"></span><span v-else>Actualizar</span></button></div></div><div v-if="comparativeChartData.labels.length > 0"><Bar :data="comparativeChartData" :options="comparativeChartOptions" /></div><div v-else class="text-center p-4"><p>No hay datos comparativos para mostrar.</p></div></div></div></div>
        </div>
      </div>

      <div v-else-if="reportData && reportData.detalle.count === 0" class="text-center p-5 border rounded bg-white mt-4">
        <p class="fs-4 mb-1">Sin Resultados</p>
        <p>No hay registros para este mes con los filtros seleccionados.</p>
      </div>

      <div v-else class="text-center p-5 border rounded bg-white mt-4">
        <p class="fs-4 mb-1">Bienvenido al Dashboard</p>
        <p>Selecciona un mes y haz clic en "Generar" para ver los resultados.</p>
      </div>
    </div>

    <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="paymentModalLabel">Confirmar Pago de Comisiones</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="card bg-light border-0 mb-4">
                        <div class="card-body p-2 p-md-3">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                                    <span>Total a Pagar:</span>
                                    <strong class="fs-5">{{ formatCurrency(subtotalSeleccionado) }}</strong>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                                    <span>Total Ingresado:</span>
                                    <strong class="fs-5">{{ formatCurrency(totalIngresado) }}</strong>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0 fw-bold fs-5" :class="restanteClass">
                                    <span>Restante:</span>
                                    <span>{{ formatCurrency(restante) }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <h6 class="mb-3">Desglose del Pago</h6>
                    <div class="row">
                        <div v-for="(value, key) in paymentMethods" :key="key" class="col-12 mb-3">
                            <div class="input-group">
                                <div class="input-group-text">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" role="switch" :id="'switch-' + key" v-model="paymentMethodsEnabled[key]" @change="togglePaymentMethod(key)">
                                    </div>
                                </div>
                                <label :for="'switch-' + key" class="input-group-text flex-grow-1">{{ key }}</label>
                                <input type="number" class="form-control" placeholder="0" v-model.number="paymentMethods[key]" :disabled="!paymentMethodsEnabled[key]">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success" @click="handlePayment">
                        <span v-if="isPaying" class="spinner-border spinner-border-sm"></span>
                        <span v-else>Confirmar y Pagar</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import { useCookies } from "vue3-cookies";
import { useRouter } from 'vue-router';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js';

import apiService from '@/services/apiService';
import backendRouter from '@/components/BackendRouter/BackendRouter';

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

const { cookies } = useCookies();
const router = useRouter();

if (!cookies.get('jwt')) {
    router.push('/login');
}

const filters = reactive({ 
    idpos: 'todos', 
    mes: new Date().toISOString().slice(0, 7)
});

const puntosDeVenta = ref([]);
const reportData = ref(null);
const isLoadingReport = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const page_size = 20;

const comparativeFilters = reactive({ selectedPdvs: ['TOTAL RUTA'] });
const comparativeData = ref([]);
const isLoadingComparative = ref(false);

const selectedComisiones = ref([]);
const isPaying = ref(false);

const paymentMethods = reactive({
    'Sim card recargada': 0, 'Recarga': 0, 'Accesorios': 0,
    'Equipos': 0, 'Cartera': 0, 'Acumulado': 0
});
const paymentMethodsEnabled = reactive({
    'Sim card recargada': false, 'Recarga': false, 'Accesorios': false,
    'Equipos': false, 'Cartera': false, 'Acumulado': false
});

const resetPaymentForm = () => {
    for (const key in paymentMethods) {
        paymentMethods[key] = 0;
        paymentMethodsEnabled[key] = false;
    }
};

const togglePaymentMethod = (key) => {
    if (!paymentMethodsEnabled[key]) {
        paymentMethods[key] = 0;
    }
};

const totalIngresado = computed(() => {
    return Object.values(paymentMethods).reduce((sum, val) => sum + (Number(val) || 0), 0);
});

const subtotalSeleccionado = computed(() => {
    if (!reportData.value || selectedComisiones.value.length === 0) return 0;
    const selectedIds = new Set(selectedComisiones.value);
    let total = 0;
    reportData.value.detalle.results.forEach(group => {
        if (selectedIds.has(group.id)) {
            total += parseFloat(group.comision_final || 0);
        }
    });
    return total;
});

const restante = computed(() => subtotalSeleccionado.value - totalIngresado.value);

const restanteClass = computed(() => {
    if (restante.value < 0) return 'text-danger';
    if (restante.value > 0) return 'text-warning';
    return 'text-success';
});

const isAllSelected = computed(() => {
    if (!reportData.value || !reportData.value.detalle.results || reportData.value.detalle.results.length === 0) return false;
    const selectableIds = reportData.value.detalle.results
        .filter(item => item.estado === 'Pendiente' || item.estado === 'Acumulada')
        .map(item => item.id);
    return selectableIds.length > 0 && selectableIds.every(id => selectedComisiones.value.includes(id));
});

const toggleSelectAll = (event) => {
    if (!reportData.value) return;
    const selectableIds = reportData.value.detalle.results
        .filter(item => item.estado === 'Pendiente' || item.estado === 'Acumulada')
        .map(item => item.id);
    
    if (event.target.checked) {
        selectedComisiones.value = [...new Set([...selectedComisiones.value, ...selectableIds])];
    } else {
        const selectableIdsSet = new Set(selectableIds);
        selectedComisiones.value = selectedComisiones.value.filter(id => !selectableIdsSet.has(id));
    }
};

const comparativeOptions = computed(() => {
    const totalRutaOption = { punto_de_venta: 'TOTAL RUTA', idpos: 'total_ruta_key' };
    return [totalRutaOption, ...puntosDeVenta.value];
});

const pdvOptions = computed(() => {
  const todosOption = { punto_de_venta: '-- Todos mis PDV --', idpos: 'todos' };
  return [todosOption, ...puntosDeVenta.value];
});

watch(() => [...comparativeFilters.selectedPdvs], (newSelection, oldSelection) => {
    if (newSelection.length === 0 || newSelection.length === oldSelection.length) return;
    const lastSelectedItem = newSelection.find(item => !oldSelection.includes(item));
    if (!lastSelectedItem) return;
    if (lastSelectedItem === 'TOTAL RUTA') {
        comparativeFilters.selectedPdvs = ['TOTAL RUTA'];
    } else {
        const selectionWithoutTotal = newSelection.filter(item => item !== 'TOTAL RUTA');
        if (selectionWithoutTotal.length !== newSelection.length) {
            comparativeFilters.selectedPdvs = selectionWithoutTotal;
        }
    }
});

const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const formatMonthYear = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + 'T00:00:00'); 
    return date.toLocaleDateString('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

// --- INICIO: LÓGICA DE GRÁFICOS ---
const baseFont = { family: 'Poppins', size: 12, weight: 500 };
const doughnutChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { ...baseFont } } }, cutout: '60%' };

const comparativeChartMax = computed(() => {
    if (!comparativeData.value || comparativeData.value.length === 0) return 100000;
    const maxVal = Math.max(...comparativeData.value.map(item => Math.max(item.total_mes_anterior || 0, item.total_mes_actual || 0)));
    return maxVal * 1.2;
});

const comparativeChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { ...baseFont } } },
    scales: {
        x: { ticks: { ...baseFont, autoSkip: false, maxRotation: 45, minRotation: 45 }, grid: { display: false } },
        y: {
            ticks: { ...baseFont, callback: (value) => new Intl.NumberFormat('es-CO', { notation: 'compact', compactDisplay: 'short' }).format(value) },
            grid: { color: '#e9ecef' },
            suggestedMax: comparativeChartMax.value
        }
    }
}));

const doughnutChartData = computed(() => {
    const chartInfo = reportData.value?.chart_data?.distribucion_estado || [];
    const colorMap = { 'Acumulada': '#17a2b8', 'Pagada': '#28a745', 'Pendiente': '#ffc107' };
    const labels = chartInfo.map(item => item.estado);
    return { labels, datasets: [{ label: 'Número de Comisiones', data: chartInfo.map(item => item.count), backgroundColor: labels.map(e => colorMap[e] || '#6c757d') }] };
});

const comparativeChartData = computed(() => {
    const chartInfo = comparativeData.value || [];
    return { labels: chartInfo.map(item => item.punto_de_venta), datasets: [{ label: 'Mes Anterior', data: chartInfo.map(item => item.total_mes_anterior || 0), backgroundColor: '#6c757d' }, { label: 'Mes Actual', data: chartInfo.map(item => item.total_mes_actual || 0), backgroundColor: '#DF1115' }] }
});

const barChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: {
            ticks: {
                ...baseFont,
                callback: (value) => new Intl.NumberFormat('es-CO', { notation: 'compact', compactDisplay: 'short' }).format(value)
            },
            grid: { color: '#e9ecef' }
        },
        x: {
            ticks: { ...baseFont },
            grid: { display: false }
        }
    }
}));

const pieChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: { ...baseFont }
        }
    }
}));

const metodoValorChartData = computed(() => {
  const data = reportData.value?.chart_data?.metodos_pago || [];
  return {
    labels: data.map(item => item.metodo),
    datasets: [{
      label: 'Valor Total Pagado',
      data: data.map(item => item.total_valor),
      backgroundColor: [
        'rgba(223, 17, 21, 0.7)',
        'rgba(23, 162, 184, 0.7)',
        'rgba(40, 167, 69, 0.7)',
        'rgba(255, 193, 7, 0.7)',
        'rgba(108, 117, 125, 0.7)',
        'rgba(102, 16, 242, 0.7)',
      ],
      borderWidth: 1
    }]
  };
});

const metodoCantidadChartData = computed(() => {
  const data = reportData.value?.chart_data?.metodos_pago || [];
  return {
    labels: data.map(item => `${item.metodo}`),
    datasets: [{
      data: data.map(item => item.total_cantidad),
      backgroundColor: [
        '#DF1115', '#17a2b8', '#28a745', '#ffc107', '#6c757d', '#6610f2'
      ],
      hoverOffset: 4
    }]
  };
});
// --- FIN: LÓGICA DE GRÁFICOS ---


const fetchPdvFiltro = async () => {
    try {
        const path = backendRouter.data + 'asesor/filtros/';
        const response = await apiService.get(path);
        puntosDeVenta.value = response.data.puntos_de_venta;
    } catch (error) { Swal.fire('Error', 'No se pudieron cargar los filtros de Puntos de Venta.', 'error'); }
};

const generarReporte = async (page = 1) => {
    if (typeof page !== 'number' || page < 1) return;
    isLoadingReport.value = true;
    if (page === 1) {
        reportData.value = null;
        selectedComisiones.value = [];
    }
    currentPage.value = page;
    const params = new URLSearchParams();
    if (filters.idpos !== 'todos') params.append('idpos', filters.idpos);
    if (filters.mes) params.append('mes', filters.mes);
    params.append('page', page);
    try {
        const path = `${backendRouter.data}asesor/reporte/?${params.toString()}`;
        const response = await apiService.get(path);
        reportData.value = response.data;
        totalPages.value = Math.ceil(response.data.detalle.count / page_size);
    } catch (error) {
        reportData.value = null;
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            Swal.fire('Sesión Expirada', 'Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'warning');
            router.push('/login');
        } else {
            Swal.fire('Error', 'No se pudo generar el reporte.', 'error');
        }
    } finally {
        isLoadingReport.value = false;
    }
};

const fetchComparativeData = async () => {
    isLoadingComparative.value = true;
    const params = new URLSearchParams();
    comparativeFilters.selectedPdvs.forEach(pdv => { params.append('pdv', pdv); });
    try {
        const path = `${backendRouter.data}asesor/comparativa/?${params.toString()}`;
        const response = await apiService.get(path);
        comparativeData.value = response.data;
    } catch (error) { Swal.fire('Error', 'No se pudieron cargar los datos comparativos.', 'error'); comparativeData.value = []; } 
    finally { isLoadingComparative.value = false; }
};

const handlePayment = async () => {
    isPaying.value = true;
    
    const metodosPagoActivos = {};
    for (const key in paymentMethods) {
        if (paymentMethodsEnabled[key] && paymentMethods[key] > 0) {
            metodosPagoActivos[key] = paymentMethods[key];
        }
    }

    const selectedGroupIds = new Set(selectedComisiones.value);
    const individualIdsToPay = reportData.value.detalle.results
        .filter(group => selectedGroupIds.has(group.id))
        .flatMap(group => group.individual_ids || []) 
        .filter(id => id !== null && id !== undefined);

    const payload = {
        comision_ids: individualIdsToPay,
        metodos_pago: metodosPagoActivos
    };

    try {
        const path = `${backendRouter.data}asesor/pagar-comisiones/`;
        await apiService.post(path, payload);

        Swal.fire('¡Éxito!', 'Las comisiones han sido pagadas.', 'success');
        
        const modalEl = document.getElementById('paymentModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
            modal.hide();
        }

        selectedComisiones.value = [];
        generarReporte(currentPage.value);

    } catch (error) {
        Swal.fire('Error', 'No se pudo procesar el pago. ' + (error.response?.data?.error || ''), 'error');
    } finally {
        isPaying.value = false;
    }
};

onMounted(() => {
    fetchPdvFiltro();
    fetchComparativeData();

    const paymentModalEl = document.getElementById('paymentModal');
    if (paymentModalEl) {
        paymentModalEl.addEventListener('hidden.bs.modal', resetPaymentForm);
    }
});

const pagesToShow = computed(() => {
    const pages = []; const maxPages = 7;
    if (totalPages.value <= maxPages) { for (let i = 1; i <= totalPages.value; i++) pages.push(i); } 
    else { pages.push(1); if (currentPage.value > 4) pages.push('...'); let start = Math.max(2, currentPage.value - 2); let end = Math.min(totalPages.value - 1, currentPage.value + 2); if (currentPage.value <= 4) end = 5; if (currentPage.value >= totalPages.value - 3) start = totalPages.value - 4; for (let i = start; i <= end; i++) pages.push(i); if (currentPage.value < totalPages.value - 3) pages.push('...'); pages.push(totalPages.value); }
    return pages;
});

const getStatusClass = (estado) => {
    if (estado === 'Pagada') return 'bg-success';
    if (estado === 'Acumulada') return 'bg-info text-dark';
    if (estado === 'Pendiente') return 'bg-warning text-dark';
    return 'bg-secondary';
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* --- General Layout & Typography --- */
body {
  font-family: 'Poppins', sans-serif;
}

.bg-light { 
  background-color: #f8f9fa;
}

.container { 
  max-width: 1400px; 
}

h1, h2, h3, h4, h5, h6, .form-label, .btn, p { 
  font-family: 'Poppins', sans-serif; 
  color: #343a40; /* Color de texto más oscuro por defecto */
}

h1 { 
  font-weight: 700; 
}

/* --- Card Styling --- */
.card { 
  border-radius: 0.75rem; 
  transition: all 0.2s ease-in-out;
  border: none;
}

.card-body {
  padding: 1.75rem;
}

.card-body.pt-0 {
  padding-top: 0 !important;
}


/* --- KPI Stat Cards --- */
.stat-value { 
  font-size: 2.25rem; 
  font-weight: 700; 
  color: #DF1115; 
}
.stat-value.text-success { color: #198754 !important; }
.stat-value.text-warning { color: #ffc107 !important; }

/* --- Table Styling --- */
.table { 
  font-size: 0.9rem; 
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}
.table th, .table td { 
  vertical-align: middle; 
  padding: 0.9rem 1rem;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.table tr {
  border-radius: 0.5rem;
  overflow: hidden;
}

.table td:first-child, .table th:first-child {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
.table td:last-child, .table th:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}


.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #000; /* Color de texto de cabecera cambiado a negro */
  border-bottom: 2px solid #dee2e6;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.table-hover > tbody > tr {
  transition: none;
}
.table-hover > tbody > tr:hover > * {
  background-color: #fbf3f3;
  color: #DF1115;
}

/* --- Pagination Styling --- */
.pagination .page-link {
  border-radius: 0.5rem;
  margin: 0 0.25rem;
  border: none;
  color: #343a40; /* Color de paginación oscurecido */
  font-weight: 500;
}
.pagination .page-link:hover {
  background-color: #e9ecef;
}
.pagination .page-item.active .page-link {
  background-color: #DF1115;
  border-color: #DF1115;
  color: #fff;
  box-shadow: 0 4px 8px rgba(223, 17, 21, 0.2);
}
.pagination .page-item.disabled .page-link {
  color: #adb5bd;
}

/* --- vue-select Customization --- */
:root {
  --vs-border-color: #ced4da;
  --vs-border-radius: 0.375rem;
  --vs-font-size: 1rem;
  --vs-dropdown-option--active-bg: #DF1115;
  --vs-dropdown-option--active-color: #fff;
}
.v-select {
  font-family: 'Poppins', sans-serif;
}

/* --- Transitions --- */
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.3s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}

/* --- Modal Switch --- */
.form-switch .form-check-input {
    cursor: pointer;
}
.btn-secondary, .btn-danger, .btn-success{
  color: white !important;
}
</style>
