<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <h1 class="h2">Consulta de Comisiones por PDV</h1>
              <p class="text-muted">Ingresa un ID de Punto de Venta (IDPOS) para buscar.</p>
            </div>

            <fieldset :disabled="isLoading">
              <div class="row g-3 align-items-end bg-light p-3 rounded mb-4">
                  <div class="col-md-5"><label for="filtroIdPos" class="form-label fw-bold">IDPOS*</label><input type="text" id="filtroIdPos" class="form-control" v-model="filters.idpos" placeholder="Campo obligatorio..."></div>
                  <div class="col-md-4"><label for="filtroMes" class="form-label fw-bold">Mes de Pago</label><input type="month" id="filtroMes" class="form-control" v-model="filters.mes"></div>
                  <div class="col-md-3"><label for="filtroEstado" class="form-label">Estado</label><select id="filtroEstado" class="form-select" v-model="filters.estado"><option value="Todos">Todos</option><option value="Pagada">Pagada</option><option value="Acumulada">Acumulada</option><option value="Pendiente">Pendiente</option></select></div>
                  <div class="col-12 d-grid mt-3"><button class="btn btn-danger" @click="buscarComisiones"><span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>Buscar Comisiones</button></div>
              </div>
            </fieldset>
            
            <div v-if="isLoading" class="text-center p-4">
              <div class="spinner-border text-danger" role="status"><span class="visually-hidden">Cargando...</span></div>
            </div>

            <div v-else-if="searchAttempted && results.length > 0">
              <div class="row g-3 mb-4">
                <div class="col-md-4"><div class="stat-card"><h6>Valor Total</h6><div class="stat-value">{{ formatCurrency(kpis.totalComisiones) }}</div></div></div>
                <div class="col-md-4"><div class="stat-card"><h6>Total Pagado</h6><div class="stat-value text-success">{{ formatCurrency(kpis.totalPagado) }}</div></div></div>
                <div class="col-md-4"><div class="stat-card"><h6>Total Pendiente</h6><div class="stat-value text-warning">{{ formatCurrency(kpis.totalPendiente) }}</div></div></div>
              </div>

              <div class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Mes Pago</th>
                      <th scope="col">Fecha Transacción</th>
                      <th scope="col">Asesor</th>
                      <th scope="col">Producto</th>
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
                      <td class="text-center"><span :class="['badge', getStatusClass(item.estado)]">{{ item.estado }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-else-if="searchAttempted" class="text-center p-4 text-muted border rounded">
              <p>No se encontraron comisiones para los filtros seleccionados.</p>
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
.stat-card { background-color: #f8f9fa; border-radius: .375rem; padding: 1rem; text-align: center; height: 100%;}
.stat-card h6 { font-size: 0.8rem; color: #6c757d; text-transform: uppercase; margin-bottom: 0.25rem;}
.stat-card .stat-value { font-size: 1.5rem; font-weight: 600; color: #000; }
.table { font-size: 0.9rem; }
</style>

