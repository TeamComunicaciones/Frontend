<template>
  <!-- Contenedor principal con fondo claro -->
  <div class="dashboard-container container-fluid p-3 p-md-4">
    
    <!-- Contenedor del Spinner de Carga -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-white">Cargando datos...</p>
    </div>

    <!-- BARRA DE FILTROS SUPERIOR -->
    <div class="filter-bar p-3 mb-4 rounded-3 shadow-sm">
      <div class="row g-3 align-items-end">
        <!-- Título -->
        <div class="col-12 col-lg-6">
          <h4 class="mb-0">Dashboard de Ventas</h4>
        </div>

        <!-- Botones de Acción -->
        <div class="col-12 col-lg-6 d-flex justify-content-start justify-content-lg-end gap-2">
          <!-- NUEVO BOTÓN PDF -->
          <button class="btn btn-outline-success" @click="exportToPDF" :disabled="loading">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
              <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-0.777.81.81 0 0 1 .43.12.82.82 0 0 1 .38.465c.03.088.057.17.079.25.07.253.07.504.002.75a.73.73 0 0 1-.252.388.77.77 0 0 1-.43.242l-.025.002c-.438.04-.86.113-1.29.2-1.015.213-2.047.433-3.04.664-.46.103-.92.21-1.38.314a.5.5 0 0 1-.29.002zM5.611 9.703a.5.5 0 0 1 .003-.707.495.495 0 0 1 .704 0l.28.28.28-.28a.495.495 0 0 1 .704 0 .5.5 0 0 1 .003.707l-.28.28.28.28a.5.5 0 0 1-.003.707.495.495 0 0 1-.704 0l-.28-.28-.28.28a.495.495 0 0 1-.704 0 .5.5 0 0 1-.003-.707l.28-.28-.28-.28z"/>
            </svg>
            Exportar a PDF
          </button>
          
          <button class="btn btn-outline-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload me-1" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
            </svg>
            Cargar Nuevo Reporte
          </button>
        </div>

        <!-- Filtros de Período -->
        <div class="col-12">
          <!-- ... (código de filtros sin cambios) ... -->
          <div class="btn-group w-100" role="group" aria-label="Filtros de período">
            <input type="radio" class="btn-check" name="periodo" id="p-semana" autocomplete="off" :checked="filters.periodo === 'semana'" @change="setPeriod('semana')">
            <label class="btn btn-outline-secondary" for="p-semana">Semana</label>

            <input type="radio" class="btn-check" name="periodo" id="p-mes" autocomplete="off" :checked="filters.periodo === 'mes'" @change="setPeriod('mes')">
            <label class="btn btn-outline-secondary" for="p-mes">Mes</label>

            <input type="radio" class="btn-check" name="periodo" id="p-trimestre" autocomplete="off" :checked="filters.periodo === 'trimestre'" @change="setPeriod('trimestre')">
            <label class="btn btn-outline-secondary" for="p-trimestre">Trimestre</label>

            <input type="radio" class="btn-check" name="periodo" id="p-anual" autocomplete="off" :checked="filters.periodo === 'anual'" @change="setPeriod('anual')">
            <label class="btn btn-outline-secondary" for="p-anual">Año</label>

            <input type="radio" class="btn-check" name="periodo" id="p-personalizado" autocomplete="off" :checked="filters.periodo === 'personalizado'" @change="setPeriod('personalizado')">
            <label class="btn btn-outline-secondary" for="p-personalizado">Personalizado</label>
          </div>
        </div>
        
        <!-- Filtros de Fechas Personalizadas -->
        <div v-if="showCustomDates" class="col-12">
          <!-- ... (código de filtros sin cambios) ... -->
          <div class="row g-2">
            <div class="col-md-6">
              <label for="fecha_inicio" class="form-label-sm">Fecha Inicio</label>
              <input type="date" id="fecha_inicio" class="form-control" v-model="filters.fecha_inicio">
            </div>
            <div class="col-md-6">
              <label for="fecha_fin" class="form-label-sm">Fecha Fin</label>
              <input type="date" id="fecha_fin" class="form-control" v-model="filters.fecha_fin">
            </div>
          </div>
        </div>

        <!-- Filtros de Dropdown -->
        <div class="col-md-3">
          <!-- ... (código de filtros sin cambios) ... -->
          <label for="filtro-sucursal" class="form-label fw-bold">Sucursal</label>
          <select id="filtro-sucursal" class="form-select" v-model="filters.sucursal">
            <option value="todas">Todas</option>
            <option v-for="suc in filterOptions.sucursales" :key="suc" :value="suc">{{ suc }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <!-- ... (código de filtros sin cambios) ... -->
          <label for="filtro-clasificacion" class="form-label fw-bold">Clasificación</label>
          <select id="filtro-clasificacion" class="form-select" v-model="filters.clasificacion">
            <option value="todas">Todas</option>
            <option v-for="clas in filterOptions.clasificaciones" :key="clas" :value="clas">{{ clas }}</option>
          </select>
        </div>
        
        <!-- NUEVOS FILTROS -->
        <div class="col-md-2">
          <!-- ... (código de filtros sin cambios) ... -->
          <label for="filtro-asesor" class="form-label fw-bold">Asesor</label>
          <select id="filtro-asesor" class="form-select" v-model="filters.asesor">
            <option value="todos">Todos</option>
            <option v-for="ase in filterOptions.asesores" :key="ase" :value="ase">{{ ase }}</option>
          </select>
        </div>
        
        <div class="col-md-2">
          <!-- ... (código de filtros sin cambios) ... -->
          <label for="filtro-canal" class="form-label fw-bold">Canal</label>
          <select id="filtro-canal" class="form-select" v-model="filters.canal">
            <option value="todos">Todos</option>
            <option v-for="can in filterOptions.canales" :key="can" :value="can">{{ can }}</option>
          </select>
        </div>

        <!-- Botón Aplicar -->
        <div class="col-md-2 d-flex align-items-end">
          <!-- ... (código de filtros sin cambios) ... -->
          <button class="btn btn-danger w-100" @click="applyFilters" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Aplicar
          </button>
        </div>
      </div>
    </div>

    <!-- CONTENIDO DEL DASHBOARD -->
    <!-- ... (todo el v-if de KPIs y Gráficas no cambia) ... -->
    <div v-if="!loading && kpiData">
      <!-- FILA DE KPIS PRINCIPALES (6 KPIs) -->
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-lg-2">
          <div class="kpi-card h-100 shadow-sm">
            <div class="kpi-title">Ingresos Totales</div>
            <div class="kpi-value text-success">{{ formatCurrency(kpiData.ingresos) }}</div>
            <div class="kpi-delta positive">+5.2%</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-2">
          <div class="kpi-card h-100 shadow-sm">
            <div class="kpi-title">Items Vendidos</div>
            <div class="kpi-value text-primary">{{ formatNumber(kpiData.items) }}</div>
            <div class="kpi-delta negative">-1.8%</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-2">
          <div class="kpi-card h-100 shadow-sm">
            <div class="kpi-title">Margen Bruto</div>
            <div class="kpi-value">{{ formatCurrency(kpiData.margenBruto) }}</div>
            <div class="kpi-delta positive">+3.1%</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-2">
          <div class="kpi-card h-100 shadow-sm">
            <div class="kpi-title">Ticket Promedio</div>
            <div class="kpi-value">{{ formatCurrency(kpiData.ticketPromedio) }}</div>
            <div class="kpi-delta positive">+1.2%</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-2">
          <div class="kpi-card h-100 shadow-sm">
            <div class="kpi-title">Margen %</div>
            <div class="kpi-value text-success">{{ kpiData.margenPorcentaje }}%</div>
            <div class="kpi-delta positive">+0.5pp</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-2">
          <div class="kpi-card h-100 shadow-sm">
            <div class="kpi-title">Incentivos</div>
            <div class="kpi-value text-danger">{{ formatCurrency(kpiData.incentivos) }}</div>
            <div class="kpi-delta negative">-0.3%</div>
          </div>
        </div>
      </div>

      <!-- FILA: GRÁFICA DE TENDENCIA -->
      <div class="row g-4 mb-4">
        <div class="col-12">
          <div class="chart-card shadow-sm h-100">
            <h5 class="card-title">Tendencia del Período (Ingresos, Margen, Incentivos)</h5>
            <div class="chart-container" style="height: 350px;">
              <canvas ref="timeSeriesCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- FILA DE GRÁFICAS (SELL IN / INVENTARIO) -->
      <div class="row g-4 mb-4">
        <!-- Gráfica de SELL IN -->
        <div class="col-lg-8">
          <div class="chart-card shadow-sm h-100">
            <h5 class="card-title">Análisis SELL IN por Referencia</h5>
            <div class="chart-container">
              <canvas ref="sellInCanvas"></canvas>
            </div>
          </div>
        </div>

        <!-- Gráfica de INVENTARIO -->
        <div class="col-lg-4">
          <div class="chart-card shadow-sm h-100">
            <h5 class="card-title">Análisis INVENTARIO por Referencia</h5>
            <div class="chart-container">
              <canvas ref="inventarioCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <!-- NUEVA FILA: ASESOR / CANAL -->
      <div class="row g-4 mb-4">
        <!-- Gráfica de TOP 10 ASESORES -->
        <div class="col-lg-8">
          <div class="chart-card shadow-sm h-100">
            <h5 class="card-title">Top 10 Asesores (por Ingresos)</h5>
            <div class="chart-container" style="height: 450px;">
              <canvas ref="asesorCanvas"></canvas>
            </div>
          </div>
        </div>

        <!-- Gráfica de VENTAS POR CANAL -->
        <div class="col-lg-4">
          <div class="chart-card shadow-sm h-100">
            <h5 class="card-title">Ventas (Items) por Canal</h5>
            <div class="chart-container" style="height: 450px;">
              <canvas ref="canalCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- FILA DE GRÁFICAS (SELL-THROUGH / SUCURSAL / TOP PRODUCTOS) -->
      <div class="row g-4">
        <!-- Gráfica de TASA DE VENTA (SELL-THROUGH) -->
        <div class="col-lg-4">
          <div class="chart-card shadow-sm h-100">
            <h5 class="card-title">Tasa de Venta (Sell-Through)</h5>
            <div class="chart-container">
              <canvas ref="sellOutCanvas"></canvas>
            </div>
          </div>
        </div>

        <!-- Gráfica de SUCURSAL -->
        <div class="col-lg-4">
          <div class="chart-card shadow-sm h-100">
            <h5 class="card-title">Ventas (Items) por Sucursal</h5>
            <div class="chart-container" style="max-height: 350px;">
              <canvas ref="sucursalCanvas"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Tabla TOP 5 PRODUCTOS -->
        <div class="col-lg-4">
          <div class="chart-card shadow-sm h-100">
            <h5 class="card-title">Top 5 Productos (Ingresos)</h5>
            <div class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col" class="text-end">Items</th>
                    <th scope="col" class="text-end">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in topProductosData" :key="item.nombre">
                    <td>{{ item.nombre }}</td>
                    <td class="text-end">{{ formatNumber(item.cantidad) }}</td>
                    <td class="text-end fw-bold">{{ formatCurrency(item.ingresos) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Estado de Error -->
    <div v-else-if="error" class="alert alert-danger">
      <strong>Error:</strong> {{ error }}
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
// Importamos Chart.js completo (árbol-sacudible)
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// --- NUEVAS IMPORTACIONES PARA PDF ---
// (Asegúrate de instalarlos: npm install jspdf jspdf-autotable)
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// ---------------------------------

// Registramos todos los componentes de Chart.js y el plugin de etiquetas
Chart.register(...registerables, ChartDataLabels);

// --- ESTADO REACTIVO ---

const loading = ref(true);
const error = ref(null);

// Referencias a los elementos Canvas
const timeSeriesCanvas = ref(null); 
const sellInCanvas = ref(null);
const inventarioCanvas = ref(null);
const sellOutCanvas = ref(null); // Ahora será Sell-Through
const sucursalCanvas = ref(null);
const asesorCanvas = ref(null); // NUEVA GRÁFICA
const canalCanvas = ref(null); // NUEVA GRÁFICA

// Almacén para instancias de Chart.js para poder destruirlas
const chartInstances = ref({});

// Opciones de filtros
const showCustomDates = ref(false);
const filters = ref({
  periodo: 'mes', // Valor inicial
  fecha_inicio: '',
  fecha_fin: '',
  sucursal: 'todas',
  clasificacion: 'todas',
  asesor: 'todos', // NUEVO
  canal: 'todos', // NUEVO
});

const filterOptions = ref({
  sucursales: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'],
  clasificaciones: ['Smartphones', 'Accesorios', 'Servicios', 'Otros'],
  asesores: ['Asesor 1', 'Asesor 2', 'Asesor 3', 'Asesor 4', 'Asesor 5', 'Asesor 6', 'Asesor 7', 'Asesor 8', 'Asesor 9', 'Asesor 10'], // NUEVO
  canales: ['Tienda Propia', 'Online', 'Promotor', 'Externo'], // NUEVO
});

// --- DATOS DE PRUEBA (MOCK DATA) ---
const kpiData = ref(null);
const timeSeriesData = ref(null);
const sellInData = ref(null);
const inventarioData = ref(null);
const sellOutData = ref(null); // Ahora será Sell-Through
const sucursalData = ref(null);
const topProductosData = ref(null);
const asesorData = ref(null); // NUEVO
const canalData = ref(null); // NUEVO

// --- PALETA DE COLORES ---
const colorPrimary = '#DF1115'; // Rojo
const colorDark = '#343a40'; // Gris Oscuro
const colorBlue = '#0d6efd'; // Azul Bootstrap
const colorOrange = '#fd7e14'; // Naranja Bootstrap
const colorGreen = '#198754'; // Verde Bootstrap
const colorTeal = '#20c997'; // Teal Bootstrap
const colorPurple = '#6f42c1'; // Púrpura Bootstrap

// --- MÉTODOS ---

/**
 * Formatea un número como moneda colombiana (COP).
 */
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$ 0';
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formatea un número con separadores de miles.
 */
const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('es-CO').format(value);
};

/**
 * Formatea una fecha a YYYY-MM-DD.
 */
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

/**
 * Establece el período de fechas y oculta/muestra los selectores de fecha.
 */
const setPeriod = (periodo) => {
  filters.value.periodo = periodo;
  const today = new Date();
  
  if (periodo === 'personalizado') {
    showCustomDates.value = true;
  } else {
    showCustomDates.value = false;
    filters.value.fecha_fin = formatDate(today);
    
    let startDate = new Date();
    if (periodo === 'semana') {
      startDate.setDate(today.getDate() - 7);
    } else if (periodo === 'mes') {
      startDate.setMonth(today.getMonth() - 1);
    } else if (periodo === 'trimestre') {
      startDate.setMonth(today.getMonth() - 3);
    } else if (periodo === 'anual') {
      startDate.setFullYear(today.getFullYear() - 1);
    }
    filters.value.fecha_inicio = formatDate(startDate);
  }
};

/**
 * Simula la carga de datos y luego inicializa las gráficas.
 */
const applyFilters = async () => {
  loading.value = true;
  error.value = null;
  
  // Destruir gráficas antiguas antes de cargar nuevas
  destroyCharts();
  
  // Simular llamada a API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // Generar nuevos datos de prueba
    const ingresos = Math.random() * 200000000 + 50000000;
    const costo = Math.random() * 100000000 + 30000000;
    const incentivos = Math.random() * 20000000 + 5000000;
    const items = Math.random() * 3000 + 500;
    const tickets = Math.random() * 1500 + 300;
    const margenBruto = ingresos - costo - incentivos;
    const margenPorcentaje = ((margenBruto / ingresos) * 100).toFixed(1);
    const ticketPromedio = ingresos / tickets;

    kpiData.value = {
      ingresos,
      items,
      costo,
      incentivos,
      margenBruto,
      margenPorcentaje,
      ticketPromedio,
      tickets,
    };
    
    const referencias = ['Referencia A', 'Referencia B', 'Referencia C', 'Referencia D'];
    
    sellInData.value = {
      labels: referencias,
      datasets: [
        {
          label: 'Compras',
          data: referencias.map(() => Math.floor(Math.random() * 1000)),
          backgroundColor: colorDark,
        },
        {
          label: 'Act Pos',
          data: referencias.map(() => Math.floor(Math.random() * 800)),
          backgroundColor: colorPrimary,
        },
        {
          label: 'Total Sell in',
          data: referencias.map(() => Math.floor(Math.random() * 1800)),
          backgroundColor: colorBlue,
        },
        {
          label: 'Proyección Sell in',
          data: referencias.map(() => Math.floor(Math.random() * 2000)),
          backgroundColor: 'rgba(13, 110, 253, 0.3)', // Azul claro
          type: 'line',
          borderColor: colorBlue,
          tension: 0.1,
          fill: false,
        },
      ],
    };

    inventarioData.value = {
      labels: referencias,
      datasets: [
        {
          label: 'Inventario Pos',
          data: referencias.map(() => Math.floor(Math.random() * 1500)),
          backgroundColor: colorGreen,
        },
        {
          label: 'Inventario Pre',
          data: referencias.map(() => Math.floor(Math.random() * 1000)),
          backgroundColor: colorTeal,
        },
      ],
    };
    
    // DATOS DE SELL-THROUGH (%)
    sellOutData.value = {
      labels: referencias,
      datasets: [
        {
          label: 'Tasa de Venta (%)',
          data: referencias.map(() => Math.floor(Math.random() * 70) + 20), // Porcentaje
          backgroundColor: colorOrange,
        },
      ],
    };

    sucursalData.value = {
      labels: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Otras'],
      datasets: [
        {
          label: 'Items Vendidos',
          data: [1200, 850, 600, 450, 300],
          backgroundColor: [colorPrimary, colorDark, colorBlue, colorOrange, colorGreen],
        },
      ],
    };

    topProductosData.value = [
      { nombre: 'Producto Estrella 1', cantidad: 150, ingresos: 45000000 },
      { nombre: 'Producto Estrella 2', cantidad: 120, ingresos: 32000000 },
      { nombre: 'Accesorio Top', cantidad: 300, ingresos: 15000000 },
      { nombre: 'Producto Nuevo', cantidad: 50, ingresos: 12000000 },
      { nombre: 'Producto Básico', cantidad: 200, ingresos: 8000000 },
    ];

    // DATOS DE TENDENCIA (con Margen)
    const timeLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const trendIngresos = timeLabels.map(() => Math.floor(Math.random() * 15000000) + 5000000);
    const trendIncentivos = timeLabels.map(() => Math.floor(Math.random() * 3000000) + 1000000);
    const trendCostos = timeLabels.map(() => Math.floor(Math.random() * 5000000) + 2000000);
    const trendMargen = trendIngresos.map((ing, i) => ing - trendCostos[i] - trendIncentivos[i]);

    timeSeriesData.value = {
      labels: timeLabels,
      datasets: [
        {
          label: 'Ingresos',
          data: trendIngresos,
          borderColor: colorGreen,
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Margen Bruto',
          data: trendMargen,
          borderColor: colorBlue,
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Incentivos',
          data: trendIncentivos,
          borderColor: colorPrimary,
          backgroundColor: 'rgba(223, 17, 21, 0.1)',
          fill: true,
          tension: 0.3,
        }
      ]
    };

    // DATOS TOP 10 ASESORES
    const asesores = filterOptions.value.asesores.map(a => ({
      nombre: a,
      ingresos: Math.floor(Math.random() * 20000000) + 5000000
    })).sort((a, b) => b.ingresos - a.ingresos);

    asesorData.value = {
      labels: asesores.map(a => a.nombre),
      datasets: [{
        label: 'Ingresos',
        data: asesores.map(a => a.ingresos),
        backgroundColor: colorPurple,
      }]
    };
    
    // DATOS VENTAS POR CANAL
    canalData.value = {
      labels: filterOptions.value.canales,
      datasets: [{
        label: 'Items Vendidos',
        data: filterOptions.value.canales.map(() => Math.floor(Math.random() * 1000) + 200),
        backgroundColor: [colorPurple, colorTeal, colorOrange, colorDark],
      }]
    };


    // --- CORRECCIÓN DEL BUG ---
    loading.value = false;
    
    // Esperar a que el DOM se actualice (v-if)
    await nextTick();
    
    // Inicializar las gráficas AHORA que los canvas existen
    initCharts();

  } catch (err) {
    console.error(err);
    error.value = 'No se pudieron cargar los datos del dashboard.';
    loading.value = false; // Asegurarse de quitar el loading también en caso de error
  }
};

/**
 * Destruye todas las instancias de Chart.js activas.
 */
const destroyCharts = () => {
  Object.values(chartInstances.value).forEach(chart => {
    if (chart) {
      chart.destroy();
    }
  });
  chartInstances.value = {};
};

// --- NUEVA FUNCIÓN ---

/**
 * Genera y descarga un reporte en PDF del dashboard.
 */
const exportToPDF = () => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);
    const halfWidth = (contentWidth / 2) - 5; // Ancho de media página con margen
    let yPos = 15; // Posición vertical

    // --- TÍTULO ---
    doc.setFontSize(18);
    doc.text("Dashboard de Ventas", margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Período: ${filters.value.fecha_inicio} al ${filters.value.fecha_fin}`, margin, yPos);
    yPos += 10;

    // --- KPIs (Tabla 1) ---
    doc.setFontSize(12);
    doc.text("Resumen del Período", margin, yPos);
    yPos += 7;
    const kpiList = [
      ["Ingresos Totales", formatCurrency(kpiData.value.ingresos)],
      ["Items Vendidos", formatNumber(kpiData.value.items)],
      ["Margen Bruto", formatCurrency(kpiData.value.margenBruto)],
      ["Ticket Promedio", formatCurrency(kpiData.value.ticketPromedio)],
      ["Margen %", `${kpiData.value.margenPorcentaje}%`],
      ["Incentivos", formatCurrency(kpiData.value.incentivos)],
    ];
    autoTable(doc, {
      startY: yPos,
      head: [['Métrica', 'Valor']],
      body: kpiList,
      theme: 'striped',
      headStyles: { fillColor: [223, 17, 21] }, // Color Rojo
    });
    yPos = doc.lastAutoTable.finalY + 10; // Obtener posición después de la tabla

    // --- Helper para chequear salto de página ---
    const checkPageBreak = (heightNeeded) => {
      if (yPos + heightNeeded > pageHeight - margin) {
        doc.addPage();
        yPos = 15;
      }
    };

    // --- Helper para añadir 1 gráfica (ancho completo) ---
    const addChart = (chartName, title) => {
      const chart = chartInstances.value[chartName];
      if (!chart) return;
      
      const chartHeight = (chart.height / chart.width) * contentWidth;
      checkPageBreak(chartHeight + 17); // +17 por título y márgenes
      
      const imgData = chart.toBase64Image('image/png', 1.0);
      doc.setFontSize(12);
      doc.text(title, margin, yPos);
      yPos += 7;
      doc.addImage(imgData, 'PNG', margin, yPos, contentWidth, chartHeight);
      yPos += chartHeight + 10;
    };
    
    // --- Helper para añadir 2 gráficas (media página) ---
    const addTwoCharts = (name1, title1, name2, title2) => {
      const chart1 = chartInstances.value[name1];
      const chart2 = chartInstances.value[name2];
      let h1 = 0, h2 = 0;
      
      if (chart1) h1 = (chart1.height / chart1.width) * halfWidth;
      if (chart2) h2 = (chart2.height / chart2.width) * halfWidth;
      
      const maxHeight = Math.max(h1, h2, 70); // 70mm mínimo
      checkPageBreak(maxHeight + 17);

      if (chart1) {
        const imgData1 = chart1.toBase64Image('image/png', 1.0);
        doc.setFontSize(12);
        doc.text(title1, margin, yPos);
        doc.addImage(imgData1, 'PNG', margin, yPos + 7, halfWidth, h1);
      }
      if (chart2) {
        const imgData2 = chart2.toBase64Image('image/png', 1.0);
        doc.setFontSize(12);
        doc.text(title2, margin + halfWidth + 10, yPos);
        doc.addImage(imgData2, 'PNG', margin + halfWidth + 10, yPos + 7, halfWidth, h2);
      }
      yPos += maxHeight + 17;
    };

    // --- AÑADIR GRÁFICAS AL PDF ---
    addChart('timeSeries', 'Tendencia del Período');
    addTwoCharts('sellIn', 'Análisis SELL IN', 'inventario', 'Análisis INVENTARIO');
    addTwoCharts('asesor', 'Top 10 Asesores', 'canal', 'Ventas por Canal');
    addTwoCharts('sellOut', 'Tasa de Venta (Sell-Through)', 'sucursal', 'Ventas por Sucursal');

    // --- TABLA FINAL (Top 5 Productos) ---
    checkPageBreak(60); // Espacio para la tabla
    doc.setFontSize(12);
    doc.text("Top 5 Productos (Ingresos)", margin, yPos);
    yPos += 7;
    autoTable(doc, {
      startY: yPos,
      head: [['Producto', 'Items', 'Ingresos']],
      body: topProductosData.value.map(item => [
        item.nombre,
        formatNumber(item.cantidad),
        formatCurrency(item.ingresos)
      ]),
      theme: 'grid',
      headStyles: { fillColor: [52, 58, 64] }, // Color Oscuro
    });
    
    // --- GUARDAR ---
    doc.save('Reporte_Ventas.pdf');

  } catch (pdfError) {
    console.error("Error al generar el PDF:", pdfError);
    // (Opcional: mostrar un modal de error al usuario)
  }
};
// ---------------------------------


/**
 * Crea e inicializa todas las gráficas de Chart.js.
 */
const initCharts = () => {

  // Configuración de Tooltip para NÚMEROS (items, cantidades)
  const numberTooltipCallbacks = {
    label: (context) => {
      let label = context.dataset.label || '';
      if (label) {
        label += ': ';
      }
      let value = context.parsed.y;
      if (context.parsed.x !== null && context.chart.options.indexAxis === 'y') {
        value = context.parsed.x;
      }
      return label + formatNumber(value);
    }
  };

  // Configuración de Tooltip para MONEDA (ingresos, costos)
  const currencyTooltipCallbacks = {
    label: (context) => {
      let label = context.dataset.label || '';
      if (label) {
        label += ': ';
      }
      let value = context.parsed.y;
      if (context.parsed.x !== null && context.chart.options.indexAxis === 'y') {
        value = context.parsed.x;
      }
      return label + formatCurrency(value);
    }
  };

  // Configuración de Tooltip para PORCENTAJE
  const percentTooltipCallbacks = {
    label: (context) => {
      let label = context.dataset.label || '';
      if (label) {
        label += ': ';
      }
      let value = context.parsed.y;
      if (context.parsed.x !== null && context.chart.options.indexAxis === 'y') {
        value = context.parsed.x;
      }
      return label + value + '%';
    }
  };


  // 0. Gráfica de TENDENCIA
  if (timeSeriesCanvas.value && timeSeriesData.value) {
    const ctx = timeSeriesCanvas.value.getContext('2d');
    chartInstances.value.timeSeries = new Chart(ctx, {
      type: 'line',
      data: timeSeriesData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false },
          legend: { position: 'bottom' },
          tooltip: { 
            callbacks: currencyTooltipCallbacks,
            mode: 'index',
            intersect: false,
          },
          datalabels: { display: false }
        },
        scales: {
          x: { stacked: false },
          y: { 
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(value)
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      }
    });
  }

  // 1. Gráfica SELL IN
  if (sellInCanvas.value && sellInData.value) {
    const ctx = sellInCanvas.value.getContext('2d');
    chartInstances.value.sellIn = new Chart(ctx, {
      type: 'bar',
      data: sellInData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false },
          legend: { position: 'bottom' },
          tooltip: { callbacks: numberTooltipCallbacks },
          datalabels: { display: false }
        },
        scales: {
          x: { stacked: false },
          y: { 
            beginAtZero: true,
            ticks: {
              callback: (value) => formatNumber(value)
            }
          }
        }
      }
    });
  }

  // 2. Gráfica INVENTARIO
  if (inventarioCanvas.value && inventarioData.value) {
    const ctx = inventarioCanvas.value.getContext('2d');
    chartInstances.value.inventario = new Chart(ctx, {
      type: 'bar',
      data: inventarioData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Gráfica de barras horizontal
        plugins: {
          title: { display: false },
          legend: { position: 'bottom' },
          tooltip: { callbacks: numberTooltipCallbacks },
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: (value) => formatNumber(value),
            color: '#333',
            font: { size: 10 }
          }
        },
        scales: {
          x: { 
            beginAtZero: true,
            ticks: {
              callback: (value) => formatNumber(value)
            }
          },
          y: { stacked: false }
        }
      }
    });
  }
  
  // 3. Gráfica SELL-THROUGH (%)
  if (sellOutCanvas.value && sellOutData.value) {
    const ctx = sellOutCanvas.value.getContext('2d');
    chartInstances.value.sellOut = new Chart(ctx, {
      type: 'bar',
      data: sellOutData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false },
          legend: { display: false }, // Ocultar leyenda, solo hay 1 serie
          tooltip: { callbacks: percentTooltipCallbacks }, // Callback de Porcentaje
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: (value) => value + '%', // Formato de Porcentaje
            color: '#333',
          }
        },
        scales: {
          x: { stacked: false },
          y: { 
            beginAtZero: true,
            ticks: {
              callback: (value) => value + '%' // Eje Y con %
            }
          }
        }
      }
    });
  }

  // 4. Gráfica SUCURSAL (Doughnut)
  if (sucursalCanvas.value && sucursalData.value) {
    const ctx = sucursalCanvas.value.getContext('2d');
    chartInstances.value.sucursal = new Chart(ctx, {
      type: 'doughnut',
      data: sucursalData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false },
          legend: { position: 'bottom' },
          tooltip: { 
            callbacks: {
              label: (context) => {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                label += formatNumber(context.parsed);
                
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = (context.parsed / total * 100).toFixed(1) + '%';
                label += ` (${percentage})`;
                
                return label;
              }
            }
          },
          datalabels: {
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = (value / total * 100).toFixed(0) + '%';
              return percentage;
            },
            color: '#fff',
            font: { weight: 'bold' }
          }
        }
      }
    });
  }

  // 5. Gráfica TOP 10 ASESORES (NUEVA)
  if (asesorCanvas.value && asesorData.value) {
    const ctx = asesorCanvas.value.getContext('2d');
    chartInstances.value.asesor = new Chart(ctx, {
      type: 'bar',
      data: asesorData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Horizontal
        plugins: {
          title: { display: false },
          legend: { display: false },
          tooltip: { callbacks: currencyTooltipCallbacks }, // Callback de Moneda
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: (value) => formatCurrency(value),
            color: '#333',
            font: { size: 10 }
          }
        },
        scales: {
          x: { 
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(value)
            }
          },
          y: { stacked: false }
        }
      }
    });
  }

  // 6. Gráfica VENTAS POR CANAL (NUEVA)
  if (canalCanvas.value && canalData.value) {
    const ctx = canalCanvas.value.getContext('2d');
    chartInstances.value.canal = new Chart(ctx, {
      type: 'doughnut',
      data: canalData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false },
          legend: { position: 'bottom' },
          tooltip: { 
            callbacks: {
              label: (context) => {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                label += formatNumber(context.parsed);
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = (context.parsed / total * 100).toFixed(1) + '%';
                label += ` (${percentage})`;
                return label;
              }
            }
          },
          datalabels: {
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = (value / total * 100).toFixed(0) + '%';
              return percentage;
            },
            color: '#fff',
            font: { weight: 'bold' }
          }
        }
      }
    });
  }
};


// --- CICLO DE VIDA ---

onMounted(() => {
  // Establecer el período inicial (ej. 'mes')
  setPeriod('mes');
  // Cargar los datos iniciales
  applyFilters();
});

onBeforeUnmount(() => {
  // Limpiar las gráficas al destruir el componente
  destroyCharts();
});

</script>

<style scoped>
/* Variables de color */
:root {
  --color-primary: #DF1115;
  --color-dark: #343a40;
}

/* Estilo del contenedor principal */
.dashboard-container {
  background-color: #f8f9fa; /* Un fondo gris muy claro */
}

/* Barra de filtros */
.filter-bar {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

/* Overlay de carga */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* Encima de otros elementos */
}
.loading-overlay .spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Tarjetas de KPI */
.kpi-card {
  background-color: #fff;
  border-radius: .5rem;
  border: 1px solid #e0e0e0;
  padding: 1rem; /* Reducido para 6 columnas */
  transition: all 0.3s ease;
}
.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07) !important;
}
.kpi-title {
  font-size: 0.8rem; /* Reducido para 6 columnas */
  font-weight: 600;
  color: #6c757d; /* Gris secundario */
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kpi-value {
  font-size: 1.75rem; /* Reducido para 6 columnas */
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1.2;
}
.kpi-delta {
  font-size: 0.8rem; /* Reducido para 6 columnas */
  font-weight: 600;
  margin-top: 0.5rem;
}
.kpi-delta.positive {
  color: #198754; /* Verde */
}
.kpi-delta.negative {
  color: #dc3545; /* Rojo */
}

/* Tarjetas de Gráficas */
.chart-card {
  background-color: #ffffff;
  border-radius: .5rem;
  border: 1px solid #e0e0e0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}
.chart-card .card-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem; 
  color: var(--color-dark);
}
.chart-container {
  position: relative;
  height: 400px; /* Altura fija para las gráficas */
  flex-grow: 1;
}

/* Estilos de la tabla */
.table-responsive {
  max-height: 380px; /* Ajustar altura para que quepa en la tarjeta */
}
.table thead {
  position: sticky;
  top: 0;
}
.table td, .table th {
  font-size: 0.9rem;
  vertical-align: middle;
}

/* Ajustes responsivos */
@media (max-width: 992px) { /* tablets */
  .kpi-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) { /* móviles */
  .chart-container {
    height: 300px; /* Menos altura en móviles */
  }
  .kpi-card {
    padding: 1rem;
  }
  .kpi-value {
    font-size: 1.75rem;
  }
}
</style>


