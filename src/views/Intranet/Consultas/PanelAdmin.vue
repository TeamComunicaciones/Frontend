<template>
  <div class="container my-5">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h1 class="h2 mb-0">Panel de Administración</h1>
        <span class="badge bg-danger">Acceso Restringido</span>
      </div>
      <div class="card-body p-0">
        <ul class="nav nav-tabs nav-fill" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#carga-pane" type="button" role="tab">Carga de Comisiones</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#permisos-pane" type="button" role="tab">Asignación de Rutas</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#reportes-pane" type="button" role="tab">Reportes y Gráficas</button>
          </li>
        </ul>

        <div class="tab-content p-4 p-md-5" id="adminTabContent">
          <div class="tab-pane fade show active" id="carga-pane" role="tabpanel">
            <h2 class="h3 mb-3">Importar Comisiones desde Excel</h2>
            <p class="text-muted mb-4">Sube el archivo .xlsx con los registros de comisiones. El sistema lo procesará en segundo plano.</p>
            <div
              class="drop-zone"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
              :class="{ 'is-dragging': isDragging }"
              @click="fileInput.click()"
            >
              <input type="file" @change="handleFileChange" accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ref="fileInput" class="d-none">
              <div class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-cloud-arrow-up mb-3 text-muted" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/><path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/></svg>
                <p class="m-0">Arrastra tu archivo .xlsx aquí o <strong>haz clic para seleccionar</strong>.</p>
              </div>
            </div>
            <div v-if="selectedFile" class="mt-3">
              <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded">
                <div class="d-flex align-items-center text-truncate">
                  <span class="text-truncate">{{ selectedFile.name }}</span>
                </div>
                <button @click="clearFile" class="btn btn-sm btn-outline-secondary ms-2" type="button">&times;</button>
              </div>
            </div>
            <div class="d-grid mt-4">
              <button @click="uploadFile" class="btn btn-danger btn-lg" :disabled="!selectedFile || isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Procesando...' : 'Iniciar Carga' }}
              </button>
            </div>
            <div v-if="uploadResult" class="mt-4">
              <div :class="['alert', uploadResult.success ? 'alert-success' : 'alert-danger']" role="alert">
                <div class="d-flex align-items-center">
                  <div>
                    <h5 class="alert-heading mb-1">{{ uploadResult.success ? 'Carga Completada' : 'Error en la Carga' }}</h5>
                    <p class="mb-0" v-if="uploadResult.message">{{ uploadResult.message }}</p>
                    <div v-if="uploadResult.errors">
                      <ul class="mb-0 ps-4">
                        <li v-for="(error, index) in uploadResult.errors" :key="index">{{ error }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="permisos-pane" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 class="h3 mb-1">Asignar Rutas a Asesores</h2>
                <p class="text-muted mb-0">Asigna una ruta para habilitar a un usuario como asesor. El cambio se guarda automáticamente.</p>
              </div>
              <div class="col-md-4">
                <input type="text" class="form-control" v-model="searchQuery" placeholder="Buscar usuario por nombre o email...">
              </div>
            </div>

            <div v-if="isLoadingPermissions" class="text-center p-5">
              <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>

            <div v-else class="row">
              <div v-for="user in filteredUsers" :key="user.id" class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm card-hover">
                  <div class="card-body">
                    <h5 class="card-title text-truncate">{{ user.username }}</h5>
                    <p class="card-text text-muted text-truncate">{{ user.email }}</p>
                    <select class="form-select" v-model="user.ruta_asignada" @change="updateAsesorRuta(user)">
                      <option :value="null">-- Sin Asignar (No es Asesor) --</option>
                      <option v-for="ruta in rutas" :key="ruta" :value="ruta">{{ ruta }}</option>
                    </select>
                    <div v-if="recentlySaved === user.id" class="save-indicator">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg> Guardado
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="filteredUsers.length === 0 && !isLoadingPermissions" class="col-12 text-center text-muted mt-5">
                <h4>No se encontraron usuarios con ese criterio.</h4>
              </div>
            </div>
          </div>
          
          <div class="tab-pane fade" id="reportes-pane" role="tabpanel">
            <h2 class="h3 mb-4">Dashboard de Comisiones Generales</h2>
            
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <fieldset :disabled="isLoadingReports">
                  <div class="row g-3 align-items-end">
                    <div class="col-md-4">
                      <label for="filtroFechas" class="form-label fw-bold">Rango de Fechas</label>
                      <DatePicker v-model:value="reportFilters.range" range id="filtroFechas" placeholder="Selecciona un rango"/>
                    </div>
                    <div class="col-md-4">
                      <label for="filtroRutas" class="form-label fw-bold">Rutas</label>
                      <v-select multiple id="filtroRutas" placeholder="Todas las rutas" v-model="reportFilters.rutas" :options="filterOptions.rutas" />
                    </div>
                    <div class="col-md-4">
                      <label for="filtroEstados" class="form-label fw-bold">Estados</label>
                      <v-select multiple id="filtroEstados" placeholder="Todos los estados" v-model="reportFilters.estados" :options="filterOptions.estados" />
                    </div>
                    <div class="col-12 d-grid">
                      <button class="btn btn-danger" @click="generarReporte">
                        <span v-if="isLoadingReports" class="spinner-border spinner-border-sm me-2"></span>
                        {{ isLoadingReports ? 'Generando...' : 'Generar Reporte' }}
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>

            <div v-if="isLoadingReports" class="text-center p-5">
              <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;" role="status"></div>
              <p class="mt-3 text-muted">Cargando datos del reporte...</p>
            </div>
            
            <div v-else-if="reportData" class="animate__animated animate__fadeIn">
              <div class="row g-4 mb-4">
                <div class="col-md-4"><div class="card h-100 text-center shadow-sm"><div class="card-body"><h6>Valor Total Comisiones</h6><div class="stat-value">{{ formatCurrency(reportData.kpis.total) }}</div></div></div></div>
                <div class="col-md-4"><div class="card h-100 text-center shadow-sm"><div class="card-body"><h6>Total Pagado</h6><div class="stat-value text-success">{{ formatCurrency(reportData.kpis.pagado) }}</div></div></div></div>
                <div class="col-md-4"><div class="card h-100 text-center shadow-sm"><div class="card-body"><h6>Total Pendiente</h6><div class="stat-value text-warning">{{ formatCurrency(reportData.kpis.pendiente) }}</div></div></div></div>
              </div>

              <div class="row g-4 mb-4">
                <div class="col-lg-7">
                  <div class="card shadow-sm h-100">
                    <div class="card-body">
                      <h5 class="card-title text-muted mb-3">Evolución Mensual</h5>
                      <div style="position: relative; height: 350px;">
                        <Bar :data="evolucionChartData" :options="chartOptions"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-5">
                  <div class="card shadow-sm h-100">
                    <div class="card-body">
                      <h5 class="card-title text-muted mb-3">Distribución por Estado</h5>
                      <div style="position: relative; height: 350px;">
                        <Doughnut :data="estadoChartData" :options="chartOptions"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row g-4">
                <div class="col-12">
                  <div class="card shadow-sm h-100">
                    <div class="card-body">
                      <h5 class="card-title text-muted mb-3">Picos Mensuales de Comisión (Total)</h5>
                      <div style="position: relative; height: 350px;">
                        <Line :data="picosMensualesChartData" :options="lineChartOptions"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center p-5 text-muted border rounded bg-light mt-4">
              <p class="fs-4 mb-1">Aún no has generado un reporte.</p>
              <p>Usa los filtros de arriba y haz clic en "Generar Reporte" para visualizar los datos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useCookies } from "vue3-cookies";
import backendRouter from '@/components/BackendRouter/BackendRouter';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import { Bar, Doughnut, Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement);

const { cookies } = useCookies();
const token = cookies.get('jwt');
const authHeaders = { 'Authorization': `Bearer ${token}` };

// --- Lógica para Carga de Archivos ---
const selectedFile = ref(null);
const isLoading = ref(false);
const isDragging = ref(false);
const uploadResult = ref(null);
const fileInput = ref(null);

const handleFileChange = (event) => {
  const files = event.target.files || event.dataTransfer.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
    uploadResult.value = null;
  }
};
const clearFile = () => {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = '';
  uploadResult.value = null;
};
const onDragOver = (event) => { event.preventDefault(); isDragging.value = true; };
const onDragLeave = (event) => { event.preventDefault(); isDragging.value = false; };
const onDrop = (event) => { event.preventDefault(); isDragging.value = false; handleFileChange(event); };

const uploadFile = async () => {
  if (!selectedFile.value) return;
  isLoading.value = true;
  uploadResult.value = null;
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  const path = backendRouter.data + 'comisiones/upload/';
  const headers = { ...authHeaders, 'Content-Type': 'multipart/form-data' };

  try {
    const response = await axios.post(path, formData, { headers });
    uploadResult.value = { success: true, message: response.data.mensaje };
  } catch (error) {
    if (error.response && error.response.data) {
      uploadResult.value = { success: false, errors: error.response.data.errores || [error.response.data.error] };
    } else {
      uploadResult.value = { success: false, errors: ['Ocurrió un error inesperado.'] };
    }
  } finally {
    isLoading.value = false;
    if (uploadResult.value?.success) clearFile();
  }
};

// --- Lógica para Gestión de Permisos ---
const searchQuery = ref('');
const users = ref([]);
const rutas = ref([]);
const isLoadingPermissions = ref(false);
const recentlySaved = ref(null);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  return users.value.filter(user =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const showSaveIndicator = (userId) => {
  recentlySaved.value = userId;
  setTimeout(() => {
    if (recentlySaved.value === userId) {
      recentlySaved.value = null;
    }
  }, 2000);
};

const fetchPermissionsData = async () => {
  isLoadingPermissions.value = true;
  try {
    const usersPath = backendRouter.data + 'admin/usuarios-con-ruta/';
    const rutasPath = backendRouter.data + 'admin/rutas/';

    const [usersResponse, rutasResponse] = await Promise.all([
      axios.get(usersPath, { headers: authHeaders }),
      axios.get(rutasPath, { headers: authHeaders })
    ]);

    users.value = usersResponse.data;
    rutas.value = rutasResponse.data;

  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar los datos de permisos.', 'error');
    console.error("Error al cargar datos de permisos:", error);
  } finally {
    isLoadingPermissions.value = false;
  }
};

const updateAsesorRuta = async (user) => {
  const newRuta = user.ruta_asignada;
  const path = backendRouter.data + 'admin/asignar-ruta/';
  const data = {
    user_id: user.id,
    ruta: newRuta
  };

  try {
    await axios.post(path, data, { headers: authHeaders });
    showSaveIndicator(user.id);
  } catch (error) {
    Swal.fire('Error', `No se pudo actualizar la ruta para ${user.username}.`, 'error');
    fetchPermissionsData();
  }
};

// --- Lógica para Reportes y Gráficas ---
const isLoadingReports = ref(false);
const reportFilters = reactive({
  range: [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()],
  rutas: [],
  estados: []
});
const filterOptions = ref({
  rutas: [],
  estados: ['Pendiente', 'Acumulada', 'Pagada', 'Consolidada']
});
const reportData = ref(null);

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const fetchFilterOptions = async () => {
  filterOptions.value.rutas = rutas.value;
};

const generarReporte = async () => {
  isLoadingReports.value = true;
  reportData.value = null;
  
  const params = new URLSearchParams();
  if (reportFilters.range && reportFilters.range[0] && reportFilters.range[1]) {
    params.append('fecha_inicio', reportFilters.range[0].toISOString().split('T')[0]);
    params.append('fecha_fin', reportFilters.range[1].toISOString().split('T')[0]);
  }
  reportFilters.rutas.forEach(ruta => params.append('rutas', ruta));
  reportFilters.estados.forEach(estado => params.append('estados', estado));

  try {
    const path = `${backendRouter.data}admin/reporte-general/?${params.toString()}`;
    const response = await axios.get(path, { headers: authHeaders });
    reportData.value = response.data;
  } catch (error) {
    Swal.fire('Error', 'No se pudo generar el reporte.', 'error');
  } finally {
    isLoadingReports.value = false;
  }
};

const chartOptions = { responsive: true, maintainAspectRatio: false };
const lineChartOptions = computed(() => ({
  ...chartOptions,
  tension: 0.3,
  scales: {
    y: { beginAtZero: true }
  }
}));

const evolucionChartData = computed(() => {
  const data = reportData.value?.charts?.evolucion_mensual || [];
  return {
    labels: data.map(item => item.mes),
    datasets: [
      {
        label: 'Total Pagado',
        data: data.map(item => item.pagado),
        backgroundColor: '#28a745',
      },
      {
        label: 'Total Pendiente',
        data: data.map(item => item.pendiente),
        backgroundColor: '#ffc107',
      }
    ]
  };
});

const estadoChartData = computed(() => {
  const data = reportData.value?.charts?.distribucion_estado || [];
  return {
    labels: data.map(item => item.estado),
    datasets: [{
      data: data.map(item => item.total),
      backgroundColor: ['#17a2b8', '#6c757d', '#28a745', '#ffc107'],
    }]
  };
});

const picosMensualesChartData = computed(() => {
  const data = reportData.value?.charts?.picos_mensuales || [];
  return {
    labels: data.map(item => item.mes),
    datasets: [{
      label: 'Total Comisiones por Mes',
      data: data.map(item => item.total),
      borderColor: '#DF1115',
      backgroundColor: 'rgba(223, 17, 21, 0.1)',
      fill: true,
    }]
  };
});

// --- Ciclo de Vida ---
onMounted(() => {
  fetchPermissionsData().then(() => {
    fetchFilterOptions();
  });
});
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #495057;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.nav-tabs .nav-link.active {
  color: #000000;
  border-bottom: 3px solid #DF1115;
}

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.drop-zone:hover,
.drop-zone.is-dragging {
  background-color: rgba(223, 17, 21, 0.05);
  border-color: #DF1115;
}

.card-hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.save-indicator {
  color: #198754;
  font-weight: 500;
  margin-top: 10px;
  font-size: 0.9em;
  opacity: 0;
  animation: fadeInOut 2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 5px;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  25%, 75% { opacity: 1; }
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #343a40;
}

:deep(.mx-datepicker) {
  width: 100%;
}
</style>