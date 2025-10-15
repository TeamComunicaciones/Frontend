<template>
  <div class="bg-light">
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-md-5">
              <div class="d-flex justify-content-end" style="margin-bottom: 50px;">
                <img class="img-fluid" :src="logoUrl" alt="logo" style="height: 80px;" />
              </div>
              <div class="text-center mb-4">
                <h1 class="h2">Comisiones PDV TAT</h1>
                <p>Ingresa el IDPOS para consultar tus comisiones.</p>
              </div>

              <fieldset :disabled="isLoading">
                <div class="row g-3 align-items-end bg-white p-3 rounded mb-4 border">
                    <div class="col-md-5">
                        <label for="filtroIdPos" class="form-label fw-bold">IDPOS</label>
                        <input type="text" id="filtroIdPos" class="form-control" v-model="filters.idpos" placeholder="Campo obligatorio...">
                    </div>
                    <div class="col-md-4">
                        <label for="filtroMes" class="form-label fw-bold">Mes Pago</label>
                        <input type="month" id="filtroMes" class="form-control" v-model="filters.mes">
                    </div>
                    <div class="col-md-3">
                        <label for="filtroEstado" class="form-label">Estado</label>
                        <select id="filtroEstado" class="form-select" v-model="filters.estado">
                        <option value="Todos">Todos</option>
                        <option value="Pagada">Pagada</option>
                        <option value="Acumulada">Acumulada</option>
                        <option value="Pendiente">Pendiente</option>
                        </select>
                    </div>
                    <div class="col-12 d-grid mt-3">
                        <button class="btn btn-danger" @click="buscarComisiones">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        Buscar Comisiones
                        </button>
                    </div>
                </div>
              </fieldset>
              
              <div v-if="isLoading" class="text-center p-4">
                <div class="spinner-border text-danger" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>

              <div v-else-if="searchAttempted && results.length > 0">
                <div v-if="pdvName" class="text-center mb-4 p-3 bg-light rounded">
                  <h5 class="mb-0">Punto de Venta: <span class="fw-bold text-danger">{{ pdvName }}</span></h5>
                </div>

                <div class="row g-4 mb-4">
                  <div class="col-md-4">
                    <div class="card h-100 shadow-sm border-0">
                      <div class="card-body text-center d-flex flex-column justify-content-center">
                        <h6>Total Comisiones</h6>
                        <div class="stat-value">{{ formatCurrency(kpis.totalComisiones) }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card h-100 shadow-sm border-0">
                      <div class="card-body text-center d-flex flex-column justify-content-center">
                        <h6>Comisiones Pagadas</h6>
                        <div class="stat-value text-success">{{ formatCurrency(kpis.totalPagado) }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card h-100 shadow-sm border-0">
                      <div class="card-body text-center d-flex flex-column justify-content-center">
                        <h6>Comisiones Pendientes</h6>
                        <div class="stat-value text-warning">{{ formatCurrency(kpis.totalPendiente) }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Mes Pago</th>
                        <th scope="col">Fecha Pago</th>
                        <th scope="col">Asesor</th>
                        <th scope="col">Detalle</th>
                        <th scope="col" class="text-end">Valor Comisión</th>
                        <th scope="col" class="text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in results" :key="item.id">
                        <td>{{ formatMonthYear(item.mes_pago) }}</td>
                        <td>{{ formatDate(item.fecha_pago) }}</td>
                        <td>{{ item.asesor_identificador }}</td>
                        <td>{{ item.producto }}</td>
                        <td class="text-end fw-bold">{{ formatCurrency(item.comision_final) }}</td>
                        <td class="text-center">
                          <span :class="['badge', getStatusClass(item.estado)]">{{ item.estado }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-else-if="searchAttempted" class="text-center p-5 border rounded bg-white mt-4">
                <p>No se encontraron comisiones para los filtros seleccionados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import { useCookies } from "vue3-cookies";
import logoUrl from '@/assets/logo.png';

const { cookies } = useCookies();
const token = cookies.get('jwt');
const headers = { 'Authorization': `Bearer ${token}` };

const filters = reactive({ 
  idpos: '', 
  mes: new Date().toISOString().slice(0, 7), 
  estado: 'Todos' 
});
const results = ref([]);
const kpis = ref({ totalComisiones: 0, totalPagado: 0, totalPendiente: 0 });
const pdvName = ref('');
const isLoading = ref(false);
const searchAttempted = ref(false);

const buscarComisiones = async () => {
  if (!filters.idpos) {
    Swal.fire('Campo Requerido', 'Por favor, ingresa un IDPOS.', 'warning');
    return;
  }
  isLoading.value = true;
  searchAttempted.value = true;
  results.value = [];
  pdvName.value = ''; // Resetear el nombre del PDV en cada búsqueda
  kpis.value = { totalComisiones: 0, totalPagado: 0, totalPendiente: 0 };

  const params = new URLSearchParams();
  params.append('idpos', filters.idpos);
  if (filters.mes) params.append('mes', filters.mes);
  if (filters.estado && filters.estado !== 'Todos') params.append('estado', filters.estado);
  
  const path = `${backendRouter.data}comisiones/consulta-agrupada/?${params.toString()}`;

  try {
    const response = await axios.get(path, { headers });
    results.value = response.data.results;
    kpis.value = response.data.kpis; 
    // Asumiendo que la respuesta del API ahora incluye 'pdv_nombre'
    pdvName.value = response.data.pdv_nombre || ''; 
  } catch (error) {
    console.error("Error al buscar comisiones:", error);
    const errorMessage = error.response?.data?.error || 'Ocurrió un error al buscar.';
    Swal.fire({ icon: 'error', title: 'Error', text: errorMessage });
  } finally {
    isLoading.value = false;
  }
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString); 
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC'
  });
};

const formatMonthYear = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString + 'T00:00:00'); 
  return date.toLocaleDateString('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

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
.btn-secondary{
  color: white !important;
}
</style>
