<template>
  <div class="container-fluid mt-4">
    <div class="filter-bar p-3 mb-4 rounded shadow-sm">
      <h4 class="mb-3">Dashboard de Ventas</h4>
      <div class="row g-3 align-items-center">
        <div class="col-md-3">
          <label for="filtro-sucursal" class="form-label fw-bold">Sucursal</label>
          <select id="filtro-sucursal" class="form-select" v-model="filters.sucursal">
            <option value="">Todas</option>
            <option v-for="suc in filterOptions.sucursales" :key="suc" :value="suc">{{ suc }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="filtro-clasificacion" class="form-label fw-bold">Clasificación</label>
           <select id="filtro-clasificacion" class="form-select" v-model="filters.clasificacion_venta">
            <option value="">Todas</option>
            <option v-for="clas in filterOptions.clasificaciones" :key="clas" :value="clas">{{ clas }}</option>
          </select>
        </div>
        <div class="col-md-6 d-flex align-items-end justify-content-end gap-2">
          <button class="btn btn-primary" @click="fetchDashboardData" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Aplicar Filtros
          </button>
           <button class="btn btn-outline-danger" @click="showUploadModal = true">Cargar Nuevo Reporte</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center my-5 py-5">
      <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando datos...</p>
    </div>
    
    <div v-else-if="dashboardData">
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="product-card h-100">
            <div class="card-header"><h5 class="card-title">Total Ventas (items)</h5></div>
            <div class="card-body text-center d-flex align-items-center justify-content-center">
              <h2 class="total-value display-4">{{ formatNumber(dashboardData.summary.total_ventas) }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="product-card h-100">
            <div class="card-header"><h5 class="card-title">Costo Total de Equipos</h5></div>
            <div class="card-body text-center d-flex align-items-center justify-content-center">
              <h2 class="total-value display-4">{{ formatCurrency(dashboardData.summary.total_costo) }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="product-card h-100">
            <div class="card-header"><h5 class="card-title">Incentivos Totales</h5></div>
            <div class="card-body text-center d-flex align-items-center justify-content-center">
              <h2 class="total-value display-4">{{ formatCurrency(dashboardData.summary.total_incentivos) }}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-lg-6 mb-4">
           <div class="product-card h-100">
              <div class="card-header"><h5 class="card-title">Ventas por Clasificación</h5></div>
              <div class="card-body" style="height: 350px;">
                <BarChart v-if="ventasPorClasificacionChartData" :chart-data="ventasPorClasificacionChartData" />
              </div>
           </div>
        </div>
        <div class="col-lg-6 mb-4">
          <div class="product-card h-100">
              <div class="card-header"><h5 class="card-title">Top 10 Sucursales</h5></div>
              <div class="card-body" style="height: 350px;">
                <BarChart v-if="ventasPorSucursalChartData" :chart-data="ventasPorSucursalChartData" />
              </div>
           </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      <strong>Error:</strong> {{ error }}
    </div>

    <FileUploadComponent 
      v-if="showUploadModal" 
      @close="showUploadModal = false" 
      @upload-success="handleUploadSuccess" 
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
// --- RUTAS DE IMPORTACIÓN CORREGIDAS ---
// El alias '@' normalmente apunta a la carpeta 'src'. Ajusta si tu configuración es diferente.
import FileUploadComponent from '@/components/FileUploadComponent.vue'; 
import BarChart from '@/components/intranet/SidebarMenu/BarChart.vue'; // <-- Ruta corregida según tu indicación

// --- ESTADO REACTIVO ---
const loading = ref(true);
const dashboardData = ref(null);
const error = ref(null);
const showUploadModal = ref(false);

const filters = ref({
  sucursal: '',
  clasificacion_venta: '',
  fecha_inicio: null,
  fecha_fin: null,
});

// --- CONFIGURACIÓN ---
const API_URL = 'http://127.0.0.1:8000/api/v1.0/sales-report/dashboard/';

// --- LÓGICA DE DATOS ---
const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = new URLSearchParams();
    if (filters.value.sucursal) params.append('sucursal', filters.value.sucursal);
    if (filters.value.clasificacion_venta) params.append('clasificacion_venta', filters.value.clasificacion_venta);

    const response = await axios.get(`${API_URL}?${params.toString()}`);
    dashboardData.value = response.data;
  } catch (err) {
    error.value = 'No se pudieron cargar los datos del dashboard. Por favor, intente de nuevo más tarde.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleUploadSuccess = () => {
  showUploadModal.value = false;
  fetchDashboardData(); 
};

// --- PROPIEDADES COMPUTADAS PARA FORMATEO ---
const filterOptions = computed(() => dashboardData.value?.opciones_filtros || { sucursales: [], clasificaciones: [] });

const ventasPorClasificacionChartData = computed(() => {
  if (!dashboardData.value?.ventas_por_clasificacion) return null;
  
  const labels = dashboardData.value.ventas_por_clasificacion.map(item => item.clasificacion_venta);
  const data = dashboardData.value.ventas_por_clasificacion.map(item => item.cantidad);

  return {
    labels: labels,
    datasets: [{
      label: 'Ventas por Clasificación',
      backgroundColor: '#DF1115',
      borderColor: '#c80f13',
      borderWidth: 1,
      data: data
    }]
  };
});

const ventasPorSucursalChartData = computed(() => {
  if (!dashboardData.value?.ventas_por_sucursal) return null;

  const labels = dashboardData.value.ventas_por_sucursal.map(item => item.sucursal);
  const data = dashboardData.value.ventas_por_sucursal.map(item => item.cantidad);

  return {
    labels: labels,
    datasets: [{
      label: 'Ventas por Sucursal',
      backgroundColor: '#343a40',
      borderColor: '#23272b',
      borderWidth: 1,
      data: data
    }]
  };
});

// --- HELPERS DE FORMATO ---
const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$ 0';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const formatNumber = (value) => {
    if (value === null || value === undefined) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
};

// --- CICLO DE VIDA ---
onMounted(fetchDashboardData);

</script>

<style lang="scss" scoped>
// Estilos que proporcionaste, más algunos ajustes menores
.filter-bar { 
  background-color: #f8f9fa; 
  border: 1px solid #e0e0e0;
}

.product-card {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  
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
  padding: 1.5rem;
  position: relative;
}

.card-title { 
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0; 
}

.total-value { 
  font-weight: bold;
  color: #DF1115; 
}
</style>